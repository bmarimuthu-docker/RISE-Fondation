import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ isLoggedIn, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            <span>Quantum Rise</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/lessons" className="hover:text-blue-400 transition">Lessons</Link>
            <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
            {isLoggedIn && <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="hover:text-blue-400 transition">Admin</Link>}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="px-4 py-2 text-sm hover:text-blue-400 transition">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm">{user?.firstName || user?.name || 'User'}</span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm hover:text-red-400 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-slate-700 pb-4 space-y-2">
            <Link to="/lessons" className="block px-4 py-2 hover:bg-slate-600 rounded">Lessons</Link>
            <Link to="/contact" className="block px-4 py-2 hover:bg-slate-600 rounded">Contact</Link>
            {isLoggedIn && <Link to="/dashboard" className="block px-4 py-2 hover:bg-slate-600 rounded">Dashboard</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="block px-4 py-2 hover:bg-slate-600 rounded">Admin</Link>}
            <div className="border-t border-slate-600 pt-2 mt-2">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="block px-4 py-2 hover:bg-slate-600 rounded">Login</Link>
                  <Link to="/signup" className="block px-4 py-2 bg-blue-600 rounded">Sign Up</Link>
                </>
              ) : (
                <button onClick={onLogout} className="block w-full text-left px-4 py-2 hover:bg-slate-600 rounded">Logout</button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
