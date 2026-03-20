'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signInWithOAuthAction(
  provider: 'google' | 'facebook',
  redirectTo?: string
) {
  const supabase = await createClient()

  const callbackUrl = redirectTo
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signUpWithEmailAction(
  email: string,
  password: string,
  role?: string
) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { role: role ?? null },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signInWithEmailAction(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect('/setup')
}

export async function forgotPasswordAction(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function resetPasswordAction(newPassword: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
