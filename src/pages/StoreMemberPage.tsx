import { useEffect, useMemo, useState } from 'react'
import Modal from '../components/Modal'
import type { Member, MemberStatus } from '../context/AppContext'
import { useAppContext } from '../context/AppContext'

type StoreMemberPageProps = {
  store: 'A' | 'B' | 'C'
}

const statusOptions: MemberStatus[] = ['active', 'inactive', 'pending']
type ConfirmState = { title: string; message: string; action: () => void } | null

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
  const [touched, setTouched] = useState<{ [K in keyof FormState]: boolean }>({
    name: false,
    waNumber: false,
    birthDate: false,
    status: false,
  })
  const nameRef = useMemo(() => ({ current: null as HTMLInputElement | null }), [])

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  const errors = {
    name: !form.name.trim() ? 'Nama wajib diisi' : '',
    waNumber: !form.waNumber.trim() ? 'No WA wajib diisi' : '',
  }
  const invalid = Boolean(errors.name || errors.waNumber)

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (invalid) return
        onSubmit(form)
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-carbon_black-500">
          <span>Nama</span>
          <input
            required
            ref={nameRef as unknown as React.RefObject<HTMLInputElement>}
            className="interactive-input w-full rounded-xl border border-silver-700 bg-white_smoke-900 px-3 py-3 text-carbon_black-500 shadow-inner focus:border-strawberry_red-500 focus:outline-none focus:ring-2 focus:ring-strawberry_red-200"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, name: true }))}
          />
          {touched.name && errors.name ? <p className="text-xs text-dark_garnet-600">{errors.name}</p> : null}
        </label>
        <label className="space-y-1 text-sm font-medium text-carbon_black-500">
          <span>No WhatsApp</span>
          <input
            required
            inputMode="numeric"
            className="interactive-input w-full rounded-xl border border-silver-700 bg-white_smoke-900 px-3 py-3 text-carbon_black-500 shadow-inner focus:border-strawberry_red-500 focus:outline-none focus:ring-2 focus:ring-strawberry_red-200"
            value={form.waNumber}
            onChange={(e) => handleChange('waNumber', e.target.value.replace(/\D+/g, ''))}
            onBlur={() => setTouched((p) => ({ ...p, waNumber: true }))}
            placeholder="Contoh: 62812xxxx"
          />
          {touched.waNumber && errors.waNumber ? <p className="text-xs text-dark_garnet-600">{errors.waNumber}</p> : null}
          <p className="text-xs text-silver-600">Contoh: 62812xxxx</p>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-carbon_black-500">
          <span>Tanggal Lahir</span>
          <input
            type="date"
            required
            className="interactive-input w-full rounded-xl border border-silver-700 bg-white_smoke-900 px-3 py-3 text-carbon_black-500 shadow-inner focus:border-strawberry_red-500 focus:outline-none focus:ring-2 focus:ring-strawberry_red-200"
            value={form.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-carbon_black-500">
          <span>Status</span>
          <select
            className="interactive-input w-full rounded-xl border border-silver-700 bg-white_smoke-900 px-3 py-3 text-carbon_black-500 shadow-inner focus:border-strawberry_red-500 focus:outline-none focus:ring-2 focus:ring-strawberry_red-200"
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
      <div className="flex flex-col gap-3 border-t border-silver-700 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="interactive-btn rounded-lg border border-silver-700 px-4 py-2 text-sm font-semibold text-carbon_black-500 hover:bg-silver-800"
          onClick={() => onSubmit(initial)}
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={invalid}
          className="interactive-btn rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition bg-emerald-500 hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 disabled:cursor-not-allowed disabled:bg-silver-700"
        >
          Simpan
        </button>
      </div>
    </form>
  )
}

function Toolbar({ onAdd, search, setSearch, statusFilter, setStatusFilter }: any) {
  return (
    <div className="interactive-card flex flex-col gap-3 rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-md shadow-silver-400/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap gap-3">
        <input
        className="interactive-input min-w-[200px] flex-1 rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
          placeholder="Cari nama / no WA"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="interactive-input rounded-lg border border-silver-700 bg-white_smoke-800 px-3 py-2 text-sm text-carbon_black-500"
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
          className="interactive-btn rounded-lg bg-strawberry_red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-strawberry_red-400"
          onClick={onAdd}
        >
          Add Member
        </button>
      </div>
    </div>
  )
}

