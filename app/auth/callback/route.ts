import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/setup'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const supabase = await createClient()

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  // Check if a profiles row already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingProfile) {
    const fullName: string =
      user.user_metadata?.full_name ??
      user.email?.split('@')[0] ??
      'User'

    const avatarUrl: string | null = user.user_metadata?.avatar_url ?? null
    const role: string | null = user.user_metadata?.role ?? null

    await supabase.from('profiles').insert({
      id: user.id,
      full_name: fullName,
      avatar_url: avatarUrl,
      role,
      verified_status: 'unverified',
    })
  }

  return NextResponse.redirect(`${origin}${next}`)
}
