import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import AuthPage from './Pages/AuthPage'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path = "/authpage" element={<AuthPage />}/>
      </Routes>

  )
}

export default App