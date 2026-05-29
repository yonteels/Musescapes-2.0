import { useState } from "react"
import { useAuth } from "../Context/AuthContext"
import { useNavigate } from 'react-router-dom'

function Login() {
    
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const { login } = useAuth()

    const navigate = useNavigate()

    const handleLogin = async () => {
        setError('')
        setSuccess('')
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error)
            } else {
                setSuccess('You have been logged in!')
                login(data.user)
                setTimeout(() => navigate('/'), 1500)
            }
        } catch (err) {
            setError('Something went wrong, try again')
        }
    }
    
    return (
        <div className="flex flex-col w-full gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-stone-400 text-xs tracking-widest uppercase">Email/UserName</label>
                <input
                    type="text"
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="bg-stone-800 text-stone-200 rounded-lg px-4 py-2.5 text-sm border border-stone-600 focus:outline-none focus:border-stone-400 placeholder:text-stone-600"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-stone-400 text-xs tracking-widest uppercase">Password</label>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-stone-800 text-stone-200 rounded-lg px-4 py-2.5 text-sm border border-stone-600 focus:outline-none focus:border-stone-400 placeholder:text-stone-600"
                />
            </div>

            <button className="mt-2 w-full py-2.5 bg-stone-500 hover:bg-stone-400 text-stone-100 rounded-lg text-sm tracking-widest uppercase transition-all duration-200"
            onClick={handleLogin}>
                Login
            </button>

            <p className="text-center text-stone-500 text-xs">
                Forgot your password? <span className="text-stone-300 cursor-pointer hover:text-white transition-colors">Reset it</span>
            </p>
        </div>
    )
}

export default Login