import { useNavigate } from 'react-router-dom'
import Layout from '../Components/Layout'

function home (){
    const navigate = useNavigate()
    return (
    <>
        <Layout>
        <div className ="h-[calc(100vh-64px)]  flex justify-center bg-amber-50 font-mono">
            <div className="w-1/3 flex flex-col items-center justify-center text-center relative space-y-2">
                <img src ="/logo.png" alt= "Musescapes Logo"/>
                <h1 className="text-2xl font-bold">Discover and listen to your favourite music here.</h1>
                <div className="flex flex-row items-center justify-evenly gap-10 m-2">
                    <button className="hover:cursor-pointer font-black border-2 rounded-lg px-4 py-2" onClick={() => navigate('/about')}>About Us</button>
                    <button className="hover:cursor-pointer font-black border-2 rounded-lg px-4 py-2" onClick={() => navigate('/authpage')}>Log In</button>
                </div>
            </div>
        </div>
        </Layout>
    </>
    )
}
export default home