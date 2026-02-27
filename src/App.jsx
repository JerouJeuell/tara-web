import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import EventsPage from './pages/EventsPage'
import ChecklistsPage from './pages/ChecklistsPage'
import SavingsPage from './pages/SavingsPage'
import useAuthStore from './stores/authStore'

export default function App() {
    const token = useAuthStore((state) => state.token)

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/events" element={
                <ProtectedRoute><EventsPage /></ProtectedRoute>
            } />
            <Route path="/checklists" element={
                <ProtectedRoute><ChecklistsPage /></ProtectedRoute>
            } />
            <Route path="/savings" element={
                <ProtectedRoute><SavingsPage /></ProtectedRoute>
            } />

            {/* Catch-all — go to dashboard if logged in, login if not */}
            <Route path="*" element={
                <Navigate to={token ? '/dashboard' : '/login'} replace />
            } />
        </Routes>
    )
}