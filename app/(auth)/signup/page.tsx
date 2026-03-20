'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import OAuthButtons from '@/components/auth/OAuthButtons'
import { signUpWithEmailAction } from '@/lib/actions/auth'

export default function SignupPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? undefined

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const result = await signUpWithEmailAction(email, password, role)
    setPending(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-2xl text-foreground">
            WorkHub<span className="text-amber-500">PH</span>
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-foreground">Create your account</h1>
          {role && (
            <p className="mt-1 text-sm text-muted-foreground">
              Joining as a{' '}
              <span className="font-medium text-amber-600">
                {role === 'client' ? 'Client' : 'Freelancer'}
              </span>
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
          {success ? (
            <div className="text-center">
              <div className="mb-4 text-4xl">📧</div>
              <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a confirmation link to{' '}
                <span className="font-medium text-foreground">{email}</span>. Click it to
                activate your account.
              </p>
            </div>
          ) : (
            <>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
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
                  {pending ? 'Creating account…' : 'Create account'}
                </Button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-amber-600 hover:text-amber-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
