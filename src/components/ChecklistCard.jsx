import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addItem, toggleItem, deleteItem, deleteChecklist } from '../lib/checklists'
import useToastStore from '../stores/toastStore'

export default function ChecklistCard({ checklist }) {
    const queryClient = useQueryClient()
    const { showToast } = useToastStore()
    const [newItem, setNewItem] = useState('')
    const [showInput, setShowInput] = useState(false)

    const items = checklist.items ?? []
    const completed = items.filter(i => i.is_completed).length
    const total = items.length
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0

    // ── Toggle Item ──
    const toggleMutation = useMutation({
        mutationFn: (itemId) => toggleItem(checklist.id, itemId),
        onSuccess: () => queryClient.invalidateQueries(['checklists']),
        onError: () => showToast('Failed to update item.', 'error'),
    })

    // ── Add Item ──
    const addMutation = useMutation({
        mutationFn: (title) => addItem(checklist.id, title),
        onSuccess: () => {
            queryClient.invalidateQueries(['checklists'])
            setNewItem('')
            setShowInput(false)
            showToast('Item added!', 'success')
        },
        onError: () => showToast('Failed to add item.', 'error'),
    })

    // ── Delete Item ──
    const deleteItemMutation = useMutation({
        mutationFn: (itemId) => deleteItem(checklist.id, itemId),
        onSuccess: () => {
            queryClient.invalidateQueries(['checklists'])
            showToast('Item removed.', 'info')
        },
        onError: () => showToast('Failed to delete item.', 'error'),
    })

    // ── Delete Checklist ──
    const deleteChecklistMutation = useMutation({
        mutationFn: () => deleteChecklist(checklist.id),
        onSuccess: () => {
            queryClient.invalidateQueries(['checklists'])
            showToast('Checklist deleted.', 'info')
        },
        onError: () => showToast('Failed to delete checklist.', 'error'),
    })

    const handleAddItem = (e) => {
        e.preventDefault()
        if (!newItem.trim()) return
        addMutation.mutate(newItem.trim())
    }

    const handleDelete = () => {
        if (window.confirm(`Delete "${checklist.title}"?`)) {
            deleteChecklistMutation.mutate()
        }
    }

    return (
        <div className="rounded-2xl p-5"
            style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{checklist.emoji ?? '✅'}</span>
                    <div>
                        <h3 className="font-medium text-sm" style={{ color: 'var(--ink)' }}>
                            {checklist.title}
                        </h3>
                        {checklist.description && (
                            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                                {checklist.description}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={deleteChecklistMutation.isPending}
                    className="text-xs px-2.5 py-1 rounded-lg"
                    style={{ color: '#DC2626', background: '#FEF2F2' }}
                >
                    Delete
                </button>
            </div>

            {/* Progress Bar */}
            {total > 0 && (
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5"
                        style={{ color: 'var(--muted)' }}>
                        <span>{completed} of {total} done</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--warm)' }}>
                        <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                                background: progress === 100 ? '#16A34A' : 'var(--rose)',
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Items */}
            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id}
                        className="flex items-center gap-3 group">

                        {/* Checkbox */}
                        <button
                            onClick={() => toggleMutation.mutate(item.id)}
                            disabled={toggleMutation.isPending}
                            className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
                            style={{
                                borderColor: item.is_completed ? 'var(--rose)' : 'var(--blush)',
                                background: item.is_completed ? 'var(--rose)' : 'transparent',
                            }}
                        >
                            {item.is_completed && (
                                <span className="text-white text-xs font-bold">✓</span>
                            )}
                        </button>

                        {/* Title */}
                        <span
                            className="flex-1 text-sm transition-all"
                            style={{
                                color: item.is_completed ? 'var(--muted)' : 'var(--ink)',
                                textDecoration: item.is_completed ? 'line-through' : 'none',
                            }}
                        >
                            {item.title}
                        </span>

                        {/* Delete item button */}
                        <button
                            onClick={() => deleteItemMutation.mutate(item.id)}
                            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded"
                            style={{ color: '#DC2626' }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Item */}
            {showInput ? (
                <form onSubmit={handleAddItem} className="flex gap-2 mt-3">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="New item..."
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
                        onClick={() => { setShowInput(false); setNewItem('') }}
                        className="px-3 py-2 rounded-xl text-sm"
                        style={{ background: 'var(--warm)', color: 'var(--muted)' }}
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <button
                    onClick={() => setShowInput(true)}
                    className="mt-3 text-xs flex items-center gap-1 transition-colors"
                    style={{ color: 'var(--muted)' }}
                >
                    <span style={{ color: 'var(--rose)' }}>+</span> Add item
                </button>
            )}

            {/* Footer */}
            <p className="text-xs mt-3" style={{ color: 'var(--muted)', opacity: 0.6 }}>
                Created by {checklist.creator?.display_name}
            </p>
        </div>
    )
}