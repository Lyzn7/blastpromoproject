import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppContext } from '../context/AppContext'

function Card({ title, value, subtle, icon }: { title: string; value: string | number; subtle?: string; icon: string }) {
  return (
    <div className="interactive-card flex items-start gap-4 rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-md shadow-silver-400/30">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-strawberry_red-500/10 text-2xl">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-silver-600">{title}</p>
        <div className="mt-1 text-3xl font-semibold text-carbon_black-500">{value}</div>
        {subtle ? <p className="mt-1 text-xs text-silver-600">{subtle}</p> : null}
      </div>
    </div>
  )
}

function ActiveMemberChart() {
  const {
    dashboardStats: { activeWeekly, activeMonthly },
  } = useAppContext()
  const [mode, setMode] = useState<'weekly' | 'monthly'>('weekly')
  const data = mode === 'weekly' ? activeWeekly : activeMonthly

  return (
    <div className="interactive-card rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-lg shadow-silver-400/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-silver-600">Member Aktif</p>
          <h3 className="text-xl font-semibold text-carbon_black-500">{mode === 'weekly' ? 'Per Minggu' : 'Per Bulan'}</h3>
        </div>
        <div className="inline-flex rounded-lg border border-silver-700 bg-white_smoke-800 text-xs">
          <button
            className={`px-3 py-1 ${mode === 'weekly' ? 'bg-strawberry_red-500/15 text-carbon_black-500' : 'text-silver-600'}`}
            onClick={() => setMode('weekly')}
          >
            Mingguan
          </button>
          <button
            className={`px-3 py-1 ${mode === 'monthly' ? 'bg-strawberry_red-500/15 text-carbon_black-500' : 'text-silver-600'}`}
            onClick={() => setMode('monthly')}
          >
            Bulanan
          </button>
        </div>
      </div>
      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#69e538ff" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#ffffffa9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#d0cac9" />
            <XAxis dataKey="label" stroke="#657786" />
            <YAxis stroke="#657786" />
            <Tooltip
              contentStyle={{ background: '#fdfdfd', border: '1px solid #d0cac9', borderRadius: 12, color: '#161a1d' }}
              labelStyle={{ color: '#657786' }}
            />
            <Area type="monotone" dataKey="total" stroke="#e5383b" fill="url(#colorActive)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const {
    dashboardStats: {
      countByStore,
      activeTotal,
      messagesTotal,
    },
    pendingMembers,
    members,
  } = useAppContext()

  const pendingTop = pendingMembers.slice(0, 5)
  const fillCount = Math.max(0, 5 - pendingTop.length)
  const approvedFill = members
    .filter((m) => m.status === 'active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter((m) => !pendingTop.some((p) => p.id === m.id))
    .slice(0, fillCount)
  const highlightList = [...pendingTop, ...approvedFill]

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-semibold text-carbon_black-500">Dashboard</h1>
        
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card title="Member Aktif Total" value={activeTotal} subtle="Semua toko" icon="👥" />
        <Card title="Member Toko A" value={countByStore.A} icon="🏪" />
        <Card title="Member Toko B" value={countByStore.B} icon="🏪" />
        <Card title="Member Toko C" value={countByStore.C} icon="🏪" />
        <Card title="Pesan Terkirim Total" value={messagesTotal} icon="✉️" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <ActiveMemberChart />
        <div className="interactive-card rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-md shadow-silver-400/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-carbon_black-500">Member Terbaru</p>
            <span className="text-xs text-silver-600">{highlightList.length} entri</span>
          </div>
          {highlightList.length === 0 ? (
            <p className="mt-4 text-sm text-silver-600">Belum ada data.</p>
          ) : (
            <div className="mt-3 space-y-2 text-sm text-carbon_black-500">
              {highlightList.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg bg-white_smoke-800 px-3 py-2"
                >
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-silver-600">
                      {m.memberNo} · WA: {m.waNumber} · Toko {m.store}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      pendingMembers.some((p) => p.id === m.id)
                        ? 'bg-amber-500/15 text-amber-700'
                        : 'bg-emerald-500/15 text-emerald-600'
                    }`}
                  >
                    {pendingMembers.some((p) => p.id === m.id) ? 'Pending' : 'Disetujui'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
