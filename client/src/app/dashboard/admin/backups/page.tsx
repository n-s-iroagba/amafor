'use client'
import { useState } from 'react'
import { Download, Database, Clock, Shield, AlertCircle, CheckCircle2, Loader2, Trash2 } from 'lucide-react'

export default function AdminBackupsPage() {
  const [backups, setBackups] = useState([
    {
      id: 1,
      name: 'backup_2026_01_17_14_30',
      size: '245 MB',
      created: '2026-01-17T14:30:00',
      status: 'completed',
      immutable: true,
      tables: 12,
      records: 45823
    },
    {
      id: 2,
      name: 'backup_2026_01_16_14_30',
      size: '243 MB',
      created: '2026-01-16T14:30:00',
      status: 'completed',
      immutable: true,
      tables: 12,
      records: 45234
    },
    {
      id: 3,
      name: 'backup_2026_01_15_14_30',
      size: '241 MB',
      created: '2026-01-15T14:30:00',
      status: 'completed',
      immutable: true,
      tables: 12,
      records: 44987
    }
  ])
  
  const [isCreating, setIsCreating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const createBackup = async () => {
    setIsCreating(true)
    setShowSuccess(false)
    
    // Simulate backup creation
    setTimeout(() => {
      const now = new Date()
      const timestamp = now.toISOString().split('.')[0].replace(/:/g, '_').replace('T', '_')
      
      const newBackup = {
        id: Date.now(),
        name: `backup_${timestamp}`,
        size: '246 MB',
        created: now.toISOString(),
        status: 'completed',
        immutable: true,
        tables: 12,
        records: 46000
      }
      
      setBackups([newBackup, ...backups])
      setIsCreating(false)
      setShowSuccess(true)
      
      setTimeout(() => setShowSuccess(false), 5000)
    }, 3000)
  }

  const downloadBackup = (backup) => {
    alert(`Downloading ${backup.name}...`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Backups</h1>
              <p className="mt-1 text-sm text-gray-500">Create and manage immutable database backups</p>
            </div>
            <button
              onClick={createBackup}
              disabled={isCreating}
              className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Create New Backup
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">Backup created successfully</p>
              <p className="text-green-700 text-sm">Your immutable backup has been created and is now available for download</p>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-blue-900 font-semibold mb-1">Immutable Backups</h3>
            <p className="text-blue-800 text-sm">
              All backups are immutable and cannot be modified or deleted for 30 days. This ensures data integrity and compliance with retention policies.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Backups</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{backups.length}</p>
              </div>
              <div className="bg-sky-100 p-3 rounded-lg">
                <Database className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Storage</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">729 MB</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Latest Backup</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {backups.length > 0 ? formatDate(backups[0].created).split(',')[0] : 'N/A'}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Backups List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Backup History</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {backups.map((backup) => (
              <div key={backup.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{backup.name}</h3>
                      {backup.immutable && (
                        <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          <Shield className="w-3 h-3" />
                          Immutable
                        </span>
                      )}
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(backup.created)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Database className="w-4 h-4" />
                        {backup.tables} tables
                      </div>
                      <div>
                        {backup.records.toLocaleString()} records
                      </div>
                      <div className="font-medium text-gray-900">
                        {backup.size}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadBackup(backup)}
                    className="ml-4 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retention Policy */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-900 font-semibold mb-1">Retention Policy</h3>
            <p className="text-amber-800 text-sm">
              Backups are retained for 90 days and are immutable for the first 30 days. After 90 days, backups are automatically archived to cold storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}