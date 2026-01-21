'use client';

import { useState } from 'react';
import { Save, AlertCircle, Clock, Archive, Trash2 } from 'lucide-react';

export default function RetentionSettings() {
    const [retentionDays, setRetentionDays] = useState({
        auditLogs: 365, // BR-SEC-09: 1 year
        applicationData: 90, // BR-SEC-09: 3 months
        inactiveAccounts: 730, // 2 years
    });

    const [anonymizationEnabled, setAnonymizationEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simmons saving
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Data Retention & Anonymization</h1>
                <p className="text-slate-600">Configure automated data lifecycle policies per BR-SEC-09.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-1">Retention Periods</h2>
                            <p className="text-sm text-slate-500">Define how long data is stored before action</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Audit Logs (Days)</label>
                            <input
                                type="number"
                                value={retentionDays.auditLogs}
                                onChange={(e) => setRetentionDays({ ...retentionDays, auditLogs: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-slate-500 mt-2">Recommended: 365 days (BR-SEC-09)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Application Logs (Days)</label>
                            <input
                                type="number"
                                value={retentionDays.applicationData}
                                onChange={(e) => setRetentionDays({ ...retentionDays, applicationData: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-slate-500 mt-2">Recommended: 90 days</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <Archive className="w-5 h-5 text-yellow-700 mt-1" />
                            <h3 className="font-bold text-yellow-900">Anonymization Policy</h3>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={anonymizationEnabled}
                                onChange={(e) => setAnonymizationEnabled(e.target.checked)}
                                className="w-5 h-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-600"
                            />
                            <span className="text-yellow-800">
                                Automatically anonymize user data upon account deletion instead of hard delete (BR-DSR-03).
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Saving Policy...' : 'Save Policy Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
