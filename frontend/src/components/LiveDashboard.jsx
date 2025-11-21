import React from 'react'
import { useLiveData } from '../hooks/useLiveData'
import { Activity, Users, TrendingUp, Award } from 'lucide-react'

export default function LiveDashboard() {
  // Fetch live statistics
  const { data: stats, loading: statsLoading } = useLiveData(
    '/api/statistics/live',
    3000 // Update every 3 seconds
  )

  // Fetch active users
  const { data: activeUsers, loading: usersLoading } = useLiveData(
    '/api/users/active',
    5000 // Update every 5 seconds
  )

  // Fetch course activity
  const { data: courseActivity, loading: activityLoading } = useLiveData(
    '/api/courses/activity',
    4000 // Update every 4 seconds
  )

  const defaultStats = {
    totalStudents: 0,
    activeLessons: 0,
    lessonsCompleted: 0,
    avgRating: 0,
  }

  const currentStats = stats || defaultStats

  return (
    <div className="w-full space-y-6">
      {/* Live Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <StatCard
          icon={<Users className="text-blue-400" size={24} />}
          title="Active Students"
          value={currentStats.totalStudents}
          change="+12%"
          loading={statsLoading}
          isLive={true}
        />

        {/* Active Lessons */}
        <StatCard
          icon={<Activity className="text-green-400" size={24} />}
          title="Active Lessons"
          value={currentStats.activeLessons}
          change="+5"
          loading={activityLoading}
          isLive={true}
        />

        {/* Completed Lessons */}
        <StatCard
          icon={<Award className="text-purple-400" size={24} />}
          title="Completed Today"
          value={currentStats.lessonsCompleted}
          change="+28"
          loading={activityLoading}
          isLive={true}
        />

        {/* Avg Rating */}
        <StatCard
          icon={<TrendingUp className="text-pink-400" size={24} />}
          title="Avg Rating"
          value={currentStats.avgRating.toFixed(1)}
          unit="⭐"
          change="+0.2"
          loading={statsLoading}
          isLive={true}
        />
      </div>

      {/* Live Activity Feed */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Course Activity
        </h3>

        {activityLoading ? (
          <div className="text-slate-400">Loading activity...</div>
        ) : courseActivity && courseActivity.length > 0 ? (
          <div className="space-y-3">
            {courseActivity.slice(0, 5).map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition"
              >
                <div className="flex-1">
                  <p className="text-white font-semibold">{activity.courseName}</p>
                  <p className="text-sm text-slate-400">{activity.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-semibold">{activity.count}</p>
                  <p className="text-xs text-slate-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-400">No recent activity</div>
        )}
      </div>

      {/* Live Students */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Students Currently Online
        </h3>

        {usersLoading ? (
          <div className="text-slate-400">Loading users...</div>
        ) : activeUsers && activeUsers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {activeUsers.slice(0, 12).map((user, idx) => (
              <div
                key={idx}
                className="bg-slate-700/50 rounded-lg p-3 text-center hover:bg-slate-700 transition"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>
                <p className="text-white font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-slate-400">{user.courseName}</p>
                <p className="text-xs text-green-400 mt-1">🟢 Online</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-400">No users online</div>
        )}
      </div>
    </div>
  )
}

// Reusable Stat Card Component
function StatCard({ icon, title, value, change, unit = '', loading = false, isLive = false }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600 transition">
          {icon}
        </div>
        {isLive && (
          <span className="flex items-center gap-1 text-xs text-green-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </span>
        )}
      </div>

      <h3 className="text-slate-400 text-sm font-medium mb-2">{title}</h3>

      {loading ? (
        <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
      ) : (
        <>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-white">{value}</span>
            {unit && <span className="text-xl">{unit}</span>}
          </div>
          <p className="text-sm text-green-400">{change} from last hour</p>
        </>
      )}
    </div>
  )
}
