import React from 'react'
import CourseGrid from '../components/CourseGrid'
import { Search } from 'lucide-react'

export default function Lessons() {
  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Choose from thousands of expertly-crafted courses taught by industry professionals
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-4 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search courses, instructors, topics..."
              className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
        </div>

        {/* Course Grid */}
        <CourseGrid featured={false} />
      </div>
    </div>
  )
}
