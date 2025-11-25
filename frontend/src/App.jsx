import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Lessons from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import NotFound from './pages/NotFound'
import Contact from './pages/Contact'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white flex flex-col">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        <main className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
              <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/login" />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/lessons/:lessonId" element={<LessonDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={isLoggedIn && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
