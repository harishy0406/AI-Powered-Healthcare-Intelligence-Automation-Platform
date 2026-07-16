import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import {
  MessageSquare,
  BarChart3,
  ClipboardList,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Activity,
} from 'lucide-react'

const navItems = [
  { to: '/app/chat', label: 'AI Assistant', icon: MessageSquare },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/intake', label: 'Patient Intake', icon: ClipboardList },
  { to: '/app/documents', label: 'Documents', icon: FileText },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="h-screen flex bg-slate-50" id="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-50 h-full flex flex-col
          bg-[hsl(220,20%,10%)] text-white
          transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'w-[68px]' : 'w-64'}
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 ${collapsed ? 'px-3' : 'px-5'} border-b border-white/5`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <Activity size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight leading-none">CareCopilot</h1>
                <p className="text-[10px] text-white/40 mt-0.5">Clinical AI</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto">
              <Activity size={16} className="text-white" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center py-2 mx-2 mb-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>

        {/* User section */}
        <div className={`border-t border-white/5 p-3 ${collapsed ? 'px-2' : 'px-4'}`}>
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 truncate">{user?.name}</p>
                <p className="text-xs text-white/40 truncate">{user?.role}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`text-white/40 hover:text-red-400 transition-colors shrink-0 ${collapsed ? 'hidden' : ''}`}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-600 hover:text-slate-900"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Activity size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold">CareCopilot</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
