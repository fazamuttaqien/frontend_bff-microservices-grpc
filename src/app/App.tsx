import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAppDispatch } from './hooks'
import { router } from './router'
import { bootstrapAuthentication } from '../features/auth/useAuth'

export function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    void bootstrapAuthentication(dispatch)
  }, [dispatch])

  return <RouterProvider router={router} />
}
