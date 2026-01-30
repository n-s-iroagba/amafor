'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGet } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { Loader2 } from 'lucide-react';


/**
 * Page: League Statistics Redirect
 * Description: Redirects to the detail view of the league statistics.
 * Requirements: REQ-ADM-07 (League Statistics)
 * User Story: US-ADM-007 (View League Stats)
 * User Journey: UJ-ADM-005 (Competition Review)
 * API: GET /leagues/:id/statistics (API_ROUTES.LEAGUES.STATISTICS)
 * Hook: useGet(API_ROUTES.LEAGUES.STATISTICS)
 */
export default function LeagueStatisticsPage() {
    const params = useParams();
    const router = useRouter();
    const leagueId = params.id as string;

    // Assuming we can fetch stats by league ID or list them and filter
    // Since user said "league statistics is created with leagues", there should be one.
    // Let's try to fetch using the LEAGUES.STATISTICS endpoint which returns stats for a league?
    // API_ROUTES.LEAGUES.STATISTICS(id) -> `/leagues/${id}/statistics`

    const { data: stats, loading, error } = useGet<any>(
        API_ROUTES.LEAGUES.STATISTICS(leagueId)
    );

    useEffect(() => {
        if (!loading && stats) {
            // If stats exist, redirect to the detail page
            // The detail page is at [statsId], so we need the ID of the stats object
            if (stats.id) {
                router.replace(`/dashboard/admin/leagues/${leagueId}/league-statstics/${stats.id}`);
            } else if (Array.isArray(stats) && stats.length > 0) {
                router.replace(`/dashboard/admin/leagues/${leagueId}/league-statstics/${stats[0].id}`);
            }
        }
    }, [loading, stats, leagueId, router]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>Could not find statistics for this league.</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-blue-600 hover:underline"
                    data-testid="btn-error-go-back"
                >
                    Go Back
                </button>
            </div>
        )
    }

    return null; // Redirecting
}
