import Navbar from "./navbar"
import Sidebar from "./Sidebar"

function Layout({ children }) {
    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50 bg-white">
                <Navbar />
            </div>
            <div className="flex pt-16 min-h-screen">
                <Sidebar />
                <main className="ml-64 w-full">
                    {children}
                </main>
            </div>
        </>
    )
}
export default Layout