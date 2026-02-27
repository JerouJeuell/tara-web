import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

const navItems = [
    { path: '/dashboard', emoji: '🏠', label: 'Home' },
    { path: '/events',    emoji: '📅', label: 'Events' },
    { path: '/checklists',emoji: '✅', label: 'Checklists' },
    { path: '/savings',   emoji: '💰', label: 'Savings' },
]

export default function Sidebar({ partner }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuthStore()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <aside style={{ background: 'var(--ink)' }} className="w-60 fixed top-0 left-0 bottom-0 flex flex-col z-10">

            {/* Logo */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }} className="px-7 py-8">
                <h1 className="font-serif italic text-2xl" style={{ color: 'var(--blush)' }}>
                    Tara <span style={{ color: 'var(--gold)' }}>✦</span>
                </h1>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>For you & me</p>
            </div>

            {/* Partner Pill */}
            <div className="mx-4 my-5 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {partner ? (
                    <div className="flex items-center gap-3">
                        <div className="flex">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{ background: 'var(--rose)' }}>
                                {user?.display_name?.charAt(0)}
                            </div>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white -ml-2" style={{ background: 'var(--gold)' }}>
                                {partner?.display_name?.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-white font-medium">
                                {user?.display_name} & {partner?.display_name}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>Connected</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{ background: 'var(--rose)' }}>
                            {user?.display_name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs text-white font-medium">{user?.display_name}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>No partner yet</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm mb-1 transition-all text-left"
                            style={{
                                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: isActive ? 'white' : 'rgba(255,255,255,0.45)',
                            }}
                        >
                            <span>{item.emoji}</span>
                            <span>{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* User + Logout */}
            <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-white font-medium">{user?.display_name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--muted)', background: 'rgba(255,255,255,0.06)' }}
                    >
                        Out
                    </button>
                </div>
            </div>

        </aside>
    )
}