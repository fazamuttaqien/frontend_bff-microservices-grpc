import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from './useAuth'

export function LoginPage() {
  const { login, status, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })

  const emailError = touched.email && !email.trim()
    ? 'Email is required.'
    : touched.email && !/^\S+@\S+\.\S+$/.test(email)
      ? 'Enter a valid email address.'
      : null
  const passwordError = touched.password && password.length < 8
    ? 'Password must be at least 8 characters.'
    : null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setTouched({ email: true, password: true })
    if (emailError || passwordError || !email.trim() || password.length < 8) return

    setSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      const from = (location.state as { from?: string } | null)?.from
      navigate(from || '/dashboard', { replace: true })
    } catch {
      // Error is normalized and exposed by the auth hook.
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'checking') {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Sign in failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <FormItem>
            <FormLabel htmlFor="login-email">Email</FormLabel>
            <Input id="login-email" name="email" type="email" autoComplete="email" value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched((value) => ({ ...value, email: true }))}
              aria-invalid={Boolean(emailError)} required />
            {emailError && <FormMessage>{emailError}</FormMessage>}
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="login-password">Password</FormLabel>
            <Input id="login-password" name="password" type="password" autoComplete="current-password" value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => setTouched((value) => ({ ...value, password: true }))}
              aria-invalid={Boolean(passwordError)} required />
            {passwordError && <FormMessage>{passwordError}</FormMessage>}
          </FormItem>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link className="font-medium text-foreground underline underline-offset-4" to="/register">Register</Link>
        </p>
      </CardContent>
    </Card>
  )
}
