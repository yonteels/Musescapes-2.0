import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="font-mono flex items-center justify-between px-8 py-4 bg-stone-900 text-amber-50">
            
            <h1 className="text-xl font-semibold">
                <Link to ="/">Musescapes</Link>
            </h1>

            <div className="flex gap-6">
                <Link to="/" className="font-semibold hover:scale-105 transition-transform duration-150 inline-block">Home</Link>
                <Link to="/about" className="font-semibold hover:scale-105 transition-transform duration-150 inline-block">About</Link>
                <Link to="/authpage"className="font-semibold hover:scale-105 transition-transform duration-150 inline-block">Login/Sign Up</Link>
                <a className="font-semibold hover:scale-105 transition-transform duration-150 inline-block" href="#contact">Contact</a>
            </div>

        </nav>
    )
}

export default Navbar;