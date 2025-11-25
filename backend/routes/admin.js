const express = require('express')
const { verifyToken, isAdmin } = require('../middleware/auth')
const pool = require('../config/database')

const router = express.Router()

// Get all users (admin only)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, role, is_verified, created_at, last_login 
       FROM users 
       ORDER BY created_at DESC`
    )

    res.json({
      users: result.rows.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }))
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Create lesson (admin only)
router.post('/lessons', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, discipline, level, content, xp_reward } = req.body

    const result = await pool.query(
      'INSERT INTO lessons (title, description, discipline, level, content, xp_reward, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
      [title, description, discipline, level, content, xp_reward]
    )

    res.status(201).json({
      message: 'Lesson created',
      lesson: result.rows[0]
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Get analytics (admin only)
router.get('/analytics', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalUsersResult = await pool.query('SELECT COUNT(*) as count FROM users')
    const lessonsResult = await pool.query('SELECT COUNT(*) as count FROM lessons')
    const avgProgressResult = await pool.query('SELECT AVG(progress) as avg_progress FROM user_progress')

    res.json({
      analytics: {
        totalUsers: parseInt(totalUsersResult.rows[0].count),
        totalLessons: parseInt(lessonsResult.rows[0].count),
        averageProgress: Number(avgProgressResult.rows[0].avg_progress) || 0
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
