import { useQuery } from '@tanstack/react-query'
import Sidebar from './Sidebar'
import { getMyPartnership } from '../lib/partnerships'
import useAuthStore from '../stores/authStore'

export default function AppLayout({ children }) {
    const token = useAuthStore((state) => state.token)

    const { data } = useQuery({
        queryKey: ['partnership'],
        queryFn: () => getMyPartnership().then(r => r.data),
        enabled: !!token,
        retry: false,
    })

    const partner = data?.partner ?? null

    return (
        <div className="flex min-h-screen" style={{ background: 'var(--cream)' }}>
            <Sidebar partner={partner} />
            <main className="flex-1 ml-60 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}