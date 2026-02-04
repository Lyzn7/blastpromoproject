import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = (location.state as { from?: string } | null)?.from || '/dashboard'
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, location.state, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await login(username.trim(), password, remember)
    setLoading(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    const redirectTo = (location.state as { from?: string } | null)?.from || '/dashboard'
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-dark_garnet-500 via-carbon_black-500 to-carbon_black-600 px-4">
      <div className="w-full max-w-[420px] space-y-6 rounded-2xl bg-white_smoke-900/95 p-8 shadow-2xl shadow-dark_garnet-900/40 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-strawberry_red-500/15 text-2xl">📚</div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-silver-600">Blasting Promo</p>
            <h1 className="text-2xl font-semibold text-carbon_black-500">Admin Login</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-carbon_black-500">Username</label>
            <input
              className="interactive-input w-full rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-carbon_black-500">Password</label>
            <input
              type="password"
              className="interactive-input w-full rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-carbon_black-500">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-silver-700 text-strawberry_red-500 focus:ring-strawberry_red-500"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Ingat saya
            </label>
            <span className="text-silver-600 text-xs">
              Demo: admin/admin123 · adminA/adminA123 · adminB/adminB123 · adminC/adminC123
            </span>
          </div>
          {error ? <p className="rounded-lg bg-dark_garnet-500/10 px-3 py-2 text-sm text-dark_garnet-700">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-strawberry_red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-strawberry_red-500/40 transition hover:bg-strawberry_red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}
