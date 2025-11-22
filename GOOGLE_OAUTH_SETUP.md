# Google OAuth Sign-In Setup Guide

## Overview
This guide explains how to implement Google Sign-In for your RISE Foundation application.

## Prerequisites
- Google Cloud Account (free)
- Project created in Google Cloud Console
- Frontend and backend set up

## Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "Select a Project" → "New Project"
3. Name: "RISE Foundation"
4. Click "Create"
5. Wait for project creation (1-2 minutes)

## Step 2: Enable Google+ API

1. In Google Cloud Console, go to "APIs & Services"
2. Click "Enable APIs and Services"
3. Search for "Google+ API"
4. Click "Google+ API"
5. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "Credentials" in left menu
2. Click "Create Credentials" → "OAuth client ID"
3. First time? Click "Configure OAuth consent screen"

### Configure OAuth Consent Screen

1. **User Type**: Select "External" (or Internal if using workspace email)
2. Click "Create"
3. Fill in:
   - **App name**: "RISE Foundation"
   - **User support email**: your-email@gmail.com
   - **Developer contact**: your-email@gmail.com
4. Click "Save and Continue"
5. **Scopes**: Click "Add or Remove Scopes"
   - Search and select: `userinfo.email`, `userinfo.profile`
   - Click "Update"
6. Click "Save and Continue"
7. Click "Save and Continue" (Test users screen)
8. Add test users if needed
9. Click "Back to Dashboard"

### Create OAuth Credentials

1. Go back to "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. **Application type**: Select "Web application"
4. **Name**: "RISE Foundation Web"
5. **Authorized JavaScript origins**: Add:
   - `http://localhost:5173` (development)
   - `http://localhost:3000` (if using different port)
   - `https://quantumrisefoundation.org` (production)
6. **Authorized redirect URIs**: Add:
   - `http://localhost:5173/api/auth/google/callback`
   - `https://quantumrisefoundation.org/api/auth/google/callback`
7. Click "Create"
8. Copy the Client ID and Client Secret

## Step 4: Backend Setup

### Install Dependencies

```bash
npm install passport passport-google-oauth20 express-session
```

### Add to .env

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your-session-secret-key
```

### Create Google Passport Strategy

Create `backend/config/google-passport.js`:

```javascript
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Profile contains: id, displayName, emails, photos
        const userInfo = {
          email: profile.emails[0].value,
          firstName: profile.given_name || profile.name?.givenName,
          lastName: profile.family_name || profile.name?.familyName,
          googleId: profile.id,
          profilePicture: profile.photos?.[0]?.value,
        }

        return done(null, userInfo)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

module.exports = passport
```

### Add Google Routes

Create `backend/routes/google-auth.js`:

```javascript
const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')
const router = express.Router()

// Initiate Google login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

// Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const { email, firstName, lastName, googleId, profilePicture } = req.user

      // Find or create user
      let result = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR google_id = $1',
        [email, googleId]
      )

      let user

      if (result.rows.length > 0) {
        user = result.rows[0]
        // Update last login and google_id
        await pool.query(
          'UPDATE users SET last_login = NOW(), google_id = $1, is_verified = true WHERE id = $2',
          [googleId, user.id]
        )
      } else {
        // Create new user
        const createResult = await pool.query(
          `INSERT INTO users (email, first_name, last_name, google_id, avatar, is_verified, role, created_at)
           VALUES ($1, $2, $3, $4, $5, true, 'student', NOW())
           RETURNING *`,
          [email, firstName || '', lastName || '', googleId, profilePicture || null]
        )
        user = createResult.rows[0]
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      )

      // Redirect with token (frontend will handle storing it)
      res.redirect(`${process.env.FRONTEND_URL}?token=${token}&user=${JSON.stringify(user)}`)
    } catch (error) {
      console.error('Google callback error:', error)
      res.redirect('/login?error=auth_failed')
    }
  }
)

module.exports = router
```

### Register in app.js

```javascript
const session = require('express-session')
const passport = require('./config/google-passport')
const googleAuthRoutes = require('./routes/google-auth')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', googleAuthRoutes)
```

## Step 5: Frontend Setup

### Install Dependencies

```bash
npm install @react-oauth/google
```

### Setup Google Button

Update `frontend/src/pages/Login.jsx`:

```javascript
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function Login() {
  const navigate = useNavigate()

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)

      // Send to backend
      const response = await fetch('/api/auth/google-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: decoded.email,
          firstName: decoded.given_name,
          lastName: decoded.family_name,
          googleId: decoded.sub,
          profilePicture: decoded.picture,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Google signin error:', error)
    }
  }

  return (
    <div>
      {/* Email/Password login form */}

      {/* Google Sign-In Button */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.error('Login failed')}
      />
    </div>
  )
}
```

### Wrap App with GoogleOAuthProvider

Update `frontend/src/main.jsx`:

```javascript
import { GoogleOAuthProvider } from '@react-oauth/google'

<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>
```

### Add to .env

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

## Step 6: Test Google Sign-In

1. **Development:**
   - Start backend: `npm run dev`
   - Start frontend: `npm run dev`
   - Click "Sign in with Google" button
   - Select your Google account
   - Should redirect to dashboard

2. **Production:**
   - Update OAuth credentials with production domain
   - Add test users if app is not verified
   - Deploy and test

## Troubleshooting

| Error | Solution |
|-------|----------|
| `redirect_uri_mismatch` | Add your domain to "Authorized redirect URIs" in Google Cloud Console |
| `invalid_client` | Verify Client ID and Secret are correct in .env |
| `access_denied` | User declined permissions, try again |
| `User not found` | First-time login, user will be created automatically |
| Can't see Google button | Check `VITE_GOOGLE_CLIENT_ID` in frontend .env |

## Database Schema Update

The existing `users` table already has `google_id` column:

```sql
google_id VARCHAR(255) UNIQUE
```

No migration needed!

## Production Checklist

- [ ] Add production domain to OAuth credentials
- [ ] Update .env with production URLs
- [ ] Test with real Google account
- [ ] Setup analytics for signin tracking
- [ ] Add user profile photo from Google
- [ ] Implement user profile management
- [ ] Add "Disconnect Google" option in settings
- [ ] Monitor failed logins in audit logs

## Next Steps

1. Test Google Sign-In locally
2. Deploy to production
3. Add profile picture display
4. Implement account linking (email + Google)
5. Add "Sign out" functionality
6. Add user profile management

## Support

For issues:
1. Check Google Cloud Console for API errors
2. Verify OAuth credentials are correct
3. Check console for CORS errors
4. Check backend logs for callback errors
5. Verify database user creation

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](https://www.passportjs.org/packages/passport-google-oauth20/)
- [Google Sign-In for React](https://www.npmjs.com/package/@react-oauth/google)
