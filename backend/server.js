const dotenv = require('dotenv')
const app = require('./app')

// Load environment variables
dotenv.config()

// ==========================================
// SERVER STARTUP
// ==========================================

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || '0.0.0.0'
const dbConfigured =
  process.env.DATABASE_URL ||
  (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER)

const server = app.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════╗
║   RISE Foundation AI Tutor Backend     ║
╚════════════════════════════════════════╝

🚀 Server is running!

   📍 Address: http://${HOST}:${PORT}
   🏗️  Environment: ${process.env.NODE_ENV || 'development'}
   💾 Database: ${dbConfigured ? 'Configured' : 'Not configured'}
   🔑 API Key: ${process.env.OPENAI_API_KEY ? 'Set' : 'Not configured'}

🔗 Endpoints:
   • Health Check: http://${HOST}:${PORT}/health
   • API Base: http://${HOST}:${PORT}/api
   • Root: http://${HOST}:${PORT}/

⚠️  Make sure to configure these environment variables:
   - NODE_ENV
   - DATABASE_URL
   - OPENAI_API_KEY
   - CORS_ORIGIN
  `)
})

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('⏹️  SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('✅ HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('⏹️  SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('✅ HTTP server closed')
    process.exit(0)
  })
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

module.exports = server
