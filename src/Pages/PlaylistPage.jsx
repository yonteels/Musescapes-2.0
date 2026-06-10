import Layout from "../Components/Layout";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { IoIosRemoveCircleOutline } from "react-icons/io";

function PlaylistPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [confirmTrack, setConfirmTrack] = useState(null); // track pending removal

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/playlist/${id}`);
        const data = await res.json();
        setPlaylist(data.playlist);
        setTracks(data.tracks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  const handleRemoveFromPlaylist = async (track) => {
    try {
      await fetch(`http://localhost:5000/playlist/${playlist.id}/track`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song_id: track.id ?? track }),
      });
      // Remove the track from the displayed list
      setTracks((prev) => prev.filter((t) => t !== track));
      setFeedback("Removed from playlist!");
      setTimeout(() => setFeedback(""), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmTrack(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
            <p className="text-stone-500 font-mono text-sm">
              Loading playlist...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-amber-50 p-6">
        {/* Banner */}
        <div className="relative w-full h-48 bg-gradient-to-r from-stone-900 to-stone-700 rounded-2xl mb-6 flex items-end p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <span className="text-[150px] font-black text-white select-none">
              ♪
            </span>
          </div>
          <div>
            <p className="text-stone-400 text-sm uppercase tracking-widest mb-1">
              Playlist
            </p>
            <h1 className="text-4xl font-black text-amber-50">
              {playlist?.name}
            </h1>
            <p className="text-stone-400 text-sm mt-1">{tracks.length} songs</p>
          </div>
          <button
            onClick={() => navigate("/collection")}
            className="absolute top-4 right-4 text-stone-400 hover:text-amber-50 transition-colors text-sm"
          >
            ← Back
          </button>
        </div>

        {/* Feedback toast */}
        {feedback && (
          <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm text-center">
            {feedback}
          </div>
        )}

        {/* Confirm modal */}
        {confirmTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-stone-800">Remove song?</h2>
              <p className="text-stone-500 text-sm">
                Remove{" "}
                <span className="font-semibold text-stone-700">
                  {confirmTrack.title}
                </span>{" "}
                by{" "}
                <span className="font-semibold text-stone-700">
                  {confirmTrack.artist}
                </span>{" "}
                from this playlist?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmTrack(null)}
                  className="px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemoveFromPlaylist(confirmTrack)}
                  className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-4 px-3 pb-2 border-b border-stone-200 text-stone-400 text-xs uppercase tracking-widest">
          <span className="w-6 text-right">#</span>
          <span className="w-10"></span>
          <span className="flex-1">Title</span>
          <span className="text-right">Artist</span>
          <span className="w-6"></span>
        </div>

        {/* Tracks */}
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-stone-400 text-lg">This playlist is empty</p>
            <p className="text-stone-400 text-sm">
              Add songs from the music page
            </p>
          </div>
        ) : (
          tracks.map((track, index) => (
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
              <span className="text-sm text-stone-400">{track.album}</span>
              <button
                onClick={() => setConfirmTrack(track)}
                className="text-stone-300 hover:text-red-500 transition-colors text-xl"
                title="Remove from playlist"
              >
                <IoIosRemoveCircleOutline />
              </button>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

export default PlaylistPage;