import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from './LoginPage'

const login = vi.fn()
vi.mock('./AuthProvider', () => ({ useAuth: () => ({ login, status: 'unauthenticated' }) }))

describe('LoginPage', () => {
  beforeEach(() => login.mockReset())

  it('validates credentials before submitting', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('submits valid credentials and disables the button while pending', async () => {
    let resolve!: () => void
    login.mockReturnValue(new Promise<void>((r) => { resolve = r }))
    const user = userEvent.setup()
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    await user.type(screen.getByLabelText('Email'), 'user@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    const button = screen.getByRole('button', { name: /sign in/i })
    await user.click(button)
    expect(login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' })
    expect(button).toBeDisabled()
    resolve()
  })
})
