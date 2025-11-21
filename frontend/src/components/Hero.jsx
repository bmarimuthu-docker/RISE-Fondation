import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, BookOpen, Users, Award } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/50 rounded-full px-4 py-2 w-fit">
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-sm text-purple-300">Welcome to the future of learning</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Learn with{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI-Powered
                </span>
                {' '}Lessons
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed">
                RISE Foundation offers personalized, interactive learning experiences powered by advanced AI. Master any subject with our adaptive tutoring system.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/lessons"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
              >
                Start Learning
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all border border-slate-600"
              >
                Create Free Account
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-700">
              <div>
                <div className="text-3xl font-bold text-blue-400">50K+</div>
                <div className="text-sm text-slate-400">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">1000+</div>
                <div className="text-sm text-slate-400">Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400">99%</div>
                <div className="text-sm text-slate-400">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
              {/* Card mockup */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-white" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Interactive Lessons</h3>
                    <p className="text-sm text-slate-400">Learn at your own pace with step-by-step guidance</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-6 border-t border-slate-700">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Users className="text-white" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">AI Tutor</h3>
                    <p className="text-sm text-slate-400">Get personalized help whenever you need it</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-6 border-t border-slate-700">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Award className="text-white" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Progress Tracking</h3>
                    <p className="text-sm text-slate-400">Earn badges and certificates as you progress</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 shadow-xl max-w-xs transform hover:scale-105 transition">
              <p className="text-white font-semibold mb-2">🎓 Join thousands learning today</p>
              <p className="text-sm text-purple-100">Start your journey to mastery with AI-powered education</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
