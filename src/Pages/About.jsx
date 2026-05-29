import Layout from "../Components/Layout"

function About() {
    return (
        <Layout>
            <div className="h-[calc(100vh-64px)] flex bg-amber-50 font-mono">
                <div className="w-1/3 flex items-center justify-center bg-amber-50">
                    <img src="/logo.png" alt="Musescapes Logo"/>
                </div>

                <div className="w-2/3 bg-stone-800 flex flex-col">
                    <div className="h-1/3 flex items-center pl-10">
                        <h1 className="text-3xl underline text-amber-50 font-black">What is Musescapes?</h1>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default About