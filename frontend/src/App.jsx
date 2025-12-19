import React from 'react'
import { Routes, Route } from "react-router-dom"

import Navbar from './components/Navbar'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import Home from './pages/Home'

const App = () => {



  return (
    <div>
      <Navbar/>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<SignUpPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/settings" element={<SettingsPage/>}/>
      <Route path="/profile" element={<ProfilePage/>}/>
    </Routes>
    </div>

    
  )
}

export default App