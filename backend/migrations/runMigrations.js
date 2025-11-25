const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')
const dotenv = require('dotenv')

// Load environment from backend/.env when available
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
})

async function runMigrations() {
  const client = await pool.connect()

  try {
    const migrationsDir = __dirname
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort()

    if (migrationFiles.length === 0) {
      console.log('No migration files found.')
      return
    }

    console.log(`Found ${migrationFiles.length} migration(s)`)

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file)
      const sql = fs.readFileSync(filePath, 'utf8')
      console.log(`Running ${file}...`)
      await client.query(sql)
    }

    console.log('All migrations applied successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations()
