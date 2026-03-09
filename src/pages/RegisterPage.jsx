import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import useToastStore from '../stores/toastStore'
import LoadingOverlay from '../components/LoadingOverlay'

export default function RegisterPage() {
    const navigate = useNavigate()
    const { register, token } = useAuthStore()
    const { showToast } = useToastStore()

    const [form, setForm] = useState({
        display_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
    })
    const fields = [
        { name: 'display_name', label: 'Display Name', type: 'text', placeholder: 'Your name' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters' },
        { name: 'password_confirmation', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
    ]
    const checkPasswordStrength = (password) => {
        setPasswordStrength({
            length:    password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number:    /[0-9]/.test(password),
        })
    }
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        if (e.target.name === 'password') {
            checkPasswordStrength(e.target.value)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await register(form)
            showToast('Account created! Welcome to Tara 🌸', 'success')
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
    
    useEffect(() => {
        if (token) navigate('/dashboard', { replace: true })
    }, [token, navigate])



    return (
        <>
            {loading && <LoadingOverlay message="Creating your account..." />}

            <div className="min-h-screen flex items-center justify-center p-6"
                style={{ background: 'var(--cream)' }}>
                <div className="w-full max-w-sm">

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
                        {/* ── Password strength indicator (only after password field) ── */}
                        {field.name === 'password' && form.password.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {[
                                    { key: 'length',    label: 'At least 8 characters' },
                                    { key: 'uppercase', label: 'One uppercase letter' },
                                    { key: 'lowercase', label: 'One lowercase letter' },
                                    { key: 'number',    label: 'One number' },
                                ].map(({ key, label }) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <span className="text-xs"
                                            style={{ color: passwordStrength[key] ? '#16A34A' : '#DC2626' }}>
                                            {passwordStrength[key] ? '✓' : '✕'}
                                        </span>
                                        <span className="text-xs"
                                            style={{ color: passwordStrength[key] ? '#16A34A' : 'var(--muted)' }}>
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* ── Submit button disabled until password valid ── */}
                {(() => {
                    const passwordValid = Object.values(passwordStrength).every(Boolean)
                    return (
                        <button
                            type="submit"
                            disabled={loading || !passwordValid}
                            className="w-full py-3 rounded-xl text-sm font-medium transition-opacity mt-2"
                            style={{
                                background: 'var(--rose)',
                                color: 'white',
                                opacity: (loading || !passwordValid) ? 0.6 : 1,
                                cursor: !passwordValid ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    )
                })()}
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
        </>
    )
}