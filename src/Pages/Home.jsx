import Navbar from "../Components/Navbar"
import { useNavigate } from 'react-router-dom'

function home (){
    const navigate = useNavigate()
    return (
    <>
        {/* Navbar */}
        <div className="fixed top-0 left-0 w-full z-50 bg-white">
            <Navbar/>
        </div>

        <div className ="h-screen flex bg-amber-50 font-mono">
            <div className="w-1/3">
            
            </div>
            <div className="w-1/3 flex flex-col items-center justify-center text-center relative space-y-2">
                <img src ="/logo.png" alt= "Musescapes Logo"/>
                <h1 className="text-2xl">Discover and listen to your favourite music here.</h1>
                <div className="flex flex-row items-center justify-evenly gap-10">
                    <button className="hover:cursor-pointer border rounded-lg px-4 py-2" onClick={() => navigate('/about')}>About Us</button>
                    <button className="hover:cursor-pointer border rounded-lg px-4 py-2"onClick={() => navigate('/authpage')}>Log In</button>
                </div>
            </div>
        </div>
    </>
    )
}
export default home