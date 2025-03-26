import React, { useEffect } from 'react'
import NavBar from './components/NavBar'
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from "./store/useAuthStore";
import { Loader, LoaderCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {theme, setTheme} = useThemeStore();
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <>
        <div className='flex items-center justify-center h-screen'>
          <LoaderCircle className='size-20 animate-spin' />
        </div>
      </>
    )
  }
  return (
    <div data-theme={theme}>
    <Toaster />

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={<SettingPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <NavBar />
    </div>
  )
}

export default App