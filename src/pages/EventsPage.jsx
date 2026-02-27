import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import EventCard from '../components/EventCard'
import EventForm from '../components/EventForm'
import { getEvents, createEvent, updateEvent, deleteEvent } from '../lib/events'
import useToastStore from '../stores/toastStore'

export default function EventsPage() {
    const queryClient = useQueryClient()
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)

    // ── Fetch Events ──
    const { data, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: () => getEvents().then(r => r.data),
        retry: false,
    })

    const events = data?.events ?? []
    const upcoming = events.filter(e => new Date(e.event_date) >= new Date())
    const past = events.filter(e => new Date(e.event_date) < new Date())

    const {showToast} = useToastStore()

    // ── Create ──
    const createMutation = useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries(['events'])
            setShowForm(false)
            showToast('Event created! 📅', 'success')
        },
        onError: (err) => {
            showToast(err.response?.data?.message ?? 'Failed to create event.', 'error')
        },
    })

    // ── Update ──
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['events'])
            setEditing(null)
            showToast('Event updated!', 'success')
        },
        onError: (err) => {
            showToast(err.response?.data?.message ?? 'Failed to update event.', 'error')
        },
    })

    // ── Delete ──
    const deleteMutation = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries(['events'])
            showToast('Event deleted.', 'info')
        },
        onError: (err) => {
            showToast(err.response?.data?.message ?? 'Failed to delete event.', 'error')
        },
    })

    const handleEdit = (event) => setEditing(event)

    const handleDelete = (id) => {
        if (window.confirm('Delete this event?')) {
            deleteMutation.mutate(id)
        }
    }

    return (
        <AppLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-serif italic text-3xl" style={{ color: 'var(--ink)' }}>
                        Events 📅
                    </h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                        {upcoming.length} upcoming · {past.length} past
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'var(--rose)', color: 'white' }}
                >
                    + New Event
                </button>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-2xl p-5 animate-pulse"
                            style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
                            <div className="h-4 rounded w-1/3 mb-2" style={{ background: 'var(--warm)' }} />
                            <div className="h-3 rounded w-1/2" style={{ background: 'var(--warm)' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && events.length === 0 && (
                <div className="rounded-2xl p-12 text-center"
                    style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
                    <p className="text-4xl mb-4">📅</p>
                    <p className="font-medium" style={{ color: 'var(--ink)' }}>No events yet</p>
                    <p className="text-sm mt-1 mb-6" style={{ color: 'var(--muted)' }}>
                        Create your first date or event together
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium"
                        style={{ background: 'var(--rose)', color: 'white' }}
                    >
                        + Create Event
                    </button>
                </div>
            )}

            {/* Upcoming Events */}
            {upcoming.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xs font-medium uppercase tracking-wider mb-3"
                        style={{ color: 'var(--muted)' }}>
                        Upcoming
                    </h3>
                    <div className="space-y-3">
                        {upcoming.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Past Events */}
            {past.length > 0 && (
                <div>
                    <h3 className="text-xs font-medium uppercase tracking-wider mb-3"
                        style={{ color: 'var(--muted)' }}>
                        Past
                    </h3>
                    <div className="space-y-3 opacity-60">
                        {past.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Create Form Modal */}
            {showForm && (
                <EventForm
                    onSubmit={(data) => createMutation.mutate(data)}
                    onClose={() => setShowForm(false)}
                    loading={createMutation.isPending}
                />
            )}

            {/* Edit Form Modal */}
            {editing && (
                <EventForm
                    initial={editing}
                    onSubmit={(data) => updateMutation.mutate({ id: editing.id, data })}
                    onClose={() => setEditing(null)}
                    loading={updateMutation.isPending}
                />
            )}
        </AppLayout>
    )
}