"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createJob(formData: FormData): Promise<{ error?: string; jobId?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return { error: "Not authenticated" };

  // Guard: must be a client
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "client") return { error: "Only clients can post jobs" };

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const tagsRaw = formData.get("tags") as string;
  const workMode = formData.get("work_mode") as string;
  const location = formData.get("location") as string | null;
  const budgetType = formData.get("budget_type") as string;
  const budgetMin = parseFloat(formData.get("budget_min") as string);
  const budgetMax = parseFloat(formData.get("budget_max") as string);
  const deadline = formData.get("deadline") as string | null;
  const description = formData.get("description") as string;

  // Validate
  if (!title?.trim()) return { error: "Job title is required" };
  if (!category?.trim()) return { error: "Category is required" };
  if (!description?.trim() || description.trim().length < 50)
    return { error: "Description must be at least 50 characters" };
  if (isNaN(budgetMin) || isNaN(budgetMax)) return { error: "Budget range is required" };
  if (budgetMin > budgetMax) return { error: "Minimum budget cannot exceed maximum" };

  const tags: string[] = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  // Insert job row first to get the ID for storage path
  const { data: job, error: insertError } = await supabase
    .from("jobs")
    .insert({
      client_id: user.id,
      title: title.trim(),
      category: category.trim(),
      tags: tags.length > 0 ? tags : null,
      work_mode: workMode,
      location: location?.trim() || null,
      budget_type: budgetType,
      budget_min: budgetMin,
      budget_max: budgetMax,
      deadline: deadline || null,
      description: description.trim(),
    })
    .select("id")
    .single();

  if (insertError || !job) return { error: insertError?.message ?? "Failed to create job" };

  // Upload attachments if any
  const files = formData.getAll("attachments") as File[];
  const validFiles = files.filter((f) => f && f.size > 0);
  const attachmentUrls: string[] = [];

  for (const file of validFiles) {
    const path = `${user.id}/${job.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("job-attachments")
      .upload(path, file, { upsert: false });
    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("job-attachments")
        .getPublicUrl(path);
      attachmentUrls.push(urlData.publicUrl);
    }
  }

  // If we have attachments, update the row
  if (attachmentUrls.length > 0) {
    await supabase
      .from("jobs")
      .update({ attachment_urls: attachmentUrls })
      .eq("id", job.id);
  }

  return { jobId: job.id };
}

export async function updateJob(
  jobId: string,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return { error: "Not authenticated" };

  // Guard: must own the job and it must be open
  const { data: existing } = await supabase
    .from("jobs")
    .select("client_id, status")
    .eq("id", jobId)
    .single();

  if (!existing || existing.client_id !== user.id) return { error: "Not authorized" };
  if (existing.status !== "open") return { error: "Only open jobs can be edited" };

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const tagsRaw = formData.get("tags") as string;
  const workMode = formData.get("work_mode") as string;
  const location = formData.get("location") as string | null;
  const budgetType = formData.get("budget_type") as string;
  const budgetMin = parseFloat(formData.get("budget_min") as string);
  const budgetMax = parseFloat(formData.get("budget_max") as string);
  const deadline = formData.get("deadline") as string | null;
  const description = formData.get("description") as string;

  if (!title?.trim()) return { error: "Job title is required" };
  if (!category?.trim()) return { error: "Category is required" };
  if (!description?.trim() || description.trim().length < 50)
    return { error: "Description must be at least 50 characters" };
  if (isNaN(budgetMin) || isNaN(budgetMax)) return { error: "Budget range is required" };

  const tags: string[] = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const { error: updateError } = await supabase
    .from("jobs")
    .update({
      title: title.trim(),
      category: category.trim(),
      tags: tags.length > 0 ? tags : null,
      work_mode: workMode,
      location: location?.trim() || null,
      budget_type: budgetType,
      budget_min: budgetMin,
      budget_max: budgetMax,
      deadline: deadline || null,
      description: description.trim(),
    })
    .eq("id", jobId);

  if (updateError) return { error: updateError.message };

  redirect(`/jobs/${jobId}`);
}
