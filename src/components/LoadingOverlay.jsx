export default function LoadingOverlay({ message = 'Loading...' }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(250,247,242,0.85)', backdropFilter: 'blur(4px)' }}>
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                    style={{ borderColor: 'var(--blush)', borderTopColor: 'transparent' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                    {message}
                </p>
            </div>
        </div>
    )
}