import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUp() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleSignUp = async () => {
        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error)
            } else {
                setSuccess('Account created successfully! Please Login')

            }
        } catch (err) {
            setError('Something went wrong, try again')
        }
    }

    return (
        <div className="flex flex-col w-full gap-4">

            <div className="flex flex-col gap-1">
                <label className="text-stone-400 text-xs tracking-widest uppercase">Username</label>
                <input
                    type="text"
                    placeholder="Your Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-stone-800 text-stone-200 rounded-lg px-4 py-2.5 text-sm border border-stone-600 focus:outline-none focus:border-stone-400 placeholder:text-stone-600"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-stone-400 text-xs tracking-widest uppercase">Email</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-stone-800 text-stone-200 rounded-lg px-4 py-2.5 text-sm border border-stone-600 focus:outline-none focus:border-stone-400 placeholder:text-stone-600"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-stone-400 text-xs tracking-widest uppercase">Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-stone-800 text-stone-200 rounded-lg px-4 py-2.5 text-sm border border-stone-600 focus:outline-none focus:border-stone-400 placeholder:text-stone-600"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-stone-400 text-xs tracking-widest uppercase">Confirm Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-stone-800 text-stone-200 rounded-lg px-4 py-2.5 text-sm border border-stone-600 focus:outline-none focus:border-stone-400 placeholder:text-stone-600"
                />
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            {success && <p className="text-green-400 text-xs text-center">{success}</p>}

            <button
                onClick={handleSignUp}
                className="mt-2 w-full py-2.5 bg-stone-500 hover:bg-stone-400 text-stone-100 rounded-lg text-sm tracking-widest uppercase transition-all duration-200"
            >
                Sign Up
            </button>
        </div>
    )
}

export default SignUp