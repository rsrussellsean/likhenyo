'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import OAuthButtons from '@/components/auth/OAuthButtons'
import { signInWithEmailAction } from '@/lib/actions/auth'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(
    authError === 'auth_failed' ? 'Authentication failed. Please try again.' : null
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const result = await signInWithEmailAction(email, password)
    setPending(false)

    if (result?.error) {
      setError(result.error)
    }
    // On success, signInWithEmailAction redirects server-side to /setup
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-2xl text-foreground">
            WorkHub<span className="text-amber-500">PH</span>
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-foreground">Welcome back</h1>
        </div>

        <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
          <OAuthButtons />

          <div className="my-6 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-amber-600 hover:text-amber-700"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-amber-500 text-white hover:bg-amber-600"
              disabled={pending}
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-amber-600 hover:text-amber-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
