"use server";

import { createClient } from "@/lib/supabase/server";

export async function getJobCategorySuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 2) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("jobs")
    .select("category")
    .ilike("category", `%${query}%`)
    .limit(10);

  if (!data) return [];
  const unique = [...new Set(data.map((r) => r.category as string))];
  return unique;
}

export async function getSkillSuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 1) return [];
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_skill_suggestions", { q: query });
  if (!data) return [];
  return data as string[];
}

export async function getTagSuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 1) return [];
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_tag_suggestions", { q: query });
  if (!data) return [];
  return data as string[];
}
