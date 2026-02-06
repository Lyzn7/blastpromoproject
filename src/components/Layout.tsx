/*  */import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type NavItem = { label: string; to?: string; icon: string; iconType?: 'img' | 'emoji'; children?: NavItem[]; store?: 'A' | 'B' | 'C' }
type NavSection = { title: string; items: NavItem[] }

const mainSection: NavSection = {
  title: 'MENU UTAMA',
  items: [
    { label: 'Dashboard', to: '/dashboard', icon: '/icons/home.png', iconType: 'img' },
    { label: 'Member', to: '/member', icon: '/icons/users.png', iconType: 'img' },
    { label: 'Log', to: '/log', icon: '/icons/clock.png', iconType: 'img' },
  ],
}

const storeSection: NavSection = {
  title: 'MENU TOKO',
  items: [
    {
      label: 'Toko A',
      store: 'A',
      icon: '/icons/bag.png',
      iconType: 'img',
      children: [
        { label: 'Member', to: '/toko-a/member', icon: '/icons/users.png', iconType: 'img' },
        { label: 'Ultah Member', to: '/toko-a/ultah-member', icon: '/icons/cake.png', iconType: 'img' },
        { label: 'Blasting Promo', to: '/toko-a/blasting', icon: '/icons/megaphone.png', iconType: 'img' },
      ],
    },
    {
      label: 'Toko B',
      store: 'B',
      icon: '/icons/bag.png',
      iconType: 'img',
      children: [
        { label: 'Member', to: '/toko-b/member', icon: '/icons/users.png', iconType: 'img' },
        { label: 'Ultah Member', to: '/toko-b/ultah-member', icon: '/icons/cake.png', iconType: 'img' },
        { label: 'Blasting Promo', to: '/toko-b/blasting', icon: '/icons/megaphone.png', iconType: 'img' },
      ],
    },
    {
      label: 'Toko C',
      store: 'C',
      icon: '/icons/bag.png',
      iconType: 'img',
      children: [
        { label: 'Member', to: '/toko-c/member', icon: '/icons/users.png', iconType: 'img' },
        { label: 'Ultah Member', to: '/toko-c/ultah-member', icon: '/icons/cake.png', iconType: 'img' },
        { label: 'Blasting Promo', to: '/toko-c/blasting', icon: '/icons/megaphone.png', iconType: 'img' },
      ],
    },
  ],
}

function titleFromPath(pathname: string) {
  if (pathname.startsWith('/toko-a')) return 'Toko A'
  if (pathname.startsWith('/toko-b')) return 'Toko B'
  if (pathname.startsWith('/toko-c')) return 'Toko C'
  if (pathname.startsWith('/member')) return 'Member'
  return 'Dashboard'
}

