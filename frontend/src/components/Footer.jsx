import React from 'react'
import { Mail, Github, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quantum Rise</h3>
            <p className="text-slate-400 text-sm">Empowering minds, shaping futures with AI-powered education.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/lessons" className="hover:text-blue-400">Lessons</a></li>
              <li><a href="/dashboard" className="hover:text-blue-400">Dashboard</a></li>
              <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400">About</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400">API Docs</a></li>
              <li><a href="#" className="hover:text-blue-400">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <Mail size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <Github size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-8 flex justify-between items-center text-sm text-slate-400">
          <p>&copy; {currentYear} Quantum Rise Foundation. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400">Terms of Service</a>
            <a href="/contact" className="hover:text-blue-400">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
