import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";

import { Loader } from "lucide-react";
import Navbar from './components/Navbar'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import Home from './pages/Home'
import { useAuthStore } from './store/useAuthStore'
import {Toaster} from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore';


const App = () => {

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const { theme } = useThemeStore();


  console.log(authUser);
if (isCheckingAuth) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  );
}


  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
      <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
    </Routes>
    <Toaster/>
    </div>

    
  )
}

export default App