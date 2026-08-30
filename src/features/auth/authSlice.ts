import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types/api'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: User | null
  status: AuthStatus
}

const initialState: AuthState = {
  user: null,
  status: 'loading',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(
      state,
      action: PayloadAction<{ user: User | null; status: AuthStatus }>,
    ) {
      state.user = action.payload.user
      state.status = action.payload.status
    },
    clearAuthState(state) {
      state.user = null
      state.status = 'unauthenticated'
    },
  },
})

export const { setAuthState, clearAuthState } = authSlice.actions
export default authSlice.reducer
