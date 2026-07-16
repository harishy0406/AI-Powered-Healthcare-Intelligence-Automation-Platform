import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { LogIn, Eye, EyeOff, Heart, Shield, Zap } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (ok) {
      navigate('/app')
    } else {
      setError('Invalid credentials. Try the demo accounts below.')
    }
  }

  return (
    <div className="min-h-screen flex" id="login-page">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[hsl(168,80%,22%)] via-[hsl(168,70%,30%)] to-[hsl(200,80%,20%)] flex-col justify-between p-10 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-20 -left-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-10 w-24 h-24 rounded-full bg-white/10" />

        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight leading-none">
            Care
          </h1>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight leading-none -mt-1">
            Copilot
          </h1>
          <p className="text-xs text-white/60 mt-2 font-medium">ai clinical intelligence</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Heart size={20} className="text-white/80" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Clinical AI Assistant</h3>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Get instant, citation-backed answers to clinical questions from your knowledge base.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Zap size={20} className="text-white/80" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Automated Workflows</h3>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Patient intake summarization, appointment tracking, and operational insights — automated.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Shield size={20} className="text-white/80" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Built for Trust</h3>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Decision support, not diagnosis. Every answer comes with source citations and disclaimers.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/30">
          © 2026 CareCopilot — Portfolio MVP with synthetic data only.
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-2xl font-extrabold uppercase tracking-tight">CareCopilot</h1>
            <p className="text-xs text-neutral-500 mt-1">ai clinical intelligence</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
            <p className="text-sm text-slate-500 mb-8">Sign in to access your clinic dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email-input">
                  Email
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="admin@carecopilot.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password-input">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base"
                id="login-submit"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn size={18} />
                    Sign in
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 bg-white/60 backdrop-blur rounded-xl border border-slate-200/60 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2">
              <button
                onClick={() => { setEmail('admin@carecopilot.com'); setPassword('demo123') }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors group"
              >
                <p className="text-sm font-medium text-slate-800 group-hover:text-teal-700 transition-colors">
                  Dr. Priya Sharma (Admin)
                </p>
                <p className="text-xs text-slate-400">admin@carecopilot.com / demo123</p>
              </button>
              <button
                onClick={() => { setEmail('staff@carecopilot.com'); setPassword('demo123') }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors group"
              >
                <p className="text-sm font-medium text-slate-800 group-hover:text-teal-700 transition-colors">
                  Rahul Verma (Staff)
                </p>
                <p className="text-xs text-slate-400">staff@carecopilot.com / demo123</p>
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-4 w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  )
}
