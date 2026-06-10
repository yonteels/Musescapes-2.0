import Layout from "../Components/Layout";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoMdAddCircleOutline } from "react-icons/io";

function Collection() {
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        if (!user?.id) return;
        const res = await fetch(
          `http://localhost:5000/user/${user.id}/playlists`,
        );
        const data = await res.json();
        setPlaylists(data);
      } catch (err) {
        console.error("Failed to fetch playlists:", err);
      }
    };
    fetchAll();
  }, [user]);

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      setError("Please enter a playlist name");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/createPlayList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          playlist_name: playlistName.trim(),
          description: "",
        }),
      });
      const data = await res.json();
      setPlaylists((prev) => [...prev, data.data]);
      setShowModal(false);
      setPlaylistName("");
      setError("");
      navigate(`/collection/${data.data.id}`);
    } catch (err) {
      setError("Failed to create playlist");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-amber-50 p-6">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Collection</h1>
        <div className="grid grid-cols-5 gap-4">
                    <div
            onClick={() => setShowModal(true)}
            className="cursor-pointer rounded-xl aspect-square bg-stone-700 flex flex-col items-center justify-between p-4 hover:opacity-80 transition-all text-stone-300 hover:text-white"
          >
            <div className="flex-1 flex items-center justify-center">
              <IoMdAddCircleOutline className="text-5xl" />
            </div>
            <div className="text-sm">Create New Playlist</div>
          </div>
          {playlists.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/collection/${p.id}`)}
              className="cursor-pointer rounded-xl p-6 flex items-end hover:opacity-80 transition-opacity aspect-square bg-stone-700 text-white"
            >
              {p.name}
            </div>
          ))}

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-bold text-stone-800 mb-4">
              Create New Playlist
            </h2>
            <input
              type="text"
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
              className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-stone-500 mb-3"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPlaylistName("");
                  setError("");
                }}
                className="flex-1 py-2.5 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                className="flex-1 py-2.5 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors text-sm"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Collection;
