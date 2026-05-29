import Layout from "../Components/Layout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const colors = [
    'bg-pink-200', 'bg-yellow-200', 'bg-red-200', 'bg-purple-200', 'bg-blue-200',
    'bg-orange-200', 'bg-green-200', 'bg-lime-200', 'bg-fuchsia-200', 'bg-amber-200',
    'bg-teal-200', 'bg-cyan-200', 'bg-rose-200', 'bg-indigo-200', 'bg-emerald-200',
    'bg-sky-200', 'bg-violet-200', 'bg-stone-200', 'bg-red-300', 'bg-pink-300',
]

function Explore() {
    const navigate = useNavigate()
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch("http://localhost:5000/lastfm/tags")
                const data = await response.json()
                if (Array.isArray(data)) {setTags(data.slice(0, 50))
                    console.log(data);
                }
                else console.log("Error:", data)
            } catch (err) {
                console.log("Error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchTags()
    }, [])

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin"/>
                        <p className="text-stone-500 font-mono text-sm">Loading categories...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="min-h-screen bg-amber-50 p-6">
                <h1 className="text-2xl font-bold text-stone-800 mb-6">Explore</h1>
                <h2 className="text-lg font-semibold text-stone-700 mb-4">Browse by Category</h2>
                <div className="grid grid-cols-5 gap-4">
                    {tags.map((tag, index) => (
                        <div
                            key={tag.name}
                            onClick={() => navigate(`/explore/${tag.name}`, { state: { color: colors[index % colors.length] } })}
                            className={`${colors[index % colors.length]} cursor-pointer rounded-xl p-6 flex items-end hover:opacity-80 transition-opacity aspect-square`}
                        >
                            <span className="font-bold text-stone-800 text-lg capitalize">{tag.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default Explore