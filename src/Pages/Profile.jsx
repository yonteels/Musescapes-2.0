import Layout from '../Components/Layout'
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'

function Profile() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        navigate('/')
        logout()
    }

    return (
        <Layout>
            <div className='min-h-screen bg-amber-50 p-6'>
                
                {/* Banner */}
                <div className='relative w-full h-48 bg-gradient-to-r from-stone-900 to-stone-700 rounded-2xl mb-6 flex items-end p-6 overflow-hidden'>
                    <div className='absolute inset-0 opacity-10 flex items-center justify-center'>
                        <span className='text-[200px] font-black text-white select-none'>P</span>
                    </div>
                    <div>
                        <p className='text-stone-400 text-sm uppercase tracking-widest mb-1'>Account</p>
                        <h1 className='text-4xl font-black text-amber-50'>Profile</h1>
                    </div>
                </div>

                {/* Profile card */}
                <div className='bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex items-center gap-6 mb-6'>
                    <FaUserCircle className='text-8xl text-stone-300'/>
                    <div>
                        <h2 className='text-2xl font-bold text-stone-800'>{user?.username}</h2>
                        <p className='text-stone-500'>{user?.email}</p>
                    </div>
                </div>

                {/* Info cards */}
                <div className='grid grid-cols-3 gap-4 mb-6'>
                    <div className='bg-white rounded-2xl p-6 shadow-sm border border-stone-200'>
                        <p className='text-stone-400 text-xs uppercase tracking-widest mb-1'>Username</p>
                        <p className='text-stone-800 font-semibold'>{user?.username}</p>
                    </div>
                    <div className='bg-white rounded-2xl p-6 shadow-sm border border-stone-200'>
                        <p className='text-stone-400 text-xs uppercase tracking-widest mb-1'>Email</p>
                        <p className='text-stone-800 font-semibold'>{user?.email}</p>
                    </div>
                    <div className='bg-white rounded-2xl p-6 shadow-sm border border-stone-200'>
                        <p className='text-stone-400 text-xs uppercase tracking-widest mb-1'>Member Since</p>
                        <p className='text-stone-800 font-semibold'>
                            {user?.created_at 
                                ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                                : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className='bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-3'>
                    <h3 className='text-stone-800 font-semibold mb-4'>Account Actions</h3>
                    <button
                        onClick={handleLogout}
                        className='w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-semibold'
                    >
                        Log Out
                    </button>
                </div>

            </div>
        </Layout>
    )
}

export default Profile