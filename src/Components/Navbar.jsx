import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

function Navbar() {
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`)
        }
    }

    return (
        <nav className="font-mono relative flex items-center justify-between px-8 py-4 bg-stone-900 text-amber-50 h-16">
            
            <h1 className="text-xl font-semibold shrink-0">
                <Link to="/">Musescapes</Link>
            </h1>

            <form onSubmit={handleSearch} className="absolute left-1/2 -translate-x-1/2 flex items-center bg-stone-700 rounded-lg px-3 py-2 gap-2 w-156">
                <FiSearch className="text-stone-400 shrink-0"/>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search songs, artists..."
                    className="bg-transparent text-amber-50 placeholder:text-stone-400 text-sm outline-none w-full"
                />
            </form>

            <div className="flex gap-6 shrink-0">
                <Link to="/" className="font-semibold hover:scale-105 transition-transform duration-150 inline-block">Home</Link>
                <Link to="/about" className="font-semibold hover:scale-105 transition-transform duration-150 inline-block">About</Link>
                <Link to="/authpage" className="font-semibold hover:scale-105 transition-transform duration-150 inline-block">Login/Sign Up</Link>
                <a className="font-semibold hover:scale-105 transition-transform duration-150 inline-block" href="#contact">Contact</a>
            </div>

        </nav>
    )
}

export default Navbar;