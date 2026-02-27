import { useState } from 'react'

export default function SavingsForm({ onSubmit, onClose, loading = false }) {
    const [form, setForm] = useState({
        title: '',
        emoji: '💰',
        target_amount: '',
        target_date: '',
        notes: '',
    })

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(form)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(44,31,26,0.5)' }}>
            <div className="w-full max-w-md rounded-2xl p-6"
                style={{ background: 'var(--card)' }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif italic text-xl" style={{ color: 'var(--ink)' }}>
                        New Savings Goal
                    </h2>
                    <button onClick={onClose}
                        className="text-sm px-3 py-1 rounded-lg"
                        style={{ color: 'var(--muted)', background: 'var(--warm)' }}>
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Emoji + Title */}
                    <div className="flex gap-3">
                        <div className="w-16">
                            <label className="block text-xs font-medium mb-1.5"
                                style={{ color: 'var(--ink)' }}>Emoji</label>
                            <input
                                type="text"
                                name="emoji"
                                value={form.emoji}
                                onChange={handleChange}
                                maxLength={2}
                                className="w-full rounded-xl px-3 py-3 text-center text-xl focus:outline-none"
                                style={{ background: 'var(--warm)', border: '1px solid var(--blush)' }}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium mb-1.5"
                                style={{ color: 'var(--ink)' }}>Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                placeholder="Honeymoon in Bali"
                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                                style={{
                                    background: 'var(--warm)',
                                    border: '1px solid var(--blush)',
                                    color: 'var(--ink)',
                                }}
                            />
                        </div>
                    </div>

                    {/* Target Amount */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5"
                            style={{ color: 'var(--ink)' }}>Target Amount (₱) *</label>
                        <input
                            type="number"
                            name="target_amount"
                            value={form.target_amount}
                            onChange={handleChange}
                            required
                            min="1"
                            placeholder="150000"
                            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                            style={{
                                background: 'var(--warm)',
                                border: '1px solid var(--blush)',
                                color: 'var(--ink)',
                            }}
                        />
                    </div>

                    {/* Target Date */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5"
                            style={{ color: 'var(--ink)' }}>Target Date</label>
                        <input
                            type="date"
                            name="target_date"
                            value={form.target_date}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                            style={{
                                background: 'var(--warm)',
                                border: '1px solid var(--blush)',
                                color: 'var(--ink)',
                            }}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5"
                            style={{ color: 'var(--ink)' }}>Notes</label>
                        <input
                            type="text"
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Optional details..."
                            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                            style={{
                                background: 'var(--warm)',
                                border: '1px solid var(--blush)',
                                color: 'var(--ink)',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-medium transition-opacity mt-2"
                        style={{ background: 'var(--rose)', color: 'white', opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? 'Creating...' : 'Create Goal'}
                    </button>
                </form>
            </div>
        </div>
    )
}