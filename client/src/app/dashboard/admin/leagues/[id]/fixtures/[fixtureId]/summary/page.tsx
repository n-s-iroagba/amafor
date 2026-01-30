'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGet, usePost, usePut } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { Loader2, ArrowLeft, Save, Activity } from 'lucide-react';

interface FixtureStatistics {
    id: string;
    fixtureId: string;
    homePossession: number;
    awayPossession: number;
    homeShots: number;
    awayShots: number;
    homeShotsOnTarget: number;
    awayShotsOnTarget: number;
    homeCorners: number;
    awayCorners: number;
    homeFouls: number;
    awayFouls: number;
    homeYellowCards: number;
    awayYellowCards: number;
    homeRedCards: number;
    awayRedCards: number;
    homeOffsides: number;
    awayOffsides: number;
}


/**
 * Page: Match Summary Statistics
 * Description: Interface to manage detailed match statistics (possession, shots, etc.).
 * Requirements: REQ-ADM-11 (Match Summary)
 * User Story: US-ADM-015 (Match Reporting)
 * User Journey: UJ-ADM-006 (Match Day Ops)
 * API: GET/POST/PUT /match-summaries (API_ROUTES.MATCH_SUMMARY)
 */
export default function MatchSummaryPage() {
    const params = useParams();
    const router = useRouter();
    const fixtureId = params.fixtureId as string;

    const { data: summary, loading, refetch } = useGet<FixtureStatistics>(
        API_ROUTES.MATCH_SUMMARY.BY_FIXTURE(fixtureId)
    );

    const { post, isPending: isCreating } = usePost(
        API_ROUTES.MATCH_SUMMARY.CREATE(fixtureId)
    );

    const { put, isPending: isUpdating } = usePut(
        summary ? API_ROUTES.MATCH_SUMMARY.MUTATE(summary.id) : ''
    );

    const [formData, setFormData] = useState<Partial<FixtureStatistics>>({
        homePossession: 50, awayPossession: 50,
        homeShots: 0, awayShots: 0,
        homeShotsOnTarget: 0, awayShotsOnTarget: 0,
        homeCorners: 0, awayCorners: 0,
        homeFouls: 0, awayFouls: 0,
        homeYellowCards: 0, awayYellowCards: 0,
        homeRedCards: 0, awayRedCards: 0,
        homeOffsides: 0, awayOffsides: 0,
    });

    useEffect(() => {
        if (summary) {
            setFormData(summary);
        }
    }, [summary]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (summary) {
                await put(formData);
            } else {
                await post(formData);
            }
            refetch();
            alert('Match summary saved successfully!');
        } catch (error) {
            console.error('Error saving summary:', error);
            alert('Failed to save summary.');
        }
    };

    const StatRow = ({ label, homeKey, awayKey }: { label: string, homeKey: keyof FixtureStatistics, awayKey: keyof FixtureStatistics }) => (
        <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-100 last:border-0">
            <div className="text-right">
                <input
                    type="number"
                    name={homeKey}
                    value={formData[homeKey] as number}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded text-right focus:ring-sky-500 focus:border-sky-500"
                    min="0"
                    data-testid={`input-home-${homeKey}`}
                />
            </div>
            <div className="text-center font-medium text-gray-600 text-sm uppercase tracking-wide">
                {label}
            </div>
            <div>
                <input
                    type="number"
                    name={awayKey}
                    value={formData[awayKey] as number}
                    onChange={handleInputChange}
                    className="w-20 px-2 py-1 border rounded focus:ring-sky-500 focus:border-sky-500"
                    min="0"
                    data-testid={`input-away-${awayKey}`}
                />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-2 transition-colors text-sm"
                        data-testid="btn-back-details"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to details
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-sky-600" />
                        Match Statistics Header
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isCreating || isUpdating}
                    className="flex items-center gap-2 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors"
                    data-testid="btn-save-summary"
                >
                    {(isCreating || isUpdating) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-3xl mx-auto">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 grid grid-cols-3 gap-4 font-semibold text-gray-700">
                    <div className="text-right">Home Team</div>
                    <div className="text-center">Statistic</div>
                    <div>Away Team</div>
                </div>

                <div className="p-6">
                    <StatRow label="Possession (%)" homeKey="homePossession" awayKey="awayPossession" />
                    <StatRow label="Shots" homeKey="homeShots" awayKey="awayShots" />
                    <StatRow label="Shots on Target" homeKey="homeShotsOnTarget" awayKey="awayShotsOnTarget" />
                    <StatRow label="Corners" homeKey="homeCorners" awayKey="awayCorners" />
                    <StatRow label="Fouls" homeKey="homeFouls" awayKey="awayFouls" />
                    <StatRow label="Yellow Cards" homeKey="homeYellowCards" awayKey="awayYellowCards" />
                    <StatRow label="Red Cards" homeKey="homeRedCards" awayKey="awayRedCards" />
                    <StatRow label="Offsides" homeKey="homeOffsides" awayKey="awayOffsides" />
                </div>
            </div>
        </div>
    );
}
