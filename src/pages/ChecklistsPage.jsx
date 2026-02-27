import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import ChecklistCard from '../components/ChecklistCard'
import ChecklistForm from '../components/ChecklistForm'
import { getChecklists, createChecklist } from '../lib/checklists'
import useToastStore from '../stores/toastStore'

export default function ChecklistsPage() {
    const queryClient = useQueryClient()
    const { showToast } = useToastStore()
    const [showForm, setShowForm] = useState(false)

    // ── Fetch ──
    const { data, isLoading } = useQuery({
        queryKey: ['checklists'],
        queryFn: () => getChecklists().then(r => r.data),
        retry: false,
    })

    const checklists = data?.checklists ?? []
    const totalItems = checklists.reduce((acc, c) => acc + (c.items?.length ?? 0), 0)
    const completedItems = checklists.reduce(
        (acc, c) => acc + (c.items?.filter(i => i.is_completed).length ?? 0), 0
    )

    // ── Create ──
    const createMutation = useMutation({
        mutationFn: createChecklist,
        onSuccess: () => {
            queryClient.invalidateQueries(['checklists'])
            setShowForm(false)
            showToast('Checklist created! ✅', 'success')
        },
        onError: (err) => {
            showToast(err.response?.data?.message ?? 'Failed to create checklist.', 'error')
        },
    })

    return (
        <AppLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-serif italic text-3xl" style={{ color: 'var(--ink)' }}>
                        Checklists ✅
                    </h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                        {completedItems} of {totalItems} items completed
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'var(--rose)', color: 'white' }}
                >
                    + New Checklist
                </button>
            </div>

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
            {!isLoading && checklists.length === 0 && (
                <div className="rounded-2xl p-12 text-center"
                    style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
                    <p className="text-4xl mb-4">✅</p>
                    <p className="font-medium" style={{ color: 'var(--ink)' }}>No checklists yet</p>
                    <p className="text-sm mt-1 mb-6" style={{ color: 'var(--muted)' }}>
                        Create your first checklist together
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium"
                        style={{ background: 'var(--rose)', color: 'white' }}
                    >
                        + Create Checklist
                    </button>
                </div>
            )}

            {/* Checklists Grid */}
            {checklists.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {checklists.map(checklist => (
                        <ChecklistCard
                            key={checklist.id}
                            checklist={checklist}
                        />
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showForm && (
                <ChecklistForm
                    onSubmit={(data) => createMutation.mutate(data)}
                    onClose={() => setShowForm(false)}
                    loading={createMutation.isPending}
                />
            )}
        </AppLayout>
    )
}