import Navbar from "../Components/Navbar"
import Login from "../Components/login";
import SignUp from "../Components/SignUp";
import { useState } from 'react'

function AuthPage() {
    const [isLoginMode, setIsLoginMode] = useState(true);

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50 bg-white">
                <Navbar />
            </div>
            <div className="h-screen bg-stone-800 flex flex-col items-center justify-center font-mono">
                <div className="w-105 bg-stone-700 rounded-2xl border border-stone-500/40 shadow-xl flex flex-col items-center pt-6 px-8 pb-8">
                    
                    <div className="flex flex-row w-full mb-6 bg-stone-800 rounded-xl p-1">
                        <button
                            onClick={() => setIsLoginMode(true)}
                            className={`flex-1 py-2 rounded-lg text-sm tracking-widest uppercase transition-all duration-200 ${
                                isLoginMode
                                    ? "bg-stone-600 text-stone-100 shadow"
                                    : "text-stone-400 hover:text-stone-200"
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLoginMode(false)}
                            className={`flex-1 py-2 rounded-lg text-sm tracking-widest uppercase transition-all duration-200 ${
                                !isLoginMode
                                    ? "bg-stone-600 text-stone-100 shadow"
                                    : "text-stone-400 hover:text-stone-200"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>
                    {isLoginMode ? <Login /> : <SignUp />}
                </div>
            </div>
        </>
    )
}

export default AuthPage