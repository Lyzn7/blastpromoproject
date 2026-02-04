import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

type Store = 'A' | 'B' | 'C'
export type MemberStatus = 'active' | 'inactive' | 'pending'
export type Member = {
  id: string
  store: Store
  memberNo: string
  name: string
  waNumber: string
  birthDate: string
  whatsappSent: boolean
  promoSent: boolean
  createdAt: string
  status: MemberStatus
}

type DashboardStats = {
  countByStore: Record<Store, number>
  activeTotal: number
  activeWeekly: { label: string; total: number }[]
  activeMonthly: { label: string; total: number }[]
  messagesByStore: Record<Store, number>
  messagesTotal: number
  birthdayThisMonthByStore: Record<Store, number>
  birthdayThisMonthTotal: number
}

type AppContextValue = {
  members: Member[]
  pendingMembers: Member[]
  customMessageByStore: Record<Store, string>
  dashboardStats: DashboardStats
  approvePending: (id: string) => void
  rejectPending: (id: string) => void
  addMember: (member: Omit<Member, 'id' | 'memberNo' | 'status' | 'whatsappSent' | 'promoSent' | 'createdAt'>) => void
  updateMember: (id: string, data: Partial<Member>) => void
  deleteMember: (id: string) => void
  resetStatuses: (id: string) => void
  togglePromo: (id: string) => void
  sendWhatsapp: (id: string) => string | undefined
  setCustomMessage: (store: Store, text: string) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const initialMembers: Member[] = [
  {
    id: 'm-1',
    store: 'A',
    memberNo: 'AUTO-0001',
    name: 'Dewi Lestari',
    waNumber: '628123400001',
    birthDate: '1995-02-10',
    whatsappSent: true,
    promoSent: true,
    createdAt: '2026-01-20',
    status: 'active',
  },
  {
    id: 'm-2',
    store: 'B',
    memberNo: 'AUTO-0002',
    name: 'Budi Santoso',
    waNumber: '628123400002',
    birthDate: '1992-02-15',
    whatsappSent: false,
    promoSent: false,
    createdAt: '2026-01-18',
    status: 'active',
  },
  {
    id: 'm-3',
    store: 'C',
    memberNo: 'AUTO-0003',
    name: 'Siti Rahma',
    waNumber: '628123400003',
    birthDate: '1990-07-21',
    whatsappSent: false,
    promoSent: true,
    createdAt: '2025-12-10',
    status: 'inactive',
  },
  {
    id: 'm-4',
    store: 'A',
    memberNo: 'AUTO-0004',
    name: 'Agus Firmansyah',
    waNumber: '628123400004',
    birthDate: '1998-02-28',
    whatsappSent: false,
    promoSent: false,
    createdAt: '2026-01-05',
    status: 'active',
  },
  {
    id: 'm-5',
    store: 'B',
    memberNo: 'AUTO-0005',
    name: 'Maria Widya',
    waNumber: '628123400005',
    birthDate: '1999-02-02',
    whatsappSent: true,
    promoSent: false,
    createdAt: '2026-01-02',
    status: 'active',
  },
]

const initialPending: Member[] = [
  {
    id: 'p-1',
    store: 'A',
    memberNo: 'AUTO-0101',
    name: 'Rina Putri',
    waNumber: '628777111222',
    birthDate: '2001-09-14',
    whatsappSent: false,
    promoSent: false,
    createdAt: '2026-02-03',
    status: 'pending',
  },
  {
    id: 'p-2',
    store: 'C',
    memberNo: 'AUTO-0102',
    name: 'Galih Pratama',
    waNumber: '628899000111',
    birthDate: '1997-11-30',
    whatsappSent: false,
    promoSent: false,
    createdAt: '2026-02-02',
    status: 'pending',
  },
]

const initialMessage: Record<Store, string> = {
  A: 'Halo, ini promo spesial dari Toko A! Klaim diskonmu sekarang.',
  B: 'Hi, promo menarik dari Toko B untukmu hari ini.',
  C: 'Salam dari Toko C, dapatkan penawaran terbaik minggu ini.',
}

function nextMemberNo(existing: Member[]) {
  const max = existing.reduce((acc, m) => {
    const num = parseInt(m.memberNo.replace(/\D+/g, ''), 10)
    return Number.isFinite(num) ? Math.max(acc, num) : acc
  }, 0)
  const next = String(max + 1).padStart(4, '0')
  return `AUTO-${next}`
}

function monthNumber(date: string) {
  return new Date(date).getMonth()
}

function AppProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [pendingMembers, setPendingMembers] = useState<Member[]>(initialPending)
  const [customMessageByStore, setCustomMessageByStore] = useState<Record<Store, string>>(initialMessage)

  const approvePending = (id: string) => {
    setPendingMembers((prev) => {
      const item = prev.find((m) => m.id === id)
      if (!item) return prev
      setMembers((current) => [
        ...current,
        { ...item, status: 'active', id: crypto.randomUUID(), memberNo: nextMemberNo(current) },
      ])
      return prev.filter((m) => m.id !== id)
    })
  }

  const rejectPending = (id: string) => {
    setPendingMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const addMember: AppContextValue['addMember'] = (member) => {
    setMembers((prev) => [
      ...prev,
      {
        ...member,
        id: crypto.randomUUID(),
        memberNo: nextMemberNo(prev),
        status: 'active',
        whatsappSent: false,
        promoSent: false,
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ])
  }

  const updateMember = (id: string, data: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)))
  }

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const resetStatuses = (id: string) => {
    updateMember(id, { whatsappSent: false, promoSent: false })
  }

  const togglePromo = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, promoSent: !m.promoSent } : m)))
  }

  const sendWhatsapp = (id: string) => {
    const member = members.find((m) => m.id === id)
    if (!member) return undefined
    const text = customMessageByStore[member.store] || ''
    const url = `https://wa.me/${member.waNumber}?text=${encodeURIComponent(text)}`
    updateMember(id, { whatsappSent: true })
    return url
  }

  const setCustomMessage = (store: Store, text: string) => {
    setCustomMessageByStore((prev) => ({ ...prev, [store]: text }))
  }

  const dashboardStats = useMemo<DashboardStats>(() => {
    const activeMembers = members.filter((m) => m.status === 'active')
    const countByStore = activeMembers.reduce(
      (acc, m) => ({ ...acc, [m.store]: (acc[m.store] || 0) + 1 }),
      { A: 0, B: 0, C: 0 } as Record<Store, number>,
    )
    const birthdayThisMonthByStore = activeMembers.reduce(
      (acc, m) => {
        if (monthNumber(m.birthDate) === monthNumber(new Date().toISOString())) {
          acc[m.store] += 1
        }
        return acc
      },
      { A: 0, B: 0, C: 0 } as Record<Store, number>,
    )

    const activeWeekly = [
      { label: 'W1', total: 48 },
      { label: 'W2', total: 52 },
      { label: 'W3', total: 55 },
      { label: 'W4', total: 58 },
    ]

    const activeMonthly = [
      { label: 'Jan', total: 160 },
      { label: 'Feb', total: 190 },
      { label: 'Mar', total: 210 },
      { label: 'Apr', total: 205 },
      { label: 'Mei', total: 215 },
      { label: 'Jun', total: 220 },
    ]

    const messagesByStore = {
      A: countByStore.A * 10 + 900,
      B: countByStore.B * 8 + 700,
      C: countByStore.C * 5 + 200,
    }

    return {
      countByStore,
      activeTotal: activeMembers.length,
      activeWeekly,
      activeMonthly,
      messagesByStore,
      messagesTotal: Object.values(messagesByStore).reduce((a, b) => a + b, 0),
      birthdayThisMonthByStore,
      birthdayThisMonthTotal: Object.values(birthdayThisMonthByStore).reduce((a, b) => a + b, 0),
    }
  }, [members])

  const value: AppContextValue = {
    members,
    pendingMembers,
    customMessageByStore,
    dashboardStats,
    approvePending,
    rejectPending,
    addMember,
    updateMember,
    deleteMember,
    resetStatuses,
    togglePromo,
    sendWhatsapp,
    setCustomMessage,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export default AppProvider
