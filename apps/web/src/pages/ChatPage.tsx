import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../App'
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  Sparkles,
  AlertTriangle,
  BookOpen,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  sources?: { title: string; page?: string }[]
  feedback?: 'up' | 'down' | null
  timestamp: Date
}

const DEMO_KNOWLEDGE: Record<string, { answer: string; sources: { title: string; page: string }[] }> = {
  'metformin': {
    answer: `**Metformin** is a first-line oral antidiabetic medication used in the management of Type 2 Diabetes Mellitus.\n\n**Key Points:**\n- **Mechanism:** Decreases hepatic glucose production, decreases intestinal absorption of glucose, and improves insulin sensitivity.\n- **Dosage:** Start with 500mg once or twice daily with meals. Maximum 2,550mg/day in divided doses.\n- **Contraindications:** eGFR <30 mL/min, acute/chronic metabolic acidosis, including diabetic ketoacidosis.\n- **Common Side Effects:** Nausea, diarrhea, flatulence (usually resolve over time).\n- **Important:** Hold before and 48 hours after iodinated contrast procedures.\n\n⚠️ **Drug Interactions:** Use caution with carbonic anhydrase inhibitors (topiramate, zonisamide) — may increase risk of lactic acidosis.`,
    sources: [
      { title: 'WHO Model List of Essential Medicines (2023)', page: 'Section 18.5' },
      { title: 'ADA Standards of Care in Diabetes (2024)', page: 'Ch. 9' },
    ],
  },
  'hypertension': {
    answer: `**Hypertension Management Protocol (JNC 8 / ACC/AHA 2017):**\n\n**Diagnosis Threshold:** ≥130/80 mmHg (Stage 1) or ≥140/90 mmHg (Stage 2)\n\n**First-line Medications:**\n1. **ACE Inhibitors** (e.g., Enalapril, Lisinopril) — preferred for patients with diabetes/CKD\n2. **ARBs** (e.g., Losartan, Valsartan) — alternative to ACEi\n3. **Calcium Channel Blockers** (e.g., Amlodipine) — preferred for African American patients\n4. **Thiazide Diuretics** (e.g., Hydrochlorothiazide, Chlorthalidone)\n\n**Lifestyle Modifications:**\n- DASH diet, sodium restriction (<2.3g/day)\n- Regular exercise (150 min/week moderate intensity)\n- Weight management (target BMI <25)\n- Limit alcohol, smoking cessation\n\n**Follow-up:** Recheck BP in 1 month after initiation/adjustment.`,
    sources: [
      { title: 'ACC/AHA Hypertension Guidelines (2017)', page: 'Table 15' },
      { title: 'JNC 8 Evidence-Based Guideline', page: 'Recommendation 1-9' },
    ],
  },
  'drug interaction': {
    answer: `**Common Drug Interactions in Primary Care:**\n\n1. **Warfarin + NSAIDs** — Increased bleeding risk. Use acetaminophen instead.\n2. **ACEi/ARBs + Potassium-sparing diuretics** — Risk of hyperkalemia. Monitor K+ levels.\n3. **SSRIs + NSAIDs** — Increased GI bleeding risk.\n4. **Statins + Macrolides** (clarithromycin, erythromycin) — Increased myopathy risk.\n5. **Metformin + Contrast dye** — Risk of lactic acidosis. Hold metformin 48h.\n6. **Ciprofloxacin + Theophylline** — Increased theophylline toxicity.\n7. **Beta-blockers + Verapamil/Diltiazem** — Risk of severe bradycardia.\n\n**Recommendation:** Always verify interactions using a clinical decision support tool before prescribing new combinations.`,
    sources: [
      { title: 'UpToDate Drug Interactions Database', page: 'Last updated 2024' },
      { title: 'Clinical Pharmacology Guidelines', page: 'Section 4.2' },
    ],
  },
  'diabetes': {
    answer: `**Type 2 Diabetes Management Protocol:**\n\n**Diagnosis Criteria (ADA):**\n- Fasting Plasma Glucose ≥126 mg/dL\n- HbA1c ≥6.5%\n- 2-hour PG ≥200 mg/dL during OGTT\n- Random PG ≥200 mg/dL with symptoms\n\n**Treatment Algorithm:**\n1. **Step 1:** Lifestyle modifications + Metformin\n2. **Step 2:** Add second agent based on patient profile:\n   - Cardiovascular disease → SGLT2 inhibitor or GLP-1 RA\n   - Obesity → GLP-1 RA (semaglutide, liraglutide)\n   - Cost concern → Sulfonylurea or TZD\n3. **Step 3:** Triple therapy or insulin initiation\n\n**Monitoring:**\n- HbA1c every 3 months (target <7% for most adults)\n- Annual: eye exam, foot exam, renal function, lipid panel\n- Self-monitoring of blood glucose as needed`,
    sources: [
      { title: 'ADA Standards of Care in Diabetes (2024)', page: 'Ch. 9-10' },
      { title: 'ICMR Guidelines for Management of T2DM', page: 'Section III' },
    ],
  },
  'asthma': {
    answer: `**Asthma Management (GINA 2024):**\n\n**Stepwise Approach:**\n- **Step 1-2:** As-needed low-dose ICS-formoterol (preferred) or as-needed SABA with low-dose ICS\n- **Step 3:** Low-dose ICS-LABA maintenance + as-needed\n- **Step 4:** Medium-dose ICS-LABA\n- **Step 5:** High-dose ICS-LABA ± add-on (tiotropium, biologics)\n\n**Key Points:**\n- SABA-only treatment is **no longer recommended** (GINA 2024)\n- All adults with asthma should receive ICS-containing therapy\n- Peak flow monitoring for moderate-severe patients\n- Written action plan for all patients\n\n**Emergency:** Severe exacerbation → Nebulized SABA + ipratropium + systemic corticosteroids + oxygen`,
    sources: [
      { title: 'GINA 2024 Report', page: 'Box 3-5' },
      { title: 'National Asthma Education Program Expert Panel Report', page: 'Step Therapy' },
    ],
  },
}

