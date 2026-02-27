import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function RegisterPage() {
    const navigate = useNavigate()
    const register = useAuthStore((state) => state.register)

    const [form, setForm] = useState({
        display_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            await register(form)
            navigate('/dashboard')
        } catch (err) {
            const errors = err.response?.data?.errors
            if (errors) {
                const first = Object.values(errors)[0][0]
                setError(first)
            } else {
                setError('Something went wrong. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-sm border border-rose-100 w-full max-w-md p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-rose-500">Tara 🌸</h1>
                    <p className="text-gray-500 mt-2">Create your account</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Name
                        </label>
                        <input
                            type="text"
                            name="display_name"
                            value={form.display_name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                            placeholder="you@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                            placeholder="Min. 8 characters"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                            placeholder="Repeat password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors mt-2"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-rose-500 hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}