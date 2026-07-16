import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Activity, 
  Stethoscope, 
  Shield, 
  Users, 
  ArrowRight, 
  Phone, 
  Microscope,
  ClipboardList,
  HeartPulse,
  BrainCircuit,
  MessageSquare,
  BarChart3,
  Bot
} from 'lucide-react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  
  const navLinks = [
    { label: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'About Us', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Features', action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'AI Modules', action: () => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'News', action: () => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' }) },
  ]

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-10 py-3 md:py-4 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <img src="/logo.png" alt="CareCopilot Logo" className="h-10 md:h-12 object-contain" />
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.label}
              onClick={link.action}
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-blue-600 rounded-lg text-white text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Login / Try Demo
          </button>
        </div>

        <button
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-gray-900 rounded-full transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-gray-900 rounded-full transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-gray-900 rounded-full transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-40 bg-white transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'} pt-24 px-6`}>
        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              className="text-2xl font-bold text-gray-900 text-left"
              onClick={() => { setMenuOpen(false); link.action(); }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); navigate('/login'); }}
            className="mt-4 px-6 py-4 bg-blue-600 rounded-xl text-white text-lg font-semibold"
          >
            Login / Try Demo
          </button>
        </div>
      </div>
    </>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 md:px-10 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold w-fit border border-blue-100">
              <Activity size={16} />
              <span>Your Health, Our Priority</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Best AI Intelligence <br/>
              for <span className="text-blue-600">Modern Clinics</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-lg leading-relaxed">
              We provide high-quality AI medical assistants, smart analytics, and modern automated facilities to deliver the best care experience for your patients.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                View Services <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-3.5 bg-white text-blue-600 border border-blue-200 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                Try Demo <Activity size={18} />
              </button>
            </div>
          </div>
          
          {/* Hero Image Container */}
          <div className="relative h-[400px] md:h-[500px] w-full bg-blue-100 rounded-[2rem] overflow-hidden hidden md:block">
            {/* Placeholder for Doctor/Patient image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-blue-50 flex items-center justify-center">
              <Stethoscope size={120} className="text-blue-300 opacity-50" />
              <img src="/images/hero.png" alt="Hero" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
          </div>
        </div>

        {/* Floating Stats Bar */}
        <div className="mt-16 md:mt-24 md:-mb-10 relative z-20 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-100">
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">15+</h3>
              <p className="text-sm font-semibold text-gray-500 mt-1">AI Models</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">25,000+</h3>
              <p className="text-sm font-semibold text-gray-500 mt-1">Patients Served</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <ClipboardList size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">120+</h3>
              <p className="text-sm font-semibold text-gray-500 mt-1">Integrations</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <HeartPulse size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">98%</h3>
              <p className="text-sm font-semibold text-gray-500 mt-1">Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="h-[400px] md:h-[600px] bg-slate-200 rounded-[2rem] overflow-hidden relative hidden md:block">
            <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
               <img src="/images/dashboard.png" alt="Dashboard" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
               <span className="text-gray-400 font-semibold absolute">Platform Dashboard</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-8">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">About Us</div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                CareCopilot <br/>
                For a Smarter Clinic
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                CareCopilot is committed to providing modern clinical intelligence with advanced AI technology and a comfortable environment for both staff and patients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-blue-600">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">24/7 AI Assistant</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Always-on support for clinical queries.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Secure & Private</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">HIPAA compliant and locally hosted options.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-blue-600">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Smart Analytics</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Real-time insights into clinic performance.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Quality Care</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Enhanced decision support for better outcomes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Services Section */}
      <section id="features" className="py-20 bg-white px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Our Features</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Platform Capabilities</h2>
            </div>
            <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
              See All Features <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              { icon: <MessageSquare size={32}/>, name: "Clinical Chat" },
              { icon: <BarChart3 size={32}/>, name: "Analytics" },
              { icon: <ClipboardList size={32}/>, name: "Intake Forms" },
              { icon: <BrainCircuit size={32}/>, name: "Decision Support" },
              { icon: <Microscope size={32}/>, name: "Lab Analysis" },
              { icon: <Bot size={32}/>, name: "Auto Coding" }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow border border-gray-100 cursor-pointer group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-gray-900">{feature.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules/AI Specialists Section */}
      <section id="modules" className="py-20 bg-slate-50 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">AI Agents</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Specialized AI Assistants</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Our AI agents are trained on specific clinical workflows to assist your medical staff in delivering the best care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Diagnostic Copilot", role: "General Practice", rating: "4.9", img: "/images/clinician.png" },
              { name: "Intake Bot", role: "Administration", rating: "4.8", img: "/images/chat-ui.png" },
              { name: "Coding Assistant", role: "Billing", rating: "4.9", img: "/images/dashboard.png" },
              { name: "Triage AI", role: "Emergency", rating: "4.9", img: "/images/analytics.png" }
            ].map((doc, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center group">
                <div className="aspect-[4/5] rounded-xl bg-blue-50 overflow-hidden mb-4 relative">
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover opacity-80 mix-blend-multiply" onError={(e) => e.currentTarget.style.display = 'none'}/>
                  <div className="absolute inset-0 flex items-center justify-center text-blue-200 font-semibold opacity-50 bg-blue-50 -z-10">Agent</div>
                </div>
                <h4 className="font-bold text-gray-900 text-lg">{doc.name}</h4>
                <p className="text-sm text-gray-500 mb-3">{doc.role}</p>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded text-xs font-bold">
                  ★ {doc.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities / Technical Architecture Section */}
      <section className="py-24 bg-gray-900 px-4 md:px-10 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Modern Infrastructure for the Best Care</h2>
            <p className="text-gray-400">A secure, scalable environment equipped with advanced tools to support your patients' healing process.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Secure Cloud", img: "/images/dashboard.png" },
              { name: "EMR Sync", img: "/images/chat-ui.png" },
              { name: "Voice AI", img: "/images/analytics.png" },
              { name: "Data Lake", img: "/images/clinician.png" },
              { name: "24/7 Uptime", img: "/images/hero.png" }
            ].map((fac, i) => (
              <div key={i} className="relative aspect-square md:aspect-auto md:h-48 rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-blue-900">
                  <img src={fac.img} alt={fac.name} className="w-full h-full object-cover opacity-30 mix-blend-overlay group-hover:scale-110 transition-transform duration-500" onError={(e) => e.currentTarget.style.display = 'none'}/>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="font-bold text-white text-sm md:text-base">{fac.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-slate-50 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Health News & Tips</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest Insights</h2>
            </div>
            <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
              View All News <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Tips for Maintaining Heart Health Every Day", tag: "Heart Health", date: "20 May 2026" },
              { title: "The Importance of Early Immunization for Children", tag: "Pediatrics", date: "18 May 2026" },
              { title: "Healthy Eating for a Balanced Lifestyle", tag: "Lifestyle", date: "15 May 2026" }
            ].map((news, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer">
                <div className="h-48 bg-blue-50 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-blue-200">Image</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-3">
                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{news.tag}</span>
                    <span>{news.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-blue-600 transition-colors">{news.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="px-4 md:px-10 pb-10 max-w-7xl mx-auto">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/dashboard.png')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Need Medical Help?</h2>
            <p className="text-blue-100 text-lg">We are ready to serve you 24 hours a day, 7 days a week.</p>
            <div className="flex gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold"><Activity size={18}/> 24/7 AI</div>
              <div className="flex items-center gap-2 text-sm font-semibold"><Users size={18}/> Professional</div>
              <div className="flex items-center gap-2 text-sm font-semibold"><Stethoscope size={18}/> Complete Setup</div>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center md:items-end bg-white/10 backdrop-blur p-6 rounded-2xl">
            <p className="text-blue-100 font-semibold mb-1">Contact Us</p>
            <div className="flex items-center gap-3 text-3xl font-bold mb-4">
              <Phone size={32} className="fill-white" />
              (021) 1234 5678
            </div>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold w-full hover:bg-blue-50 transition-colors">
              Try Demo Now
            </button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-semibold text-gray-500">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-6 opacity-50 grayscale" />
            <span>© 2026 CareCopilot. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
