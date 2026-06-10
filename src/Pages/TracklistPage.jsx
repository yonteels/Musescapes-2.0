import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import {
  FaHeart,
  FaRegHeart,
  FaPlus,
  FaCheck,
} from "react-icons/fa";

const PAGE_CONFIG = {
  top50s: {
    label: "Global Top 50",
    subtitle: "The most played songs in the world right now",
    dataKey: "topTracks",
    gradient: "from-stone-900 to-stone-700",
    watermark: "50",
  },
  topalbums: {
    label: "Top Albums",
    subtitle: "The most popular albums right now",
    dataKey: "topAlbum",
    gradient: "from-blue-900 to-stone-700",
    watermark: "Albums",
  },
  trendings: {
    label: "Trending Songs",
    subtitle: "Trending in the US right now",
    dataKey: "trendingTracks",
    gradient: "from-green-900 to-stone-700",
    watermark: "Trending",
  },
};

function TrackListPage({ type }) {
  const context = useOutletContext();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [visibleCount, setVisibleCount] = useState(10);
  const [playlists, setPlaylists] = useState([]);
  const [favouritesPlaylist, setFavouritesPlaylist] = useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useState({});
  const [feedback, setFeedback] = useState("");

  const config = PAGE_CONFIG[type];
  const tracks = context[config.dataKey] || [];

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      const [playlistsRes, favouritesRes] = await Promise.allSettled([
        fetch(`http://localhost:5000/user/${user.id}/playlists`).then((r) =>
          r.json(),
        ),
        fetch(`http://localhost:5000/user/${user.id}/favourites`).then((r) =>
          r.json(),
        ),
      ]);

      if (
        playlistsRes.status === "fulfilled" &&
        Array.isArray(playlistsRes.value)
      ) {
        setPlaylists(playlistsRes.value);
        const songsByPlaylist = {};
        await Promise.all(
          playlistsRes.value.map(async (p) => {
            const res = await fetch(
              `http://localhost:5000/playlist/${p.id}/tracks`,
            );
            const data = await res.json();
            if (Array.isArray(data))
              songsByPlaylist[p.id] = data.map((t) => t.song_id);
          }),
        );
        setPlaylistSongs(songsByPlaylist);
      }

      if (favouritesRes.status === "fulfilled" && favouritesRes.value) {
        setFavouritesPlaylist(favouritesRes.value);
        const res = await fetch(
          `http://localhost:5000/playlist/${favouritesRes.value.id}/tracks`,
        );
        const data = await res.json();
        if (Array.isArray(data)) setFavouriteSongs(data.map((t) => t.song_id));
      }
    };
    fetchData();
  }, [user]);

  const isFavourited = (track) =>
    favouriteSongs.includes(JSON.stringify(track));
  const isInPlaylist = (playlistId, track) =>
    playlistSongs[playlistId]?.includes(JSON.stringify(track));

  const handleHeart = async (track) => {
    if (!user){
      navigate("/authpage")
    }
    if (!favouritesPlaylist || isFavourited(track)) return;
    try {
      await fetch("http://localhost:5000/addToFavourite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlist_id: favouritesPlaylist.id,
          song_id: JSON.stringify(track),
        }),
      });
      setFavouriteSongs((prev) => [...prev, JSON.stringify(track)]);
      setFeedback("Added to Favourites!");
      setTimeout(() => setFeedback(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToPlaylist = async (playlist_id) => {
    if (!user){
      navigate("/authpage")
    }
    if (isInPlaylist(playlist_id, selectedTrack)) return;
    try {
      await fetch("http://localhost:5000/addToFavourite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlist_id,
          song_id: JSON.stringify(selectedTrack),
        }),
      });
      setPlaylistSongs((prev) => ({
        ...prev,
        [playlist_id]: [
          ...(prev[playlist_id] || []),
          JSON.stringify(selectedTrack),
        ],
      }));
      setShowPlaylistModal(false);
      setFeedback("Added to playlist!");
      setTimeout(() => setFeedback(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromPlaylist = async (playlist_id) => {
    try {
      await fetch(`http://localhost:5000/playlist/${playlist_id}/track`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song_id: JSON.stringify(selectedTrack) }),
      });
      setPlaylistSongs((prev) => ({
        ...prev,
        [playlist_id]: prev[playlist_id].filter(
          (s) => s !== JSON.stringify(selectedTrack),
        ),
      }));
      setFeedback("Removed from playlist!");
      setTimeout(() => setFeedback(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    
    <div>
      {/* Banner */}
      <div
        className={`relative w-full h-48 bg-gradient-to-r ${config.gradient} rounded-2xl mb-6 flex items-end p-6 overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <span className="text-[200px] font-black text-white select-none">
            {config.watermark}
          </span>
        </div>
        <div>
          <p className="text-stone-400 text-sm uppercase tracking-widest mb-1">
            Playlist
          </p>
          <h1 className="text-4xl font-black text-amber-50">{config.label}</h1>
          <p className="text-stone-400 text-sm mt-1">{config.subtitle}</p>
        </div>
        <button
          onClick={() => navigate("/music")}
          className="absolute top-4 right-4 text-stone-400 hover:text-amber-50 transition-colors text-sm"
        >
          ← Back
        </button>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div className="fixed bottom-6 right-6 bg-stone-800 text-amber-50 px-4 py-2 rounded-lg text-sm shadow-lg z-50">
          {feedback}
        </div>
      )}

      <p className="text-stone-500 text-sm mb-4">{tracks.length} songs</p>

      <div className="flex items-center gap-4 px-3 pb-2 border-b border-stone-200 text-stone-400 text-xs uppercase tracking-widest">
        <span className="w-6 text-right">#</span>
        <span className="w-10"></span>
        <span className="flex-1">Title</span>
        <span className="text-right">Album</span>
        <span className="w-16"></span>
      </div>

      {tracks.length === 0 ? (
        <p className="text-stone-500 text-center py-4">No songs found</p>
      ) : (
        <>
          {tracks.slice(0, visibleCount).map((track, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-stone-100 transition-colors group"
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
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleHeart(track)}
                  className={`transition-colors ${isFavourited(track) ? "text-red-500 cursor-default" : "text-stone-400 hover:text-red-500"}`}
                  title={
                    isFavourited(track)
                      ? "Already in Favourites"
                      : "Add to Favourites"
                  }
                >
                  {isFavourited(track) ? <FaHeart /> : <FaRegHeart />}
                </button>
                <button
                  onClick={() => {
                    setSelectedTrack(track);
                    setShowPlaylistModal(true);
                  }}
                  className="text-stone-400 hover:text-stone-800 transition-colors"
                  title="Add to Playlist"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          ))}

          {visibleCount < tracks.length && (
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 10, 50))}
              className="w-full py-3 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors text-sm mt-2"
            >
              Show more ({tracks.length - visibleCount} remaining)
            </button>
          )}

          {visibleCount >= tracks.length && tracks.length > 10 && (
            <button
              onClick={() => setVisibleCount(10)}
              className="w-full py-3 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors text-sm mt-2"
            >
              Show less
            </button>
          )}
        </>
      )}

      {/* Playlist modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-bold text-stone-800 mb-1">
              Add to Playlist
            </h2>
            <p className="text-stone-500 text-sm mb-4">
              "{selectedTrack?.title}"
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlists.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-4">
                  No playlists yet — create one in Collection
                </p>
              ) : (
                playlists.map((p) => {
                  const alreadyIn = isInPlaylist(p.id, selectedTrack);
                  return (
                    <button
                      key={p.id}
                      onClick={() =>
                        alreadyIn
                          ? handleRemoveFromPlaylist(p.id)
                          : handleAddToPlaylist(p.id)
                      }
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm flex items-center justify-between ${
                        alreadyIn
                          ? "text-stone-400 bg-stone-50 hover:bg-red-50 hover:text-red-400"
                          : "text-stone-800 hover:bg-stone-100"
                      }`}
                    >
                      <span>{p.name}</span>
                      {alreadyIn && <FaCheck className="text-green-500" />}
                    </button>
                  );
                })
              )}
            </div>
            <button
              onClick={() => setShowPlaylistModal(false)}
              className="mt-4 w-full py-2.5 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackListPage;
