# Authentication Quick Reference

## Files Created/Modified

### Backend Files
- ✅ `backend/routes/auth.js` - Complete auth routes (signup, login, google, password reset)
- ✅ `backend/middleware/auth.js` - Auth middleware (verifyToken, isAdmin, requireEmailVerified)
- ✅ `backend/migrations/001_create_users_table.sql` - Database schema
- ✅ `backend/.env.example` - Updated with Gmail configuration

### Frontend Components
- ✅ `frontend/src/pages/SignUp.jsx` - Modern signup form with validation
- ✅ `frontend/src/pages/Login.jsx` - Login with email/password and Google OAuth
- ✅ `frontend/src/pages/VerifyEmail.jsx` - Email verification with resend option
- ✅ `frontend/src/pages/ForgotPassword.jsx` - Password reset request form
- ✅ `frontend/src/pages/ResetPassword.jsx` - Password reset with token validation

### Documentation
- ✅ `AUTHENTICATION_COMPLETE.md` - Complete setup and API documentation

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install nodemailer
```

### 2. Setup Database
```bash
# Create database
createdb -U postgres rise_foundation

# Run migrations
psql -U postgres -d rise_foundation -f migrations/001_create_users_table.sql
```

### 3. Configure Environment (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rise_foundation
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your-super-secret-key-minimum-32-characters

GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password

FRONTEND_URL=http://localhost:5173
```

### 4. Register Routes (in app.js or server.js)
```javascript
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
```

### 5. Add Routes to React Router (main.jsx)
```javascript
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Add to routes array
{ path: '/signup', element: <SignUp /> },
{ path: '/login', element: <Login /> },
{ path: '/verify-email', element: <VerifyEmail /> },
{ path: '/forgot-password', element: <ForgotPassword /> },
{ path: '/reset-password', element: <ResetPassword /> },
```

### 6. Test It
- Visit `http://localhost:5173/signup`
- Create account with email/password
- Check email for verification link
- Click link to verify
- Login with verified email

## API Endpoints Quick Reference

| Method | Endpoint | Body | Auth | Purpose |
|--------|----------|------|------|---------|
| POST | `/api/auth/signup` | {firstName, lastName, email, password} | No | Create account |
| POST | `/api/auth/verify-email` | {token} | No | Verify email |
| POST | `/api/auth/login` | {email, password} | No | Login |
| POST | `/api/auth/google-signin` | {email, googleId, ...} | No | Google login |
| POST | `/api/auth/forgot-password` | {email} | No | Request reset |
| POST | `/api/auth/reset-password` | {token, password} | No | Reset password |
| GET | `/api/auth/me` | None | Yes | Get user profile |

## Middleware Usage

### Protect Routes
```javascript
const { verifyToken, isAdmin } = require('./middleware/auth')

// Public route
router.get('/courses', (req, res) => { ... })

// Protected route
router.post('/enroll', verifyToken, (req, res) => {
  console.log(req.userId) // User ID from token
})

// Admin only
router.delete('/users/:id', verifyToken, isAdmin, (req, res) => { ... })
```

## Frontend Example: Protected Component

```javascript
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    // Fetch user data
    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setUser(data.user))
      .catch(() => navigate('/login'))
  }, [])

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={() => {
        localStorage.removeItem('token')
        navigate('/login')
      }}>
        Logout
      </button>
    </div>
  )
}
```

## Gmail Setup (2FA Enabled - Recommended)

1. Go to https://myaccount.google.com
2. Click "Security" in left menu
3. Enable 2-Factor Authentication (if not already)
4. Go to https://myaccount.google.com/apppasswords
5. Select "Mail" and "Windows Computer"
6. Copy the 16-character password shown
7. Use as `GMAIL_PASSWORD` in .env

## Database Tables Created

```sql
users
├── id (PRIMARY KEY)
├── email (UNIQUE)
├── password (bcryptjs hash)
├── first_name
├── last_name
├── avatar
├── role (default: 'student')
├── is_verified
├── verification_token
├── verification_token_expire
├── reset_token
├── reset_token_expire
├── google_id (for OAuth)
├── created_at
├── updated_at
└── last_login

auth_logs (optional)
├── id (PRIMARY KEY)
├── user_id
├── action ('login', 'signup', 'password_reset', etc)
├── ip_address
├── user_agent
├── success
└── created_at
```

## Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `ENOENT: no such file or directory, open '.env'` | Missing .env file | Create `backend/.env` with variables |
| `connect ECONNREFUSED 127.0.0.1:5432` | PostgreSQL not running | Start PostgreSQL service |
| `Email already registered` | Email exists | Use different email or reset password |
| `Invalid email or password` | Wrong credentials | Check email/password |
| `Please verify your email` | Email not verified | Click verification link in email |
| `Invalid or expired token` | Token expired (24h) | Request new verification email |
| `SMTP 535 error` | Gmail password wrong | Use app password, not Gmail password |

## Security Best Practices

✅ **Implemented:**
- Password hashing with bcryptjs (10 salt rounds)
- JWT token verification
- Email token expiration (24 hours)
- Reset token expiration (1 hour)
- Parameterized SQL queries (SQL injection prevention)
- CORS configured to production domain
- Helmet headers configured

⚠️ **TODO for Production:**
- Rate limiting on auth endpoints
- Email verification template styling
- Two-factor authentication
- Device tracking
- Password strength validation enhancement
- Audit logging
- HTTPS enforcement
- Session timeout

## Testing

### Manual Testing Checklist

- [ ] Signup with new email → verification email received
- [ ] Click verification link → email verified
- [ ] Try login before verification → shows error
- [ ] Login with verified email → success, redirected to dashboard
- [ ] Click "Forgot Password" → reset email received
- [ ] Click reset link → password reset form
- [ ] Reset password → can login with new password
- [ ] Google signin button → works (if configured)
- [ ] Protected routes require token → redirects to login if no token

## Next Steps

1. ✅ Basic auth system working
2. ⏳ Test all flows end-to-end
3. ⏳ Add rate limiting (npm install express-rate-limit)
4. ⏳ Add better email templates (npm install ejs or handlebars)
5. ⏳ Implement Google OAuth fully
6. ⏳ Add user profile management
7. ⏳ Add two-factor authentication
8. ⏳ Setup audit logging

## Support

Check `AUTHENTICATION_COMPLETE.md` for:
- Detailed setup instructions
- Complete API documentation
- Troubleshooting guide
- Database schema reference
- Integration examples
