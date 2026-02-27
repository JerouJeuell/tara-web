import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function DashboardPage() {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-rose-50 p-6">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-rose-500">Tara 🌸</h1>
                        <p className="text-gray-500 text-sm">Your couples space</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-rose-500 transition-colors"
                    >
                        Sign out
                    </button>
                </div>

                {/* Welcome Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Welcome, {user?.display_name}! 👋
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Your invite code:{' '}
                        <span className="font-mono font-bold text-rose-500">
                            {user?.invite_code}
                        </span>
                    </p>
                    <p className="text-gray-400 text-xs mt-3">
                        Share your invite code with your partner to connect.
                    </p>
                </div>

                {/* Coming Soon Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { emoji: '📅', label: 'Events' },
                        { emoji: '✅', label: 'Checklists' },
                        { emoji: '💰', label: 'Savings' },
                        { emoji: '💑', label: 'Partner' },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="bg-white rounded-2xl border border-rose-100 p-6 flex flex-col items-center justify-center gap-2 opacity-50"
                        >
                            <span className="text-3xl">{item.emoji}</span>
                            <span className="text-sm font-medium text-gray-600">{item.label}</span>
                            <span className="text-xs text-gray-400">Coming soon</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}