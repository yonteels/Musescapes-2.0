import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import AuthPage from './Pages/AuthPage'
import Music from './Pages/Music'
import Explore from './Pages/Explore'
import Notification from './Pages/Notification'
import Collection from './Pages/Collection'
import TopArtist from './Pages/TopArtist'
import GenrePage from './Pages/GenrePage'
import Profile from './Pages/Profile'
import ProtectedRoute from './Components/ProtectedRoute'
import PlaylistPage from './Pages/PlaylistPage'
import TrackListPage from './Pages/TracklistPage'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path = "/authpage" element={<AuthPage />}/>
        <Route path = "/music" element = {<Music/>}>
          <Route path="top50s" element={<TrackListPage type="top50s" />} />
          <Route path="topalbums" element={<TrackListPage type="topalbums" />} />
          <Route path="trendings" element={<TrackListPage type="trendings" />} />
          <Route path = "topartists" element = {<TopArtist/>}/>
        </Route>
        <Route path = "/explore" element = {<Explore/>}/>
        <Route path="/explore/:tag" element={<GenrePage />} />
        <Route path = "/notification" element = {<Notification/>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path = "/collection" element = {<ProtectedRoute><Collection/></ProtectedRoute>}/>
        <Route path="/collection/:id" element={<ProtectedRoute><PlaylistPage/></ProtectedRoute>}/>
      </Routes>

  )
}

export default App