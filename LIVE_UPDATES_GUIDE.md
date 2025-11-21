# Live Update Implementation Guide

Your website now has **5 different methods** to enable live, real-time updates without reloading the page!

---

## 🚀 5 Ways to Implement Live Updates

### **1. Polling (Simple) ⏱️**
Fetch data at regular intervals

```jsx
import { useLiveData } from '../hooks/useLiveData'

function MyComponent() {
  const { data, loading, error } = useLiveData('/api/data', 5000) // Update every 5 seconds
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>{data.value}</p>}
    </div>
  )
}
```

**Pros:** Simple, works everywhere  
**Cons:** Uses more bandwidth, slower updates  
**Best for:** Non-critical data, low update frequency

---

### **2. Server-Sent Events (SSE) 📡**
One-way updates from server to client (like Twitch chat)

**Backend:**
```javascript
app.get('/api/stream/data', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  
  const intervalId = setInterval(() => {
    res.write(`data: ${JSON.stringify(getData())}\n\n`)
  }, 1000)
  
  req.on('close', () => clearInterval(intervalId))
})
```

**Frontend:**
```jsx
import { useSSE } from '../hooks/useLiveData'

function MyComponent() {
  const { data, connected } = useSSE('http://localhost:5000/api/stream/data')
  
  return (
    <div>
      {connected ? '🟢 Connected' : '⚫ Disconnected'}
      {data && <p>{data.value}</p>}
    </div>
  )
}
```

**Pros:** Efficient, built-in reconnection, native browser support  
**Cons:** One-way only  
**Best for:** Live statistics, activity feeds, notifications

---

### **3. WebSockets 🔗**
Bi-directional real-time communication

**Backend (using Socket.IO):**
```javascript
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('User connected')
  
  setInterval(() => {
    socket.emit('stats-update', {
      users: getActiveUsers(),
      courses: getActiveCourses()
    })
  }, 1000)
  
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})
```

**Frontend:**
```jsx
import { useSocketIO } from '../hooks/useLiveData'

function MyComponent() {
  const { data, connected } = useSocketIO(
    'http://localhost:5000',
    'stats-update'
  )
  
  return <div>{data && <p>{data.users} users online</p>}</div>
}
```

**Pros:** Bi-directional, super fast, perfect for real-time  
**Cons:** Requires Socket.IO library  
**Best for:** Gaming, collaboration, chat, live updates

---

### **4. React Query (Advanced) 🎯**
Professional data fetching with caching and synchronization

```jsx
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await fetch('/api/courses')
      return res.json()
    },
    refetchInterval: 5000, // Auto-refetch every 5 seconds
    staleTime: 10000, // Consider data fresh for 10 seconds
  })
  
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {data && <p>Courses: {data.length}</p>}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  )
}
```

**Pros:** Professional, built-in caching, error handling  
**Cons:** Requires React Query library  
**Best for:** Production apps, complex data synchronization

---

### **5. GraphQL Subscriptions 🚀**
Real-time updates with GraphQL

```jsx
import { useSubscription } from '@apollo/client'
import { gql } from '@apollo/client'

const COURSE_UPDATE = gql`
  subscription OnCourseUpdate {
    courseUpdated {
      id
      name
      activeStudents
    }
  }
`

function MyComponent() {
  const { data, loading } = useSubscription(COURSE_UPDATE)
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {data && <p>{data.courseUpdated.activeStudents} active students</p>}
    </div>
  )
}
```

**Pros:** Powerful, scalable, great for complex data  
**Cons:** Requires GraphQL setup  
**Best for:** Large applications, complex real-time data

---

## 🎯 Quick Comparison

| Method | Speed | Bandwidth | Complexity | Best For |
|--------|-------|-----------|-----------|----------|
| **Polling** | Slow | High | Very Simple | Simple updates, low frequency |
| **SSE** | Fast | Low | Simple | Notifications, activity feeds |
| **WebSockets** | Very Fast | Low | Medium | Real-time collaboration |
| **React Query** | Fast | Low | Medium | Production apps |
| **GraphQL** | Very Fast | Low | Complex | Enterprise apps |

---

## 🔧 Implementation Steps

### **Step 1: Choose Your Method**
For most cases, **use SSE or Polling** (simplest), or **WebSockets** (best experience).

### **Step 2: Add to Your Component**

#### **Option A: Polling (Easiest)**
```jsx
import { useLiveData } from '../hooks/useLiveData'

export default function Dashboard() {
  const { data: courses } = useLiveData('/api/courses/live', 5000)
  
  return (
    <div>
      {courses?.map(course => (
        <div key={course.id}>{course.name}</div>
      ))}
    </div>
  )
}
```

