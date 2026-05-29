import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import AuthPage from './Pages/AuthPage'
import Music from './Pages/Music'
import Explore from './Pages/Explore'
import Notification from './Pages/Notification'
import Collection from './Pages/Collection'
import Top50 from './Pages/Top50'
import Trending from './Pages/Trending'
import TopAlbum from './Pages/TopAlbum'
import TopArtist from './Pages/TopArtist'
import GenrePage from './Pages/GenrePage'
import Profile from './Pages/Profile'
import ProtectedRoute from './Components/ProtectedRoute'
function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path = "/authpage" element={<AuthPage />}/>
        <Route path = "/music" element = {<Music/>}>
          <Route path = "top50s" element = {<Top50/>}/>
          <Route path = "trending" element = {<Trending/>}/>
          <Route path = "topalbums" element = {<TopAlbum/>}/>
          <Route path = "topartists" element = {<TopArtist/>}/>
        </Route>
        <Route path = "/explore" element = {<Explore/>}/>
        <Route path="/explore/:tag" element={<GenrePage />} />
        <Route path = "/notification" element = {<Notification/>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path = "/collection" element = {<ProtectedRoute><Collection/></ProtectedRoute>}/>
      </Routes>

  )
}

export default App