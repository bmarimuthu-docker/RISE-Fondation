const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// ==========================================
// MIDDLEWARE SETUP
// ==========================================

// Security middleware
app.use(helmet())

// CORS Configuration for Production Domain
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://quantumrisefoundation.org',
        'https://www.quantumrisefoundation.org',
        'http://quantumrisefoundation.org',
        'http://www.quantumrisefoundation.org'
      ]
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://localhost',
        'http://127.0.0.1'
      ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
}
app.use(cors(corsOptions))

// HTTP logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ==========================================
// ROUTES
// ==========================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
try {
  app.use('/api/auth', require('./routes/auth'))
  app.use('/api/user', require('./routes/user'))
  app.use('/api/lessons', require('./routes/lessons'))
  app.use('/api/tutor', require('./routes/tutor'))
  app.use('/api/admin', require('./routes/admin'))
  app.use('/api', require('./routes/live'))  // Live data endpoints
  console.log('✅ All routes loaded successfully')
} catch (error) {
  console.warn('⚠️  Warning loading routes:', error.message)
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RISE Foundation AI Tutor API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      user: '/api/user',
      lessons: '/api/lessons',
      tutor: '/api/tutor',
      admin: '/api/admin'
    }
  })
})

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler - must be after all routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    status: 404
  })
})

// Global error handler - must be last
app.use((err, req, res, next) => {
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  })

  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  res.status(status).json({
    status: status,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err : undefined,
    timestamp: new Date().toISOString()
  })
})

// ==========================================
// EXPORTS
// ==========================================

module.exports = app
