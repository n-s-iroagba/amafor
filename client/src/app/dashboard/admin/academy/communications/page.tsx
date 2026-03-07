'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, MessageCircle, Mail, Smartphone, Send, Users, Loader2, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { useGet, usePost } from '@/shared/hooks/useApiQuery';

/**
 * Page: Communications Hub
 * Screen ID: SC-132
 * Description: Send WhatsApp/SMS/Email messages to guardians and trialists from a unified hub.
 * BRD Requirements: BR-ADV-05, BR-ADV-06
 * User Journey: UJ-ADM-005 (Manage Academy)
 * Route: /dashboard/admin/academy/communications
 */

interface Recipient { id: string; name: string; guardianName?: string; phone?: string; email?: string; }

const CHANNELS = [
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    { id: 'email', label: 'Email', icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { id: 'sms', label: 'SMS', icon: Smartphone, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200' },
];

const TEMPLATES = [
    { id: 'trial_invite', label: 'Trial Day Invitation', body: 'Dear {guardian}, we are pleased to invite {name} for a trial day at Amafor Gladiators FC on {date}. Please confirm attendance.' },
    { id: 'trial_reminder', label: 'Trial Day Reminder', body: 'This is a reminder that {name}\'s trial day is scheduled for {date}. Please arrive 15 minutes early.' },
    { id: 'result_accepted', label: 'Acceptance Notification', body: 'Congratulations! {name} has been accepted into the Amafor Gladiators FC Academy. Welcome to the family!' },
    { id: 'result_rejected', label: 'Regret Notification', body: 'Thank you for attending the trial. Unfortunately, {name} was not selected at this time. We encourage you to try again next cycle.' },
    { id: 'custom', label: 'Custom Message', body: '' },
];

export default function CommunicationsHubPage() {
    const [channel, setChannel] = useState('whatsapp');
    const [templateId, setTemplateId] = useState('trial_invite');
    const [body, setBody] = useState(TEMPLATES[0].body);
    const [group, setGroup] = useState<'trialists' | 'guardians' | 'all'>('trialists');
    const [sent, setSent] = useState(false);
    const [showLog, setShowLog] = useState(false);

    const { data: recipients, loading } = useGet<Recipient[]>(`/academy/${group}`);
    const { post: sendMessage, isPending: sending, error } = usePost('/academy/communications/send');

    const handleTemplateChange = (tid: string) => {
        setTemplateId(tid);
        const tmpl = TEMPLATES.find(t => t.id === tid);
        setBody(tmpl?.body ?? '');
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendMessage({ channel, body, group, recipients: (recipients ?? []).map(r => r.id) });
        setSent(true);
        setTimeout(() => setSent(false), 4000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
            <div className="bg-gradient-to-r from-sky-800 to-sky-900 text-white">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <Link href="/dashboard/admin" className="inline-flex items-center text-sky-400 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-sky-600 p-2 rounded-xl"><MessageSquare className="w-5 h-5 text-white" /></div>
                        <h1 className="text-3xl font-bold">Communications Hub</h1>
                    </div>
                    <p className="text-sky-300 text-sm">
                        Send WhatsApp → Email → SMS fallback messages to trialists and guardians (BR-ADV-05, BR-ADV-06).
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Compose Panel */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSend} className="bg-white rounded-xl shadow-sm border border-sky-200 p-8 space-y-6">
                            <h2 className="font-bold text-sky-800 text-lg">Compose Message</h2>

                            {sent && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <p className="text-sm text-green-800 font-medium">Message dispatched successfully!</p>
                                </div>
                            )}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            {/* Channel selector */}
                            <div>
                                <label className="block text-sm font-semibold text-sky-700 mb-3">Channel (fallback: WhatsApp → Email → SMS)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {CHANNELS.map(ch => {
                                        const Icon = ch.icon;
                                        return (
                                            <button
                                                key={ch.id}
                                                type="button"
                                                onClick={() => setChannel(ch.id)}
                                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors text-sm font-semibold
                          ${channel === ch.id ? `${ch.bg} border-current ${ch.color}` : 'border-sky-200 text-sky-400 hover:border-sky-300'}`}
                                            >
                                                <Icon className="w-5 h-5" /> {ch.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Group */}
                            <div>
                                <label className="block text-sm font-semibold text-sky-700 mb-2">Recipients</label>
                                <div className="flex items-center gap-3">
                                    {(['trialists', 'guardians', 'all'] as const).map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setGroup(g)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize
                        ${group === g ? 'bg-sky-800 text-white' : 'bg-sky-100 text-sky-600 hover:bg-sky-200'}`}
                                        >
                                            {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
                                        </button>
                                    ))}
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> : <span className="text-sm text-sky-500">{recipients?.length ?? 0} recipients</span>}
                                </div>
                            </div>

                            {/* Template */}
                            <div>
                                <label className="block text-sm font-semibold text-sky-700 mb-2">Template</label>
                                <div className="relative">
                                    <select
                                        value={templateId}
                                        onChange={e => handleTemplateChange(e.target.value)}
                                        className="w-full px-4 py-3 border border-sky-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 appearance-none"
                                    >
                                        {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Message body */}
                            <div>
                                <label className="block text-sm font-semibold text-sky-700 mb-2">
                                    Message Body
                                    <span className="ml-2 text-xs font-normal text-sky-400">Use &#123;name&#125;, &#123;guardian&#125;, &#123;date&#125; as merge tags</span>
                                </label>
                                <textarea
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    rows={5}
                                    required
                                    className="w-full px-4 py-3 border border-sky-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none"
                                />
                                <p className="text-xs text-sky-400 mt-1">{body.length} characters</p>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-sky-200">
                                <span className="text-xs text-sky-400">Sending via <strong>{CHANNELS.find(c => c.id === channel)?.label}</strong> to <strong>{recipients?.length ?? 0}</strong> recipient(s)</span>
                                <button
                                    type="submit"
                                    disabled={sending || !body.trim()}
                                    className="px-8 py-3 bg-sky-800 text-white rounded-lg text-sm font-bold hover:bg-sky-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Recipient Preview */}
                    <div className="bg-white rounded-xl shadow-sm border border-sky-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-sky-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-sky-500" />
                                <h3 className="font-bold text-sky-800">Recipients</h3>
                            </div>
                            {loading && <Loader2 className="w-4 h-4 animate-spin text-sky-400" />}
                        </div>
                        <div className="divide-y divide-sky-100 max-h-96 overflow-y-auto">
                            {(recipients ?? []).length === 0 ? (
                                <div className="p-8 text-center"><p className="text-sm text-sky-500">No recipients found.</p></div>
                            ) : (recipients ?? []).slice(0, 20).map(r => (
                                <div key={r.id} className="px-6 py-3">
                                    <p className="text-sm font-medium text-sky-800">{r.name}</p>
                                    {r.guardianName && <p className="text-xs text-sky-500">Guardian: {r.guardianName}</p>}
                                    {r.email && <p className="text-xs text-sky-400">{r.email}</p>}
                                </div>
                            ))}
                            {(recipients?.length ?? 0) > 20 && (
                                <div className="px-6 py-3 text-xs text-sky-400">+ {(recipients?.length ?? 0) - 20} more…</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
