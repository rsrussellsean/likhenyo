'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPasswordAction } from '@/lib/actions/auth'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError(null)
    setPending(true)
    const result = await resetPasswordAction(password)
    setPending(false)
    if (result?.error) {
      setError(result.error)
    }
    // On success, resetPasswordAction redirects to /dashboard
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-2xl text-foreground">
            WorkHub<span className="text-amber-500">PH</span>
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-foreground">Set a new password</h1>
        </div>

        <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">New password</Label>
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
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Repeat new password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              {pending ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
