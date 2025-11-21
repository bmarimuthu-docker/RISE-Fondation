import React, { useState } from 'react'
import { Star, Users, Clock, TrendingUp } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: 'Mathematics Fundamentals',
    description: 'Master basic math concepts with interactive lessons',
    category: 'Math',
    level: 'Beginner',
    rating: 4.8,
    students: 12500,
    lessons: 45,
    image: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    progress: 65,
    tags: ['Algebra', 'Geometry', 'Calculus']
  },
  {
    id: 2,
    title: 'Physics for Everyone',
    description: 'Understand the laws of motion and energy',
    category: 'Science',
    level: 'Intermediate',
    rating: 4.7,
    students: 8300,
    lessons: 38,
    image: 'bg-gradient-to-br from-purple-500 to-pink-500',
    progress: 42,
    tags: ['Mechanics', 'Thermodynamics', 'Waves']
  },
  {
    id: 3,
    title: 'Chemistry Essentials',
    description: 'Explore the building blocks of matter',
    category: 'Science',
    level: 'Beginner',
    rating: 4.9,
    students: 9800,
    lessons: 52,
    image: 'bg-gradient-to-br from-green-500 to-emerald-500',
    progress: 28,
    tags: ['Atoms', 'Reactions', 'Elements']
  },
  {
    id: 4,
    title: 'English Literature',
    description: 'Discover timeless works and writing techniques',
    category: 'Language',
    level: 'Intermediate',
    rating: 4.6,
    students: 6200,
    lessons: 35,
    image: 'bg-gradient-to-br from-amber-500 to-orange-500',
    progress: 0,
    tags: ['Classics', 'Modern', 'Poetry']
  },
  {
    id: 5,
    title: 'History & Civilization',
    description: 'Learn about pivotal moments that shaped our world',
    category: 'History',
    level: 'Beginner',
    rating: 4.7,
    students: 7100,
    lessons: 60,
    image: 'bg-gradient-to-br from-red-500 to-pink-500',
    progress: 18,
    tags: ['World', 'Modern', 'Ancient']
  },
  {
    id: 6,
    title: 'Computer Science',
    description: 'Coding, algorithms, and data structures',
    category: 'Technology',
    level: 'Advanced',
    rating: 4.9,
    students: 14200,
    lessons: 78,
    image: 'bg-gradient-to-br from-indigo-500 to-purple-500',
    progress: 85,
    tags: ['Python', 'JavaScript', 'Data Structures']
  }
]

export default function CourseGrid({ featured = false }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const categories = ['All', 'Math', 'Science', 'Language', 'History', 'Technology']
  const displayCourses = featured ? courses.slice(0, 3) : selectedCategory === 'All' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory)

  return (
    <div className="w-full">
      {/* Category Filter */}
      {!featured && (
        <div className="mb-12 flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCourses.map(course => (
          <div
            key={course.id}
            className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-2"
          >
            {/* Course Image */}
            <div className={`h-40 ${course.image} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-blue-300">
                {course.level}
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <h3 className="font-bold text-lg text-white mb-2 group-hover:text-blue-400 transition">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{course.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {course.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-block bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Progress Bar (if enrolled) */}
              {course.progress > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span className="text-xs font-semibold text-blue-400">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-700">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                    <Star size={16} fill="currentColor" />
                    <span className="font-semibold text-sm">{course.rating}</span>
                  </div>
                  <p className="text-xs text-slate-400">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                    <Users size={16} />
                    <span className="font-semibold text-sm">{(course.students / 1000).toFixed(1)}K</span>
                  </div>
                  <p className="text-xs text-slate-400">Students</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                    <Clock size={16} />
                    <span className="font-semibold text-sm">{course.lessons}</span>
                  </div>
                  <p className="text-xs text-slate-400">Lessons</p>
                </div>
              </div>

              {/* Enroll Button */}
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
                {course.progress > 0 ? 'Continue Learning' : 'Enroll Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
