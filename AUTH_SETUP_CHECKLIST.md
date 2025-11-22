# Authentication System - Setup & Testing Checklist

## Pre-Setup Requirements

- [ ] Node.js v16+ installed (`node --version`)
- [ ] PostgreSQL installed and running
- [ ] Git configured
- [ ] Gmail account with 2FA enabled
- [ ] Google Cloud account (for OAuth - optional)
- [ ] Text editor/IDE (VS Code recommended)

## Backend Setup

### 1. Dependencies Installation
- [ ] Run `npm install nodemailer` in backend directory
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Verify nodemailer in `package.json`
- [ ] Verify all packages: bcryptjs, jsonwebtoken, express-validator

### 2. Database Setup
- [ ] Create PostgreSQL database: `createdb rise_foundation`
- [ ] Create database user: `CREATE USER rise_user WITH PASSWORD '...';`
- [ ] Grant privileges: `ALTER ROLE rise_user CREATEDB;`
- [ ] Run migrations: `psql -U postgres -d rise_foundation -f migrations/001_create_users_table.sql`
- [ ] Verify tables created: `psql -U postgres -d rise_foundation -dt`

### 3. Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `DB_HOST=localhost`
- [ ] Set `DB_NAME=rise_foundation`
- [ ] Set `DB_USER=postgres` (or your user)
- [ ] Set `DB_PASSWORD=your_password`
- [ ] Set `JWT_SECRET` to random 32+ character string
- [ ] Set `GMAIL_USER=your-email@gmail.com`
- [ ] Generate Gmail App Password and set `GMAIL_PASSWORD`
- [ ] Set `FRONTEND_URL=http://localhost:5173` (development)
- [ ] Set `NODE_ENV=development`

### 4. Gmail App Password Setup
- [ ] Go to https://myaccount.google.com
- [ ] Enable 2-Factor Authentication
- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Select "Mail" and "Windows Computer"
- [ ] Copy 16-character password
- [ ] Paste into `GMAIL_PASSWORD` in .env

### 5. Backend Routes Registration
- [ ] Open `backend/app.js` or `backend/server.js`
- [ ] Add: `const authRoutes = require('./routes/auth');`
- [ ] Add: `app.use('/api/auth', authRoutes);`
- [ ] Verify auth routes are registered before starting server

### 6. Backend Testing
- [ ] Run `npm run dev` (or `npm start`)
- [ ] See startup message: "Server running on port 5000"
- [ ] Check console for "Connected to database" message
- [ ] No errors in console
- [ ] Backend ready for testing

## Frontend Setup

### 1. React Router Configuration
- [ ] Open `frontend/src/main.jsx` or main routing file
- [ ] Add import: `import SignUp from './pages/SignUp'`
- [ ] Add import: `import Login from './pages/Login'`
- [ ] Add import: `import VerifyEmail from './pages/VerifyEmail'`
- [ ] Add import: `import ForgotPassword from './pages/ForgotPassword'`
- [ ] Add import: `import ResetPassword from './pages/ResetPassword'`
- [ ] Add routes to router configuration
- [ ] Verify no import errors

### 2. Navigation Setup (Optional)
- [ ] Add links to signup/login in navigation/header
- [ ] Remove hardcoded auth routes if existing
- [ ] Test navigation between pages

### 3. Frontend Testing
- [ ] Run `npm run dev`
- [ ] See message: "Port 5173" (or configured port)
- [ ] Open browser to `http://localhost:5173`
- [ ] No CORS errors in console
- [ ] Ready for testing

## Integration Testing

### Test 1: Signup Flow
- [ ] Navigate to `/signup`
- [ ] See signup form with all fields
- [ ] Enter: First name, Last name, Email, Password, Confirm Password
- [ ] Click "Sign Up"
- [ ] See success message: "Account created! Check your email to verify."
- [ ] Check email inbox for verification email
- [ ] Verify email contains verification link
- [ ] Verify email styling/content is acceptable
- [ ] Check backend logs for "Email sent" message

### Test 2: Email Verification
- [ ] Click verification link in email
- [ ] See page: "Email verified successfully!"
- [ ] Redirected to login page after 3 seconds
- [ ] Alternatively, copy token and paste in form
- [ ] See success message
- [ ] Check database: `SELECT is_verified FROM users WHERE email='...';`
- [ ] Result should be `true`

