import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import SavingsCard from '../components/SavingsCard'
import SavingsForm from '../components/SavingsForm'
import { getSavings, createSavingsGoal } from '../lib/savings'
import useToastStore from '../stores/toastStore'

export default function SavingsPage() {
    const queryClient = useQueryClient()
    const { showToast } = useToastStore()
    const [showForm, setShowForm] = useState(false)

    // ── Fetch ──
    const { data, isLoading } = useQuery({
        queryKey: ['savings'],
        queryFn: () => getSavings().then(r => r.data),
        retry: false,
    })

    const goals = data?.goals ?? []

    // ── Totals ──
    const totalTarget = goals.reduce((sum, g) => sum + parseFloat(g.target_amount), 0)
    const totalSaved = goals.reduce((sum, g) =>
        sum + g.contributions.reduce((s, c) => s + parseFloat(c.amount), 0), 0)
    const achieved = goals.filter(g => {
        const saved = g.contributions.reduce((s, c) => s + parseFloat(c.amount), 0)
        return saved >= parseFloat(g.target_amount)
    }).length

    const formatPHP = (amount) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)

    // ── Create ──
    const createMutation = useMutation({
        mutationFn: createSavingsGoal,
        onSuccess: () => {
            queryClient.invalidateQueries(['savings'])
            setShowForm(false)
            showToast('Savings goal created! 💰', 'success')
        },
        onError: (err) => {
            showToast(err.response?.data?.message ?? 'Failed to create goal.', 'error')
        },
    })

    return (
        <AppLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-serif italic text-3xl" style={{ color: 'var(--ink)' }}>
                        Savings 💰
                    </h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                        {achieved} of {goals.length} goals achieved
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'var(--rose)', color: 'white' }}
                >
                    + New Goal
                </button>
            </div>

            {/* Summary Card */}
            {goals.length > 0 && (
                <div className="rounded-2xl p-5 mb-6 grid grid-cols-3 gap-4"
                    style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
                    <div>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>Total Saved</p>
                        <p className="text-lg font-bold mt-1" style={{ color: 'var(--rose)' }}>
                            {formatPHP(totalSaved)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>Total Target</p>
                        <p className="text-lg font-bold mt-1" style={{ color: 'var(--ink)' }}>
                            {formatPHP(totalTarget)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>Goals Achieved</p>
                        <p className="text-lg font-bold mt-1" style={{ color: '#16A34A' }}>
                            {achieved} / {goals.length}
                        </p>
                    </div>
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2].map(i => (
                        <div key={i} className="rounded-2xl p-5 animate-pulse"
                            style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
                            <div className="h-4 rounded w-1/3 mb-3" style={{ background: 'var(--warm)' }} />
                            <div className="h-2 rounded w-full mb-2" style={{ background: 'var(--warm)' }} />
                            <div className="h-2 rounded w-2/3" style={{ background: 'var(--warm)' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && goals.length === 0 && (
                <div className="rounded-2xl p-12 text-center"
                    style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
                    <p className="text-4xl mb-4">💰</p>
                    <p className="font-medium" style={{ color: 'var(--ink)' }}>No savings goals yet</p>
                    <p className="text-sm mt-1 mb-6" style={{ color: 'var(--muted)' }}>
                        Start saving towards your dreams together
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium"
                        style={{ background: 'var(--rose)', color: 'white' }}
                    >
                        + Create Goal
                    </button>
                </div>
            )}

            {/* Goals List */}
            {goals.length > 0 && (
                <div className="space-y-4">
                    {goals.map(goal => (
                        <SavingsCard key={goal.id} goal={goal} />
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showForm && (
                <SavingsForm
                    onSubmit={(data) => createMutation.mutate(data)}
                    onClose={() => setShowForm(false)}
                    loading={createMutation.isPending}
                />
            )}
        </AppLayout>
    )
}