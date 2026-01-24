'use client';

import { useState } from 'react';
import { Header } from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';
import { Shield, Lock, FileText, CheckCircle, AlertTriangle } from 'lucide-react';


/**
 * Page: Data Subject Request
 * Description: Form for users to request data export or deletion (GDPR/NDPR).
 * Requirements: REQ-DSR-01 (Data Rights)
 * User Story: US-UTL-004 (View Compliance Information)
 * User Journey: UJ-UTL-002 (View Legal Pages)
 * API: POST /privacy/request
 */
export default function DataRequestPage() {
    const [requestType, setRequestType] = useState('access');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to submit DSR request would go here
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <>
                <Header />
                <main className="py-24 bg-slate-50 min-h-screen">
                    <div className="container mx-auto px-4 max-w-2xl text-center">
                        <div className="bg-white p-12 rounded-lg shadow-card">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-heading text-slate-800 mb-4">Request Submitted</h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
                                Your Data Subject Request (DSR) has been received.
                                <br /><br />
                                Our Data Protection Officer (DPO) will review your request and respond within 30 days as required by NDPR.
                                You will receive a confirmation email with a reference number shortly.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-sky-700 font-medium hover:underline"
                            >
                                Submit another request
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="py-16 bg-slate-50 min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-heading text-slate-900 mb-4">Privacy & Data Rights Portal</h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Exercise your rights under the Nigeria Data Protection Regulation (NDPR).
                            Manage your personal data, request copies, or ask for deletion.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                                <Shield className="w-8 h-8 text-sky-700 mb-4" />
                                <h3 className="font-bold text-lg mb-2">Your Rights</h3>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li>• Right to Access</li>
                                    <li>• Right to Rectification</li>
                                    <li>• Right to Erasure</li>
                                    <li>• Right to Restrict Processing</li>
                                    <li>• Right to Data Portability</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                <Lock className="w-8 h-8 text-blue-700 mb-4" />
                                <h3 className="font-bold text-lg mb-2 text-blue-900">Secure Process</h3>
                                <p className="text-sm text-blue-800">
                                    We will verify your identity before processing any request associated with personal data (BR-DSR-01).
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <div className="bg-white rounded-lg shadow-card p-8">
                                <h2 className="text-2xl font-heading mb-6">Submit a Request</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                                            <input type="text" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                                            <input type="text" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Associated with Account</label>
                                        <input type="email" required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Request Type</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {['access', 'rectify', 'delete'].map((type) => (
                                                <div
                                                    key={type}
                                                    onClick={() => setRequestType(type)}
                                                    className={`cursor-pointer border rounded-lg p-4 text-center transition-all ${requestType === type
                                                        ? 'border-sky-600 bg-sky-50 text-sky-800 ring-1 ring-sky-600'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className="font-semibold capitalize mb-1">
                                                        {type === 'access' ? 'Export Data' : type === 'rectify' ? 'Correction' : 'Deletion'}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {type === 'access' ? 'Get a copy of your data' : type === 'rectify' ? 'Update your info' : 'Remove your account'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Details</label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                                            placeholder="Please provide any specific details to help us fulfill your request..."
                                        ></textarea>
                                    </div>

                                    {requestType === 'delete' && (
                                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex gap-3">
                                            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                            <div className="text-sm text-red-800">
                                                <strong>Warning:</strong> Deletion requests are irreversible. We may retain certain data for legal compliance as per our retention policy (BR-SEC-09).
                                            </div>
                                        </div>
                                    )}

                                    <button type="submit" className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold py-4 rounded-lg transition-colors">
                                        Submit Request
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
