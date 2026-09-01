import { useEffect, useRef } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks'
import { router } from '@/app/router'
import { bootstrapAuthentication } from '@/features/auth/useAuth'

export function App() {
  const dispatch = useAppDispatch()
  const bootstrapped = useRef(false)

  useEffect(() => {
    if (bootstrapped.current) return
    bootstrapped.current = true
    void bootstrapAuthentication(dispatch)
  }, [dispatch])

  return <RouterProvider router={router} />
}
