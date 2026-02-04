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

export type LogItem = {
  id: string
  type:
    | 'member_add'
    | 'member_delete'
    | 'member_edit'
    | 'approval'
    | 'whatsapp_send'
    | 'promo_mark'
    | 'reset'
    | 'birthday'
    | 'other'
  title: string
  description: string
  store?: Store | null
  actor: string
  createdAt: string
  meta?: Record<string, unknown>
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
  logs: LogItem[]
  dashboardStats: DashboardStats
  approvePending: (id: string) => void
  rejectPending: (id: string) => void
  addMember: (member: Omit<Member, 'id' | 'memberNo' | 'status' | 'whatsappSent' | 'promoSent' | 'createdAt'>) => void
  updateMember: (id: string, data: Partial<Member>) => void
  deleteMember: (id: string) => void
  resetStatuses: (id: string) => void
  sendWhatsapp: (id: string) => string | undefined
  setCustomMessage: (store: Store, text: string) => void
  addLog: (log: Omit<LogItem, 'id' | 'actor' | 'createdAt'> & { createdAt?: string; actor?: string }) => void
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
  {
    id: 'm-6',
    store: 'A',
    memberNo: 'AUTO-0006',
    name: 'Yoga Pratama',
    waNumber: '628123400006',
    birthDate: '1993-06-12',
    whatsappSent: false,
    promoSent: false,
    createdAt: '2026-01-25',
    status: 'active',
  },
  {
    id: 'm-7',
    store: 'A',
    memberNo: 'AUTO-0007',
    name: 'Lestari Handayani',
    waNumber: '628123400007',
    birthDate: '1988-03-03',
    whatsappSent: true,
    promoSent: true,
    createdAt: '2026-01-24',
    status: 'active',
  },
  {
    id: 'm-8',
    store: 'A',
    memberNo: 'AUTO-0008',
    name: 'Rama Dwi Putra',
    waNumber: '628123400008',
    birthDate: '1996-09-18',
    whatsappSent: false,
    promoSent: true,
    createdAt: '2026-01-23',
    status: 'active',
  },
  {
    id: 'm-9',
    store: 'A',
    memberNo: 'AUTO-0009',
    name: 'Mega Puspita',
    waNumber: '628123400009',
    birthDate: '1994-12-01',
    whatsappSent: false,
    promoSent: false,
    createdAt: '2026-01-22',
    status: 'active',
  },
  {
    id: 'm-10',
    store: 'A',
    memberNo: 'AUTO-0010',
    name: 'Ardiansyah Putu',
    waNumber: '628123400010',
    birthDate: '1991-05-27',
    whatsappSent: true,
    promoSent: false,
    createdAt: '2026-01-21',
    status: 'active',
  },
  {
    id: 'm-11',
    store: 'A',
    memberNo: 'AUTO-0011',
    name: 'Nia Kurniasih',
    waNumber: '628123400011',
    birthDate: '1997-08-08',
    whatsappSent: false,
    promoSent: false,
    createdAt: '2026-01-19',
    status: 'active',
  },
  {
    id: 'm-12',
    store: 'A',
    memberNo: 'AUTO-0012',
    name: 'Bagus Hartanto',
    waNumber: '628123400012',
    birthDate: '1989-04-14',
    whatsappSent: true,
    promoSent: true,
    createdAt: '2026-01-17',
    status: 'active',
  },
  {
    id: 'm-13',
    store: 'A',
    memberNo: 'AUTO-0013',
    name: 'Citra Melani',
    waNumber: '628123400013',
    birthDate: '1995-10-30',
    whatsappSent: false,
    promoSent: true,
    createdAt: '2026-01-15',
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

const initialLogs: LogItem[] = [
  {
    id: 'log-1',
    type: 'member_add',
    title: 'Tambah Member',
    description: 'Menambahkan Dewi Lestari (AUTO-0001) ke Toko A',
    store: 'A',
    actor: 'SuperAdmin',
    createdAt: '2026-02-03T09:15:00',
  },
  {
    id: 'log-2',
    type: 'approval',
    title: 'Approve Member Pending',
    description: 'Menyetujui Rina Putri (AUTO-0101) Toko A',
    store: 'A',
    actor: 'SuperAdmin',
    createdAt: '2026-02-04T08:00:00',
  },
  {
    id: 'log-3',
    type: 'whatsapp_send',
    title: 'Kirim WhatsApp Promo',
    description: 'Promo dikirim ke Budi Santoso (628123400002) - Toko B',
    store: 'B',
    actor: 'SuperAdmin',
    createdAt: '2026-02-02T12:45:00',
  },
  {
    id: 'log-4',
    type: 'reset',
    title: 'Reset Status Kirim',
    description: 'Reset status WA & promo untuk Agus Firmansyah - Toko A',
    store: 'A',
    actor: 'SuperAdmin',
    createdAt: '2026-02-01T10:10:00',
  },
  {
    id: 'log-5',
    type: 'promo_mark',
    title: 'Tandai Promo Terkirim',
    description: 'Promo ditandai terkirim ke Siti Rahma - Toko C',
    store: 'C',
    actor: 'SuperAdmin',
    createdAt: '2026-01-29T16:05:00',
  },
  {
    id: 'log-6',
    type: 'member_edit',
    title: 'Edit Data Member',
    description: 'Edit data Maria Widya (AUTO-0005) - Toko B',
    store: 'B',
    actor: 'SuperAdmin',
    createdAt: '2026-01-28T11:00:00',
  },
  {
    id: 'log-7',
    type: 'member_delete',
    title: 'Hapus Member',
    description: 'Hapus member non-aktif AUTO-0099 - Toko C',
    store: 'C',
    actor: 'SuperAdmin',
    createdAt: '2025-12-20T09:30:00',
  },
  {
    id: 'log-8',
    type: 'birthday',
    title: 'Reminder Ultah',
    description: 'Kirim ucapan ultah ke Dewi Lestari - Toko A',
    store: 'A',
    actor: 'System',
    createdAt: '2026-02-10T07:00:00',
  },
  {
    id: 'log-9',
    type: 'approval',
    title: 'Reject Member Pending',
    description: 'Menolak pengajuan Galih Pratama - Toko C',
    store: 'C',
    actor: 'SuperAdmin',
    createdAt: '2026-02-03T09:00:00',
  },
]

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
  const [logs, setLogs] = useState<LogItem[]>(initialLogs)

  const addLog: AppContextValue['addLog'] = (log) => {
    setLogs((prev) => [
      {
        id: crypto.randomUUID(),
        actor: log.actor ?? 'SuperAdmin',
        createdAt: log.createdAt ?? new Date().toISOString(),
        ...log,
      },
      ...prev,
    ])
  }

  const approvePending = (id: string) => {
    setPendingMembers((prev) => {
      const item = prev.find((m) => m.id === id)
      if (!item) return prev
      setMembers((current) => [
        ...current,
        { ...item, status: 'active', id: crypto.randomUUID(), memberNo: nextMemberNo(current) },
      ])
      addLog({
        type: 'approval',
        title: 'Approve Member Pending',
        description: `Menyetujui ${item.name} (${item.memberNo}) - Toko ${item.store}`,
        store: item.store,
      })
      return prev.filter((m) => m.id !== id)
    })
  }

  const rejectPending = (id: string) => {
    setPendingMembers((prev) => {
      const item = prev.find((m) => m.id === id)
      if (item) {
        addLog({
          type: 'approval',
          title: 'Reject Member Pending',
          description: `Menolak ${item.name} (${item.memberNo}) - Toko ${item.store}`,
          store: item.store,
        })
      }
    return prev.filter((m) => m.id !== id)
    })
  }

  const addMember: AppContextValue['addMember'] = (member) => {
    setMembers((prev) => {
      const payload: Member = {
        ...member,
        id: crypto.randomUUID(),
        memberNo: nextMemberNo(prev),
        status: 'active',
        whatsappSent: false,
        promoSent: false,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      addLog({
        type: 'member_add',
        title: 'Tambah Member',
        description: `Menambahkan ${member.name} ke Toko ${member.store}`,
        store: member.store,
      })
      return [...prev, payload]
    })
  }

  const updateMember = (id: string, data: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)))
  }

  const deleteMember = (id: string) => {
    setMembers((prev) => {
      const target = prev.find((m) => m.id === id)
      if (target) {
        addLog({
          type: 'member_delete',
          title: 'Hapus Member',
          description: `Hapus ${target.name} (${target.memberNo})`,
          store: target.store,
        })
      }
      return prev.filter((m) => m.id !== id)
    })
  }

  const resetStatuses = (id: string) => {
    updateMember(id, { whatsappSent: false, promoSent: false })
    const target = members.find((m) => m.id === id)
    addLog({
      type: 'reset',
      title: 'Reset Status',
      description: `Reset status ${target?.name ?? id}`,
      store: target?.store,
    })
  }

  const sendWhatsapp = (id: string) => {
    const member = members.find((m) => m.id === id)
    if (!member) return undefined

    const template = customMessageByStore[member.store] || ''
    const personalized = template.includes('{nama}')
      ? template.replace('{nama}', member.name)
      : `${member.name}, ${template}`.trim()

    const url = `https://wa.me/${member.waNumber}?text=${encodeURIComponent(personalized)}`

    updateMember(id, { whatsappSent: true })
    addLog({
      type: 'whatsapp_send',
      title: 'Kirim WhatsApp',
      description: `WA dikirim ke ${member.name} (${member.waNumber}) - Toko ${member.store}`,
      store: member.store,
    })

    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }

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
    logs,
    dashboardStats,
    approvePending,
    rejectPending,
    addMember,
    updateMember,
    deleteMember,
    resetStatuses,
    sendWhatsapp,
    setCustomMessage,
    addLog,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export default AppProvider


