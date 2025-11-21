const express = require('express')
const router = express.Router()

// In-memory storage for live data (replace with database in production)
let liveStats = {
  totalStudents: 1523,
  activeLessons: 47,
  lessonsCompleted: 156,
  avgRating: 4.8,
}

let activeUsers = [
  { name: 'Alex', courseName: 'Python Basics', timestamp: 'now' },
  { name: 'Beth', courseName: 'Physics', timestamp: '2m ago' },
  { name: 'Chris', courseName: 'Math', timestamp: '1m ago' },
  { name: 'Diana', courseName: 'Chemistry', timestamp: 'now' },
  { name: 'Evan', courseName: 'History', timestamp: '5m ago' },
  { name: 'Fiona', courseName: 'English', timestamp: 'now' },
]

let courseActivity = [
  { courseName: 'Python Basics', action: 'Lesson completed', count: 12, timestamp: 'just now' },
  { courseName: 'Mathematics', action: 'Quiz started', count: 8, timestamp: '2 mins ago' },
  { courseName: 'Physics', action: 'Video watched', count: 15, timestamp: '3 mins ago' },
  { courseName: 'Chemistry', action: 'Exercise completed', count: 5, timestamp: '5 mins ago' },
  { courseName: 'History', action: 'Lesson started', count: 10, timestamp: '7 mins ago' },
]

// GET live statistics
router.get('/statistics/live', (req, res) => {
  // Simulate real-time data changes
  liveStats.totalStudents += Math.floor(Math.random() * 3 - 1)
  liveStats.activeLessons = Math.floor(Math.random() * 30) + 30
  liveStats.lessonsCompleted += Math.floor(Math.random() * 5)
  liveStats.avgRating = Math.min(5, Math.max(4.5, liveStats.avgRating + (Math.random() - 0.5) * 0.1))

  res.json(liveStats)
})

// GET active users
router.get('/users/active', (req, res) => {
  // Simulate user activity changes
  const users = activeUsers.map(user => ({
    ...user,
    timestamp: Math.random() > 0.5 ? 'now' : `${Math.floor(Math.random() * 10) + 1}m ago`,
  }))

  res.json(users)
})

// GET course activity
router.get('/courses/activity', (req, res) => {
  // Simulate activity changes
  const activity = courseActivity.map(item => ({
    ...item,
    count: item.count + Math.floor(Math.random() * 5 - 2),
    timestamp: Math.random() > 0.5 ? 'just now' : `${Math.floor(Math.random() * 10) + 1} mins ago`,
  }))

  res.json(activity)
})

// Server-Sent Events for real-time updates
router.get('/stream/statistics', (req, res) => {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  })

  // Send initial data
  res.write(`data: ${JSON.stringify(liveStats)}\n\n`)

  // Send updates every 3 seconds
  const intervalId = setInterval(() => {
    liveStats.totalStudents += Math.floor(Math.random() * 3 - 1)
    liveStats.activeLessons = Math.floor(Math.random() * 30) + 30
    liveStats.lessonsCompleted += Math.floor(Math.random() * 5)

    res.write(`data: ${JSON.stringify(liveStats)}\n\n`)
  }, 3000)

  // Clean up on disconnect
  req.on('close', () => {
    clearInterval(intervalId)
    res.end()
  })
})

// Stream course activity
router.get('/stream/activity', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  })

  const intervalId = setInterval(() => {
    const activity = courseActivity.map(item => ({
      ...item,
      count: item.count + Math.floor(Math.random() * 5 - 2),
      timestamp: Math.random() > 0.5 ? 'just now' : `${Math.floor(Math.random() * 10) + 1} mins ago`,
    }))

    res.write(`data: ${JSON.stringify(activity)}\n\n`)
  }, 4000)

  req.on('close', () => {
    clearInterval(intervalId)
    res.end()
  })
})

// WebSocket endpoint for bi-directional communication
router.post('/notify/courses', (req, res) => {
  const { courseName, action } = req.body

  if (!courseName || !action) {
    return res.status(400).json({ error: 'courseName and action required' })
  }

  // Add to activity feed
  courseActivity.unshift({
    courseName,
    action,
    count: 1,
    timestamp: 'just now',
  })

  // Keep only last 10 items
  if (courseActivity.length > 10) {
    courseActivity.pop()
  }

  res.json({ success: true, activity: courseActivity })
})

// Update user activity
router.post('/notify/user-activity', (req, res) => {
  const { userId, action, courseName } = req.body

  if (!userId || !action) {
    return res.status(400).json({ error: 'userId and action required' })
  }

  // Log activity or broadcast to all connected clients
  console.log(`User activity: ${userId} - ${action} in ${courseName}`)

  res.json({ success: true, message: 'Activity recorded' })
})

module.exports = router
