import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function RegisterPage() {
    const navigate = useNavigate()
    const { register, token } = useAuthStore()

    const [form, setForm] = useState({
        display_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    // If already logged in, go straight to dashboard
    useEffect(() => {
        if (token) {
            navigate('/dashboard', { replace: true })
        }
    }, [token, navigate])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

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
                setError(Object.values(errors)[0][0])
            } else {
                setError(err.response?.data?.message ?? 'Something went wrong.')
            }
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { name: 'display_name', label: 'Display Name', type: 'text', placeholder: 'Your name' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters' },
        { name: 'password_confirmation', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--cream)' }}>
            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="text-center mb-10">
                    <h1 className="font-serif italic text-4xl" style={{ color: 'var(--ink)' }}>
                        Tara <span style={{ color: 'var(--gold)' }}>✦</span>
                    </h1>
                    <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Create your account</p>
                </div>

                {error && (
                    <div className="text-sm rounded-xl px-4 py-3 mb-6"
                        style={{ background: '#FEF2F2', color: '#DC2626' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.name}>
                            <label className="block text-xs font-medium mb-1.5"
                                style={{ color: 'var(--ink)' }}>
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={form[field.name]}
                                onChange={handleChange}
                                required
                                placeholder={field.placeholder}
                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                                style={{
                                    background: 'var(--warm)',
                                    border: '1px solid var(--blush)',
                                    color: 'var(--ink)',
                                }}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-medium transition-opacity mt-2"
                        style={{ background: 'var(--rose)', color: 'white', opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--rose)' }}
                        className="font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}