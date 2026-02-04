import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
  { label: 'Member', to: '/member', icon: '👥' },
  { label: 'Toko A / Member', to: '/toko-a/member', icon: '🛍️' },
  { label: 'Toko B / Member', to: '/toko-b/member', icon: '🛒' },
  { label: 'Toko C / Member', to: '/toko-c/member', icon: '🛍️' },
]

function TitleFromPath(pathname: string) {
  if (pathname.startsWith('/toko-a')) return 'Toko A'
  if (pathname.startsWith('/toko-b')) return 'Toko B'
  if (pathname.startsWith('/toko-c')) return 'Toko C'
  if (pathname.startsWith('/member')) return 'Member'
  return 'Dashboard'
}

export default function Layout() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState<boolean>(false)

  const title = useMemo(() => TitleFromPath(pathname), [pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // handle responsive default state
  useEffect(() => {
    const update = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)
      setOpen(desktop) // auto open on desktop, close on mobile
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const sidebarWidth = 260
  const sidebarClass = open ? 'translate-x-0' : '-translate-x-full'
  const topbarLeft = isDesktop && open ? `${sidebarWidth}px` : '0px'
  const contentMargin = isDesktop && open ? `${sidebarWidth}px` : '0px'

  return (
    <div className="min-h-screen bg-white_smoke-800 text-carbon_black-500">
      {/* Sidebar fixed at root level */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-[260px] transform border-r border-silver-700 bg-gradient-to-b from-carbon_black-500 to-carbon_black-600 text-white_smoke-900 shadow-lg shadow-silver-400/30 transition-transform duration-200 ${sidebarClass}`}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white_smoke-900 text-strawberry_red-500 text-xl font-black">
            📚
          </div>
          <div>
            <div className="text-sm font-semibold">Promo Panel</div>
            <div className="text-[11px] text-white_smoke-700/80">Admin</div>
          </div>
        </div>
        <nav className="mt-2 space-y-1 px-3">
          <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white_smoke-700/70">
            Menu Utama
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white_smoke-900 text-carbon_black-500 shadow-sm shadow-silver-400/40'
                    : 'text-white_smoke-900 hover:bg-carbon_black-400/60'
                }`
              }
              onClick={() => {
                if (!isDesktop) setOpen(false)
              }}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Topbar fixed, offset follows sidebar */}
      <header
        className="fixed top-0 z-30 flex h-16 w-full items-center justify-between border-b border-silver-700 bg-white_smoke-900/95 px-4 shadow-sm sm:px-6"
        style={{ left: topbarLeft, width: isDesktop ? `calc(100% - ${topbarLeft})` : '100%' }}
      >
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-silver-700 bg-white_smoke-800 text-carbon_black-500 hover:border-strawberry_red-500 hover:text-strawberry_red-500"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <div className="text-lg font-semibold sm:text-xl">{title}</div>
        <div className="flex items-center gap-3">
          <div className="h-11 rounded-full border border-silver-600 bg-white_smoke-900 px-4 py-2 shadow-sm shadow-silver-400/40">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-strawberry_red-500 text-white font-semibold">A</div>
              <div className="text-sm leading-tight">
                <div className="font-semibold">Admin</div>
                <div className="text-silver-600">Perpustakaan</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for mobile/tablet */}
      {open && !isDesktop ? (
        <div className="fixed inset-0 z-20 bg-carbon_black-100/40 transition-opacity" onClick={() => setOpen(false)} />
      ) : null}

      {/* Main content obeys sidebar + topbar offsets */}
      <main
        className="px-4 pb-10 pt-20 sm:px-6 lg:px-10"
        style={{ marginLeft: contentMargin }}
      >
        <Outlet />
      </main>
    </div>
  )
}
