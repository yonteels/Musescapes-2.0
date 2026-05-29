import Layout from "../Components/Layout";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
function GenrePage() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const color = location.state?.color || "bg-stone-700";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tracksRes, artistsRes] = await Promise.allSettled([
          fetch(`http://localhost:5000/lastfm/tag/${tag}/topTracks`).then((r) =>
            r.json(),
          ),
          fetch(`http://localhost:5000/lastfm/tag/${tag}/topArtists`).then(
            (r) => r.json(),
          ),
        ]);

        if (tracksRes.status === "fulfilled" && Array.isArray(tracksRes.value))
          setTracks(tracksRes.value);
        if (
          artistsRes.status === "fulfilled" &&
          Array.isArray(artistsRes.value)
        )
          setArtists(artistsRes.value);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [tag]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
            <p className="text-stone-500 font-mono text-sm">Loading {tag}...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-amber-50 p-6 space-y-8">
        {/* Banner */}
        <div
          className={`relative w-full h-48 ${color} rounded-2xl flex items-end p-6 overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <span className="text-[150px] font-black text-white select-none capitalize">
              {tag}
            </span>
          </div>
          <div>
            <p className="text-stone-600 text-sm uppercase tracking-widest mb-1">
              Genre
            </p>
            <h1 className="text-4xl font-black text-stone-800 capitalize">
              {tag}
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              Top tracks and artists in {tag}
            </p>
          </div>
          <button
            onClick={() => navigate("/explore")}
            className="absolute top-4 right-4 text-stone-600 hover:text-stone-900 transition-colors text-sm"
          >
            ← Back
          </button>
        </div>

        {/* Top Tracks */}
        <div>
          <h2 className="text-xl font-bold text-stone-800 mb-4">Top Tracks</h2>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <span className="text-stone-400 font-mono w-6 text-right text-sm">
                  {index + 1}
                </span>
                {track.albumArt ? (
                  <img
                    src={track.albumArt}
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-stone-200 flex items-center justify-center shrink-0">
                    <p className="text-stone-400 text-xs">N/A</p>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 truncate">
                    {track.title}
                  </p>
                  <p className="text-sm text-stone-500 truncate">
                    {track.artist}
                  </p>
                </div>
                <span className="text-sm text-stone-400 truncate max-w-32">
                  {track.album}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Artists */}
        <div>
          <h2 className="text-xl font-bold text-stone-800 mb-4">Top Artists</h2>
          <div className="grid grid-cols-5 gap-4">
            {artists.map((artist, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                {artist.albumArt ? (
                  <img
                    src={artist.albumArt}
                    alt={artist.name}
                    className="w-full aspect-square rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square rounded-full bg-stone-200 flex items-center justify-center">
                    <p className="text-stone-400 text-xs">N/A</p>
                  </div>
                )}
                <p className="text-sm font-medium text-stone-800 text-center">
                  {artist.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GenrePage;
