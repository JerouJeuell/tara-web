import { useState, useEffect } from 'react'

const TAG_COLORS = ['rose', 'gold', 'green', 'blue', 'purple']

const emptyForm = {
    title: '',
    event_date: '',
    event_time: '',
    venue: '',
    notes: '',
    emoji: '📅',
    tags: [],
}

export default function EventForm({ onSubmit, onClose, initial = null, loading = false }) {
    const [form, setForm] = useState(emptyForm)
    const [tagInput, setTagInput] = useState('')
    const [tagColor, setTagColor] = useState('rose')

    useEffect(() => {
        if (initial) {
            setForm({
                title:      initial.title ?? '',
                event_date: initial.event_date?.slice(0, 10) ?? '',
                event_time: initial.event_time?.slice(0, 5) ?? '',
                venue:      initial.venue ?? '',
                notes:      initial.notes ?? '',
                emoji:      initial.emoji ?? '📅',
                tags:       initial.tags ?? [],
            })
        }
    }, [initial])

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const addTag = () => {
        if (!tagInput.trim()) return
        setForm({
            ...form,
            tags: [...form.tags, { label: tagInput.trim(), color: tagColor }],
        })
        setTagInput('')
    }

    const removeTag = (index) =>
        setForm({ ...form, tags: form.tags.filter((_, i) => i !== index) })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(form)
    }

    const colorMap = {
        rose: '#C97B63', gold: '#C9A96E', green: '#16A34A',
        blue: '#3B82F6', purple: '#9333EA',
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(44,31,26,0.5)' }}>
            <div className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
                style={{ background: 'var(--card)' }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif italic text-xl" style={{ color: 'var(--ink)' }}>
                        {initial ? 'Edit Event' : 'New Event'}
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
                                placeholder="Dinner at Manam"
                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                                style={{ background: 'var(--warm)', border: '1px solid var(--blush)', color: 'var(--ink)' }}
                            />
                        </div>
                    </div>

                    {/* Date + Time */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-medium mb-1.5"
                                style={{ color: 'var(--ink)' }}>Date *</label>
                            <input
                                type="date"
                                name="event_date"
                                value={form.event_date}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                                style={{ background: 'var(--warm)', border: '1px solid var(--blush)', color: 'var(--ink)' }}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium mb-1.5"
                                style={{ color: 'var(--ink)' }}>Time</label>
                            <input
                                type="time"
                                name="event_time"
                                value={form.event_time}
                                onChange={handleChange}
                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                                style={{ background: 'var(--warm)', border: '1px solid var(--blush)', color: 'var(--ink)' }}
                            />
                        </div>
                    </div>

                    {/* Venue */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5"
                            style={{ color: 'var(--ink)' }}>Venue</label>
                        <input
                            type="text"
                            name="venue"
                            value={form.venue}
                            onChange={handleChange}
                            placeholder="Restaurant, park, etc."
                            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                            style={{ background: 'var(--warm)', border: '1px solid var(--blush)', color: 'var(--ink)' }}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5"
                            style={{ color: 'var(--ink)' }}>Notes</label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Any details..."
                            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                            style={{ background: 'var(--warm)', border: '1px solid var(--blush)', color: 'var(--ink)' }}
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5"
                            style={{ color: 'var(--ink)' }}>Tags</label>

                        {/* Existing tags */}
                        {form.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {form.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1"
                                        style={{ background: 'var(--warm)', color: 'var(--ink)' }}
                                    >
                                        <span style={{ color: colorMap[tag.color] }}>●</span>
                                        {tag.label}
                                        <button type="button" onClick={() => removeTag(i)}
                                            className="ml-1 hover:text-red-400">×</button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Add tag input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                placeholder="Add a tag..."
                                className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none"
                                style={{ background: 'var(--warm)', border: '1px solid var(--blush)', color: 'var(--ink)' }}
                            />
                            {/* Color picker */}
                            <div className="flex gap-1 items-center">
                                {TAG_COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setTagColor(c)}
                                        className="w-5 h-5 rounded-full transition-transform"
                                        style={{
                                            background: colorMap[c],
                                            transform: tagColor === c ? 'scale(1.3)' : 'scale(1)',
                                        }}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-3 py-2 rounded-xl text-sm"
                                style={{ background: 'var(--warm)', color: 'var(--ink)' }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-medium transition-opacity mt-2"
                        style={{ background: 'var(--rose)', color: 'white', opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? 'Saving...' : initial ? 'Save Changes' : 'Create Event'}
                    </button>
                </form>
            </div>
        </div>
    )
}