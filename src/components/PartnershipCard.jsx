import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getMyPartnership,
    getPendingInvites,
    sendInvite,
    acceptInvite,
    leavePartnership,
} from '../lib/partnerships'
import useToastStore from '../stores/toastStore'

export default function PartnershipCard() {
    const queryClient = useQueryClient()
    const [inviteCode, setInviteCode] = useState('')
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    // ── Queries ──
    const { data: partnershipData, isLoading } = useQuery({
        queryKey: ['partnership'],
        queryFn: () => getMyPartnership().then(r => r.data),
    })

    const { data: pendingData } = useQuery({
        queryKey: ['pending-invites'],
        queryFn: () => getPendingInvites().then(r => r.data),
        enabled: !partnershipData?.partnership,
    })

    const { showToast } = useToastStore()

    // ── Mutations ──
    const inviteMutation = useMutation({
        mutationFn: () => sendInvite(inviteCode),
        onSuccess: (res) => {
            setMessage(res.data.message)
            setInviteCode('')
            queryClient.invalidateQueries(['partnership'])
            showToast('Invite sent! 💌', 'success')
        },
        onError: (err) => {
            showToast(err.response?.data?.message ?? 'Something went wrong.', 'error')
            setError(err.response?.data?.message ?? 'Something went wrong.')
        },
    })

    const acceptMutation = useMutation({
        mutationFn: acceptInvite,
        onSuccess: () => {
            queryClient.invalidateQueries(['partnership'])
            queryClient.invalidateQueries(['pending-invites'])
            showToast('You are now connected! 💑', 'success')
        },
        onError: (err) => {
            showToast(err.response?.data?.message ?? 'Something went wrong.', 'error')
        },
    })

    const leaveMutation = useMutation({
        mutationFn: leavePartnership,
        onSuccess: () => {
            queryClient.invalidateQueries(['partnership'])
            showToast('Partnership dissolved.', 'info')
        },
        onError: (err) => {
            showToast(err.response?.data?.message ?? 'Something went wrong.', 'error')
        },
    })

    const handleInvite = (e) => {
        e.preventDefault()
        if (inviteMutation.isPending || inviteMutation.isSuccess) return  // ← guard
        setError(null)
        setMessage(null)
        inviteMutation.mutate()
    }

    // ── Loading ──
    if (isLoading) {
        return (
            <div className="rounded-2xl p-6 animate-pulse"
                style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
                <div className="h-4 rounded w-1/3 mb-3" style={{ background: 'var(--warm)' }}></div>
                <div className="h-3 rounded w-2/3" style={{ background: 'var(--warm)' }}></div>
            </div>
        )
    }

    // ── Active Partnership ──
    if (partnershipData?.partnership) {
        const { partner, partnership } = partnershipData
        return (
            <div className="rounded-2xl p-6"
                style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-sm" style={{ color: 'var(--ink)' }}>
                        💑 Your Partner
                    </h3>
                    <button
                        onClick={() => leaveMutation.mutate()}
                        disabled={leaveMutation.isPending}
                        className="text-xs transition-colors"
                        style={{ color: 'var(--muted)' }}
                    >
                        {leaveMutation.isPending ? 'Leaving...' : 'Leave'}
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                        style={{ background: 'var(--gold)' }}>
                        {partner?.display_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--ink)' }}>
                            {partner?.display_name}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>
                            {partner?.email}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--rose)' }}>
                            ✓ Connected {new Date(partnership.connected_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // ── Pending Invite Received ──
    if (pendingData?.invites?.length > 0) {
        const invite = pendingData.invites[0]
        return (
            <div className="rounded-2xl p-6"
                style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
                <h3 className="font-medium text-sm mb-3" style={{ color: 'var(--ink)' }}>
                    💌 Incoming Invite
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
                    <span className="font-medium" style={{ color: 'var(--rose)' }}>
                        {invite.user_a?.display_name}
                    </span>{' '}
                    wants to connect with you!
                </p>
                {error && (
                    <div className="text-sm rounded-xl px-4 py-3 mb-4"
                        style={{ background: '#FEF2F2', color: '#DC2626' }}>
                        {error}
                    </div>
                )}
                <button
                    onClick={() => { setError(null); acceptMutation.mutate() }}
                    disabled={acceptMutation.isPending}
                    className="w-full py-2.5 rounded-xl text-sm font-medium transition-opacity"
                    style={{ background: 'var(--rose)', color: 'white', opacity: acceptMutation.isPending ? 0.6 : 1 }}
                >
                    {acceptMutation.isPending ? 'Accepting...' : 'Accept Invite 💕'}
                </button>
            </div>
        )
    }

    // ── No Partnership — Connect Form ──
    return (
        <div className="rounded-2xl p-6"
            style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
            <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--ink)' }}>
                💑 Connect with Partner
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
                Enter your partner's invite code to send them a request
            </p>

            {message && (
                <div className="text-sm rounded-xl px-4 py-3 mb-4"
                    style={{ background: '#F0FDF4', color: '#16A34A' }}>
                    {message}
                </div>
            )}
            {error && (
                <div className="text-sm rounded-xl px-4 py-3 mb-4"
                    style={{ background: '#FEF2F2', color: '#DC2626' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleInvite} className="flex gap-2">
                <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="TRA-XXXX"
                    maxLength={8}
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none uppercase"
                    style={{
                        background: 'var(--warm)',
                        border: '1px solid var(--blush)',
                        color: 'var(--ink)',
                    }}
                />
                <button
                    type="submit"
                    disabled={inviteMutation.isPending || inviteMutation.isSuccess || inviteCode.length < 8}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium transition-opacity"
                    style={{
                        background: 'var(--rose)',
                        color: 'white',
                        opacity: (inviteMutation.isPending || inviteMutation.isSuccess || inviteCode.length < 8) ? 0.5 : 1,
                    }}
                >
                    {inviteMutation.isPending ? '...' : inviteMutation.isSuccess ? '✓' : 'Send'}
                </button>
            </form>
        </div>
    )
}