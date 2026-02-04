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

function BirthdayTable() {
  const { members } = useAppContext()
  const today = new Date()
  const month = today.getMonth()
  const upcoming = members
    .filter((m) => new Date(m.birthDate).getMonth() === month)
    .slice(0, 5)
    .map((m) => ({
      name: m.name,
      wa: m.waNumber,
      date: new Date(m.birthDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    }))

  if (upcoming.length === 0) return null

  return (
    <div className="interactive-card rounded-2xl border border-silver-700 bg-white_smoke-900 p-4 shadow-md shadow-silver-400/30">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-carbon_black-500">Ultah Terdekat</p>
        <span className="text-xs text-silver-600">Bulan ini</span>
      </div>
      <div className="mt-3 space-y-2 text-sm text-carbon_black-500">
        {upcoming.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-lg bg-white_smoke-800 px-3 py-2">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-silver-600">WA: {item.wa}</p>
            </div>
            <span className="rounded-full bg-strawberry_red-500/15 px-3 py-1 text-xs font-semibold text-strawberry_red-500">
              {item.date}
            </span>
          </div>
        ))}
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
      birthdayThisMonthTotal,
    },
  } = useAppContext()

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-semibold text-carbon_black-500">Dashboard</h1>
        <div className="flex items-center gap-3 rounded-full border border-silver-700 bg-white_smoke-900 px-4 py-2 shadow-sm shadow-silver-400/30">
          <span className="text-sm text-silver-700">Admin View</span>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card title="Member Aktif Total" value={activeTotal} subtle="Semua toko" icon="👥" />
        <Card title="Member Toko A" value={countByStore.A} icon="🏪" />
        <Card title="Member Toko B" value={countByStore.B} icon="🏪" />
        <Card title="Member Toko C" value={countByStore.C} icon="🏪" />
        <Card title="Pesan Terkirim Total" value={messagesTotal} icon="✉️" />
        <Card title="Ultah Bulan Ini" value={birthdayThisMonthTotal} icon="🎂" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <ActiveMemberChart />
        <BirthdayTable />
      </section>
    </div>
  )
}
