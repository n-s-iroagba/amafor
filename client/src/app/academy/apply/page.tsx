'use client';

import { useState } from 'react';
import { Header } from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';
import { ArrowLeft, Check, AlertCircle, Upload } from 'lucide-react';
import Link from 'next/link';

export default function TrialistApplication() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        phone: '',
        position: '',
        previousClub: '',
        videoUrl: '',
        guardianName: '',
        guardianPhone: '',
        guardianEmail: '',
        consentEmail: false,
        consentSmsWhatsapp: false,
        guardianConsent: false
    });

    const [submitted, setSubmitted] = useState(false);

    const calculateAge = (dob: string) => {
        if (!dob) return 0;
        const diff = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const isMinor = calculateAge(formData.dob) < 18;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isMinor && !formData.guardianConsent) {
            alert('Guardian consent is required for applicants under 18.');
            return;
        }
        // In production: Submit to backend
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <>
                <Header />
                <main className="py-24 bg-slate-50 min-h-screen">
                    <div className="container mx-auto px-4 max-w-2xl text-center">
                        <div className="bg-white p-12 rounded-lg shadow-card">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-heading text-slate-800 mb-4">Application Submitted</h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
                                Thank you for applying to the Amafor Gladiators Academy. Your application is now under review.
                                <br /><br />
                                We will contact you via WhatsApp, Email, or SMS (in that priority order) if you are selected for a trial.
                                Standard review time is 72 business hours (BR-TP-04).
                            </p>
                            <Link href="/academy" className="inline-block bg-sky-700 text-white px-8 py-3 rounded-lg hover:bg-sky-800 transition-colors">
                                Return to Academy Hub
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="py-16 bg-slate-50 min-h-screen">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Link href="/academy" className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 mb-8 font-medium">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Academy
                    </Link>

                    <div className="bg-white rounded-lg shadow-card p-8 md:p-12">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-heading mb-4">Academy Trial Application</h1>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Join the Amafor Gladiators legacy. Provide your details below for our scouting team to review.
                                <br />
                                <span className="text-sm font-semibold text-sky-700 mt-2 block">
                                    Note: Priority communication channel is WhatsApp → Email → SMS (BR-TP-10).
                                </span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Player Information */}
                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Player Information</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">First Name *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth *</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                                            value={formData.dob}
                                            onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Position *</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                                            value={formData.position}
                                            onChange={e => setFormData({ ...formData, position: e.target.value })}
                                        >
                                            <option value="">Select Position</option>
                                            <option value="Goalkeeper">Goalkeeper</option>
                                            <option value="Defender">Defender</option>
                                            <option value="Midfielder">Midfielder</option>
                                            <option value="Forward">Forward</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Contact Information */}
                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Contact Details</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone / WhatsApp *</label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="+234..."
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Guardian Info (Conditional) */}
                            {isMinor && (
                                <section className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 animate-in fade-in">
                                    <div className="flex items-start gap-3 mb-6">
                                        <AlertCircle className="w-6 h-6 text-yellow-700 shrink-0 mt-1" />
                                        <div>
                                            <h2 className="text-xl font-bold text-yellow-800 mb-1">Guardian Information Required</h2>
                                            <p className="text-sm text-yellow-700">
                                                Since the applicant is under 18 (Minor Data - BR-DSR-02), guardian details and consent are mandatory.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Guardian Full Name *</label>
                                            <input
                                                type="text"
                                                required={isMinor}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                value={formData.guardianName}
                                                onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Guardian Phone *</label>
                                            <input
                                                type="tel"
                                                required={isMinor}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                value={formData.guardianPhone}
                                                onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Guardian Email *</label>
                                            <input
                                                type="email"
                                                required={isMinor}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                value={formData.guardianEmail}
                                                onChange={e => setFormData({ ...formData, guardianEmail: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Assessment Data */}
                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Experience & Highlights</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Previous Club (Optional)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                                            value={formData.previousClub}
                                            onChange={e => setFormData({ ...formData, previousClub: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Highlight Video URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://youtube.com/..."
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                                            value={formData.videoUrl}
                                            onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                        />
                                        <p className="text-xs text-slate-500 mt-1">YouTube, Vimeo, or Google Drive link (Max 100MB equivalent)</p>
                                    </div>
                                </div>
                            </section>

                            {/* Consents (DEV-09) */}
                            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-4">Communications & Consent (BR-TP-06)</h3>

                                <div className="space-y-4">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            required
                                            className="mt-1 w-5 h-5 text-sky-700 border-slate-300 rounded focus:ring-sky-700"
                                            checked={formData.consentEmail}
                                            onChange={e => setFormData({ ...formData, consentEmail: e.target.checked })}
                                        />
                                        <span className="text-slate-700 text-sm">
                                            I consent to receiving official club communications via <strong>Email</strong>.
                                        </span>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            required
                                            className="mt-1 w-5 h-5 text-sky-700 border-slate-300 rounded focus:ring-sky-700"
                                            checked={formData.consentSmsWhatsapp}
                                            onChange={e => setFormData({ ...formData, consentSmsWhatsapp: e.target.checked })}
                                        />
                                        <span className="text-slate-700 text-sm">
                                            I consent to receiving official club communications via <strong>SMS and WhatsApp</strong>.
                                        </span>
                                    </label>

                                    {isMinor && (
                                        <label className="flex items-start gap-3 cursor-pointer bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                            <input
                                                type="checkbox"
                                                required
                                                className="mt-1 w-5 h-5 text-yellow-700 border-yellow-400 rounded focus:ring-yellow-700"
                                                checked={formData.guardianConsent}
                                                onChange={e => setFormData({ ...formData, guardianConsent: e.target.checked })}
                                            />
                                            <span className="text-yellow-900 text-sm font-semibold">
                                                [Guardian Consent] I confirm I am the legal guardian of this applicant and I authorize their participation in Amafor Gladiators FC trials.
                                            </span>
                                        </label>
                                    )}
                                </div>
                            </section>

                            <button
                                type="submit"
                                className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
