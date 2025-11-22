# Complete Working Example - Email Verification Flow

This example shows the complete end-to-end authentication flow.

## 1. User Signs Up

**Frontend: SignUp.jsx**
```javascript
const handleSignup = async (e) => {
  e.preventDefault()
  
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'SecurePassword123!'
    })
  })
  
  const data = await response.json()
  
  // Response:
  // {
  //   message: "Account created! Check your email to verify.",
  //   user: { id: 1, email: "john@example.com", firstName: "John", lastName: "Doe", isVerified: false },
  //   token: "eyJhbGc..."
  // }
  
  localStorage.setItem('token', data.token)
  navigate('/verify-email', { state: { email: data.user.email } })
}
```

**What Happens in Backend:**

```javascript
// 1. Validate input
const errors = validationResult(req)
if (!errors.isEmpty()) return error

// 2. Check if email exists
const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email])
if (existingUser.rows.length > 0) return error('Email already registered')

// 3. Hash password
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt)

// 4. Generate verification token
const verificationToken = crypto.randomBytes(32).toString('hex')
const verificationTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000)

// 5. Create user in database
const result = await pool.query(
  `INSERT INTO users (email, password, first_name, last_name, verification_token, verification_token_expire, is_verified, role, created_at)
   VALUES ($1, $2, $3, $4, $5, $6, false, 'student', NOW())
   RETURNING *`,
  [email, hashedPassword, firstName, lastName, verificationToken, verificationTokenExpire]
)

// 6. Send verification email
const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
await transporter.sendMail({
  from: process.env.GMAIL_USER,
  to: email,
  subject: '✉️ Verify Your RISE Foundation Account',
  html: `
    <h2>Welcome to RISE Foundation!</h2>
    <p>Hi ${firstName},</p>
    <p>Thank you for signing up. Please verify your email to activate your account.</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>This link expires in 24 hours.</p>
  `
})

// 7. Generate JWT token
const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)

// 8. Return success
return { message: 'Account created! Check your email to verify.', user, token }
```

## 2. Email Sent

**Email Received:**
```
From: your-gmail@gmail.com
To: john@example.com
Subject: ✉️ Verify Your RISE Foundation Account

Welcome to RISE Foundation!

Hi John,

Thank you for signing up. Please verify your email to activate your account.

[Verify Email Button]
↓ Or click: https://quantumrisefoundation.org/verify-email?token=abcd1234...

This link expires in 24 hours.

Best regards,
RISE Foundation Team
```

## 3. User Clicks Verification Link

**Frontend: VerifyEmail.jsx**
```javascript
const token = searchParams.get('token') // token=abcd1234...

useEffect(() => {
  if (token) {
    handleVerification(token)
  }
}, [token])

const handleVerification = async (verificationToken) => {
  const response = await fetch('/api/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: verificationToken })
  })
  
  const data = await response.json()
  
  // Response:
  // {
  //   message: "Email verified successfully! You can now login.",
  //   user: { id: 1, email: "john@example.com" }
  // }
  
  setVerified(true)
  setTimeout(() => navigate('/login'), 3000)
}
```

**What Happens in Backend:**

```javascript
// 1. Find user with valid token
const result = await pool.query(
  `SELECT id, email FROM users 
   WHERE verification_token = $1 AND verification_token_expire > NOW()`,
  [token]
)

if (result.rows.length === 0) {
  return error('Invalid or expired verification token')
}

// 2. Mark email as verified
await pool.query(
  `UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1`,
  [user.id]
)

// 3. Return success
return { message: 'Email verified successfully! You can now login.', user }
```

## 4. User Logs In

**Frontend: Login.jsx**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'john@example.com',
      password: 'SecurePassword123!'
    })
  })
  
  const data = await response.json()
  
  // Response:
  // {
  //   message: "Login successful",
  //   user: { id: 1, email: "john@example.com", firstName: "John", lastName: "Doe", role: "student" },
  //   token: "eyJhbGc..."
  // }
  
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
  navigate('/dashboard')
}
```

**What Happens in Backend:**

```javascript
// 1. Find user by email
const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
if (result.rows.length === 0) return error('Invalid email or password')

const user = result.rows[0]

// 2. Check if email is verified
if (!user.is_verified) {
  return error('Please verify your email before logging in')
}

// 3. Verify password
const isPasswordValid = await bcrypt.compare(password, user.password)
if (!isPasswordValid) return error('Invalid email or password')

// 4. Update last login
await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id])

