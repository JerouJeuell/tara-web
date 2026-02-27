const colorMap = {
    rose:   { bg: '#FFF1F0', text: '#C97B63' },
    gold:   { bg: '#FFFBEB', text: '#C9A96E' },
    green:  { bg: '#F0FDF4', text: '#16A34A' },
    blue:   { bg: '#EFF6FF', text: '#3B82F6' },
    purple: { bg: '#FAF5FF', text: '#9333EA' },
}

export default function EventCard({ event, onEdit, onDelete }) {
    const date = new Date(event.event_date)
    const isUpcoming = date >= new Date()

    return (
        <div className="rounded-2xl p-5 transition-all hover:shadow-md"
            style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>

            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{event.emoji ?? '📅'}</span>
                    <div>
                        <h3 className="font-medium text-sm" style={{ color: 'var(--ink)' }}>
                            {event.title}
                        </h3>
                        {event.venue && (
                            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                                📍 {event.venue}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={() => onEdit(event)}
                        className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                        style={{ color: 'var(--muted)', background: 'var(--warm)' }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(event.id)}
                        className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                        style={{ color: '#DC2626', background: '#FEF2F2' }}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-3 mt-3">
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg"
                    style={{
                        background: isUpcoming ? '#F0FDF4' : 'var(--warm)',
                        color: isUpcoming ? '#16A34A' : 'var(--muted)',
                    }}>
                    {date.toLocaleDateString('en-PH', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </span>
                {event.event_time && (
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        🕐 {event.event_time.slice(0, 5)}
                    </span>
                )}
            </div>

            {/* Notes */}
            {event.notes && (
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {event.notes}
                </p>
            )}

            {/* Tags */}
            {event.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {event.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                            style={{
                                background: colorMap[tag.color]?.bg ?? '#F3F4F6',
                                color: colorMap[tag.color]?.text ?? '#6B7280',
                            }}
                        >
                            {tag.label}
                        </span>
                    ))}
                </div>
            )}

            {/* Created by */}
            <p className="text-xs mt-3" style={{ color: 'var(--muted)', opacity: 0.6 }}>
                Added by {event.creator?.display_name}
            </p>
        </div>
    )
}