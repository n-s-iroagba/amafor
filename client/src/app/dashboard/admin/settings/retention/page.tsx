/**
 * Data Retention Policy Settings
 * 
 * Compliance interface for defining data lifecycle rules, archival parameters, and deletion schedules.
 * 
 * @screen SC-080
 * @implements REQ-SYS-05
 * @usecase UC-SYS-05 (Manage Data Retention)
 * @requires SRS-I-099 (Settings API - GET/PUT /admin/settings/retention)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-098 Monitor policy compliance and automated data lifecycle execution logs
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, Save, Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';

/**
 * Page: Data Retention Settings
 * Screen ID: SC-134
 * Description: Configure data retention periods per data category.
 * BRD Requirements: BR-DSR-01, BR-AD-12
 * User Journey: UJ-ADM-009 (System Administration)
 * Route: /dashboard/admin/settings/retention
 */

interface RetentionPolicy {
    userRecordsDays: number;
    auditLogDays: number;
    campaignDataDays: number;
    trialistRecordsDays: number;
    patronRecordsDays: number;
    scoutReportsDays: number;
}

const CATEGORIES: {
    key: keyof RetentionPolicy;
    label: string;
    desc: string;
    minDays: number;
    brd?: string;
}[] = [
        { key: 'userRecordsDays', label: 'User Records', desc: 'Authenticated user profiles and authentication data.', minDays: 365, brd: 'BR-DSR-01' },
        { key: 'auditLogDays', label: 'Audit Logs', desc: 'System event and action audit trail.', minDays: 365, brd: 'BR-DSR-01' },
        { key: 'campaignDataDays', label: 'Campaign Data', desc: 'Ad campaign records, impressions, and billing. Minimum 365 days required.', minDays: 365, brd: 'BR-AD-12' },
        { key: 'trialistRecordsDays', label: 'Trialist Records', desc: 'Academy trial applications and outcome history.', minDays: 180, brd: 'BR-AO-04' },
        { key: 'patronRecordsDays', label: 'Patron Records', desc: 'Donor and patron subscription history and receipts.', minDays: 2555, brd: 'BR-PP-05' },
        { key: 'scoutReportsDays', label: 'Scout Reports', desc: 'Pro View scouting reports and dossiers. System default: 365 days.', minDays: 365, brd: 'BR-TP-13' },
    ];

export default function DataRetentionSettingsPage() {
    const { data: policy, loading, error } = useGet<RetentionPolicy>('/admin/settings/retention');
    const { put, isPending: saving } = usePut('/admin/settings/retention');
    const [form, setForm] = useState<Partial<RetentionPolicy>>({});
    const [saved, setSaved] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const current = { ...(policy ?? {}), ...form } as RetentionPolicy;

    const setValue = (key: keyof RetentionPolicy, raw: string) => {
        const val = parseInt(raw, 10);
        const category = CATEGORIES.find(c => c.key === key);
        const errs = { ...validationErrors };
        if (category && val < category.minDays) {
            errs[key] = `Minimum ${category.minDays} days required${category.brd ? ` (${category.brd})` : ''}.`;
        } else {
            delete errs[key];
        }
        setValidationErrors(errs);
        setForm(f => ({ ...f, [key]: val }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(validationErrors).length > 0) return;
        await put(current);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-sky-400" /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
            <div className="bg-gradient-to-r from-sky-800 to-sky-900 text-white">
                <div className="container mx-auto max-w-4xl px-4 py-8">
                    <Link href="/dashboard/admin/settings" className="inline-flex items-center text-sky-400 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> System Settings
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-sky-600 p-2 rounded-xl"><Database className="w-5 h-5 text-white" /></div>
                        <h1 className="text-3xl font-bold">Data Retention Policy</h1>
                    </div>
                    <p className="text-sky-300 text-sm">Configure how long each data category is kept before automated purge. All values in days.</p>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-4 py-8">
                {/* NDPR Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                        <span className="font-bold">NDPR Compliance Notice:</span> Data retention periods must comply with the Nigeria Data Protection Regulation. Personal data should not be kept longer than necessary. Reducing periods below the BRD minimum will be blocked by the system. Data Subject Requests must be fulfilled within 30 days of receipt (BR-DSR-01, BR-DSR-02).
                    </div>
                </div>

                {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-sm text-red-700">{error}</p></div>}
                {saved && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-600" /><p className="text-sm text-green-800 font-medium">Retention policy updated. Scheduled purge jobs reconfigured.</p></div>}

                <form onSubmit={handleSave}>
                    <div className="bg-white rounded-xl shadow-sm border border-sky-200 divide-y divide-sky-100">
                        {CATEGORIES.map(cat => {
                            const val = (current as any)[cat.key] ?? cat.minDays;
                            const hasError = Boolean(validationErrors[cat.key]);
                            return (
                                <div key={cat.key} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-sky-800">{cat.label}</p>
                                            {cat.brd && <span className="text-xs bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full font-medium">{cat.brd}</span>}
                                        </div>
                                        <p className="text-xs text-sky-500 mt-1">{cat.desc}</p>
                                        <p className="text-xs text-sky-400 mt-0.5">Minimum: {cat.minDays} days ({Math.round(cat.minDays / 365 * 10) / 10} years)</p>
                                        {hasError && <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors[cat.key]}</p>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min={cat.minDays}
                                                step={1}
                                                value={val}
                                                onChange={e => setValue(cat.key, e.target.value)}
                                                className={`w-28 px-4 py-2 border rounded-lg text-sm text-right focus:outline-none focus:ring-2 ${hasError ? 'border-red-300 focus:ring-red-200' : 'border-sky-300 focus:ring-sky-200'}`}
                                            />
                                        </div>
                                        <span className="text-sm text-sky-500 w-10">days</span>
                                        <span className="text-xs text-sky-400 w-16">
                                            ≈ {Math.round(val / 365 * 10) / 10}y
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <p className="text-xs text-sky-400">Changes take effect on the next scheduled purge run (nightly at 02:00 WAT).</p>
                        <button
                            type="submit"
                            disabled={saving || Object.keys(validationErrors).length > 0}
                            className="px-8 py-3 bg-sky-800 text-white rounded-xl text-sm font-bold hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Retention Policy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
