const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const pool = require('../config/database')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const router = express.Router()

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD, // Use App Password if 2FA enabled
  },
})

// ==========================================
// SIGNUP - Create New Account
// ==========================================
router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password, firstName, lastName } = req.body

      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      )

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already registered' })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex')
      const verificationTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Create user in database
      const result = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name, verification_token, verification_token_expire, is_verified, role, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, false, 'student', NOW())
         RETURNING id, email, first_name, last_name`,
        [email, hashedPassword, firstName, lastName, verificationToken, verificationTokenExpire]
      )

      const user = result.rows[0]

      // Send verification email
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: '✉️ Verify Your RISE Foundation Account',
        html: `
          <h2>Welcome to RISE Foundation!</h2>
          <p>Hi ${firstName},</p>
          <p>Thank you for signing up. Please verify your email to activate your account.</p>
          <p>
            <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p>Or copy this link: ${verificationUrl}</p>
          <p>This link expires in 24 hours.</p>
          <p>Best regards,<br>RISE Foundation Team</p>
        `,
      }

      await transporter.sendMail(mailOptions)

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '7d' }
      )

      res.status(201).json({
        message: 'Account created! Check your email to verify.',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isVerified: false,
        },
        token,
      })
    } catch (error) {
      console.error('Signup error:', error)
      res.status(500).json({ message: 'Error creating account', error: error.message })
    }
  }
)

// ==========================================
// EMAIL VERIFICATION
// ==========================================
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: 'Verification token required' })
    }

    // Find user with valid token
    const result = await pool.query(
      `SELECT id, email FROM users 
       WHERE verification_token = $1 AND verification_token_expire > NOW()`,
      [token]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token' })
    }

    const user = result.rows[0]

    // Mark email as verified
    await pool.query(
      `UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1`,
      [user.id]
    )

    res.json({
      message: 'Email verified successfully! You can now login.',
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({ message: 'Error verifying email', error: error.message })
  }
})

// ==========================================
// LOGIN - Email & Password
// ==========================================
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      const user = result.rows[0]

      // Check if email is verified
      if (!user.is_verified) {
        return res.status(403).json({
          message: 'Please verify your email before logging in',
          userId: user.id,
        })
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      // Update last login
      await pool.query(
        'UPDATE users SET last_login = NOW() WHERE id = $1',
        [user.id]
      )

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '30d' }
      )

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ message: 'Error logging in', error: error.message })
    }
  }
)

// ==========================================
// GOOGLE OAUTH SIGNIN
// ==========================================
router.post('/google-signin', async (req, res) => {
  try {
    const { email, firstName, lastName, googleId, profilePicture } = req.body

    if (!email || !googleId) {
      return res.status(400).json({ message: 'Email and Google ID required' })
    }

    // Check if user exists
    let result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR google_id = $1',
      [email, googleId]
    )

    let user

    if (result.rows.length > 0) {
      // User exists - update last login
      user = result.rows[0]
      await pool.query(
        'UPDATE users SET last_login = NOW(), google_id = $1, is_verified = true WHERE id = $2',
        [googleId, user.id]
      )
    } else {
      // Create new user
      const createResult = await pool.query(
        `INSERT INTO users (email, first_name, last_name, google_id, avatar, is_verified, role, created_at)
         VALUES ($1, $2, $3, $4, $5, true, 'student', NOW())
         RETURNING id, email, first_name, last_name, avatar, role`,
        [email, firstName || '', lastName || '', googleId, profilePicture || null]
      )
      user = createResult.rows[0]
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '30d' }
    )

    res.json({
      message: 'Google signin successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    })
  } catch (error) {
    console.error('Google signin error:', error)
    res.status(500).json({ message: 'Error with Google signin', error: error.message })
  }
})

// ==========================================
// PASSWORD RESET REQUEST
// ==========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email required' })
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, first_name FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      // Don't reveal if email exists for security
      return res.json({
        message: 'If an account exists, a password reset link has been sent',
      })
    }

    const user = result.rows[0]

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpire = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store token in database
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expire = $2 WHERE id = $3',
      [resetToken, resetTokenExpire, user.id]
    )

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: '🔐 Reset Your Password - RISE Foundation',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${user.first_name},</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <p>
          <a href="${resetUrl}" style="background-color: #ef4444; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>Or copy this link: ${resetUrl}</p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, ignore this email.</p>
        <p>Best regards,<br>RISE Foundation Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)

    res.json({
      message: 'If an account exists, a password reset link has been sent',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Error sending reset email', error: error.message })
  }
})

// ==========================================
// PASSWORD RESET
// ==========================================
router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { token, password } = req.body

      // Find user with valid reset token
      const result = await pool.query(
        `SELECT id, email FROM users 
         WHERE reset_token = $1 AND reset_token_expire > NOW()`,
        [token]
      )

      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired reset token' })
      }

      const user = result.rows[0]

      // Hash new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Update password and clear reset token
      await pool.query(
        `UPDATE users SET password = $1, reset_token = NULL, reset_token_expire = NULL WHERE id = $2`,
        [hashedPassword, user.id]
      )

      res.json({
        message: 'Password reset successful. You can now login with your new password.',
      })
    } catch (error) {
      console.error('Password reset error:', error)
      res.status(500).json({ message: 'Error resetting password', error: error.message })
    }
  }
)

// ==========================================
// GET CURRENT USER
// ==========================================
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key')

    const result = await pool.query(
      'SELECT id, email, first_name, last_name, avatar, role FROM users WHERE id = $1',
      [decoded.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const user = result.rows[0]

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        avatar: user.avatar,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message })
  }
})

module.exports = router
