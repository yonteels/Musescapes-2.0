require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await pool.query("BEGIN");

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [username, email, hashedPassword]
    );

    const user = userResult.rows[0];

    const playlistResult = await pool.query(
      `INSERT INTO playlists (user_id, name, description)
       VALUES ($1, 'Favorites', 'Your liked songs')
       RETURNING *`,
      [user.id]
    );

    await pool.query("COMMIT");

    res.status(201).json({
      message: "User created!",
      user,
      playlist: playlistResult.rows[0],
    });

  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      error: "Email already exists or something went wrong",
    });
  }
});

app.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1 OR email = $1",
    [identifier],
  );
  if (result.rows.length === 0) {
    res.status(500).json({ error: "The Password or Username is incorrect" });
  } else {
    const passwordMatch = await bcrypt.compare(
      password,
      result.rows[0].password_hash,
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    } else {
      res.json({ message: "You have been logged in!", user: result.rows[0] });
    }
  }
});

app.get("/lastfm/topTracks", async (req, res) => {
  try {
    const lastfmResponse = await axios.get(
      "https://ws.audioscrobbler.com/2.0/",
      {
        params: {
          method: "chart.getTopTracks",
          api_key: process.env.LASTFM_API_KEY,
          format: "json",
          limit: 50,
        },
      },
    );

    const tracks = lastfmResponse.data.tracks.track;

    const tracksWithArt = await Promise.all(
      tracks.map(async (track) => {
        try {
          const infoRes = await axios.get(
            "https://ws.audioscrobbler.com/2.0/",
            {
              params: {
                method: "track.getInfo",
                api_key: process.env.LASTFM_API_KEY,
                artist: track.artist.name,
                track: track.name,
                format: "json",
              },
            },
          );
          const albumArt = infoRes.data.track?.album?.image[3]["#text"] || null;
          const album = infoRes.data.track?.album?.title || null; // add this
          return {
            title: track.name,
            artist: track.artist.name,
            listeners: track.listeners,
            albumArt,
            album,
          };
        } catch {
          return {
            title: track.name,
            artist: track.artist.name,
            listeners: track.listeners,
            albumArt: null,
            album: null,
          };
        }
      }),
    );

    res.json(tracksWithArt);
  } catch (err) {
    console.log("LastFM error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});

app.get("/lastfm/topArtists", async (req, res) => {
  try {
    const lastfmResponse = await axios.get(
      "https://ws.audioscrobbler.com/2.0/",
      {
        params: {
          method: "chart.getTopArtists",
          api_key: process.env.LASTFM_API_KEY,
          format: "json",
          limit: 50,
        },
      },
    );

    const artists = await Promise.all(
      lastfmResponse.data.artists.artist.map(async (artist) => {
        try {
          const wikiRes = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artist.name)}`,
            { headers: { "User-Agent": "Musescapes/1.0 (music app)" } },
          );
          return {
            title: artist.name,
            artist: artist.name,
            listeners: artist.listeners,
            playcount: artist.playcount,
            albumArt: wikiRes.data.thumbnail?.source || null,
          };
        } catch {
          return {
            title: artist.name,
            artist: artist.name,
            listeners: artist.listeners,
            playcount: artist.playcount,
            albumArt: null,
          };
        }
      }),
    );

    res.json(artists);
  } catch (err) {
    console.log("LastFM error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch top artists" });
  }
});

app.get("/lastfm/topAlbums", async (req, res) => {
  try {
    const artistRes = await axios.get("https://ws.audioscrobbler.com/2.0/", {
      params: {
        method: "chart.getTopArtists",
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: 50,
      },
    });

    const artists = artistRes.data.artists.artist;

    const albums = await Promise.all(
      artists.map(async (artist) => {
        try {
          const albumRes = await axios.get(
            "https://ws.audioscrobbler.com/2.0/",
            {
              params: {
                method: "artist.getTopAlbums",
                api_key: process.env.LASTFM_API_KEY,
                artist: artist.name,
                format: "json",
                limit: 1,
              },
            },
          );
          const album = albumRes.data.topalbums.album[0];
          return {
            title: album.name,
            artist: artist.name,
            albumArt: album.image[3]["#text"] || null,
          };
        } catch {
          return {
            title: "Unknown",
            artist: artist.name,
            albumArt: null,
          };
        }
      }),
    );

    res.json(albums);
  } catch (err) {
    console.log("LastFM error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch top albums" });
  }
});

app.get("/lastfm/trendingTracks", async (req, res) => {
  try {
    const lastfmResponse = await axios.get(
      "https://ws.audioscrobbler.com/2.0/",
      {
        params: {
          method: "geo.getTopTracks",
          api_key: process.env.LASTFM_API_KEY,
          country: "united states",
          format: "json",
          limit: 50,
        },
      },
    );

    const tracks = await Promise.all(
      lastfmResponse.data.tracks.track.map(async (track) => {
        try {
          const infoRes = await axios.get(
            "https://ws.audioscrobbler.com/2.0/",
            {
              params: {
                method: "track.getInfo",
                api_key: process.env.LASTFM_API_KEY,
                artist: track.artist.name,
                track: track.name,
                format: "json",
              },
            },
          );
          return {
            title: track.name,
            artist: track.artist.name,
            albumArt: infoRes.data.track?.album?.image[3]["#text"] || null,
          };
        } catch {
          return {
            title: track.name,
            artist: track.artist.name,
            albumArt: null,
          };
        }
      }),
    );

    res.json(tracks);
  } catch (err) {
    console.log("LastFM error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch trending tracks" });
  }
});

app.get("/lastfm/tags", async (req, res) => {
  try {
    const response = await axios.get("https://ws.audioscrobbler.com/2.0/", {
      params: {
        method: "tag.getTopTags",
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
      },
    });
    res.json(response.data.toptags.tag);
  } catch (err) {
    console.log("LastFM error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

app.get("/lastfm/tag/:tag/topTracks", async (req, res) => {
  try {
    const response = await axios.get("https://ws.audioscrobbler.com/2.0/", {
      params: {
        method: "tag.getTopTracks",
        api_key: process.env.LASTFM_API_KEY,
        tag: req.params.tag,
        format: "json",
        limit: 50,
      },
    });

    const tracks = await Promise.all(
      response.data.tracks.track.map(async (track) => {
        try {
          const infoRes = await axios.get(
            "https://ws.audioscrobbler.com/2.0/",
            {
              params: {
                method: "track.getInfo",
                api_key: process.env.LASTFM_API_KEY,
                artist: track.artist.name,
                track: track.name,
                format: "json",
              },
            },
          );
          return {
            title: track.name,
            artist: track.artist.name,
            album: infoRes.data.track?.album?.title || null,
            albumArt: infoRes.data.track?.album?.image[3]["#text"] || null,
          };
        } catch {
          return {
            title: track.name,
            artist: track.artist.name,
            album: null,
            albumArt: null,
          };
        }
      }),
    );

    res.json(tracks);
  } catch (err) {
    console.log("LastFM error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch tag tracks" });
  }
});

app.get("/lastfm/tag/:tag/topArtists", async (req, res) => {
  try {
    const response = await axios.get("https://ws.audioscrobbler.com/2.0/", {
      params: {
        method: "tag.getTopArtists",
        api_key: process.env.LASTFM_API_KEY,
        tag: req.params.tag,
        format: "json",
        limit: 10,
      },
    });

    const artists = await Promise.all(
      response.data.topartists.artist.map(async (artist) => {
        try {
          const wikiRes = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artist.name)}`,
            { headers: { "User-Agent": "Musescapes/1.0 (music app)" } },
          );
          return {
            name: artist.name,
            albumArt: wikiRes.data.thumbnail?.source || null,
          };
        } catch {
          return {
            name: artist.name,
            albumArt: null,
          };
        }
      }),
    );

    res.json(artists);
  } catch (err) {
    console.log("LastFM error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch tag artists" });
  }
});

