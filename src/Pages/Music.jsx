import Layout from "../Components/Layout";
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

function Music() {
  const navigate = useNavigate();
  const location = useLocation()
  const [topTracks, setTopTracks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topArtists, setTopArtist] = useState([]);
  const [topAlbum, setTopAlbum] = useState([]);
  const [trendingTracks, setTrendingTrack] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSubPage = location.pathname !== '/music'

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tracksRes, artistsRes, albumsRes, trendingRes] =
          await Promise.allSettled([
            fetch("http://localhost:5000/lastfm/topTracks").then((r) => r.json()),
            fetch("http://localhost:5000/lastfm/topArtists").then((r) => r.json()),
            fetch("http://localhost:5000/lastfm/topAlbums").then((r) => r.json()),
            fetch("http://localhost:5000/lastfm/trendingTracks").then((r) => r.json()),
          ]);

        if (tracksRes.status === "fulfilled" && Array.isArray(tracksRes.value)) setTopTracks(tracksRes.value);
        if (artistsRes.status === "fulfilled" && Array.isArray(artistsRes.value)) setTopArtist(artistsRes.value);
        if (albumsRes.status === "fulfilled" && Array.isArray(albumsRes.value)) setTopAlbum(albumsRes.value);
        if (trendingRes.status === "fulfilled" && Array.isArray(trendingRes.value)) setTrendingTrack(trendingRes.value);
      } catch (err) {
        console.log("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const sections = [
    { id: "top50",      label: "Global Top 50",  route: "/music/top50s",        songs: topTracks },
    { id: "trending",   label: "Trending Songs",  route: "/music/trendings",     songs: trendingTracks },
    { id: "albums",     label: "Top Albums",      route: "/music/topalbums",       songs: topAlbum },
    { id: "newrelease", label: "New Releases",    route: "/music/new-releases", songs: newReleases },
    { id: "artists",    label: "Top Artists",     route: "/music/topartists",      songs: topArtists },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
            <p className="text-stone-500 font-mono text-sm">Loading music...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-amber-50 p-6 space-y-6">
        {isSubPage ? (
          <Outlet context={{ topTracks, trendingTracks, topAlbum, newReleases, topArtists }} />
        ) : (
          sections.map(({ id, label, route, songs }) => (
            <div key={id}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-stone-800">{label}</h2>
                <button
                  onClick={() => navigate(route)}
                  className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
                >
                  See all →
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {songs.slice(0, id === 'artists' ? 10 : 5).map((track, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(route)}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    {track.albumArt ? (
                      <img
                        src={track.albumArt}
                        alt={track.title}
                        className={`w-full object-cover group-hover:opacity-80 transition-opacity ${
                          id === "artists"
                            ? "aspect-square rounded-full"
                            : "aspect-square rounded-lg"
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-full aspect-square bg-stone-200 flex items-center justify-center ${
                          id === "artists" ? "rounded-full" : "rounded-lg"
                        }`}
                      >
                        <p className="text-stone-400 text-xs text-center">No Image</p>
                      </div>
                    )}
                    <p className="mt-2 text-sm font-medium text-stone-800 truncate w-full text-center">
                      {track.title}
                    </p>
                    <p className="text-xs text-stone-500 truncate w-full text-center">
                      {track.artist}
                    </p>
                  </div>
                ))}
                {songs.length === 0 &&
                  Array.from({ length: id === 'artists' ? 10 : 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className={`w-full aspect-square bg-stone-200 ${id === 'artists' ? 'rounded-full' : 'rounded-lg'}`} />
                      <div className="mt-2 h-3 bg-stone-200 rounded w-3/4" />
                      <div className="mt-1 h-3 bg-stone-200 rounded w-1/2" />
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

export default Music;