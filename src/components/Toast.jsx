import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    const styles = {
        success: { background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' },
        error:   { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' },
        info:    { background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE' },
    }

    const icons = {
        success: '✓',
        error:   '✕',
        info:    'ℹ',
    }

    return (
        <div
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
            style={styles[type]}
        >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: styles[type].color }}>
                {icons[type]}
            </span>
            {message}
            <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 text-xs">
                ✕
            </button>
        </div>
    )
}