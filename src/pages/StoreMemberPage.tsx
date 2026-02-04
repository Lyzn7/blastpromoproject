import { useMemo, useState } from 'react'
import Modal from '../components/Modal'
import type { Member, MemberStatus } from '../context/AppContext'
import { useAppContext } from '../context/AppContext'

type StoreMemberPageProps = {
  store: 'A' | 'B' | 'C'
}

const statusOptions: MemberStatus[] = ['active', 'inactive', 'pending']

type FormState = {
  name: string
  waNumber: string
  birthDate: string
  status: MemberStatus
}

function MemberForm({
  initial,
  onSubmit,
}: {
  initial: FormState
  onSubmit: (data: FormState) => void
}) {
  const [form, setForm] = useState<FormState>(initial)

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(form)
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-silver-600">Nama</span>
          <input
            required
            className="w-full rounded-lg border border-carbon_black-400 bg-carbon_black-500 px-3 py-2 text-white_smoke-800"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-silver-600">No WhatsApp</span>
          <input
            required
            className="w-full rounded-lg border border-carbon_black-400 bg-carbon_black-500 px-3 py-2 text-white_smoke-800"
            value={form.waNumber}
            onChange={(e) => handleChange('waNumber', e.target.value)}
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-silver-600">Tanggal Lahir</span>
          <input
            type="date"
            required
            className="w-full rounded-lg border border-carbon_black-400 bg-carbon_black-500 px-3 py-2 text-white_smoke-800"
            value={form.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-silver-600">Status</span>
          <select
            className="w-full rounded-lg border border-carbon_black-400 bg-carbon_black-500 px-3 py-2 text-white_smoke-800"
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value as MemberStatus)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
        >
          Simpan
        </button>
      </div>
    </form>
  )
}

function Toolbar({ onAdd, search, setSearch, statusFilter, setStatusFilter }: any) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-md shadow-silver-400/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap gap-3">
        <input
          className="min-w-[200px] flex-1 rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
          placeholder="Cari nama / no WA"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Semua status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          className="rounded-lg bg-strawberry_red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-strawberry_red-400"
          onClick={onAdd}
        >
          Add Member
        </button>
      </div>
    </div>
  )
}

function CustomMessageBox({ store }: { store: 'A' | 'B' | 'C' }) {
  const { customMessageByStore, setCustomMessage } = useAppContext()
  const [text, setText] = useState(customMessageByStore[store])
  const [preview, setPreview] = useState(false)

  return (
    <div className="space-y-3 rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-md shadow-silver-400/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-silver-600">Custom Text Promo</p>
          <h3 className="text-lg font-semibold text-carbon_black-500">Toko {store}</h3>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-silver-700 px-3 py-1.5 text-xs font-semibold text-carbon_black-500 hover:border-strawberry_red-500"
            onClick={() => setPreview(true)}
          >
            Preview
          </button>
          <button
            className="rounded-lg bg-strawberry_red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-strawberry_red-400"
            onClick={() => setCustomMessage(store, text)}
          >
            Set Default
          </button>
        </div>
      </div>
      <textarea
        className="w-full rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-3 text-sm text-carbon_black-500"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Modal
        open={preview}
        onClose={() => setPreview(false)}
        title="Preview Pesan"
        footer={
          <button className="rounded-lg bg-strawberry_red-500 px-4 py-2 text-sm font-semibold text-white" onClick={() => setPreview(false)}>
            Tutup
          </button>
        }
      >
        <p className="whitespace-pre-line text-sm text-carbon_black-500">{text}</p>
      </Modal>
    </div>
  )
}

