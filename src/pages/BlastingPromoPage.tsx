import { useMemo, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import Modal from '../components/Modal'

type Store = 'A' | 'B' | 'C'
type ConfirmState = { title: string; message: string; action: () => void } | null

export default function BlastingPromoPage({ store }: { store: Store }) {
  const { members, customMessageByStore, setCustomMessage, sendWhatsapp, updateMember } = useAppContext()
  const [preview, setPreview] = useState(false)
  const [confirm, setConfirm] = useState<ConfirmState>(null)

  const storeMembers = useMemo(() => members.filter((m) => m.store === store), [members, store])
  const template = customMessageByStore[store] ?? ''

  const openConfirm = (title: string, message: string, action: () => void) => setConfirm({ title, message, action })
  const runAndClose = () => {
    if (confirm?.action) confirm.action()
    setConfirm(null)
  }

//  const sendSelected = () => {
//     return
//   }

//   const sendAll = () => {
//     if (storeMembers.length === 0) return
//     openConfirm('Kirim Semua', `Kirim WA ke semua member Toko ${store}? (${storeMembers.length} orang)`, () => {
//       storeMembers.forEach((m) => sendWhatsapp(m.id))
//     })
//   }

  const resetOne = (id: string) => {
    const target = members.find((m) => m.id === id)
    openConfirm('Reset Status', `Reset status kirim ${target?.name ?? 'member'}?`, () => updateMember(id, { whatsappSent: false }))
  }

  const resetAll = () => {
    openConfirm('Reset Semua', 'Reset status kirim untuk semua member toko ini?', () => {
      storeMembers.forEach((m) => updateMember(m.id, { whatsappSent: false }))
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-silver-600">Blasting Promo</p>
          <h1 className="text-2xl font-semibold text-carbon_black-500">Toko {store}</h1>
        </div>
        <div className="flex gap-2 text-sm">
          {/* <button
            className="interactive-btn rounded-lg border border-silver-700 px-4 py-2 font-semibold text-carbon_black-500 hover:bg-silver-800"
            onClick={() => setPreview(true)}
          >
            Preview Pesan
          </button> */}
          {/* <button
            className="interactive-btn rounded-lg border border-silver-700 px-4 py-2 font-semibold text-carbon_black-500 hover:bg-silver-800"
            onClick={resetAll}
          >
            Reset Semua Status
          </button> */}
          {/* <button
            className="interactive-btn rounded-lg bg-strawberry_red-500 px-4 py-2 font-semibold text-white hover:bg-strawberry_red-400"
            onClick={sendAll}
          >
            Kirim ke Semua
          </button>
          <button
            disabled={selected.length === 0}
            className="interactive-btn rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-400 disabled:bg-silver-700 disabled:cursor-not-allowed"
            onClick={sendSelected}
          >
            Kirim {selected.length} Terpilih
          </button> */}
        </div>
      </div>

      <div className="interactive-card space-y-3 rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-md shadow-silver-400/30">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-carbon_black-500">Template Pesan</p>
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
        
       
        <div >
          <div className="grid grid-cols-[1.2fr_1fr_auto] gap-3 bg-white_smoke-800 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-silver-700 sticky top-0">
            <span>Nama</span>
            <span>No WA</span>
            <span className="flex items-center justify-end gap-3">
              <span>Action</span>
              <button
                className="interactive-btn rounded-lg border border-silver-700 px-4 py-2 font-semibold text-carbon_black-500 hover:bg-silver-800"
                onClick={resetAll}
              >
                Reset Semua Status
              </button>
            </span>
          </div>
          <div className="divide-y divide-red-700 bg-white_smoke-900 max-h-[520px] overflow-y-auto rounded-xl border border-silver-700">
            {storeMembers.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-[1.2fr_1fr_auto] items-center gap-3 px-4 py-3 text-sm text-carbon_black-500 transition hover:bg-white_smoke-800"
              >
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-silver-600">{m.memberNo}</p>
                </div>
                <span>{m.waNumber}</span>
                <div className="flex justify-end gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      m.whatsappSent ? 'bg-emerald-500/15 text-emerald-600' : 'bg-silver-700 text-carbon_black-500'
                    }`}
                  >
                    {m.whatsappSent ? 'Sudah dikirim' : 'Belum'}
                  </span>
                  <button
                    className="interactive-btn rounded-lg bg-strawberry_red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-strawberry_red-400"
                    onClick={() => openConfirm('Kirim WA', `Kirim WA ke ${m.name}?`, () => sendWhatsapp(m.id))}
                  >
                    Kirim WA
                  </button>
                  <button
                    className="interactive-btn rounded-lg border border-silver-700 px-3 py-1 text-xs font-semibold text-carbon_black-500 hover:bg-silver-800"
                    onClick={() => resetOne(m.id)}
                  >
                    Reset
                  </button>
                </div>
              </div>
            ))}
          </div>
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

      <Modal
        open={preview}
        onClose={() => setPreview(false)}
        title="Preview Pesan"
        footer={
          <button
            className="interactive-btn rounded-lg border border-silver-700 px-4 py-2 text-sm font-semibold text-carbon_black-500 hover:bg-silver-800"
            onClick={() => setPreview(false)}
          >
            Tutup
          </button>
        }
      >
        <p className="whitespace-pre-line text-sm text-carbon_black-500">{template}</p>
      </Modal>
    </div>
  )
}
