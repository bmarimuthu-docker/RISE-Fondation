-- Create users table with all authentication fields
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar VARCHAR(500),
  role VARCHAR(50) DEFAULT 'student',
  
  -- Email verification
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  verification_token_expire TIMESTAMP,
  
  -- Password reset
  reset_token VARCHAR(255),
  reset_token_expire TIMESTAMP,
  
  -- OAuth
  google_id VARCHAR(255) UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  
  -- Indexes for performance
  CONSTRAINT check_email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create indexes for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_reset_token ON users(reset_token);

-- Create audit log table (optional, for tracking login/signup activities)
CREATE TABLE IF NOT EXISTS auth_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50), -- 'login', 'signup', 'password_reset', 'email_verified'
  ip_address VARCHAR(50),
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auth_logs_user_id ON auth_logs(user_id);
CREATE INDEX idx_auth_logs_created_at ON auth_logs(created_at);
