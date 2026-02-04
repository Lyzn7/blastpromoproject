import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Role = 'superadmin' | 'store_admin'
type User = {
  username: string
  name: string
  role: Role
  store?: 'A' | 'B' | 'C'
}

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string, remember?: boolean) => Promise<{ ok: true } | { ok: false; message: string }>
  logout: () => void
  allowedStores: ('A' | 'B' | 'C')[]
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const DEMO_USERS = [
  { username: 'admin', password: 'admin123', name: 'Super Admin', role: 'superadmin' as Role },
  { username: 'adminA', password: 'adminA123', name: 'Admin Toko A', role: 'store_admin' as Role, store: 'A' as const },
  { username: 'adminB', password: 'adminB123', name: 'Admin Toko B', role: 'store_admin' as Role, store: 'B' as const },
  { username: 'adminC', password: 'adminC123', name: 'Admin Toko C', role: 'store_admin' as Role, store: 'C' as const },
]

const STORAGE_KEY = 'bp-auth'

function readPersistedUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as User
    if (parsed.role === 'store_admin' && !parsed.store) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const saved = readPersistedUser()
    if (saved) setUser(saved)
  }, [])

  const login: AuthContextValue['login'] = async (username, password, remember = true) => {
    const found = DEMO_USERS.find((u) => u.username === username && u.password === password)
    if (!found) {
      return { ok: false, message: 'Username atau password salah' }
    }
    const payload: User = { username: found.username, name: found.name, role: found.role, store: found.store }
    setUser(payload)
    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    return { ok: true }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const allowedStores = useMemo<('A' | 'B' | 'C')[]>(() => {
    if (!user) return []
    if (user.role === 'superadmin') return ['A', 'B', 'C']
    if (user.role === 'store_admin' && user.store) return [user.store]
    return []
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      allowedStores,
    }),
    [user, allowedStores],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