function MemberRow({
  member,
  onEdit,
  onDelete,
  onSendWA,
  onTogglePromo,
  onReset,
}: {
  member: Member
  onEdit: () => void
  onDelete: () => void
  onSendWA: () => void
  onTogglePromo: () => void
  onReset: () => void
}) {
  return (
    <div className="grid grid-cols-[0.7fr_1fr_1fr_1fr_auto] items-center gap-3 rounded-lg border border-silver-700 bg-white_smoke-900 px-4 py-3 text-sm text-carbon_black-500">
      <div>
        <p className="font-semibold text-white_smoke-800">{member.name}</p>
        <p className="text-xs text-silver-600">{member.memberNo}</p>
      </div>
      <span>{member.waNumber}</span>
      <span>{member.birthDate}</span>
      <div className="flex flex-col gap-1 text-xs">
        <span className={`inline-flex w-fit rounded-full px-2 py-1 ${member.whatsappSent ? 'bg-strawberry_red-500/15 text-strawberry_red-500' : 'bg-silver-800 text-silver-700'}`}>
          WA: {member.whatsappSent ? 'sudah' : 'belum'}
        </span>
        <span className={`inline-flex w-fit rounded-full px-2 py-1 ${member.promoSent ? 'bg-strawberry_red-500/15 text-strawberry_red-500' : 'bg-silver-800 text-silver-700'}`}>
          Promo: {member.promoSent ? 'dikirim' : 'belum'}
        </span>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <button
          className="rounded-lg bg-strawberry_red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-strawberry_red-400"
          onClick={onSendWA}
        >
          WhatsApp
        </button>
        <button
          className="rounded-lg border border-mahogany_red-600 px-3 py-1 text-xs font-semibold text-mahogany_red-900 hover:bg-mahogany_red-500/15"
          onClick={onTogglePromo}
        >
          Promo Sent
        </button>
        <button
          className="rounded-lg border border-silver-700 px-3 py-1 text-xs font-semibold text-carbon_black-500 hover:bg-silver-800"
          onClick={onReset}
        >
          Reset
        </button>
        <button
          className="rounded-lg border border-silver-700 px-3 py-1 text-xs font-semibold text-carbon_black-500 hover:bg-silver-800"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="rounded-lg border border-dark_garnet-600 px-3 py-1 text-xs font-semibold text-dark_garnet-800 hover:bg-dark_garnet-500/15"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default function StoreMemberPage({ store }: StoreMemberPageProps) {
  const {
    members,
    addMember,
    updateMember,
    deleteMember,
    sendWhatsapp,
    togglePromo,
    resetStatuses,
  } = useAppContext()

  const storeMembers = useMemo(() => members.filter((m) => m.store === store), [members, store])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return storeMembers.filter((m) => {
      const matchQuery = m.name.toLowerCase().includes(q) || m.waNumber.includes(q)
      const matchStatus = statusFilter ? m.status === statusFilter : true
      return matchQuery && matchStatus
    })
  }, [storeMembers, search, statusFilter])

  const activeMember = storeMembers.find((m) => m.id === activeId)

  const baseForm: FormState = activeMember
    ? {
        name: activeMember.name,
        waNumber: activeMember.waNumber,
        birthDate: activeMember.birthDate,
        status: activeMember.status,
      }
    : {
        name: '',
        waNumber: '',
        birthDate: new Date().toISOString().slice(0, 10),
        status: 'active',
      }

  const openAdd = () => {
    setModalMode('add')
    setActiveId(null)
  }

  const openEdit = (id: string) => {
    setActiveId(id)
    setModalMode('edit')
  }

  const handleSubmit = (data: FormState) => {
    if (modalMode === 'add') {
      addMember({ ...data, store })
    } else if (modalMode === 'edit' && activeId) {
      updateMember(activeId, data)
    }
    setModalMode(null)
    setActiveId(null)
  }

  return (
    <div className="space-y-6">
      <CustomMessageBox store={store} />

      <Toolbar
        onAdd={openAdd}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-md shadow-silver-400/30">
        <div className="flex items-center justify-between">
          <div>
          <p className="text-xs uppercase tracking-[0.2em] text-silver-600">Member</p>
          <h3 className="text-lg font-semibold text-carbon_black-500">Toko {store}</h3>
          </div>
          <span className="rounded-full bg-strawberry_red-500/15 px-3 py-1 text-xs font-semibold text-strawberry_red-500">
            {filtered.length} member
          </span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-[0.7fr_1fr_1fr_1fr_auto] gap-3 rounded-lg bg-white_smoke-800 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-silver-700">
            <span>Nama</span>
            <span>No WA</span>
            <span>Tgl Lahir</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
          {filtered.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              onEdit={() => openEdit(member.id)}
              onDelete={() => setConfirmDelete(member.id)}
              onSendWA={() => {
                const url = sendWhatsapp(member.id)
                if (url) window.open(url, '_blank')
              }}
              onTogglePromo={() => togglePromo(member.id)}
              onReset={() => resetStatuses(member.id)}
            />
          ))}
          {filtered.length === 0 ? <p className="px-4 py-6 text-sm text-silver-600">Tidak ada member.</p> : null}
        </div>
      </div>

      <Modal
        open={modalMode !== null}
        onClose={() => setModalMode(null)}
        title={modalMode === 'add' ? 'Tambah Member' : 'Edit Member'}
      >
        <MemberForm initial={baseForm} onSubmit={handleSubmit} />
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Hapus Member"
        footer={
          <>
            <button className="rounded-lg px-3 py-2 text-sm text-silver-600" onClick={() => setConfirmDelete(null)}>
              Batal
            </button>
            <button
              className="rounded-lg bg-dark_garnet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-dark_garnet-500"
              onClick={() => {
                if (confirmDelete) deleteMember(confirmDelete)
                setConfirmDelete(null)
              }}
            >
              Hapus
            </button>
          </>
        }
      >
        <p className="text-sm text-carbon_black-500">Yakin hapus member ini? Status WA & promo juga akan hilang.</p>
      </Modal>
    </div>
  )
}
