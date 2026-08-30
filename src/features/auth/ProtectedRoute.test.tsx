import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from './ProtectedRoute'

let status: 'loading' | 'authenticated' | 'unauthenticated' = 'unauthenticated'
vi.mock('./AuthProvider', () => ({ useAuth: () => ({ status }) }))

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    status = 'unauthenticated'
    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/private" element={<p>Private</p>} />
          </Route>
          <Route path="/login" element={<p>Login</p>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('renders protected content when authenticated', () => {
    status = 'authenticated'
    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/private" element={<p>Private</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Private')).toBeInTheDocument()
  })
})
