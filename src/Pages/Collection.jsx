import Layout from "../Components/Layout";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { IoMdAddCircleOutline } from "react-icons/io";
function Collection() {
  const [playlists, setPlaylists] = useState([]);
  const { user } = useAuth();

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

  console.log(user);

  return (
    <Layout>
      <div className="min-h-screen bg-amber-50 p-6">
        <h1 className="text-2xl font-bold text-stone-800">Collection</h1>
        <div className="grid grid-cols-5 gap-4">
          {playlists.map((p) => (
            <div
              key={p.id}
              // onClick={}
              className={`cursor-pointer rounded-xl p-6 flex items-end hover:opacity-80 transition-opacity aspect-square bg-stone-700 text-white`}
            >
              {p.name}
            </div>
          ))}
          <div className="cursor-pointer rounded-xl aspect-square bg-stone-700 flex flex-col items-center justify-between p-4 hover:opacity-80  transition-all text-stone-300 hover:text-white">
            <div className="flex-1 flex items-center justify-center">
              <IoMdAddCircleOutline className="text-5xl" />
            </div>

            <div className="text-sm  ">Create New Playlist</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Collection;
