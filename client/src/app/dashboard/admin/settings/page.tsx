/**
 * Global System Settings
 * 
 * Central configuration interface for platform-wide parameters, branding, and operational toggles.
 * 
 * @screen SC-079
 * @implements REQ-SYS-04
 * @usecase UC-SYS-04 (Update System Settings)
 * @requires SRS-I-098 (Settings API - GET/PUT /admin/settings)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-097 Track configuration changes and publishing success of system-wide updates
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Globe, Image as ImageIcon, Mail, Save, Loader2, CheckCircle, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { useGet, usePut } from '@/shared/hooks/useApiQuery';

/**
 * Page: System Settings (Admin)
 * Screen ID: SC-133
 * Description: Global system configuration — site name, logos, contact info, feature flags.
 * BRD Requirements: N/A (internal ops)
 * User Journey: UJ-ADM-009 (System Administration)
 * Route: /dashboard/admin/settings
 */

interface SiteConfig {
    siteName: string;
    tagline: string;
    contactEmail: string;
    supportPhone: string;
    twitterHandle: string;
    facebookUrl: string;
    instagramHandle: string;
    features: { whatsappWidget: boolean; patronWall: boolean; proViewEnabled: boolean; rssEnabled: boolean; adsEnabled: boolean; };
}

export default function SystemSettingsPage() {
    const { data: config, loading, error } = useGet<SiteConfig>('/admin/settings');
    const { put, isPending: saving } = usePut('/admin/settings');
    const [form, setForm] = useState<Partial<SiteConfig>>({});
    const [saved, setSaved] = useState(false);

    const current = { ...(config ?? {}), ...form } as SiteConfig;

    const set = (key: keyof SiteConfig, value: any) => setForm(f => ({ ...f, [key]: value }));

    const setFeature = (key: keyof SiteConfig['features'], value: boolean) =>
        setForm(f => ({ ...f, features: { ...(current.features ?? {}), [key]: value } }));

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await put(current);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-sky-400" /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
            <div className="bg-gradient-to-r from-sky-800 to-sky-900 text-white">
                <div className="container mx-auto max-w-4xl px-4 py-8">
                    <Link href="/dashboard/admin" className="inline-flex items-center text-sky-400 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-sky-600 p-2 rounded-xl"><Settings className="w-5 h-5 text-white" /></div>
                        <h1 className="text-3xl font-bold">System Settings</h1>
                    </div>
                    <p className="text-sky-300 text-sm">Global site configuration, feature flags, and contact details.</p>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-4 py-8">
                {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-sm text-red-700">{error}</p></div>}
                {saved && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-600" /><p className="text-sm text-green-800 font-medium">Settings saved successfully.</p></div>}

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Site Identity */}
                    <div className="bg-white rounded-xl shadow-sm border border-sky-200 p-8">
                        <h2 className="flex items-center gap-2 font-bold text-sky-800 text-lg mb-6"><Globe className="w-5 h-5 text-sky-500" /> Site Identity</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-sky-700 mb-2">Site Name</label>
                                <input type="text" value={current.siteName ?? ''} onChange={e => set('siteName', e.target.value)} className="w-full px-4 py-3 border border-sky-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-sky-700 mb-2">Tagline</label>
                                <input type="text" value={current.tagline ?? ''} onChange={e => set('tagline', e.target.value)} className="w-full px-4 py-3 border border-sky-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-sky-200 p-8">
                        <h2 className="flex items-center gap-2 font-bold text-sky-800 text-lg mb-6"><Mail className="w-5 h-5 text-sky-500" /> Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { key: 'contactEmail', label: 'Contact Email', type: 'email' },
                                { key: 'supportPhone', label: 'Support Phone', type: 'tel' },
                                { key: 'twitterHandle', label: 'Twitter / X Handle', type: 'text' },
                                { key: 'facebookUrl', label: 'Facebook URL', type: 'url' },
                                { key: 'instagramHandle', label: 'Instagram Handle', type: 'text' },
                            ].map(({ key, label, type }) => (
                                <div key={key}>
                                    <label className="block text-sm font-semibold text-sky-700 mb-2">{label}</label>
                                    <input
                                        type={type}
                                        value={(current as any)[key] ?? ''}
                                        onChange={e => set(key as keyof SiteConfig, e.target.value)}
                                        className="w-full px-4 py-3 border border-sky-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Feature Flags */}
                    <div className="bg-white rounded-xl shadow-sm border border-sky-200 p-8">
                        <h2 className="flex items-center gap-2 font-bold text-sky-800 text-lg mb-6"><ToggleRight className="w-5 h-5 text-sky-500" /> Feature Flags</h2>
                        <div className="space-y-4">
                            {([
                                { key: 'whatsappWidget', label: 'WhatsApp Contact Widget', desc: 'Show floating WhatsApp CTA on public pages' },
                                { key: 'patronWall', label: 'Patron Wall', desc: 'Display public patron recognition wall (BR-PP-04)' },
                                { key: 'proViewEnabled', label: 'Pro View (Scout Portal)', desc: 'Enable scout registration and Pro View access' },
                                { key: 'rssEnabled', label: 'RSS Feed Integration', desc: 'Pull and display external news feeds (BR-CE-10)' },
                                { key: 'adsEnabled', label: 'Ad System', desc: 'Enable ad zones and campaign delivery (BR-AD)' },
                            ] as { key: keyof SiteConfig['features']; label: string; desc: string }[]).map(flag => {
                                const enabled = current.features?.[flag.key] ?? false;
                                return (
                                    <div key={flag.key} className="flex items-center justify-between p-4 rounded-lg border border-sky-200">
                                        <div>
                                            <p className="font-semibold text-sky-800">{flag.label}</p>
                                            <p className="text-xs text-sky-500 mt-0.5">{flag.desc}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFeature(flag.key, !enabled)}
                                            className={`transition-colors ${enabled ? 'text-green-600' : 'text-sky-300'}`}
                                            aria-label={`Toggle ${flag.label}`}
                                        >
                                            {enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sub-section links */}
                    <div className="bg-white rounded-xl shadow-sm border border-sky-200 p-6">
                        <h2 className="flex items-center gap-2 font-bold text-sky-800 mb-4"><Settings className="w-4 h-4" /> Advanced Settings</h2>
                        <Link href="/dashboard/admin/settings/retention" className="flex items-center justify-between p-4 rounded-lg border border-sky-200 hover:bg-sky-50 transition-colors">
                            <div>
                                <p className="font-semibold text-sky-800">Data Retention Policy</p>
                                <p className="text-xs text-sky-500 mt-0.5">Configure retention periods for user records, audit logs, campaign data (BR-AD-12, BR-DSR)</p>
                            </div>
                            <ArrowLeft className="w-4 h-4 text-sky-400 rotate-180" />
                        </Link>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={saving} className="px-8 py-3 bg-sky-800 text-white rounded-xl text-sm font-bold hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save All Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
