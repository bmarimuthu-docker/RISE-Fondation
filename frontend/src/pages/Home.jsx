import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import CourseGrid from '../components/CourseGrid'
import { Zap, Target, Lightbulb, BarChart3, MessageSquare } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <Hero />

      {/* Featured Courses Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Start with our most popular courses and join thousands of learners worldwide
            </p>
          </div>
          
          <CourseGrid featured={true} />
          
          <div className="text-center mt-12">
            <Link
              to="/lessons"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              View All Courses →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose RISE Foundation?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Experience the next generation of online education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-xl p-8 transition-all hover:shadow-lg hover:shadow-blue-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Learning</h3>
              <p className="text-slate-400 leading-relaxed">
                Get personalized lessons that adapt to your learning style and pace. Our AI tutor provides real-time feedback and guidance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-slate-800 border border-slate-700 hover:border-purple-500 rounded-xl p-8 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Target className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Structured Learning Path</h3>
              <p className="text-slate-400 leading-relaxed">
                Follow carefully designed curricula that take you from beginner to expert. Each course builds on previous knowledge systematically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-slate-800 border border-slate-700 hover:border-green-500 rounded-xl p-8 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Progress</h3>
              <p className="text-slate-400 leading-relaxed">
                Track your progress with detailed analytics. Get insights into your strengths and areas for improvement with visual dashboards.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-slate-800 border border-slate-700 hover:border-yellow-500 rounded-xl p-8 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Lightbulb className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Interactive Content</h3>
              <p className="text-slate-400 leading-relaxed">
                Learn through videos, quizzes, coding challenges, and interactive simulations. Make learning engaging and fun.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-slate-800 border border-slate-700 hover:border-red-500 rounded-xl p-8 transition-all hover:shadow-lg hover:shadow-red-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <MessageSquare className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">24/7 AI Support</h3>
              <p className="text-slate-400 leading-relaxed">
                Get answers to your questions anytime. Our AI tutor is available 24/7 to help you overcome challenges and understand concepts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl p-8 transition-all hover:shadow-lg hover:shadow-indigo-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Certification Program</h3>
              <p className="text-slate-400 leading-relaxed">
                Earn recognized certificates upon course completion. Showcase your achievements and boost your professional profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '500K+', label: 'Active Learners' },
              { number: '5000+', label: 'Expert Instructors' },
              { number: '2000+', label: 'Courses' },
              { number: '95%', label: 'Completion Rate' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-8 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of learners who are already achieving their goals with RISE Foundation. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 inline-block"
            >
              Start Free Trial
            </Link>
            <Link
              to="/lessons"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all border border-slate-700 inline-block"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