app.post("/createPlayList", async (req, res) => {
  try{
    const { user_id, playlist_name, description } = req.body;

    if (!user_id || !playlist_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO playlists (user_id, name, description) 
       VALUES ($1, $2, $3)
       RETURNING *`, [user_id, playlist_name, description]
    );
      res.status(201).json({
      message: "Added new playlist",
      data: result.rows[0],
    });

  }
  catch (err){
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/addToFavourite", async (req, res) => {
  try {
    const { playlist_id, song_id } = req.body;

    const orderResult = await pool.query(
      `SELECT COALESCE(MAX(track_order), 0) + 1 AS next_order
       FROM playlist_tracks
       WHERE playlist_id = $1`,
      [playlist_id],
    );

    const track_order = orderResult.rows[0].next_order;

    const result = await pool.query(
      `INSERT INTO playlist_tracks (playlist_id, song_id, track_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [playlist_id, song_id, track_order],
    );

    res.status(200).json({
      message: "Added to favourites",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/user/:user_id/playlists", async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `SELECT * FROM playlists WHERE user_id = $1`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/playlist/:id", async (req, res) => {
    try {
        const { id } = req.params
        const playlistRes = await pool.query(`SELECT * FROM playlists WHERE id = $1`, [id])
        const tracksRes = await pool.query(`SELECT * FROM playlist_tracks WHERE playlist_id = $1 ORDER BY track_order`, [id])
        
        // parse song_id back from JSON string
        const tracks = tracksRes.rows.map(row => {
            try {
                return JSON.parse(row.song_id)
            } catch {
                return row
            }
        })

        res.json({ playlist: playlistRes.rows[0], tracks })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error" })
    }
})

app.get("/user/:user_id/favourites", async (req, res) => {
    try {
        const { user_id } = req.params
        const result = await pool.query(
            `SELECT * FROM playlists WHERE user_id = $1 AND name = 'Favorites'`,
            [user_id]
        )
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

app.get("/playlist/:playlist_id/tracks", async (req, res) => {
    try {
        const { playlist_id } = req.params
        const result = await pool.query(
            `SELECT * FROM playlist_tracks WHERE playlist_id = $1`,
            [playlist_id]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

app.delete("/playlist/:playlist_id/track", async (req, res) => {
    try {
        const { playlist_id } = req.params
        const { song_id } = req.body

        await pool.query(
            `DELETE FROM playlist_tracks WHERE playlist_id = $1 AND song_id = $2`,
            [playlist_id, song_id]
        )

        res.json({ message: "Removed from playlist" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error" })
    }
})

  app.delete("/playlist/:playlist_id", async (req,res) => {
    try {
      const {playlist_id} = req.params

      await pool.query(
        ``
      )
    } catch (err){
      console.log(err)
    }
  })


app.listen(5000, () => console.log("Server running on port 5000"));