function findRelevantAnswer(query: string): { answer: string; sources: { title: string; page: string }[] } {
  const q = query.toLowerCase()
  for (const [key, value] of Object.entries(DEMO_KNOWLEDGE)) {
    if (q.includes(key)) {
      return value
    }
  }
  return {
    answer: `I searched the knowledge base but couldn't find specific information matching your query: *"${query}"*.\n\n**Suggestions:**\n- Try asking about specific topics like: metformin, hypertension, drug interactions, diabetes, or asthma\n- Upload relevant clinical guidelines via the Documents page\n- Consult a licensed clinician for specific patient cases\n\n⚠️ *This system provides decision support only. Always verify information with authoritative sources.*`,
    sources: [],
  }
}

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: `Hello${user?.name ? ', ' + user.name.split(' ')[0] : ''}! 👋 I'm your **Clinical AI Assistant**.\n\nI can help you with:\n- 💊 Drug information & interactions\n- 📋 Clinical protocols & guidelines\n- 🏥 Treatment algorithms\n- ⚕️ Dosage references\n\nAsk me anything from the clinical knowledge base. All answers include source citations.\n\n*Try: "Tell me about metformin" or "Hypertension management protocol"*`,
      sources: [],
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate RAG retrieval delay
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 1500))

    const { answer, sources } = findRelevantAnswer(userMsg.content)
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: answer,
      sources,
      feedback: null,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, aiMsg])
    setIsTyping(false)
  }

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, feedback: m.feedback === type ? null : type } : m
      )
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full" id="chat-page">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Clinical AI Assistant</h1>
            <p className="text-xs text-slate-500">RAG-powered · Citation-backed · Decision support only</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
          >
            <div className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-slate-700 to-slate-900'
                    : 'bg-gradient-to-br from-teal-500 to-emerald-600'
                }`}
              >
                {msg.role === 'user' ? (
                  <User size={14} className="text-white" />
                ) : (
                  <Bot size={14} className="text-white" />
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div
                  className={
                    msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                  }
                >
                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\n/g, '<br/>'),
                    }}
                  />
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-1">
                    {msg.sources.map((src, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-md border border-teal-100"
                      >
                        <BookOpen size={10} />
                        {src.title} {src.page && `· ${src.page}`}
                      </span>
                    ))}
                  </div>
                )}

                {/* Feedback buttons */}
                {msg.role === 'ai' && msg.id !== 'welcome' && (
                  <div className="flex items-center gap-1 ml-1">
                    <button
                      onClick={() => handleFeedback(msg.id, 'up')}
                      className={`p-1.5 rounded-md transition-colors ${
                        msg.feedback === 'up'
                          ? 'bg-green-100 text-green-600'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Helpful"
                    >
                      <ThumbsUp size={14} />
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, 'down')}
                      className={`p-1.5 rounded-md transition-colors ${
                        msg.feedback === 'down'
                          ? 'bg-red-100 text-red-600'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Not helpful"
                    >
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="chat-bubble-ai">
                <div className="flex items-center gap-1.5 py-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400" style={{ animation: 'typing-dots 1.4s infinite 0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400" style={{ animation: 'typing-dots 1.4s infinite 200ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400" style={{ animation: 'typing-dots 1.4s infinite 400ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Disclaimer */}
      <div className="px-4 md:px-6 py-1.5">
        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
          <AlertTriangle size={12} className="shrink-0" />
          <span>Decision support only — not medical advice. Always consult a licensed clinician.</span>
        </div>
      </div>

      {/* Input area */}
      <div className="px-4 md:px-6 pb-4 pt-2">
        <form onSubmit={handleSubmit} className="flex items-end gap-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-2 pl-4">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a clinical question..."
            rows={1}
            className="flex-1 resize-none border-none outline-none text-sm py-2 bg-transparent placeholder:text-slate-400 max-h-32"
            style={{ minHeight: '2.5rem' }}
            id="chat-input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="btn-primary p-2.5 rounded-xl"
            id="chat-send"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
