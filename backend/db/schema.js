const pool = require('../config/database')

const createTables = async () => {
  try {
    // Users table (auth + profile fields)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        avatar VARCHAR(500),
        role VARCHAR(50) DEFAULT 'student',
        is_verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(255),
        verification_token_expire TIMESTAMP,
        reset_token VARCHAR(255),
        reset_token_expire TIMESTAMP,
        google_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        CONSTRAINT check_email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$')
      )
    `)

    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token)')

    // Lessons table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        discipline VARCHAR(100),
        level VARCHAR(50),
        content TEXT,
        xp_reward INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // User Progress table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        progress INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        xp_earned INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
        UNIQUE(user_id, lesson_id)
      )
    `)

    // Badges table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS badges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(255),
        criteria TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // User Badges table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        badge_id INTEGER NOT NULL,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
        UNIQUE(user_id, badge_id)
      )
    `)

    // AI Tutor Conversations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tutor_conversations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
      )
    `)

    // Auth event log (optional)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS auth_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(50),
        ip_address VARCHAR(50),
        user_agent TEXT,
        success BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query('CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON auth_logs(user_id)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON auth_logs(created_at)')

    console.log('✅ Database tables created successfully')
  } catch (err) {
    console.error('❌ Error creating tables:', err)
  }
}

module.exports = { createTables }
