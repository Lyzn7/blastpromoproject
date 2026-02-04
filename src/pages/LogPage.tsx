import { useMemo, useState } from 'react'
import Modal from '../components/Modal'
import { useAppContext, type LogItem } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const typeOptions: { label: string; value: LogItem['type'] | 'all' }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Tambah Member', value: 'member_add' },
  { label: 'Edit Member', value: 'member_edit' },
  { label: 'Delete Member', value: 'member_delete' },
  { label: 'Approval', value: 'approval' },
  { label: 'Kirim WhatsApp', value: 'whatsapp_send' },
  { label: 'Promo Terkirim', value: 'promo_mark' },
  { label: 'Reset', value: 'reset' },
  { label: 'Ultah', value: 'birthday' },
  { label: 'Lainnya', value: 'other' },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const defaultStoreOptions = [
  { label: 'Semua Toko', value: 'all' },
  { label: 'Toko A', value: 'A' },
  { label: 'Toko B', value: 'B' },
  { label: 'Toko C', value: 'C' },
]

function formatDate(date: string) {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(date: string) {
  const d = new Date(date)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function typeBadge(type: LogItem['type']) {
  const map: Record<LogItem['type'], string> = {
    member_add: 'bg-emerald-500/15 text-emerald-600',
    member_delete: 'bg-dark_garnet-600/15 text-dark_garnet-600',
    member_edit: 'bg-amber-500/15 text-amber-700',
    approval: 'bg-silver-700 text-carbon_black-500',
    whatsapp_send: 'bg-strawberry_red-500/15 text-strawberry_red-500',
    promo_mark: 'bg-mahogany_bright-500/15 text-mahogany_bright-500',
    reset: 'bg-silver-700 text-carbon_black-500',
    birthday: 'bg-strawberry_red-500/15 text-strawberry_red-500',
    other: 'bg-silver-700 text-carbon_black-500',
  }
  return map[type]
}

export default function LogPage() {
  const { logs } = useAppContext()
  const { allowedStores } = useAuth()
  const [type, setType] = useState<LogItem['type'] | 'all'>('all')
  const [month, setMonth] = useState<string>('all')
  const [store, setStore] = useState<'all' | 'A' | 'B' | 'C'>(allowedStores.length === 1 ? allowedStores[0] : 'all')
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [detail, setDetail] = useState<LogItem | null>(null)

  const storeOptions = useMemo(
    () => defaultStoreOptions.filter((opt) => opt.value === 'all' || allowedStores.includes(opt.value as 'A' | 'B' | 'C')),
    [allowedStores],
  )

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (!allowedStores.includes((log.store ?? 'none') as 'A' | 'B' | 'C')) return false
      if (type !== 'all' && log.type !== type) return false
      if (month !== 'all') {
        const m = new Date(log.createdAt).getMonth()
        if (m !== months.indexOf(month)) return false
      }
      if (store !== 'all' && log.store !== store) return false
      if (startDate) {
        const d = new Date(log.createdAt).getTime()
        const s = new Date(startDate).getTime()
        const e = endDate ? new Date(endDate).getTime() : s
        if (d < s || d > e + 24 * 60 * 60 * 1000 - 1) return false
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!(`${log.title} ${log.description}`.toLowerCase().includes(q))) return false
      }
      return true
    })
  }, [logs, type, month, store, startDate, endDate, search])

  const resetFilter = () => {
    setType('all')
    setMonth('all')
    setStore(allowedStores.length === 1 ? allowedStores[0] : 'all')
    setSearch('')
    setStartDate('')
    setEndDate('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-carbon_black-500">Log Aktivitas</h1>
        <p className="text-sm text-silver-600">Riwayat semua aksi dalam sistem</p>
      </div>

      <div className="interactive-card rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-md shadow-silver-400/30 space-y-3">
        <div className="grid gap-3 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-carbon_black-500">Tipe</label>
            <select
              className="interactive-input mt-1 w-full rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
              value={type}
              onChange={(e) => setType(e.target.value as LogItem['type'] | 'all')}
            >
              {typeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-carbon_black-500">Bulan</label>
            <select
              className="interactive-input mt-1 w-full rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="all">Semua bulan</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-carbon_black-500">Toko</label>
            <select
              className="interactive-input mt-1 w-full rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
              value={store}
              onChange={(e) => setStore(e.target.value as 'all' | 'A' | 'B' | 'C')}
            >
              {storeOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-carbon_black-500">Tanggal mulai</label>
            <input
              type="date"
              className="interactive-input mt-1 w-full rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-carbon_black-500">Tanggal akhir</label>
            <input
              type="date"
              className="interactive-input mt-1 w-full rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-carbon_black-500">Cari</label>
            <input
              className="interactive-input mt-1 w-full rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
              placeholder="Cari deskripsi / nama"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-silver-700 pt-3">
          <div className="text-xs text-silver-600">Menampilkan {filtered.length} log</div>
          <div className="flex gap-2">
            <button
              className="interactive-btn rounded-lg border border-silver-700 px-3 py-2 text-sm font-semibold text-carbon_black-500 hover:bg-silver-800"
              onClick={resetFilter}
            >
              Reset Filter
            </button>
            <button className="interactive-btn rounded-lg border border-silver-700 px-3 py-2 text-sm font-semibold text-carbon_black-500 hover:bg-silver-800">
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="interactive-card space-y-3 rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-md shadow-silver-400/30">
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {filtered.map((log) => (
            <button
              key={log.id}
              className="interactive-card w-full text-left rounded-xl border border-silver-700 bg-white_smoke-900 px-4 py-3 shadow-sm shadow-silver-400/30"
              onClick={() => setDetail(log)}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeBadge(log.type)}`}>{log.type}</span>
                {log.store ? (
                  <span className="rounded-full bg-silver-700 px-2.5 py-1 text-xs font-semibold text-carbon_black-500">Toko {log.store}</span>
                ) : null}
                <span className="text-xs text-silver-600">{formatDate(log.createdAt)} · {formatTime(log.createdAt)}</span>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-semibold text-carbon_black-500">{log.title}</p>
                <p className="text-sm text-silver-600">{log.description}</p>
              </div>
            </button>
          ))}
          {filtered.length === 0 ? <p className="text-sm text-silver-600">Tidak ada log sesuai filter.</p> : null}
        </div>
      </div>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title="Detail Log"
        footer={
          <button
            className="interactive-btn rounded-lg border border-silver-700 px-4 py-2 text-sm font-semibold text-carbon_black-500 hover:bg-silver-800"
            onClick={() => setDetail(null)}
          >
            Tutup
          </button>
        }
      >
        {detail ? (
          <div className="space-y-3 text-sm text-carbon_black-500">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className={`rounded-full px-3 py-1 ${typeBadge(detail.type)}`}>{detail.type}</span>
              {detail.store ? (
                <span className="rounded-full bg-silver-700 px-3 py-1 text-carbon_black-500">Toko {detail.store}</span>
              ) : null}
            </div>
            <div>
              <p className="text-sm font-semibold">{detail.title}</p>
              <p className="text-silver-600">{detail.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-silver-700">
              <div><span className="font-semibold text-carbon_black-500">Waktu:</span> {formatDate(detail.createdAt)} {formatTime(detail.createdAt)}</div>
              <div><span className="font-semibold text-carbon_black-500">Actor:</span> {detail.actor}</div>
              <div><span className="font-semibold text-carbon_black-500">Type:</span> {detail.type}</div>
              <div><span className="font-semibold text-carbon_black-500">Store:</span> {detail.store ?? '-'}</div>
            </div>
            {detail.meta ? (
              <pre className="rounded-lg bg-white_smoke-800 p-3 text-xs text-carbon_black-500">{JSON.stringify(detail.meta, null, 2)}</pre>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
