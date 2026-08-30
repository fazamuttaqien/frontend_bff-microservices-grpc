import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it } from 'vitest'
import authReducer, { type AuthStatus } from './authSlice'
import { ProtectedRoute } from './ProtectedRoute'

function renderRoute(status: AuthStatus) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { status, currentUser: null, error: null } },
  })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/private" element={<p>Private page</p>} />
          </Route>
          <Route path="/login" element={<p>Login page</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    renderRoute('unauthenticated')
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('renders protected content when authenticated', () => {
    renderRoute('authenticated')
    expect(screen.getByText('Private page')).toBeInTheDocument()
  })
})
