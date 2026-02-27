import { useState } from 'react'

export default function ChecklistForm({ onSubmit, onClose, loading = false }) {
    const [form, setForm] = useState({
        title: '',
        emoji: '✅',
        description: '',
    })
    const [items, setItems] = useState([''])

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleItemChange = (index, value) => {
        const updated = [...items]
        updated[index] = value
        setItems(updated)
    }

    const addItemField = () => setItems([...items, ''])

    const removeItemField = (index) =>
        setItems(items.filter((_, i) => i !== index))

    const handleSubmit = (e) => {
        e.preventDefault()
        const filteredItems = items
            .filter(i => i.trim())
            .map(title => ({ title }))

        onSubmit({ ...form, items: filteredItems })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(44,31,26,0.5)' }}>
            <div className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
                style={{ background: 'var(--card)' }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif italic text-xl" style={{ color: 'var(--ink)' }}>
                        New Checklist
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
                                placeholder="Wedding Preparations"
                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                                style={{
                                    background: 'var(--warm)',
                                    border: '1px solid var(--blush)',
                                    color: 'var(--ink)',
                                }}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5"
                            style={{ color: 'var(--ink)' }}>Description</label>
                        <input
                            type="text"
                            name="description"
                            value={form.description}
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

                    {/* Initial Items */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5"
                            style={{ color: 'var(--ink)' }}>
                            Items <span style={{ color: 'var(--muted)' }}>(optional)</span>
                        </label>
                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleItemChange(index, e.target.value)}
                                        placeholder={`Item ${index + 1}`}
                                        className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                                        style={{
                                            background: 'var(--warm)',
                                            border: '1px solid var(--blush)',
                                            color: 'var(--ink)',
                                        }}
                                    />
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItemField(index)}
                                            className="px-3 rounded-xl text-sm"
                                            style={{ color: '#DC2626', background: '#FEF2F2' }}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addItemField}
                            className="mt-2 text-xs flex items-center gap-1"
                            style={{ color: 'var(--muted)' }}
                        >
                            <span style={{ color: 'var(--rose)' }}>+</span> Add another item
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-medium transition-opacity mt-2"
                        style={{ background: 'var(--rose)', color: 'white', opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? 'Creating...' : 'Create Checklist'}
                    </button>
                </form>
            </div>
        </div>
    )
}