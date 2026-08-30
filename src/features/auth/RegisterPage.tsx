import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from './useAuth'

export function RegisterPage() {
  const { register, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)

  const nameError = touched && !name.trim() ? 'Name is required.' : null
  const emailError =
    touched && (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
      ? 'Enter a valid email address.'
      : null
  const passwordError =
    touched && (password.length < 8 || password.length > 72)
      ? 'Password must be 8–72 characters.'
      : null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setTouched(true)
    clearError()
    if (nameError || emailError || passwordError || !name.trim()) return

    setSubmitting(true)
    try {
      await register({ name: name.trim(), email: email.trim(), password })
      navigate('/login', { replace: true })
    } catch {
      // Error is normalized and exposed by the auth hook.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Register to start using the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Registration failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <FormItem>
            <FormLabel htmlFor="register-name">Name</FormLabel>
            <Input
              id="register-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            {nameError && <FormMessage>{nameError}</FormMessage>}
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="register-email">Email</FormLabel>
            <Input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            {emailError && <FormMessage>{emailError}</FormMessage>}
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="register-password">Password</FormLabel>
            <Input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {passwordError && <FormMessage>{passwordError}</FormMessage>}
          </FormItem>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{' '}
          <Link
            className="font-medium text-foreground underline underline-offset-4"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
