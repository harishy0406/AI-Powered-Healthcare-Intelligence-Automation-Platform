import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AppLayout from './layouts/AppLayout'
import ChatPage from './pages/ChatPage'
import AnalyticsPage from './pages/AnalyticsPage'
import IntakePage from './pages/IntakePage'
import DocumentsPage from './pages/DocumentsPage'

interface AuthContextType {
  user: { name: string; email: string; role: string } | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => false,
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

const API_BASE = 'http://localhost:8000'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const [user, setUser] = useState<AuthContextType['user']>(() => {
    const stored = localStorage.getItem('cc_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('cc_token')
  )

  useEffect(() => {
    if (token) localStorage.setItem('cc_token', token)
    else localStorage.removeItem('cc_token')
    if (user) localStorage.setItem('cc_user', JSON.stringify(user))
    else localStorage.removeItem('cc_user')
  }, [token, user])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) return false
      const data = await res.json()
      setToken(data.access_token)
      setUser(data.user)
      return true
    } catch {
      // Fallback demo mode if backend is not running
      if (email === 'admin@carecopilot.com' && password === 'demo123') {
        setToken('demo-token')
        setUser({ name: 'Dr. Priya Sharma', email, role: 'admin' })
        return true
      }
      if (email === 'staff@carecopilot.com' && password === 'demo123') {
        setToken('demo-token')
        setUser({ name: 'Rahul Verma', email, role: 'staff' })
        return true
      }
      return false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="intake" element={<IntakePage />} />
          <Route path="documents" element={<DocumentsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  )
}