### Test 3: Login with Unverified Email
- [ ] Create new account (don't verify)
- [ ] Navigate to `/login`
- [ ] Enter email and password
- [ ] Click "Sign In"
- [ ] See error: "Please verify your email before logging in"
- [ ] Verify login is prevented

### Test 4: Login with Verified Email
- [ ] Use previously verified account
- [ ] Navigate to `/login`
- [ ] Enter email and password
- [ ] Click "Sign In"
- [ ] See success message and redirect to dashboard
- [ ] Check localStorage: token should be stored
- [ ] Check browser console: no errors
- [ ] User profile visible in dashboard

### Test 5: Logout
- [ ] From dashboard, click logout button
- [ ] Redirected to login page
- [ ] localStorage cleared
- [ ] Cannot access dashboard without re-login

### Test 6: Wrong Password
- [ ] Go to `/login`
- [ ] Enter correct email, wrong password
- [ ] Click "Sign In"
- [ ] See error: "Invalid email or password"
- [ ] Not redirected (error shown inline)

### Test 7: Wrong Email
- [ ] Go to `/login`
- [ ] Enter non-existent email
- [ ] Click "Sign In"
- [ ] See error: "Invalid email or password"
- [ ] Not redirected

### Test 8: Password Reset - Request
- [ ] Go to `/login`
- [ ] Click "Forgot Password?"
- [ ] Enter registered email
- [ ] Click "Send Reset Link"
- [ ] See message: "Password reset link sent"
- [ ] Check email for reset link
- [ ] Link is valid and not expired

### Test 9: Password Reset - Update
- [ ] Click reset link from email
- [ ] See password reset form
- [ ] Enter new password (8+ chars)
- [ ] Confirm password
- [ ] Click "Reset Password"
- [ ] See success: "Password reset successful"
- [ ] Login with new password
- [ ] Works correctly

### Test 10: Protected Routes
- [ ] Try access `/dashboard` without login
- [ ] Redirected to `/login`
- [ ] Login
- [ ] Access `/dashboard`
- [ ] Works correctly
- [ ] Token in Authorization header

### Test 11: Token Expiration
- [ ] Login and get token
- [ ] Manually set token to invalid value in localStorage
- [ ] Try access protected route
- [ ] See error: "Invalid token"
- [ ] Redirected to login

### Test 12: Form Validation
- [ ] Signup: Try submit with short password (< 8 chars)
- [ ] See error: "Password must be at least 8 characters"
- [ ] Try submit with mismatched passwords
- [ ] See error: "Passwords do not match"
- [ ] Try submit with invalid email
- [ ] See error: "Invalid email format"

### Test 13: Resend Verification Email (Optional)
- [ ] After signup, don't verify
- [ ] Go to `/verify-email`
- [ ] Click "Resend Verification Email"
- [ ] Check email for new verification link
- [ ] New link works

## Google OAuth Testing (Optional)

### Setup Google OAuth
- [ ] Create Google Cloud project
- [ ] Generate OAuth credentials
- [ ] Add authorized domains
- [ ] Add redirect URIs
- [ ] Set environment variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### Test Google Sign-In
- [ ] See "Sign in with Google" button on login page
- [ ] Click button
- [ ] Redirected to Google login
- [ ] Approve permissions
- [ ] Auto-logged in
- [ ] User created in database (if first time)
- [ ] Existing user linked (if account exists)

## Database Verification

### Check User Table
```bash
psql -U postgres -d rise_foundation

-- Verify table structure
\d users

-- Check created user
SELECT * FROM users WHERE email='test@example.com';

-- Check hashed password (should not be readable)
SELECT id, email, password FROM users LIMIT 1;

-- Check verification fields
SELECT id, email, is_verified, verification_token FROM users LIMIT 1;
```

### Verify Data
- [ ] Table exists: `\d users`
- [ ] Columns are correct (21 columns expected)
- [ ] Indexes created: `\di`
- [ ] Users are created with correct data
- [ ] Passwords are hashed (bcrypt format: `$2a$10$...`)
- [ ] Timestamps are correct

## Security Verification

### Password Hashing
- [ ] Select password from database
- [ ] Verify format: `$2a$10$...` (bcrypt format)
- [ ] Not human-readable
- [ ] All user passwords are hashed

### Token Handling
- [ ] Tokens stored in localStorage (frontend)
- [ ] Tokens validated on protected routes (backend)
- [ ] Token expiration enforced
- [ ] Invalid tokens rejected

### Email Verification
- [ ] Tokens generated are random (32+ chars)
- [ ] Tokens expire after 24 hours
- [ ] Used tokens are cleared from database
- [ ] Cannot verify twice with same token

### Password Reset
- [ ] Reset tokens are random (32+ chars)
- [ ] Reset tokens expire after 1 hour
- [ ] Reset tokens cleared after use
- [ ] Password updated after reset

### SQL Injection Prevention
- [ ] All queries use parameterized format ($1, $2, etc.)
- [ ] No string concatenation in queries
- [ ] No direct user input in SQL

## Performance & Load Testing

- [ ] Signup with 100 requests → no errors
- [ ] Multiple concurrent logins → work correctly
- [ ] Database queries execute in < 100ms
- [ ] Email sending doesn't block UI
- [ ] No memory leaks in repeated logins/logouts

## Browser Compatibility Testing

- [ ] Chrome: Works correctly
- [ ] Firefox: Works correctly
- [ ] Safari: Works correctly
- [ ] Edge: Works correctly
- [ ] Mobile browser (iOS Safari, Chrome Mobile): Works correctly

## Documentation Verification

- [ ] README has setup instructions
- [ ] AUTHENTICATION_COMPLETE.md covers all features
- [ ] AUTH_QUICK_REFERENCE.md is accurate
- [ ] GOOGLE_OAUTH_SETUP.md is complete
- [ ] AUTH_COMPLETE_EXAMPLE.md has working code
- [ ] All code examples tested and working

## Deployment Checklist (Production)

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] Security review completed
- [ ] Database backup created
- [ ] .env.production configured
- [ ] JWT_SECRET is strong (32+ random chars)
- [ ] GMAIL credentials verified
- [ ] FRONTEND_URL updated to production domain
- [ ] NODE_ENV set to 'production'

