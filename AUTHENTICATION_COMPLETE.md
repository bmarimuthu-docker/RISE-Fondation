# Complete Authentication System Guide

## Overview
This guide covers the complete login and signup system with SQL database, email verification, password reset, and Google OAuth integration.

## Features Implemented

### 1. **User Registration (Signup)**
- Create new account with First Name, Last Name, Email, Password
- Password hashing with bcryptjs (10 salt rounds)
- Email verification with token (24-hour expiration)
- Auto-send verification email via Gmail
- JWT token generation upon signup

### 2. **Email Verification**
- Sends verification email with verification link
- Verification token valid for 24 hours
- User can verify email by clicking link
- Email verification required before login
- Resend verification email option

### 3. **Login (Email + Password)**
- Email & password authentication
- Password verification with bcryptjs
- Email must be verified before login
- JWT token generation (7-30 days expiration)
- Last login tracking

### 4. **Google OAuth Signin**
- Sign in with Google account
- Auto-create user if first time
- Auto-link existing user if already registered
- No password required for Google users
- Auto-verified email

### 5. **Password Reset**
- Forgot password email with reset link
- Reset token valid for 1 hour
- Password updated securely with bcryptjs
- Reset token cleared after use

### 6. **Session Management**
- JWT token-based authentication
- Token stored in localStorage (frontend)
- Token verified on protected routes
- User profile retrieval from token

## Database Schema

```sql
CREATE TABLE users (
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
  last_login TIMESTAMP
);
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install bcryptjs jsonwebtoken express-validator nodemailer dotenv
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE rise_foundation;

# Create user
CREATE USER rise_user WITH PASSWORD 'secure_password';

# Grant privileges
ALTER ROLE rise_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE rise_foundation TO rise_user;
```

### 3. Run Database Migrations

```bash
# Run SQL migrations
psql -U rise_user -d rise_foundation -f backend/migrations/001_create_users_table.sql
```

### 4. Configure Gmail for Email Sending

**Option A: Gmail App Password (Recommended for 2FA enabled accounts)**

1. Go to https://myaccount.google.com
2. Enable 2-Factor Authentication
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password
6. Use this as `GMAIL_PASSWORD` in .env

**Option B: Gmail Less Secure App Access**

1. Go to https://myaccount.google.com/lesssecureapps
2. Turn on "Less secure app access"
3. Use your Gmail password as `GMAIL_PASSWORD`

### 5. Environment Variables

Create `.env` file in backend directory:

```env
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rise_foundation
DB_USER=rise_user
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Gmail
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password

# Frontend
FRONTEND_URL=https://quantumrisefoundation.org

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 6. Register Auth Routes

In `backend/server.js` or `backend/app.js`:

```javascript
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
```

### 7. Setup Frontend Routes

Update `frontend/src/main.jsx` or router configuration:

```javascript
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

const routes = [
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <Login /> },
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
]
```

## API Endpoints

### 1. POST `/api/auth/signup`
Create new account

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "message": "Account created! Check your email to verify.",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isVerified": false
  },
  "token": "eyJhbGc..."
}
```

### 2. POST `/api/auth/verify-email`
Verify email with token

**Request:**
```json
{
  "token": "verification-token-from-email"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully! You can now login.",
  "user": {
    "id": 1,
    "email": "john@example.com"
  }
}
```

### 3. POST `/api/auth/login`
Login with email and password

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "avatar": null
  },
  "token": "eyJhbGc..."
}
```

### 4. POST `/api/auth/google-signin`
Sign in with Google

**Request:**
```json
{
  "email": "john@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "googleId": "google-oauth-id",
  "profilePicture": "image-url"
}
```

**Response (200):**
```json
{
  "message": "Google signin successful",
  "user": { ... },
  "token": "eyJhbGc..."
}
```

### 5. POST `/api/auth/forgot-password`
Request password reset

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "If an account exists, a password reset link has been sent"
}
```

### 6. POST `/api/auth/reset-password`
Reset password with token

**Request:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful. You can now login with your new password."
}
```

### 7. GET `/api/auth/me`
Get current user profile

**Request:**
```
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": null,
    "role": "student"
  }
}
```

## Middleware Usage

Use `verifyToken` middleware to protect routes:

```javascript
const { verifyToken, isAdmin, requireEmailVerified } = require('./middleware/auth')

// Protect route
router.get('/protected-route', verifyToken, (req, res) => {
  // req.userId, req.user available
})

// Admin only
router.delete('/admin/users/:id', verifyToken, isAdmin, (req, res) => {
  // Only admins can delete users
})

// Require email verified
router.post('/submit-assignment', verifyToken, requireEmailVerified, (req, res) => {
  // User must verify email first
})
```

## Security Features

1. **Password Hashing**: bcryptjs with 10 salt rounds
2. **Email Tokens**: Cryptographically secure random tokens
3. **Token Expiration**: Email tokens (24h), reset tokens (1h)
4. **SQL Injection Prevention**: Parameterized queries (pool.query with $1, $2...)
5. **JWT Verification**: Token signature validation
6. **Rate Limiting**: Implement in production
7. **HTTPS Only**: Email links use HTTPS
8. **CORS**: Configured to production domain only

## Troubleshooting

### Email not sending
- Check Gmail App Password is correct (16 characters)
- Verify 2FA is enabled for Gmail
- Check GMAIL_USER and GMAIL_PASSWORD in .env
- Check `nodemailer` is installed

### Cannot verify email
- Check email was sent (check spam folder)
- Verify token hasn't expired (24-hour limit)
- Check FRONTEND_URL in .env matches your domain

### Login shows "unverified email"
- Click "Resend Verification Email" button
- Check email inbox and spam folder
- Click verification link in email

### JWT token invalid
- Check JWT_SECRET is same in .env and code
- Verify token hasn't expired
- Check Authorization header format: `Bearer <token>`

### Database connection error
- Verify PostgreSQL is running
- Check DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- Run migrations: `psql -U rise_user -d rise_foundation -f migrations/001_create_users_table.sql`

## Frontend Integration Example

```javascript
// Signup
const handleSignup = async (formData) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  const data = await response.json()
  localStorage.setItem('token', data.token)
  // Redirect to verify-email page
}

// Login
const handleLogin = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await response.json()
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
  // Redirect to dashboard
}

// Get current user
const fetchUser = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await response.json()
  return data.user
}

// Logout
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  // Redirect to login
}
```

## Next Steps

1. Test signup flow
2. Verify email sending works
3. Test login with verified email
4. Test password reset flow
5. Implement Google OAuth (optional)
6. Add rate limiting in production
7. Setup email templates for better design
8. Add user profile management
9. Add two-factor authentication (optional)
10. Setup audit logging for security events

## Support

For issues or questions:
1. Check error messages in browser console
2. Check backend logs with `npm run dev` or `npm start`
3. Verify all .env variables are set correctly
4. Check database is running and accessible
5. Verify Gmail credentials are correct
