import { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

// --- Synthetic data ---
const monthlyPatients = [
  { month: 'Jan', patients: 142, newPatients: 28 },
  { month: 'Feb', patients: 156, newPatients: 34 },
  { month: 'Mar', patients: 189, newPatients: 41 },
  { month: 'Apr', patients: 201, newPatients: 38 },
  { month: 'May', patients: 178, newPatients: 32 },
  { month: 'Jun', patients: 223, newPatients: 45 },
  { month: 'Jul', patients: 245, newPatients: 52 },
]

const topComplaints = [
  { condition: 'Fever / Viral', count: 187, color: '#0d9488' },
  { condition: 'Hypertension Follow-up', count: 143, color: '#0891b2' },
  { condition: 'Diabetes Management', count: 128, color: '#7c3aed' },
  { condition: 'Respiratory Infections', count: 97, color: '#e11d48' },
  { condition: 'Musculoskeletal Pain', count: 84, color: '#f59e0b' },
]

const appointmentStatus = [
  { name: 'Completed', value: 682, color: '#0d9488' },
  { name: 'Scheduled', value: 124, color: '#0891b2' },
  { name: 'No-Show', value: 78, color: '#ef4444' },
  { name: 'Cancelled', value: 42, color: '#94a3b8' },
]

const weeklyAppointments = [
  { day: 'Mon', appointments: 32, noShows: 4 },
  { day: 'Tue', appointments: 28, noShows: 3 },
  { day: 'Wed', appointments: 35, noShows: 5 },
  { day: 'Thu', appointments: 30, noShows: 2 },
  { day: 'Fri', appointments: 38, noShows: 6 },
  { day: 'Sat', appointments: 22, noShows: 3 },
]

const recentActivity = [
  { time: '10 min ago', text: 'Patient intake summary generated for ID #1847', type: 'intake' },
  { time: '25 min ago', text: 'Dr. Priya queried "metformin dosage adjustments"', type: 'chat' },
  { time: '1 hr ago', text: 'Appointment reminder sent to 12 patients', type: 'reminder' },
  { time: '2 hr ago', text: 'New clinical guideline uploaded: "GINA 2024"', type: 'document' },
  { time: '3 hr ago', text: 'Patient #1839 marked as no-show', type: 'appointment' },
]

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'up' | 'down'
  icon: React.ElementType
  accent: string
}

function StatCard({ title, value, change, changeType, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon size={20} className="text-white" />
        </div>
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold ${
            changeType === 'up' ? 'text-emerald-600' : 'text-red-500'
          }`}
        >
          {changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{title}</p>
    </div>
  )
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d')

  const totalAppointments = useMemo(
    () => appointmentStatus.reduce((sum, item) => sum + item.value, 0),
    []
  )
  const noShowRate = useMemo(
    () => ((78 / totalAppointments) * 100).toFixed(1),
    [totalAppointments]
  )

  return (
    <div className="p-4 md:p-6 space-y-6" id="analytics-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clinic Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time operational insights · Seeded with synthetic demo data
          </p>
        </div>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                dateRange === range
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value="1,334"
          change="12.5%"
          changeType="up"
          icon={Users}
          accent="bg-gradient-to-br from-teal-500 to-emerald-600"
        />
        <StatCard
          title="Appointments (This Week)"
          value="185"
          change="8.3%"
          changeType="up"
          icon={Calendar}
          accent="bg-gradient-to-br from-cyan-500 to-blue-600"
        />
        <StatCard
          title="AI Queries Today"
          value="47"
          change="23%"
          changeType="up"
          icon={Activity}
          accent="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <StatCard
          title="No-Show Rate"
          value={`${noShowRate}%`}
          change="2.1%"
          changeType="down"
          icon={AlertCircle}
          accent="bg-gradient-to-br from-rose-500 to-red-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Patient volume chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Patient Volume Trends</h2>
              <p className="text-xs text-slate-500 mt-0.5">Monthly patient visits</p>
            </div>
            <TrendingUp size={18} className="text-teal-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPatients}>
                <defs>
                  <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#0d9488"
                  strokeWidth={2}
                  fill="url(#patientGrad)"
                  name="Total Patients"
                />
                <Area
                  type="monotone"
                  dataKey="newPatients"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  fill="none"
                  strokeDasharray="5 5"
                  name="New Patients"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointment status pie */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-1">Appointment Status</h2>
          <p className="text-xs text-slate-500 mb-2">This month</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {appointmentStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {appointmentStatus.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-slate-600">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top complaints */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-1">Top 5 Complaint Categories</h2>
          <p className="text-xs text-slate-500 mb-4">Most common reasons for visit</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topComplaints} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="condition"
                  type="category"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  width={140}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Visits">
                  {topComplaints.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly appointments + no-shows */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-slate-800">Weekly Appointments</h2>
            <Clock size={16} className="text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 mb-4">Appointments vs No-Shows by day</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAppointments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="appointments" fill="#0d9488" radius={[4, 4, 0, 0]} name="Appointments" />
                <Bar dataKey="noShows" fill="#ef4444" radius={[4, 4, 0, 0]} name="No-Shows" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  item.type === 'intake'
                    ? 'bg-violet-500'
                    : item.type === 'chat'
                    ? 'bg-teal-500'
                    : item.type === 'reminder'
                    ? 'bg-amber-500'
                    : item.type === 'document'
                    ? 'bg-blue-500'
                    : 'bg-red-500'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">{item.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