function MemberTableHeader() {
  return (
    <div className="grid grid-cols-[120px_1.3fr_1.1fr_1fr_0.9fr_auto] gap-3 rounded-lg bg-white_smoke-800 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-carbon_black-500">
      <span>ID</span>
      <span>Nama</span>
      <span>No WA</span>
      <span>Tgl Lahir</span>
      <span>Status</span>
      <span className="text-right">Action</span>
    </div>
  )
}

function MemberTableRow({
  member,
  onEdit,
  onDelete,
  onReset,
}: {
  member: Member
  onEdit: () => void
  onDelete: () => void
  onReset: () => void
}) {
  return (
    <div className="grid grid-cols-[120px_1.3fr_1.1fr_1fr_0.9fr_auto] items-center gap-3 px-4 py-3 text-sm text-carbon_black-500 transition hover:bg-white_smoke-800 bg-white_smoke-900">
      <span className="truncate text-xs font-semibold text-silver-600">{member.memberNo}</span>
      <div className="min-w-0">
        <div className="truncate font-semibold">{member.name}</div>
      </div>
      <span className="truncate">{member.waNumber}</span>
      <span>{member.birthDate}</span>
      <span className={member.status === 'active' ? 'text-emerald-600 font-semibold' : 'text-silver-600'}>{member.status}</span>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          className="interactive-btn h-8 rounded-lg border border-silver-700 px-3 text-xs font-semibold text-carbon_black-500 hover:bg-silver-800"
          onClick={onReset}
        >
          Reset
        </button>
        <button
          className="interactive-btn h-8 rounded-lg border border-silver-700 px-3 text-xs font-semibold text-carbon_black-500 hover:bg-silver-800"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="interactive-btn h-8 rounded-lg border border-dark_garnet-600 px-3 text-xs font-semibold text-dark_garnet-800 hover:bg-dark_garnet-500/15"
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
    resetStatuses,
  } = useAppContext()

  const storeMembers = useMemo(() => members.filter((m) => m.store === store), [members, store])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState>(null)

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

  const openConfirm = (title: string, message: string, action: () => void) => setConfirm({ title, message, action })
  const runAndClose = () => {
    if (confirm?.action) confirm.action()
    setConfirm(null)
  }

  const handleSubmit = (data: FormState) => {
    if (modalMode === 'add') {
      openConfirm('Tambah Member', 'Simpan member baru?', () => {
        addMember({ ...data, store })
        setModalMode(null)
        setActiveId(null)
      })
    } else if (modalMode === 'edit' && activeId) {
      openConfirm('Simpan Perubahan', 'Simpan perubahan member?', () => {
        updateMember(activeId, data)
        setModalMode(null)
        setActiveId(null)
      })
    }
  }

  return (
    <div className="space-y-6">
      <Toolbar
        onAdd={openAdd}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="interactive-card rounded-2xl border border-silver-700 bg-white_smoke-900 p-6 shadow-md shadow-silver-400/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-silver-600">Member</p>
            <h3 className="text-lg font-semibold text-carbon_black-500">Toko {store}</h3>
          </div>
          <span className="rounded-full bg-strawberry_red-500/15 px-3 py-1 text-xs font-semibold text-strawberry_red-500">
            {filtered.length} member
          </span>
        </div>
        <div className="mt-4 overflow-x-auto ">
          <div className="min-w-[1100px] space-y-3 text-sm text-carbon_black-500">
            <MemberTableHeader />
            <div className="divide-y divide-red-700 overflow-hidden rounded-xl border border-silver-700 bg-white_smoke-900">
              {filtered.map((member) => (
                <MemberTableRow
                  key={member.id}
                  member={member}
                  onEdit={() => openConfirm('Edit Member', 'Edit data member ini?', () => openEdit(member.id))}
                  onDelete={() => setConfirmDelete(member.id)}
                  onReset={() =>
                    openConfirm('Reset Status', 'Reset status WA & promo member ini?', () => resetStatuses(member.id))
                  }
                />
              ))}
            </div>
            {filtered.length === 0 ? <p className="px-4 py-6 text-sm text-silver-600">Tidak ada member.</p> : null}
          </div>
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
