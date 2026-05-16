import Navbar from "../Components/Navbar"

function about (){
    return (
    <>
        <div className="fixed top-0 left-0 w-full z-50 bg-white">
            <Navbar/>
        </div>

        <div className ="h-screen flex flex-row items-center text-center font-mono">
            <div className="h-screen w-1/3 bg-amber-50 flex flex-col items-center justify-center">
                <img src = "/logo.png" alt= "musescapes Logo"/>   
            </div>

            <div className="h-screen w-2/3 bg-stone-800">
                <div className="h-1/3 text-left flex items-center font-mono text-amber-50 font-black pl-10">
                    <h1 className="text-3xl underline">What is Musescapes?</h1>
                </div>
            </div>

        </div>
    </>
    )
}

export default about