// 5. Generate JWT token
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }
)

// 6. Return success
return { message: 'Login successful', user, token }
```

## 5. Access Protected Route

**Protected Component: Dashboard.jsx**
```javascript
export default function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    // Fetch user data with token
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
      <p>Email: {user.email}</p>
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

**What Happens in Backend:**

```javascript
// 1. Extract token from Authorization header
const token = req.headers.authorization?.split(' ')[1]
if (!token) return error('No token provided')

// 2. Verify JWT token
const decoded = jwt.verify(token, process.env.JWT_SECRET)
req.userId = decoded.id

// 3. Fetch user from database
const result = await pool.query(
  'SELECT id, email, first_name, last_name, avatar, role FROM users WHERE id = $1',
  [req.userId]
)

// 4. Return user data
return { user: result.rows[0] }
```

## 6. Password Reset Flow

**Forgot Password:**
```javascript
// User clicks "Forgot Password" button
const handleForgotPassword = async () => {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'john@example.com' })
  })
  
  // Response: { message: 'If an account exists, reset email has been sent' }
}

// Backend:
// 1. Find user
// 2. Generate reset token (valid 1 hour)
// 3. Store in database
// 4. Send email with reset link
```

**Reset Password:**
```javascript
// User clicks reset link: /reset-password?token=xyz123
const handleResetPassword = async () => {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: 'xyz123...',
      password: 'NewPassword123!'
    })
  })
  
  // Response: { message: 'Password reset successful. You can now login.' }
  navigate('/login')
}

// Backend:
// 1. Find user with valid reset token
// 2. Hash new password
// 3. Update password
// 4. Clear reset token
```

## 7. Database State After Complete Flow

```sql
-- After Signup:
INSERT INTO users (email, password, first_name, last_name, is_verified, verification_token, verification_token_expire, created_at)
VALUES ('john@example.com', '$2a$10$...', 'John', 'Doe', false, 'token123...', '2024-01-22 10:00:00', NOW());

-- After Email Verification:
UPDATE users SET is_verified = true, verification_token = NULL WHERE email = 'john@example.com';

-- After Login:
UPDATE users SET last_login = NOW() WHERE email = 'john@example.com';

-- Query to check user:
SELECT * FROM users WHERE email = 'john@example.com';
-- Result:
-- id: 1
-- email: john@example.com
-- password: $2a$10$... (hashed)
-- first_name: John
-- last_name: Doe
-- is_verified: true
-- verification_token: NULL
-- google_id: NULL
-- created_at: 2024-01-21 10:00:00
-- last_login: 2024-01-21 15:30:00
```

## 8. JWT Token Payload

```javascript
// JWT Token Generated:
// Header: { alg: 'HS256', typ: 'JWT' }
// Payload:
{
  id: 1,
  email: 'john@example.com',
  role: 'student',
  iat: 1705859400,        // issued at
  exp: 1706464200         // expires in 7 days
}
// Signature: HMACSHA256(header.payload, JWT_SECRET)

// Decoded Token Example:
const decoded = jwt.verify(token, process.env.JWT_SECRET)
// {
//   id: 1,
//   email: 'john@example.com',
//   role: 'student',
//   iat: 1705859400,
//   exp: 1706464200
// }
```

## 9. Error Scenarios

**Scenario 1: Wrong Password**
```javascript
fetch('/api/auth/login', {
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'WrongPassword'
  })
})
// Response: 401 Unauthorized
// { message: 'Invalid email or password' }
```

**Scenario 2: Email Not Verified**
```javascript
fetch('/api/auth/login', {
  body: JSON.stringify({
    email: 'unverified@example.com',
    password: 'CorrectPassword'
  })
})
// Response: 403 Forbidden
// { message: 'Please verify your email before logging in' }
```

**Scenario 3: Invalid Token**
```javascript
fetch('/api/auth/me', {
  headers: { 'Authorization': 'Bearer invalid-token' }
})
// Response: 401 Unauthorized
// { message: 'Invalid token' }
```

**Scenario 4: Token Expired**
```javascript
// After 7 days, token expires
fetch('/api/auth/me', {
  headers: { 'Authorization': 'Bearer expired-token' }
})
// Response: 401 Unauthorized
// { message: 'Invalid token' }
// Frontend redirects to /login
```

## 10. Complete Request/Response Examples

### Signup Request
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

### Signup Response
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

### Login Response
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get User Request
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Get User Response
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

This complete example shows the entire authentication flow from signup through to accessing protected routes!
