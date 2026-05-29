import { useOutletContext, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Trending() {
    const { trendingTracks } = useOutletContext()
    const navigate = useNavigate()
    const [visibleCount, setVisibleCount] = useState(10)

    return (
        <div>
            {/* Banner */}
            <div className='relative w-full h-48 bg-gradient-to-r from-red-900 to-stone-700 rounded-2xl mb-6 flex items-end p-6 overflow-hidden'>
                <div className='absolute inset-0 opacity-10 flex items-center justify-center'>
                    <span className='text-[200px] font-black text-white select-none'>Trending</span>
                </div>
                <div>
                    <p className='text-stone-400 text-sm uppercase tracking-widest mb-1'>Playlist</p>
                    <h1 className='text-4xl font-black text-amber-50'>Trending</h1>
                    <p className='text-stone-400 text-sm mt-1'>The most trending songs right now</p>
                </div>
                <button
                    onClick={() => navigate('/music')}
                    className='absolute top-4 right-4 text-stone-400 hover:text-amber-50 transition-colors text-sm'
                >
                    ← Back
                </button>
            </div>

            {/* Track count */}
            <p className='text-stone-500 text-sm mb-4'>{trendingTracks?.length || 0} songs</p>

            {/* Header row */}
            <div className='flex items-center gap-4 px-3 pb-2 border-b border-stone-200 text-stone-400 text-xs uppercase tracking-widest'>
                <span className='w-6 text-right'>#</span>
                <span className='w-10'></span>
                <span className='flex-1'>Title</span>
                <span className='text-right'>Album</span>
            </div>

            {/* Songs */}
            {!trendingTracks || trendingTracks.length === 0 ? (
                <p className='text-stone-500 text-center py-4'>Loading songs...</p>
            ) : (
                <>
                    {trendingTracks.slice(0, visibleCount).map((track, index) => (
                        <div
                            key={index}
                            className='flex items-center gap-4 p-3 rounded-lg hover:bg-stone-100 transition-colors group'
                        >
                            <span className='text-stone-400 font-mono w-6 text-right text-sm'>
                                {index + 1}
                            </span>
                            {track.albumArt ? (
                                <img
                                    src={track.albumArt}
                                    alt={track.title}
                                    className='w-10 h-10 rounded object-cover'
                                />
                            ) : (
                                <div className='w-10 h-10 rounded bg-stone-200 flex items-center justify-center shrink-0'>
                                    <p className='text-stone-400 text-xs'>N/A</p>
                                </div>
                            )}
                            <div className='flex-1 min-w-0'>
                                <p className='font-medium text-stone-800 truncate'>{track.title}</p>
                                <p className='text-sm text-stone-500 truncate'>{track.artist}</p>
                            </div>
                            <span className='text-sm text-stone-400 truncate max-w-32'>{track.album}</span>
                        </div>
                    ))}

                    {visibleCount < trendingTracks.length && (
                        <button
                            onClick={() => setVisibleCount(prev => Math.min(prev + 10, 50))}
                            className='w-full py-3 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors text-sm mt-2'
                        >
                            Show more ({trendingTracks.length - visibleCount} remaining)
                        </button>
                    )}

                    {visibleCount >= trendingTracks.length && trendingTracks.length > 10 && (
                        <button
                            onClick={() => setVisibleCount(10)}
                            className='w-full py-3 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors text-sm mt-2'
                        >
                            Show less
                        </button>
                    )}
                </>
            )}
        </div>
    )
}

export default Trending