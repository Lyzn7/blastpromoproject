import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

type StoreRouteProps = {
  store: 'A' | 'B' | 'C'
  children: ReactNode
}

export default function StoreRoute({ store, children }: StoreRouteProps) {
  const { allowedStores } = useAuth()
  if (!allowedStores.includes(store)) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}
