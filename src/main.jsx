import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import Toast from './components/Toast.jsx'
import useToastStore from './stores/toastStore.js'

const queryClient = new QueryClient()

function Root() {
    const { toast, hideToast } = useToastStore()

    return (
        <>
            <App />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </>
    )
}

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <Root />
        </QueryClientProvider>
    </BrowserRouter>
)