### Deployment
- [ ] Push code to main branch
- [ ] Deploy backend to production
- [ ] Deploy frontend to production
- [ ] Update database migrations on production
- [ ] Test signup flow on production
- [ ] Test login flow on production
- [ ] Test password reset on production
- [ ] Monitor logs for errors
- [ ] Verify HTTPS is enabled
- [ ] Test from different networks/IPs

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check server load
- [ ] Verify email sending works
- [ ] Test with real users
- [ ] Collect feedback
- [ ] Document any issues
- [ ] Plan updates/improvements

## Troubleshooting Checklist

### Backend Won't Start
- [ ] Node version >= 16? → `node --version`
- [ ] Dependencies installed? → `npm install`
- [ ] Database running? → `psql` connects?
- [ ] .env file exists? → Check `backend/.env`
- [ ] Port 5000 available? → Check `lsof -i :5000`
- [ ] DATABASE_URL correct? → Verify in .env

### Email Not Sending
- [ ] GMAIL_USER correct? → Verify email address
- [ ] GMAIL_PASSWORD correct? → Use app password, not Gmail password
- [ ] 2FA enabled? → Check Google account settings
- [ ] App Password generated? → https://myaccount.google.com/apppasswords
- [ ] Nodemailer installed? → Check `npm list nodemailer`
- [ ] Check backend logs → Look for `Email sent` or error messages

### Signup Fails
- [ ] Email valid format? → Check input format
- [ ] Password >= 8 chars? → Password requirement
- [ ] Email already exists? → Try different email
- [ ] Database connected? → Check backend logs
- [ ] CORS enabled? → Check backend config

### Verification Link Not Working
- [ ] Token in URL? → Check link format
- [ ] 24 hours passed? → Token expires after 24 hours
- [ ] FRONTEND_URL correct? → Check verification email
- [ ] Database has token? → `SELECT verification_token FROM users WHERE email='...';`

### Login Fails
- [ ] Email verified? → Must verify before login
- [ ] Correct password? → Password is case-sensitive
- [ ] Account exists? → Check in database
- [ ] Database connected? → Check backend logs

## Final Checks Before Launch

- [ ] [ ] All tests passing (100%)
- [ ] [ ] No console errors
- [ ] [ ] No console warnings
- [ ] [ ] Database backups created
- [ ] [ ] Security review completed
- [ ] [ ] Performance tested
- [ ] [ ] All browsers tested
- [ ] [ ] Mobile tested
- [ ] [ ] Documentation complete
- [ ] [ ] Code committed to git
- [ ] [ ] Team trained on system
- [ ] [ ] Monitoring/logging set up
- [ ] [ ] Backup/recovery plan ready

## Success Criteria - Launch Ready

✅ **Requirements Met:**
- All 13 tests passing
- Database verified
- Security verified
- Email working
- Frontend responsive
- Documentation complete
- Production ready

🎉 **System is ready for production deployment!**

## Support Contact Points

- Backend logs: `npm run dev`
- Database: `psql -U postgres -d rise_foundation`
- Email testing: Check spam folder, check backend console
- Browser console: F12 → Console tab
- Network tab: F12 → Network tab (for API calls)

## Notes

- Keep `.env` file secure (add to `.gitignore`)
- Document any customizations made
- Keep backups of production database
- Monitor server logs regularly
- Plan regular security updates
- Review user feedback monthly