#### **Option B: SSE (More Efficient)**
```jsx
import { useSSE } from '../hooks/useLiveData'

export default function Dashboard() {
  const { data: courses, connected } = useSSE('/api/stream/courses')
  
  return (
    <div>
      {connected && '🟢 Live Updates Active'}
      {courses?.map(course => (
        <div key={course.id}>{course.name}</div>
      ))}
    </div>
  )
}
```

### **Step 3: Add Backend Endpoint**

```javascript
// routes/live.js
router.get('/api/courses/live', (req, res) => {
  const courses = fetchCoursesFromDB()
  res.json(courses)
})
```

### **Step 4: Deploy & Test**
```bash
cd frontend
npm run build

cd ../backend
npm install

# Restart backend service
sudo systemctl restart rise-backend.service
```

---

## 📊 Live Dashboard Example

We've created a **LiveDashboard** component that shows:
- ✅ Real-time student count
- ✅ Active lessons
- ✅ Completed lessons today
- ✅ Average rating
- ✅ Live activity feed
- ✅ Currently online students

### **Using in Your Pages:**

```jsx
import LiveDashboard from '../components/LiveDashboard'

export default function AdminPanel() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <LiveDashboard />
    </div>
  )
}
```

---

## 🛠️ Backend API Endpoints

All live endpoints are in `/api/`:

```
GET  /api/statistics/live        → Live stats (polling)
GET  /api/users/active           → Active users (polling)
GET  /api/courses/activity       → Course activity (polling)
GET  /api/stream/statistics      → Stats stream (SSE)
GET  /api/stream/activity        → Activity stream (SSE)
POST /api/notify/courses         → Notify course update
POST /api/notify/user-activity   → Notify user activity
```

---

## 💡 Pro Tips

### **1. Optimize Update Frequency**
Don't update too often - it wastes bandwidth!
```jsx
// ✅ Good: 5-10 second intervals
const { data } = useLiveData('/api/stats', 5000)

// ❌ Bad: Too frequent
const { data } = useLiveData('/api/stats', 100)
```

### **2. Use Conditional Updates**
Only fetch when needed:
```jsx
const { data } = useLiveData('/api/stats', enabled ? 5000 : Infinity)
```

### **3. Handle Errors Gracefully**
```jsx
const { data, error } = useLiveData('/api/stats', 5000)

if (error) {
  return <div>Unable to load live data. Using cached data instead.</div>
}
```

### **4. Cache Data**
Avoid unnecessary fetches:
```jsx
const { data, refetch } = useQueryData('/api/stats', {
  staleTime: 10000,      // Don't refetch for 10 seconds
  refetchInterval: 5000, // But refetch in background
})
```

---

## 🚀 Deploy to Raspberry Pi 5

### **1. Update & Build**
```bash
cd /home/pi/RISE-Fondation

# Update code
git pull origin main

# Install any new dependencies
cd backend && npm install
cd ../frontend && npm install

# Build frontend
npm run build
```

### **2. Restart Services**
```bash
# Restart backend
sudo systemctl restart rise-backend.service

# Restart Nginx
sudo systemctl restart nginx
```

### **3. Test Live Updates**
Visit: `https://quantumrisefoundation.org/admin`

You should see:
- 🟢 Live indicator showing it's updating
- Numbers changing in real-time
- No page refresh needed

---

## 📝 Troubleshooting

### **Updates not working?**

1. **Check browser console for errors:**
   ```javascript
   // In browser DevTools Console
   fetch('/api/statistics/live').then(r => r.json()).then(console.log)
   ```

2. **Check backend is running:**
   ```bash
   sudo systemctl status rise-backend.service
   ```

3. **Check CORS is configured:**
   ```javascript
   // In backend/app.js
   app.use(cors({
     origin: 'https://quantumrisefoundation.org',
     credentials: true
   }))
   ```

4. **Check network tab:**
   - Open DevTools → Network
   - Should see requests to `/api/statistics/live`
   - Status should be `200 OK`

---

## ✨ Next Steps

1. ✅ Choose your update method (we recommend **SSE** for best balance)
2. ✅ Add `LiveDashboard` component to your pages
3. ✅ Test with `npm run dev` locally
4. ✅ Build and deploy to Raspberry Pi
5. ✅ Monitor live updates on your domain

**Your website is now truly interactive and real-time!** 🎉

---

## 📚 Resources

- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Socket.IO Docs](https://socket.io/docs/)
- [React Query](https://tanstack.com/query/latest)
- [GraphQL Subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/)
