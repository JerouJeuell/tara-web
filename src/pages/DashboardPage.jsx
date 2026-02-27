import { useQuery } from '@tanstack/react-query'
import AppLayout from '../components/AppLayout'
import PartnershipCard from '../components/PartnershipCard'
import useAuthStore from '../stores/authStore'
import { getMyPartnership } from '../lib/partnerships'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
    const { user } = useAuthStore()
    const navigate = useNavigate()

    const { data: partnershipData } = useQuery({
        queryKey: ['partnership'],
        queryFn: () => getMyPartnership().then(r => r.data),
    })
    
    const partner = partnershipData?.partner ?? null
    const isConnected = !!partnershipData?.partnership

    return (
        <AppLayout>
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="font-serif italic text-3xl" style={{ color: 'var(--ink)' }}>
                    Good day, {user?.display_name} 🌸
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                    {isConnected
                        ? `You and ${partner?.display_name} have things to plan.`
                        : 'Connect with your partner to get started.'}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-3xl">

                {/* Invite Code Card */}
                <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>YOUR INVITE CODE</p>
                    <p className="font-mono text-2xl font-bold" style={{ color: 'var(--rose)' }}>
                        {user?.invite_code}
                    </p>
                    <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
                        Share this with your partner so they can connect with you
                    </p>
                </div>

                {/* Partnership Card */}
                <PartnershipCard />

                {/* Feature Grid */}
                {isConnected && (
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { emoji: '📅', label: 'Events', desc: 'Plan your dates', path:'/events' },
                            { emoji: '✅', label: 'Checklists', desc: 'Stay organized', path: '/checklists' },
                            { emoji: '💰', label: 'Savings', desc: 'Reach goals together', path: '/savings' },
                            // { emoji: '🔔', label: 'Reminders', desc: 'Never forget' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className="rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md"
                                style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}
                            >
                                <span className="text-2xl">{item.emoji}</span>
                                <p className="font-medium text-sm mt-3" style={{ color: 'var(--ink)' }}>
                                    {item.label}
                                </p>
                                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}