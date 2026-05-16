import { createContext, useContext, useState } from 'react'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const cookie = Cookies.get('user')
        return cookie ? JSON.parse(cookie) : null
    })

    const login = (userData) => {
        Cookies.set('user', JSON.stringify(userData), { expires: 30 })
        setUser(userData)
    }

    const logout = () => {
        Cookies.remove('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}