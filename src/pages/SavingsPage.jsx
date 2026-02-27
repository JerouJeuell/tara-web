import AppLayout from '../components/AppLayout'

export default function SavingsPage() {
    return (
        <AppLayout>
            <div className="mb-8">
                <h2 className="font-serif italic text-3xl" style={{ color: 'var(--ink)' }}>
                    Savings 💰
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                    Reach your goals together
                </p>
            </div>
            <div className="rounded-2xl p-12 text-center"
                style={{ background: 'var(--card)', border: '1px solid var(--warm)' }}>
                <p className="text-4xl mb-4">💰</p>
                <p className="font-medium" style={{ color: 'var(--ink)' }}>Coming Soon</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                    Savings feature is under construction
                </p>
            </div>
        </AppLayout>
    )
}