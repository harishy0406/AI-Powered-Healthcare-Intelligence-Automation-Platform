import { useState, useRef } from 'react'
import {
  Upload,
  FileText,
  Check,
  Clock,
  Trash2,
  AlertTriangle,
  Search,
  File,
  Layers,
} from 'lucide-react'

interface Document {
  id: string
  title: string
  type: 'pdf' | 'text'
  size: string
  chunks: number
  status: 'processed' | 'processing' | 'error'
  uploadedAt: Date
  uploadedBy: string
}

const INITIAL_DOCS: Document[] = [
  {
    id: 'DOC-001',
    title: 'ADA Standards of Care in Diabetes 2024',
    type: 'pdf',
    size: '4.2 MB',
    chunks: 128,
    status: 'processed',
    uploadedAt: new Date(Date.now() - 86400000 * 3),
    uploadedBy: 'Dr. Priya Sharma',
  },
  {
    id: 'DOC-002',
    title: 'GINA 2024 - Global Strategy for Asthma Management',
    type: 'pdf',
    size: '6.8 MB',
    chunks: 215,
    status: 'processed',
    uploadedAt: new Date(Date.now() - 86400000 * 2),
    uploadedBy: 'Dr. Priya Sharma',
  },
  {
    id: 'DOC-003',
    title: 'ACC/AHA Hypertension Guidelines 2017',
    type: 'pdf',
    size: '3.1 MB',
    chunks: 94,
    status: 'processed',
    uploadedAt: new Date(Date.now() - 86400000),
    uploadedBy: 'Dr. Priya Sharma',
  },
  {
    id: 'DOC-004',
    title: 'WHO Essential Medicines List 2023',
    type: 'pdf',
    size: '2.7 MB',
    chunks: 76,
    status: 'processed',
    uploadedAt: new Date(Date.now() - 86400000),
    uploadedBy: 'Rahul Verma',
  },
  {
    id: 'DOC-005',
    title: 'Clinic Drug Interaction Reference',
    type: 'text',
    size: '340 KB',
    chunks: 42,
    status: 'processed',
    uploadedAt: new Date(Date.now() - 7200000),
    uploadedBy: 'Dr. Priya Sharma',
  },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCS)
  const [dragActive, setDragActive] = useState(false)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  )

  const totalChunks = documents.reduce((sum, d) => sum + d.chunks, 0)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setDragActive(false)

    // Simulate upload + processing
    await new Promise((r) => setTimeout(r, 2000))

    const newDocs: Document[] = Array.from(files).map((file, i) => ({
      id: `DOC-${String(documents.length + i + 1).padStart(3, '0')}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      type: file.name.endsWith('.pdf') ? 'pdf' : 'text',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      chunks: Math.floor(Math.random() * 100 + 30),
      status: 'processed',
      uploadedAt: new Date(),
      uploadedBy: 'Dr. Priya Sharma',
    }))

    setDocuments((prev) => [...newDocs, ...prev])
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleUpload(e.dataTransfer.files)
  }

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="p-4 md:p-6 space-y-6" id="documents-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload clinical guidelines and protocols for the AI assistant
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-slate-500">
              <FileText size={14} />
              {documents.length} documents
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <Layers size={14} />
              {totalChunks} chunks
            </span>
          </div>
        </div>
      </div>

      {/* Upload zone */}
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        id="upload-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md,.doc,.docx"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-3 border-teal-200 border-t-teal-600 animate-spin" />
            <p className="text-sm font-medium text-slate-600">Processing documents...</p>
            <p className="text-xs text-slate-400">Chunking → Embedding → Storing to vector DB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
              <Upload size={24} className="text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Drop files here or{' '}
                <span className="text-teal-600 underline underline-offset-2">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, TXT, MD · Files will be chunked and embedded for RAG retrieval
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input pl-9"
          placeholder="Search documents..."
          id="doc-search"
        />
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow group"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                doc.type === 'pdf' ? 'bg-red-50' : 'bg-blue-50'
              }`}
            >
              <File
                size={18}
                className={doc.type === 'pdf' ? 'text-red-500' : 'text-blue-500'}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{doc.title}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-slate-400">{doc.size}</span>
                <span className="text-xs text-slate-400">{doc.chunks} chunks</span>
                <span className="text-xs text-slate-400">by {doc.uploadedBy}</span>
                <span className="text-xs text-slate-400">
                  {doc.uploadedAt.toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {doc.status === 'processed' && (
                <span className="badge badge-success flex items-center gap-1">
                  <Check size={10} />
                  Indexed
                </span>
              )}
              {doc.status === 'processing' && (
                <span className="badge badge-warning flex items-center gap-1">
                  <Clock size={10} />
                  Processing
                </span>
              )}
              {doc.status === 'error' && (
                <span className="badge badge-danger flex items-center gap-1">
                  <AlertTriangle size={10} />
                  Error
                </span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(doc.id) }}
                className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove document"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <FileText size={36} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No documents found</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 text-xs text-blue-600 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
        <Layers size={14} className="shrink-0 mt-0.5" />
        <p>
          <strong>RAG Pipeline:</strong> Uploaded documents are split into ~500-token chunks with overlap, embedded using the configured model, and stored in the vector database. The AI assistant retrieves relevant chunks when answering questions.
        </p>
      </div>
    </div>
  )
}
