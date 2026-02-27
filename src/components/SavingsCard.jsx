import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addContribution, deleteContribution, deleteSavingsGoal } from '../lib/savings'
import useToastStore from '../stores/toastStore'

export default function SavingsCard({ goal }) {
    const queryClient = useQueryClient()
    const { showToast } = useToastStore()
    const [showContribForm, setShowContribForm] = useState(false)
    const [showContribs, setShowContribs] = useState(false)
    const [amount, setAmount] = useState('')
    const [notes, setNotes] = useState('')

    // ── Compute totals ──
    const contributions = goal.contributions ?? []
    const totalSaved = contributions.reduce((sum, c) => sum + parseFloat(c.amount), 0)
    const progress = goal.target_amount > 0
        ? Math.min(100, Math.round((totalSaved / goal.target_amount) * 100))
        : 0
    const remaining = Math.max(0, goal.target_amount - totalSaved)
    const isAchieved = progress >= 100

    const formatPHP = (amount) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)

    // ── Add Contribution ──
    const addMutation = useMutation({
        mutationFn: () => addContribution(goal.id, { amount: parseFloat(amount), notes }),
        onSuccess: () => {
            queryClient.invalidateQueries(['savings'])
            setAmount('')
            setNotes('')
            setShowContribForm(false)
            showToast('Contribution added! 💸', 'success')
        },
        onError: (err) => {
            showToast(err.response?.data?.message ?? 'Failed to add contribution.', 'error')
        },
    })

    // ── Delete Contribution ──
    const deleteContribMutation = useMutation({
        mutationFn: (contributionId) => deleteContribution(goal.id, contributionId),
        onSuccess: () => {
            queryClient.invalidateQueries(['savings'])
            showToast('Contribution removed.', 'info')
        },
        onError: () => showToast('Failed to remove contribution.', 'error'),
    })

    // ── Delete Goal ──
    const deleteGoalMutation = useMutation({
        mutationFn: () => deleteSavingsGoal(goal.id),
        onSuccess: () => {
            queryClient.invalidateQueries(['savings'])
            showToast('Goal deleted.', 'info')
        },
        onError: () => showToast('Failed to delete goal.', 'error'),
    })

    const handleAddContrib = (e) => {
        e.preventDefault()
        if (!amount || parseFloat(amount) <= 0) return
        addMutation.mutate()
    }

    const handleDeleteGoal = () => {
        if (window.confirm(`Delete "${goal.title}"? This will remove all contributions.`)) {
            deleteGoalMutation.mutate()
        }
    }

    return (
        <div className="rounded-2xl p-5"
            style={{ background: 'var(--card)', border: `1px solid ${isAchieved ? '#BBF7D0' : 'var(--warm)'}` }}>

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.emoji ?? '💰'}</span>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm" style={{ color: 'var(--ink)' }}>
                                {goal.title}
                            </h3>
                            {isAchieved && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                    style={{ background: '#F0FDF4', color: '#16A34A' }}>
                                    ✓ Achieved!
                                </span>
                            )}
                        </div>
                        {goal.target_date && (
                            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                                🗓 Target: {new Date(goal.target_date).toLocaleDateString('en-PH', {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                })}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleDeleteGoal}
                    disabled={deleteGoalMutation.isPending}
                    className="text-xs px-2.5 py-1 rounded-lg"
                    style={{ color: '#DC2626', background: '#FEF2F2' }}
                >
                    Delete
                </button>
            </div>

            {/* Amounts */}
            <div className="flex items-end justify-between mb-2">
                <div>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Saved</p>
                    <p className="text-lg font-bold" style={{ color: isAchieved ? '#16A34A' : 'var(--rose)' }}>
                        {formatPHP(totalSaved)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Target</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                        {formatPHP(goal.target_amount)}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
                <div className="flex justify-between text-xs mb-1"
                    style={{ color: 'var(--muted)' }}>
                    <span>{progress}% complete</span>
                    {!isAchieved && <span>{formatPHP(remaining)} remaining</span>}
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'var(--warm)' }}>
                    <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{
                            width: `${progress}%`,
                            background: isAchieved
                                ? '#16A34A'
                                : progress > 66 ? 'var(--gold)' : 'var(--rose)',
                        }}
                    />
                </div>
            </div>

            {/* Notes */}
            {goal.notes && (
                <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
                    {goal.notes}
                </p>
            )}

            {/* Contributions Toggle */}
            {contributions.length > 0 && (
                <button
                    onClick={() => setShowContribs(!showContribs)}
                    className="text-xs mb-3 flex items-center gap-1 transition-colors"
                    style={{ color: 'var(--muted)' }}
                >
                    <span style={{ color: 'var(--rose)' }}>
                        {showContribs ? '▼' : '▶'}
                    </span>
                    {contributions.length} contribution{contributions.length !== 1 ? 's' : ''}
                </button>
            )}

            {/* Contributions List */}
            {showContribs && (
                <div className="space-y-2 mb-3">
                    {contributions.map((c) => (
                        <div key={c.id}
                            className="flex items-center justify-between px-3 py-2 rounded-xl group"
                            style={{ background: 'var(--warm)' }}>
                            <div>
                                <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                                    {formatPHP(c.amount)}
                                </span>
                                <span className="text-xs ml-2" style={{ color: 'var(--muted)' }}>
                                    by {c.contributor?.display_name}
                                </span>
                                {c.notes && (
                                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                                        {c.notes}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => deleteContribMutation.mutate(c.id)}
                                className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: '#DC2626' }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Contribution */}
            {showContribForm ? (
                <form onSubmit={handleAddContrib} className="space-y-2 mt-2">
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount (₱)"
                            min="1"
                            autoFocus
                            className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none"
                            style={{
                                background: 'var(--warm)',
                                border: '1px solid var(--blush)',
                                color: 'var(--ink)',
                            }}
                        />
                        <button
                            type="submit"
                            disabled={addMutation.isPending}
                            className="px-3 py-2 rounded-xl text-sm font-medium"
                            style={{ background: 'var(--rose)', color: 'white' }}
                        >
                            {addMutation.isPending ? '...' : 'Add'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowContribForm(false); setAmount(''); setNotes('') }}
                            className="px-3 py-2 rounded-xl text-sm"
                            style={{ background: 'var(--warm)', color: 'var(--muted)' }}
                        >
                            Cancel
                        </button>
                    </div>
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Notes (optional)"
                        className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                        style={{
                            background: 'var(--warm)',
                            border: '1px solid var(--blush)',
                            color: 'var(--ink)',
                        }}
                    />
                </form>
            ) : (
                <button
                    onClick={() => setShowContribForm(true)}
                    className="mt-2 text-xs flex items-center gap-1"
                    style={{ color: 'var(--muted)' }}
                >
                    <span style={{ color: 'var(--rose)' }}>+</span> Add contribution
                </button>
            )}

            {/* Footer */}
            <p className="text-xs mt-3" style={{ color: 'var(--muted)', opacity: 0.6 }}>
                Created by {goal.creator?.display_name}
            </p>
        </div>
    )
}