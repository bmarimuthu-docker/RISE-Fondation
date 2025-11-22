const jwt = require('jsonwebtoken')
const pool = require('../config/database')

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' })
      }
      req.userId = decoded.id
      req.user = decoded
      next()
    })
  } catch (error) {
    return res.status(401).json({ message: 'Token verification failed', error: error.message })
  }
}

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Admin access required' })
  }
}

// Check if email is verified
const requireEmailVerified = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT is_verified FROM users WHERE id = $1', [req.userId])

    if (result.rows.length === 0 || !result.rows[0].is_verified) {
      return res.status(403).json({ message: 'Please verify your email first' })
    }

    next()
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email status', error: error.message })
  }
}

module.exports = { verifyToken, isAdmin, requireEmailVerified }
