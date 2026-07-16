import { useState } from 'react'
import {
  ClipboardList,
  Sparkles,
  Edit3,
  Check,
  Clock,
  AlertTriangle,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface IntakeRecord {
  id: string
  patientName: string
  symptoms: string
  duration: string
  severity: string
  medications: string
  aiSummary: string | null
  reviewed: boolean
  reviewedBy: string | null
  createdAt: Date
}

const INITIAL_RECORDS: IntakeRecord[] = [
  {
    id: 'INT-001',
    patientName: 'Aarav Mehta',
    symptoms: 'Persistent cough, mild fever (99.5°F), body ache for 3 days',
    duration: '3 days',
    severity: 'Moderate',
    medications: 'Paracetamol 500mg PRN',
    aiSummary:
      '**Chief Complaint:** Persistent productive cough with low-grade fever.\n\n**Duration:** 3 days\n\n**Assessment:**\n- Upper respiratory tract infection (likely viral)\n- Low-grade fever (99.5°F) — not alarming\n- Body aches consistent with viral syndrome\n\n**Current Medications:** Paracetamol 500mg as needed\n\n**🚩 Flags:** None — no red flags identified\n\n**Suggested Next Steps:**\n- Symptomatic treatment, hydration\n- If cough persists >7 days or fever >101°F, consider chest X-ray\n- Follow-up in 5-7 days if not improving',
    reviewed: true,
    reviewedBy: 'Dr. Priya Sharma',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'INT-002',
    patientName: 'Sneha Kulkarni',
    symptoms: 'Severe headache, nausea, sensitivity to light, has been recurring monthly',
    duration: '2 days (current episode), recurring monthly',
    severity: 'Severe',
    medications: 'Ibuprofen 400mg, no prescribed medications',
    aiSummary:
      '**Chief Complaint:** Severe recurrent headache with associated symptoms.\n\n**Duration:** Current episode 2 days; recurrent monthly pattern\n\n**Assessment:**\n- Clinical presentation consistent with **migraine without aura**\n- Photophobia + nausea are classic migraine features\n- Monthly recurrence may suggest hormonal/menstrual trigger\n\n**Current Medications:** Ibuprofen 400mg (OTC)\n\n**🚩 Flags:**\n- ⚠️ Recurring severe headaches warrant further evaluation\n- Rule out secondary causes if pattern changes\n\n**Suggested Next Steps:**\n- Consider triptan therapy for acute episodes\n- Headache diary to identify triggers\n- If frequency >4/month, consider prophylaxis (propranolol, topiramate)\n- Neurological exam recommended',
    reviewed: false,
    reviewedBy: null,
    createdAt: new Date(Date.now() - 1800000),
  },
]

export default function IntakePage() {
  const [records, setRecords] = useState<IntakeRecord[]>(INITIAL_RECORDS)
  const [showForm, setShowForm] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    symptoms: '',
    duration: '',
    severity: 'Moderate',
    medications: '',
  })

  const handleGenerateSummary = async () => {
    if (!formData.patientName || !formData.symptoms) return
    setGenerating(true)

    // Simulate AI summarization delay
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000))

    const newRecord: IntakeRecord = {
      id: `INT-${String(records.length + 1).padStart(3, '0')}`,
      patientName: formData.patientName,
      symptoms: formData.symptoms,
      duration: formData.duration,
      severity: formData.severity,
      medications: formData.medications,
      aiSummary: `**Chief Complaint:** ${formData.symptoms.split(',')[0].trim()}\n\n**Duration:** ${formData.duration || 'Not specified'}\n\n**Assessment:**\n- Symptoms reported: ${formData.symptoms}\n- Severity level: ${formData.severity}\n- ${formData.severity === 'Severe' ? '⚠️ Requires prompt clinical evaluation' : 'Standard workup recommended'}\n\n**Current Medications:** ${formData.medications || 'None reported'}\n\n**🚩 Flags:**\n${formData.severity === 'Severe' ? '- ⚠️ Severity rated as SEVERE — prioritize clinical review\n' : '- No immediate red flags identified\n'}\n**Suggested Next Steps:**\n- Complete physical examination\n- Review patient history for relevant context\n- Order appropriate diagnostics based on clinical judgment\n- Schedule follow-up as indicated`,
      reviewed: false,
      reviewedBy: null,
      createdAt: new Date(),
    }

    setRecords((prev) => [newRecord, ...prev])
    setFormData({ patientName: '', symptoms: '', duration: '', severity: 'Moderate', medications: '' })
    setShowForm(false)
    setGenerating(false)
    setExpandedId(newRecord.id)
  }

  const handleReview = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, reviewed: true, reviewedBy: 'Dr. Priya Sharma' } : r
      )
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6" id="intake-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Intake</h1>
          <p className="text-sm text-slate-500 mt-1">
            AI-powered intake summarization · Human-in-the-loop review required
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          id="new-intake-btn"
        >
          <ClipboardList size={16} />
          {showForm ? 'Cancel' : 'New Intake'}
        </button>
      </div>

      {/* New intake form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-fade-in-up">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ClipboardList size={18} className="text-teal-600" />
            Symptom Intake Form
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Patient Name *
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="form-input"
                placeholder="e.g., Rajesh Kumar"
                id="intake-patient-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="form-input"
                placeholder="e.g., 3 days"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Symptoms / Chief Complaint *
              </label>
              <textarea
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="form-input min-h-[100px] resize-y"
                placeholder="Describe the patient's symptoms, complaints, and relevant history..."
                id="intake-symptoms"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="form-input"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Current Medications
              </label>
              <input
                type="text"
                value={formData.medications}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                className="form-input"
                placeholder="e.g., Metformin 500mg, Amlodipine 5mg"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleGenerateSummary}
              disabled={!formData.patientName || !formData.symptoms || generating}
              className="btn-primary"
              id="generate-summary-btn"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Summary...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles size={16} />
                  Generate AI Summary
                </span>
              )}
            </button>
            <span className="text-xs text-slate-400">
              AI will generate a structured clinical note for staff review
            </span>
          </div>
        </div>
      )}

      {/* Intake records */}
      <div className="space-y-3">
        {records.map((record) => {
          const isExpanded = expandedId === record.id
          return (
            <div
              key={record.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
            >
              {/* Record header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : record.id)}
                className="w-full flex items-center gap-4 p-4 md:p-5 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                  <User size={18} className="text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900">{record.patientName}</span>
                    <span className="text-xs text-slate-400">{record.id}</span>
                    {record.reviewed ? (
                      <span className="badge badge-success flex items-center gap-1">
                        <Check size={10} />
                        Reviewed
                      </span>
                    ) : (
                      <span className="badge badge-warning flex items-center gap-1">
                        <Clock size={10} />
                        Pending Review
                      </span>
                    )}
                    {record.severity === 'Severe' && (
                      <span className="badge badge-danger flex items-center gap-1">
                        <AlertTriangle size={10} />
                        Severe
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate">{record.symptoms}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400 hidden md:block">
                    {record.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-4 md:p-5 animate-fade-in-up">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Raw intake data */}
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Raw Intake Data
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-500">Symptoms: </span>
                          <span className="text-slate-800">{record.symptoms}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Duration: </span>
                          <span className="text-slate-800">{record.duration}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Severity: </span>
                          <span className={`font-medium ${
                            record.severity === 'Severe' ? 'text-red-600' : 
                            record.severity === 'Moderate' ? 'text-amber-600' : 'text-green-600'
                          }`}>
                            {record.severity}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Medications: </span>
                          <span className="text-slate-800">{record.medications || 'None reported'}</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-violet-500" />
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          AI-Generated Summary
                        </h3>
                      </div>
                      <div className="bg-violet-50/50 rounded-lg p-4 border border-violet-100">
                        <div
                          className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html: (record.aiSummary || '')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n/g, '<br/>'),
                          }}
                        />
                      </div>

                      {/* Review actions */}
                      {!record.reviewed && (
                        <div className="mt-4 flex items-center gap-3">
                          <button
                            onClick={() => handleReview(record.id)}
                            className="btn-primary text-xs py-2"
                          >
                            <Check size={14} />
                            Approve & Finalize
                          </button>
                          <button className="btn-outline text-xs py-2">
                            <Edit3 size={14} />
                            Edit Summary
                          </button>
                        </div>
                      )}
                      {record.reviewed && record.reviewedBy && (
                        <p className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                          <Check size={12} className="text-emerald-500" />
                          Reviewed by {record.reviewedBy}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 px-4 py-3 rounded-lg border border-amber-100">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <p>
          <strong>Human-in-the-loop required:</strong> All AI-generated summaries must be reviewed and approved by a
          licensed clinician before being finalized. The AI provides decision support only — it does not replace
          clinical judgment.
        </p>
      </div>
    </div>
  )
}
