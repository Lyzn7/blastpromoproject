import { useState } from 'react'
import Modal from '../components/Modal'
import type { Member } from '../context/AppContext'
import { useAppContext } from '../context/AppContext'

type ConfirmState = { title: string; message: string; action: () => void } | null

function TableHeader() {
  return (
    <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-3 rounded-lg bg-white_smoke-800 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-silver-700">
      <span>Nama</span>
      <span>No WA</span>
      <span>Toko</span>
      <span>Tanggal Daftar</span>
      <span className="text-right">Action</span>
    </div>
  )
}

function PendingRow({ member, onApprove, onReject }: { member: Member; onApprove: () => void; onReject: () => void }) {
  return (
    <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] items-center gap-3 rounded-lg border border-silver-700 bg-white_smoke-900 px-4 py-3 text-sm text-carbon_black-500">
      <div>
        <p className="font-semibold">{member.name}</p>
        <p className="text-xs text-silver-600">#{member.memberNo}</p>
      </div>
      <span>{member.waNumber}</span>
      <span className="font-semibold text-strawberry_red-500">Toko {member.store}</span>
      <span>{member.createdAt}</span>
      <div className="flex justify-end gap-2">
        <button
          className="rounded-lg bg-strawberry_red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-strawberry_red-400"
          onClick={onApprove}
        >
          Approve
        </button>
        <button
          className="rounded-lg border border-dark_garnet-600 px-3 py-1 text-xs font-semibold text-dark_garnet-800 hover:bg-dark_garnet-500/15"
          onClick={onReject}
        >
          Reject
        </button>
      </div>
    </div>
  )
}

function AllMembersTable({ members, onDelete }: { members: Member[]; onDelete: (id: string) => void }) {
  return (
    <div className="interactive-card mt-6 rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-md shadow-silver-400/30">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Semua Member</h3>
        <span className="text-xs text-silver-600">({members.length})</span>
      </div>
      <div className="mt-3 divide-y divide-red-700 overflow-hidden rounded-xl border border-silver-700 bg-white_smoke-900 text-sm max-h-[520px] overflow-y-auto pr-1">
        {members.map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] items-center gap-3 px-4 py-3 transition hover:bg-white_smoke-800"
          >
            <div>
              <p className="font-semibold">{m.name}</p>
              <p className="text-xs text-silver-600">{m.memberNo}</p>
            </div>
            <span>{m.waNumber}</span>
            <span>Toko {m.store}</span>
            <span
              className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                m.status === 'active'
                  ? 'bg-emerald-500/15 text-emerald-600'
                  : 'bg-silver-700 text-carbon_black-500'
              }`}
            >
              {m.status}
            </span>
            <div className="flex justify-end">
            <button
              className="rounded-lg border border-dark_garnet-600 px-3 py-1 text-xs font-semibold text-dark_garnet-800 hover:bg-dark_garnet-500/15"
              onClick={() => onDelete(m.id)}
            >
              Delete
            </button>
          </div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default function MemberPage() {
  const { pendingMembers, members, approvePending, rejectPending, deleteMember } = useAppContext()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState>(null)
  const confirmItem = pendingMembers.find((m) => m.id === confirmId)

  const openConfirm = (title: string, message: string, action: () => void) => setConfirm({ title, message, action })
  const runAndClose = () => {
    if (confirm?.action) confirm.action()
    setConfirm(null)
  }

  return (
    <div className="space-y-6">
      <section className="interactive-card rounded-2xl border border-silver-700 bg-white_smoke-900 p-5 shadow-md shadow-silver-400/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-silver-600">Persetujuan</p>
            <h2 className="text-xl font-semibold text-carbon_black-500">Pending Approval</h2>
          </div>
          <span className="rounded-full bg-strawberry_red-500/15 px-3 py-1 text-xs font-semibold text-strawberry_red-500">
            {pendingMembers.length} menunggu
          </span>
        </div>
        <div className="mt-4 space-y-2">
          <TableHeader />
          {pendingMembers.map((m) => (
            <PendingRow
              key={m.id}
              member={m}
              onApprove={() =>
                openConfirm('Setujui Member', 'Setujui pengajuan member ini?', () => {
                  approvePending(m.id)
                })
              }
              onReject={() => setConfirmId(m.id)}
            />
          ))}
          {pendingMembers.length === 0 ? <p className="px-4 py-6 text-sm text-silver-600">Tidak ada data pending.</p> : null}
        </div>
      </section>

      <AllMembersTable
        members={members}
        onDelete={(id) =>
          openConfirm('Hapus Member', 'Hapus member ini?', () => {
            deleteMember(id)
          })
        }
      />

      <Modal
        open={Boolean(confirmId)}
        onClose={() => setConfirmId(null)}
        title="Tolak & Hapus?"
        footer={
          <>
            <button className="rounded-lg px-3 py-2 text-sm text-silver-600" onClick={() => setConfirmId(null)}>
              Batal
            </button>
            <button
              className="rounded-lg bg-dark_garnet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-dark_garnet-500"
              onClick={() => {
                if (confirmId) rejectPending(confirmId)
                setConfirmId(null)
              }}
            >
              Ya, hapus
            </button>
          </>
        }
      >
        <p className="text-sm text-carbon_black-500">
          Hapus pengajuan member <span className="font-semibold">{confirmItem?.name}</span>? Data akan dibuang dari daftar pending.
        </p>
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
