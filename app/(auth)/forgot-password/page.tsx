'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPasswordAction } from '@/lib/actions/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const result = await forgotPasswordAction(email)
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
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-2xl text-foreground">
            WorkHub<span className="text-amber-500">PH</span>
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-foreground">Reset your password</h1>
        </div>

        <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
          {success ? (
            <div className="text-center">
              <div className="mb-4 text-4xl">📧</div>
              <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a password reset link to{' '}
                <span className="font-medium text-foreground">{email}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {pending ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-amber-600 hover:text-amber-700">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
