const express = require('express')
const { verifyToken } = require('../middleware/auth')
const pool = require('../config/database')

const router = express.Router()

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, avatar, role, is_verified, created_at, last_login 
       FROM users WHERE id = $1`,
      [req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const user = result.rows[0]

    // Get user stats
    const statsResult = await pool.query(
      `SELECT 
         COALESCE(SUM(xp_earned), 0) AS total_xp, 
         COUNT(*) FILTER (WHERE completed) AS lessons_completed
       FROM user_progress 
       WHERE user_id = $1`,
      [req.userId]
    )

    const stats = statsResult.rows[0] || {}

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.is_verified,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      totalXP: Number(stats.total_xp) || 0,
      lessonsCompleted: Number(stats.lessons_completed) || 0,
      streak: 7 // TODO: Calculate from actual data
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, avatar } = req.body

    const result = await pool.query(
      `UPDATE users 
       SET 
         first_name = COALESCE($1, first_name),
         last_name = COALESCE($2, last_name),
         avatar = COALESCE($3, avatar),
         updated_at = NOW()
       WHERE id = $4 
       RETURNING id, email, first_name, last_name, avatar, role, is_verified, created_at, last_login`,
      [firstName, lastName, avatar, req.userId]
    )

    res.json({
      message: 'Profile updated',
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        avatar: result.rows[0].avatar,
        role: result.rows[0].role,
        isVerified: result.rows[0].is_verified,
        createdAt: result.rows[0].created_at,
        lastLogin: result.rows[0].last_login
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
