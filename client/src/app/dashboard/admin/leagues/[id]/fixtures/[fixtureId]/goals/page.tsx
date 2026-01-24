'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGet, usePost, useDelete } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { Loader2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Goal {
    id: number;
    fixtureId: string;
    scorer: string;
    minute: number;
    isPenalty: boolean;
    team: string; // 'home' | 'away' - Note: Server model might not store team explicitly if inferred from player? 
    // Wait, Goal model has `scorer` string. It doesn't seem to have `team`.
    // If `scorer` is just a string, how do we know which team?
    // Maybe valid logic determines it? Or simply store it?
    // Looking at Model (Step 881): `scorer`, `minute`, `isPenalty`. No `team` field.
    // This is a limitation. For now I will assume we enter scorer name.
    // Ideally it should be linked to a Player and Team.
    // But given the schema, we just list them.
}


/**
 * Page: Fixture Goals Management
 * Description: Interface to list, add, and delete goals for a fixture.
 * Requirements: REQ-ADM-10 (Goal Tracking)
 * User Story: US-ADM-013 (Manage Goals)
 * User Journey: UJ-ADM-006 (Match Day Ops)
 * API: GET /goals (API_ROUTES.GOALS.LIST), POST /goals, DELETE /goals/:id
 * Hook: useGet, usePost, useDelete
 */
export default function GoalsPage() {
    const params = useParams();
    const fixtureId = params.fixtureId as string;
    const leagueId = params.id as string;
    const router = useRouter();

    const [newGoal, setNewGoal] = useState({
        scorer: '',
        minute: '',
        isPenalty: false
    });

    const { data: goals, loading, refetch } = useGet<Goal[]>(
        API_ROUTES.GOALS.LIST(fixtureId)
    );

    const { post, isPending } = usePost(
        API_ROUTES.GOALS.CREATE(fixtureId)
    );

    const { delete: deleteGoal, isPending: isDeleting } = useDelete(
        (id) => API_ROUTES.GOALS.MUTATE(Number(id))
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await post({
                ...newGoal,
                minute: parseInt(newGoal.minute),
                fixtureId
            });
            setNewGoal({ scorer: '', minute: '', isPenalty: false });
            refetch();
        } catch (error) {
            console.error('Error creating goal:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this goal?')) return;
        try {
            await deleteGoal(id);
            refetch();
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-2 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to details
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Match Goals</h2>
                </div>
            </div>

            {/* Create Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Add New Goal</h3>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm text-gray-600 mb-1">Scorer Name</label>
                        <input
                            type="text"
                            required
                            value={newGoal.scorer}
                            onChange={(e) => setNewGoal({ ...newGoal, scorer: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="w-24">
                        <label className="block text-sm text-gray-600 mb-1">Minute</label>
                        <input
                            type="number"
                            required
                            min="1"
                            max="120"
                            value={newGoal.minute}
                            onChange={(e) => setNewGoal({ ...newGoal, minute: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Min"
                        />
                    </div>
                    <div className="flex items-center gap-2 pb-2">
                        <input
                            type="checkbox"
                            id="penalty"
                            checked={newGoal.isPenalty}
                            onChange={(e) => setNewGoal({ ...newGoal, isPenalty: e.target.checked })}
                            className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                        />
                        <label htmlFor="penalty" className="text-sm text-gray-700">Penalty Goal</label>
                    </div>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add Goal
                    </button>
                </form>
            </div>

            {/* Goals List */}
            <div className="overflow-hidden border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minute</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scorer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {goals?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No goals recorded yet.
                                </td>
                            </tr>
                        ) : (
                            goals?.map((goal) => (
                                <tr key={goal.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {goal.minute}'
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {goal.scorer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {goal.isPenalty ? (
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Penalty</span>
                                        ) : (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Regular</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(goal.id)}
                                            disabled={isDeleting}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
