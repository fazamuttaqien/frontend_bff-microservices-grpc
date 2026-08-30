import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export function LoginPage() {
  const { login, status } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  const emailError = touched.email && !email.trim() ? 'Email is required.' : touched.email && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email address.' : null
  const passwordError = touched.password && password.length < 8 ? 'Password must be at least 8 characters.' : null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setTouched({ email: true, password: true })
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return
    setError(null)
    setSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      const from = (location.state as { from?: string } | null)?.from
      navigate(from || '/dashboard', { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') return <p role="status">Loading…</p>

  return (
    <section>
      <h1>Login</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <label>Email<input name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} onBlur={() => setTouched((value) => ({ ...value, email: true }))} aria-invalid={Boolean(emailError)} aria-describedby={emailError ? 'email-error' : undefined} required /></label>
        {emailError && <p id="email-error" role="alert">{emailError}</p>}
        <label>Password<input name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} onBlur={() => setTouched((value) => ({ ...value, password: true }))} aria-invalid={Boolean(passwordError)} aria-describedby={passwordError ? 'password-error' : undefined} required /></label>
        {passwordError && <p id="password-error" role="alert">{passwordError}</p>}
        <button type="submit" disabled={submitting || Boolean(emailError) || Boolean(passwordError)}>{submitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </section>
  )
}
