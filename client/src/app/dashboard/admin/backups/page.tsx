'use client';
import React, { useState } from 'react';
import { HardDrive, Plus, Download, Clock, CheckCircle, Loader2, Shield, Database, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useGet, usePost, useDelete } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';

interface Backup {
  id: string;
  name: string;
  createdAt: string;
  size: string;
  status: 'completed' | 'in_progress' | 'failed';
  type: 'full' | 'incremental';
}

export default function BackupsPage() {
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: response, loading: backupsLoading, refetch } = useGet<any>(
    API_ROUTES.BACKUPS.LIST
  );

  const backups: Backup[] = response?.data || [];

  const { post: createBackup } = usePost<{ type: string }, Backup>(
    API_ROUTES.BACKUPS.CREATE
  );

  const { delete: deleteBackupFn, isPending: deleteLoading } = useDelete(
    (id: string | number) => API_ROUTES.BACKUPS.DELETE(String(id))
  );

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      await createBackup({ type: 'full' });
      refetch();
    } catch (error) {
      console.error('Failed to create backup:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = (backupId: string) => {
    window.open(API_ROUTES.BACKUPS.DOWNLOAD(backupId), '_blank');
  };

  const handleDelete = async (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup?')) return;

    setDeletingId(backupId);
    try {
      await deleteBackupFn(backupId);
      refetch();
    } catch (error) {
      console.error('Failed to delete backup:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusIcon = (status: Backup['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <Shield className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusLabel = (status: Backup['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'failed':
        return 'Failed';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Link href="/dashboard/admin" className="text-[10px] font-black text-[#87CEEB] uppercase tracking-[0.3em] mb-2 block hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl text-[#2F4F4F] flex items-center gap-4">
            <HardDrive className="w-10 h-10 text-[#87CEEB]" />
            Data Backups
          </h1>
        </div>
        <button
          onClick={handleCreateBackup}
          disabled={creating}
          className="sky-button flex items-center gap-2 py-3 disabled:opacity-50"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          CREATE NEW BACKUP
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#2F4F4F] text-[#87CEEB] rounded-xl">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Backups</div>
          <div className="text-3xl font-black text-[#2F4F4F]">
            {backupsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : backups?.length || 0}
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 text-white rounded-xl">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Successful</div>
          <div className="text-3xl font-black text-[#2F4F4F]">
            {backupsLoading ? '...' : backups?.filter(b => b.status === 'completed').length || 0}
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 text-white rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Latest Backup</div>
          <div className="text-lg font-black text-[#2F4F4F]">
            {backupsLoading ? '...' : backups && backups.length > 0
              ? new Date(backups[0].createdAt).toLocaleDateString()
              : 'Never'}
          </div>
        </div>
      </div>

      {/* Backups Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b bg-gray-50">
          <h2 className="text-sm font-black text-[#2F4F4F] uppercase tracking-widest">Backup History</h2>
        </div>
        {backupsLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-4 text-gray-400">Loading backups...</p>
          </div>
        ) : backups && backups.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">Backup Name</th>
                <th className="px-8 py-4">Created</th>
                <th className="px-8 py-4">Size</th>
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {backups.map(backup => (
                <tr key={backup.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-4 h-4 text-[#87CEEB]" />
                      <span className="font-bold text-[#2F4F4F]">{backup.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-gray-500">
                    {new Date(backup.createdAt).toLocaleString()}
                  </td>
                  <td className="px-8 py-4 text-sm font-mono text-gray-700">{backup.size}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${backup.type === 'full' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                      {backup.type}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(backup.status)}
                      <span className="text-sm text-gray-700">{getStatusLabel(backup.status)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      {backup.status === 'completed' && (
                        <button
                          onClick={() => handleDownload(backup.id)}
                          className="p-2 hover:bg-[#87CEEB]/10 rounded-lg transition-colors text-[#87CEEB]"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(backup.id)}
                        disabled={deleteLoading && deletingId === backup.id}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400 disabled:opacity-50"
                        title="Delete"
                      >
                        {deleteLoading && deletingId === backup.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <HardDrive className="w-12 h-12 mx-auto mb-4 text-gray-200" />
            <p>No backups found</p>
            <p className="text-sm mt-2">Create your first backup to get started</p>
          </div>
        )}
      </div>

      {/* Compliance Note */}
      <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 bg-slate-100 p-4 rounded-lg">
        <Shield className="w-4 h-4" />
        <span>Database backups are encrypted at rest and stored in multiple geographic locations per ISO 27001:2022 requirements (BR-SEC-04).</span>
      </div>
    </div>
  );
}