export default function Layout() {
  const { pathname } = useLocation()
  const { user, logout, allowedStores } = useAuth()
  const [open, setOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({})

  const filteredStoreItems = useMemo(
    () => storeSection.items.filter((i) => !i.store || allowedStores.includes(i.store)),
    [allowedStores],
  )

  const title = useMemo(() => titleFromPath(pathname), [pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const update = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)
      setOpen(desktop)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // auto-open store section containing active route
  useEffect(() => {
    filteredStoreItems.forEach((store) => {
      if (store.children?.some((c) => pathname.startsWith(c.to ?? ''))) {
        setOpenSection((prev) => ({ ...prev, [store.label]: true }))
      }
    })
  }, [pathname, filteredStoreItems])

  const sidebarWidth = 260
  const sidebarClass = open ? 'translate-x-0' : '-translate-x-full'
  const topbarLeft = isDesktop && open ? `${sidebarWidth}px` : '0px'
  const contentMargin = isDesktop && open ? `${sidebarWidth}px` : '0px'

  const renderIconVisual = (icon: string, iconType?: 'img' | 'emoji', isActive = false) =>
    iconType === 'img' ? (
      <img
        src={icon}
        alt=""
        className="h-5 w-5 transition"
        style={{
          filter: isActive
            ? 'brightness(0) saturate(0) invert(27%) sepia(6%) saturate(274%) hue-rotate(156deg) brightness(92%) contrast(88%)'
            : 'drop-shadow(0 0 2px rgba(0,0,0,0.25))',
        }}
      />
    ) : (
      <span className="text-base">{icon}</span>
    )

  const renderItem = (item: NavItem, level = 0) => (
    <NavLink
      key={item.to}
      to={item.to!}
      className={({ isActive }) =>
        `interactive-nav group relative flex h-[52px] items-center gap-3 rounded-xl ${level === 0 ? 'pl-4 pr-3' : 'pl-6 pr-3'} text-sm font-medium transition active:scale-[0.99] ${
          isActive
            ? 'bg-white text-carbon_black-700 shadow-sm shadow-silver-400/40'
            : 'text-white hover:bg-white hover:text-carbon_black-700'
        }`
      }
      onClick={() => {
        if (!isDesktop) setOpen(false)
      }}
    >
          {({ isActive }) => (
            <>
              <span
                className={`absolute left-0 top-1.5 h-[calc(100%-12px)] w-[6px] rounded-r-full transition ${
                  isActive ? 'bg-strawberry_red-500' : 'bg-transparent group-hover:bg-strawberry_red-300/80'
                }`}
                aria-hidden
              />
              {renderIconVisual(item.icon, item.iconType, isActive)}
              <span className="tracking-wide">{item.label}</span>
            </>
          )}
    </NavLink>
  )

  return (
    <div className="min-h-screen bg-white_smoke-900 text-carbon_black-500">
      <aside
  className={`fixed left-0 top-0 z-40 h-screen w-[260px] transform
  border-r border-white/20
  bg-gradient-to-b from-[#D02752] via-[#F63049] to-[#FF4B4B]
  shadow-lg shadow-red-300/40
  transition-transform duration-200 ${sidebarClass}`}
>

        <div className="flex flex-col items-center gap-3 px-5 py-7 text-center">
          
          <div className="space-y-1">
            <div className="text-xl font-semibold text-carbon_black-500">DM Grosir</div>
            <div className="inline-flex items-center gap-2">
              <span className="text-sm font-medium text-white-600">{user?.name ?? 'User'}</span>
              
            </div>
          </div>
        </div>
        <nav className="mt-2 space-y-5 px-3 pb-6">
          {[mainSection, { ...storeSection, items: filteredStoreItems }].map((section) => {
            if (section.title === 'MENU TOKO' && section.items.length === 0) return null
            return (
              <div key={section.title} className="space-y-2">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-silver-600">
                  {section.title}
                </p>
                <div className="space-y-1.5">
                  {section.items.map((item) =>
                    item.children ? (
                      <div key={item.label} className="space-y-1">
                        <button
                          className="interactive-nav group flex h-12 w-full items-center justify-between rounded-lg bg-white/70 px-4 py-3 text-sm font-semibold text-carbon_black-600 shadow-sm shadow-silver-500/20 transition hover:bg-white active:scale-[0.99]"
                          type="button"
                          onClick={() => setOpenSection((prev) => ({ ...prev, [item.label]: !prev[item.label] }))}
                        >
                          <span className="flex items-center gap-2">
                            {renderIconVisual(item.icon, item.iconType, false)}
                            {item.label}
                          </span>
                          <svg
                            className={`h-3 w-3 transition-transform ${openSection[item.label] ? 'rotate-90' : ''}`}
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                        <div
                          className={`${
                            openSection[item.label] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          } space-y-1 overflow-hidden transition-all duration-200`}
                        >
                          {item.children.map((child) => renderItem(child, 1))}
                        </div>
                      </div>
                    ) : (
                      renderItem(item)
                    ),
                  )}
                </div>
                <div className="border-b border-silver-700/40 pt-3" />
              </div>
            )
          })}
        </nav>
      </aside>

      <header
        className="fixed top-0 z-30 flex h-16 w-full items-center justify-between border-b border-silver-700 bg-white_smoke-900/95 px-4 shadow-sm sm:px-6"
        style={{ left: topbarLeft, width: isDesktop ? `calc(100% - ${topbarLeft})` : '100%' }}
      >
        <button
          className="interactive-icon inline-flex h-10 w-10 items-center justify-center rounded-lg border border-silver-700 bg-white_smoke-800 text-carbon_black-500 hover:border-strawberry_red-500 hover:text-strawberry_red-500"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <div className="text-lg font-semibold sm:text-xl">{title}</div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-carbon_black-500">{user?.name ?? 'User'}</p>
            <p className="text-[11px] text-silver-600">{user?.role === 'superadmin' ? 'Superadmin' : 'Admin Toko'}</p>
          </div>
          <button
            className="interactive-btn rounded-lg border border-silver-700 px-3 py-2 text-xs font-semibold text-carbon_black-500 hover:bg-silver-800"
            onClick={logout}
          >
            Keluar
          </button>
        </div>
      </header>

      {open && !isDesktop ? (
        <div className="fixed inset-0 z-20 bg-carbon_black-100/40 transition-opacity" onClick={() => setOpen(false)} />
      ) : null}

      <main className="px-4 pb-10 pt-20 sm:px-6 lg:px-10" style={{ marginLeft: contentMargin }}>
        <Outlet />
      </main>
    </div>
  )
}
