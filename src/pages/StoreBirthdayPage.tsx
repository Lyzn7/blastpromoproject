import { useMemo, useState } from 'react'
import Modal from '../components/Modal'
import { useAppContext } from '../context/AppContext'

type Store = 'A' | 'B' | 'C'
type ConfirmState = { title: string; message: string; action: () => void } | null

export default function StoreBirthdayPage({ store }: { store: Store }) {
  const { members, customMessageByStore, setCustomMessage, updateMember } = useAppContext()
  const month = new Date().getMonth()
  const [confirm, setConfirm] = useState<ConfirmState>(null)

  const list = useMemo(
    () =>
      members
        .filter((m) => m.store === store && new Date(m.birthDate).getMonth() === month)
        .sort((a, b) => a.birthDate.localeCompare(b.birthDate)),
    [members, month, store],
  )

  const template = customMessageByStore[store] ?? ''

  const personalize = (name: string) => {
    if (template.includes('{nama}')) return template.replace('{nama}', name)
    return `${name}, ${template}`.trim()
  }

  const openConfirm = (title: string, message: string, action: () => void) => setConfirm({ title, message, action })
  const runAndClose = () => {
    if (confirm?.action) confirm.action()
    setConfirm(null)
  }

  const handleSend = (id: string, waNumber: string, name: string) => {
    const text = personalize(name)
    openConfirm('Kirim WA', `Kirim WA ulang tahun ke ${name}?`, () => {
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
      updateMember(id, { whatsappSent: true })
      window.open(url, '_blank')
    })
  }

  const resetOne = (id: string) => {
    const target = members.find((m) => m.id === id)
    openConfirm('Reset Status', `Reset status kirim ${target?.name ?? 'member'}?`, () => updateMember(id, { whatsappSent: false }))
  }
  const resetAll = () => {
    openConfirm('Reset Semua', 'Reset status kirim untuk semua member toko ini?', () => {
      members
        .filter((m) => m.store === store)
        .forEach((m) => updateMember(m.id, { whatsappSent: false }))
    })
  }

  const daysLeft = (date: string) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const b = new Date(date)
    let target = new Date(today.getFullYear(), b.getMonth(), b.getDate())
    if (target < today) target = new Date(today.getFullYear() + 1, b.getMonth(), b.getDate())
    return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-silver-600">Ultah Member</p>
          <h1 className="text-2xl font-semibold text-carbon_black-500">Toko {store}</h1>
        </div>
        <span className="rounded-full bg-strawberry_red-500/15 px-3 py-1 text-sm font-semibold text-strawberry_red-500">
          {list.length} orang bulan ini
        </span>
      </div>

      <div className="interactive-card rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-sm shadow-silver-400/30 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-carbon_black-500">Custom pesan ulang tahun</p>
          <p className="text-xs text-silver-600">
            Gunakan placeholder <code className="font-mono text-strawberry_red-500">{'{nama}'}</code> untuk otomatis menyisipkan nama
            member.
          </p>
          <textarea
            className="interactive-input w-full rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-3 text-sm text-carbon_black-500"
            rows={3}
            value={template}
            onChange={(e) => setCustomMessage(store, e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="grid w-full grid-cols-[1.2fr_1fr_1fr_0.7fr_0.8fr_auto] gap-3 rounded-lg bg-white_smoke-800 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-silver-700">
            <span>Nama</span>
            <span>No WA</span>
            <span>Tanggal Lahir</span>
            <span>Sisa Hari</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
          <div className="ml-3 flex shrink-0 gap-2 text-xs">
            <button
              className="interactive-btn rounded-lg border border-silver-700 px-3 py-2 font-semibold text-carbon_black-500 hover:bg-silver-800"
              onClick={resetAll}
            >
              Reset Semua Status
            </button>
          </div>
        </div>
        <div className="divide-y divide-red-700 overflow-hidden rounded-xl border border-silver-700 bg-white_smoke-900">
          {list.map((m) => {
            const fullDate = new Date(m.birthDate).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
            const days = daysLeft(m.birthDate)
            return (
              <div
                key={m.id}
                className="grid grid-cols-[1.2fr_1fr_1fr_0.7fr_0.8fr_auto] items-center gap-3 px-4 py-3 text-sm text-carbon_black-500 transition hover:bg-white_smoke-800 bg-white_smoke-900"
              >
                <div className="font-semibold">{m.name}</div>
                <span className="truncate">{m.waNumber}</span>
                <span>{fullDate}</span>
                <span className="text-xs font-semibold text-carbon_black-500">
                  {days === 0 ? 'Hari ini' : `H-${days}`}
                </span>
                <span
                  className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-semibold ${
                    m.whatsappSent ? 'bg-strawberry_red-500/15 text-strawberry_red-500' : 'bg-silver-700 text-carbon_black-500'
                  }`}
                >
                  {m.whatsappSent ? 'Sudah dikirim' : 'Belum'}
                </span>
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    className="interactive-btn rounded-lg bg-strawberry_red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-strawberry_red-400"
                    onClick={() => handleSend(m.id, m.waNumber, m.name)}
                  >
                    Kirim WA
                  </button>
                  <button
                    className="interactive-btn rounded-lg border border-silver-700 px-3 py-1.5 text-xs font-semibold text-carbon_black-500 hover:bg-silver-800"
                    onClick={() => resetOne(m.id)}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )
          })}
          {list.length === 0 ? <p className="px-4 py-5 text-sm text-silver-600">Tidak ada ulang tahun bulan ini.</p> : null}
        </div>
    </div>

      <Modal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        title={confirm?.title ?? 'Konfirmasi'}
        footer={
          <div className="flex gap-2">
            <button
              className="interactive-btn rounded-lg border border-silver-700 px-4 py-2 text-sm font-semibold text-carbon_black-500 hover:bg-silver-800"
              onClick={() => setConfirm(null)}
            >
              Batal
            </button>
            <button
              className="interactive-btn rounded-lg bg-strawberry_red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-strawberry_red-400"
              onClick={runAndClose}
            >
              Ya, lanjut
            </button>
          </div>
        }
      >
        <p className="text-sm text-carbon_black-500">{confirm?.message}</p>
      </Modal>
    </div>
  )
}
