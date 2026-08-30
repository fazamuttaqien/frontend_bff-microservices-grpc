import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types/api'

export type AuthStatus =
  'checking' | 'authenticated' | 'unauthenticated' | 'error'

interface AuthState {
  status: AuthStatus
  currentUser: User | null
  error: string | null
}

const initialState: AuthState = {
  status: 'checking',
  currentUser: null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setChecking(state) {
      state.status = 'checking'
      state.error = null
    },
    setAuthenticated(state, action: PayloadAction<User>) {
      state.status = 'authenticated'
      state.currentUser = action.payload
      state.error = null
    },
    setUnauthenticated(state) {
      state.status = 'unauthenticated'
      state.currentUser = null
      state.error = null
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.status = 'error'
      state.currentUser = null
      state.error = action.payload
    },
    clearAuthError(state) {
      state.error = null
      if (state.status === 'error') state.status = 'unauthenticated'
    },
  },
})

export const {
  setChecking,
  setAuthenticated,
  setUnauthenticated,
  setAuthError,
  clearAuthError,
} = authSlice.actions
export default authSlice.reducer
