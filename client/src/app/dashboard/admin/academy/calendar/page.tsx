/**
 * Academy Training Calendar
 * 
 * Administrative interface for scheduling and managing academy training sessions, matches, and events.
 * 
 * @screen SC-131
 * @implements REQ-ACA-01
 * @usecase UC-ACA-01 (Manage Academy Schedule)
 * @requires SRS-I-110 (Academy API - GET /admin/academy/calendar)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-110 Monitor schedule density and event modification frequency
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, CalendarDays, ChevronLeft, ChevronRight,
    CheckCircle, XCircle, Clock, Loader2, AlertCircle, Plus, Users
} from 'lucide-react';
import { useGet, usePost } from '@/shared/hooks/useApiQuery';

interface Session {
    id: string;
    date: string;
    title: string;
    type: 'training' | 'trial' | 'match';
    attendees: { id: string; name: string; status: 'present' | 'absent' | 'pending' }[];
}

const typeColors: Record<string, string> = {
    training: 'bg-blue-100 text-blue-700',
    trial: 'bg-amber-100 text-amber-700',
    match: 'bg-green-100 text-green-700',
};

export default function AcademyCalendarPage() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const { data: sessions, loading, error } = useGet<Session[]>(
        `/academy/sessions?year=${year}&month=${month + 1}`
    );
    const { post: logAttendance, isPending: logging } = usePost('/academy/attendance');

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

    const sessionsByDate: Record<string, Session[]> = {};
    (sessions ?? []).forEach(s => {
        const day = s.date.split('T')[0];
        sessionsByDate[day] = sessionsByDate[day] ? [...sessionsByDate[day], s] : [s];
    });

    const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const selectedSessions = selectedDate ? (sessionsByDate[selectedDate] ?? []) : [];

    const handleNav = (dir: number) => {
        let m = month + dir; let y = year;
        if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
        setMonth(m); setYear(y); setSelectedDate(null);
    };

    const handleAttendance = async (sessionId: string, attendeeId: string, status: string) => {
        await logAttendance({ sessionId, attendeeId, status });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
            <div className="bg-gradient-to-r from-sky-800 to-sky-900 text-white">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <Link href="/dashboard/admin" className="inline-flex items-center text-sky-400 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-2" /> Central Command
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2"><CalendarDays className="w-6 h-6 text-sky-400" /><h1 className="text-3xl font-bold">Academy Calendar</h1></div>
                            <p className="text-sky-300 text-sm">Schedule trial days, log training attendance, and track match sessions (BR-ADV-03, BR-ADV-04).</p>
                        </div>
                        <Link href="/dashboard/admin/academy/trialist/new" className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm font-medium transition-colors">
                            <Plus className="w-4 h-4" /> Schedule Session
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-sm text-red-700">{error}</p></div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar Grid */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-sky-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <button onClick={() => handleNav(-1)} className="p-2 hover:bg-sky-100 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-sky-600" /></button>
                            <h2 className="text-xl font-bold text-sky-800">{monthName} {year}</h2>
                            <button onClick={() => handleNav(1)} className="p-2 hover:bg-sky-100 rounded-lg transition-colors"><ChevronRight className="w-5 h-5 text-sky-600" /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-sky-500 uppercase tracking-wider mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const hasSessions = Boolean(sessionsByDate[dateStr]);
                                const isToday = dateStr === todayStr;
                                const isSelected = dateStr === selectedDate;
                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDate(dateStr)}
                                        className={`relative p-2 rounded-lg text-sm font-medium transition-colors aspect-square flex flex-col items-center justify-center
                      ${isSelected ? 'bg-sky-800 text-white' : isToday ? 'bg-sky-100 text-sky-700' : 'hover:bg-sky-100 text-sky-700'}
                    `}
                                    >
                                        {day}
                                        {hasSessions && <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-sky-400' : 'bg-sky-500'}`} />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Session Panel */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm border border-sky-200 h-full">
                            <div className="px-6 py-4 border-b border-sky-200">
                                <h3 className="font-bold text-sky-800">
                                    {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Select a day'}
                                </h3>
                            </div>
                            {loading ? (
                                <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-sky-400" /></div>
                            ) : !selectedDate ? (
                                <div className="p-8 text-center"><CalendarDays className="w-10 h-10 text-sky-200 mx-auto mb-3" /><p className="text-sm text-sky-500">Click a date to see sessions.</p></div>
                            ) : selectedSessions.length === 0 ? (
                                <div className="p-8 text-center"><CalendarDays className="w-10 h-10 text-sky-200 mx-auto mb-3" /><p className="text-sm text-sky-500">No sessions on this day.</p></div>
                            ) : selectedSessions.map(session => (
                                <div key={session.id} className="p-6 border-b border-sky-100 last:border-0">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${typeColors[session.type]}`}>{session.type}</span>
                                        <h4 className="font-semibold text-sky-800">{session.title}</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {session.attendees.map(att => (
                                            <div key={att.id} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-3 h-3 text-sky-400" />
                                                    <span className="text-sky-700">{att.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleAttendance(session.id, att.id, 'present')} className={`p-1 rounded ${att.status === 'present' ? 'text-green-600' : 'text-sky-300 hover:text-green-500'} transition-colors`}>
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleAttendance(session.id, att.id, 'absent')} className={`p-1 rounded ${att.status === 'absent' ? 'text-red-500' : 'text-sky-300 hover:text-red-400'} transition-colors`}>
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                    {att.status === 'pending' && <Clock className="w-4 h-4 text-sky-300" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
