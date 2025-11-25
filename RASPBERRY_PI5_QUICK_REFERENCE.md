# Raspberry Pi 5 → GitHub Clone → Deployment (Quick Reference)

## 🎯 TL;DR - Clone & Deploy in 30 Minutes

### On Your Raspberry Pi 5:

```bash
# 1. SSH into your Pi
ssh pi@YOUR_PI_IP

# 2. Clone from GitHub
git clone https://github.com/bmarimuthu-docker/RISE-Fondation.git
cd RISE-Fondation

# 3. Install all dependencies at once
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm postgresql nginx curl certbot python3-certbot-nginx

# 4. Setup database
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 5. Configure backend
cd backend
cp .env.example .env
# Edit .env with your OpenAI API key and database credentials
nano .env

# 6. Install and build
npm install
cd ../frontend
npm install
npm run build

# 7. Configure Nginx and SSL
# Copy Nginx config from guide below
sudo nano /etc/nginx/sites-available/quantumrisefoundation.org
# Then enable and get SSL certificate

# 8. Start backend service
# Create systemd service (see full guide)
sudo systemctl start rise-backend.service

# 9. Visit https://quantumrisefoundation.org
```

---

## 📋 What You Need

```
✅ Raspberry Pi 5 (8GB RAM minimum)
✅ Raspberry Pi OS 64-bit
✅ SSH access to your Pi
✅ Public IP or Dynamic DNS
✅ Domain: quantumrisefoundation.org
✅ OpenAI API key
```

---

## 🔗 GitHub Repository URL

```
https://github.com/bmarimuthu-docker/RISE-Fondation.git
```

Clone with:
```bash
git clone https://github.com/bmarimuthu-docker/RISE-Fondation.git
cd RISE-Fondation
```

---

## 🌐 Domain & DNS Setup

After deployment, configure these DNS records at your registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_PI_PUBLIC_IP |
| A | www | YOUR_PI_PUBLIC_IP |
| CNAME | api | quantumrisefoundation.org |

Get your Pi's public IP:
```bash
curl -s https://api.ipify.org
```

---

## 📁 Project Structure After Clone

```
RISE-Fondation/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env (create this)
├── frontend/
│   ├── src/
│   ├── package.json
│   └── dist/ (after npm run build)
├── docs/
├── RASPBERRY_PI5_DEPLOYMENT.md (Full guide)
└── README.md
```

---

## ⚙️ Key Configuration Files

### 1. Backend `.env` File
```bash
cd backend
cp .env.example .env
nano .env
```

Fill in:
```env
NODE_ENV=production
PORT=5000
DB_USER=rise_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quantumrise
OPENAI_API_KEY=sk-proj-YOUR_KEY
JWT_SECRET=change_me
FRONTEND_URL=https://quantumrisefoundation.org
API_URL=https://quantumrisefoundation.org
# Optional (for email features)
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASSWORD=your-app-password
```

### 2. Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/quantumrisefoundation.org
```

Key parts:
- Listen on 443 (HTTPS)
- SSL certificates from Let's Encrypt
- Proxy `/api/*` to backend (port 5000)
- Serve frontend static files from `frontend/dist`

### 3. PostgreSQL Database
```bash
sudo -u postgres psql

CREATE DATABASE quantumrise;
CREATE USER rise_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE quantumrise TO rise_user;
```

---

## 🚀 Start Services

```bash
# Backend service
sudo systemctl start rise-backend.service
sudo systemctl enable rise-backend.service

# Nginx
sudo systemctl restart nginx

# PostgreSQL (already enabled)
sudo systemctl status postgresql
```

---

## 🔒 SSL/HTTPS Setup

```bash
# Get free SSL certificate
sudo certbot certonly --nginx \
  -d quantumrisefoundation.org \
  -d www.quantumrisefoundation.org

# Auto-renewal enabled automatically
sudo systemctl status certbot.timer
```

---

## ✅ Verify Everything Works

```bash
# Check services running
sudo systemctl status rise-backend.service nginx postgresql

# Test backend
curl http://localhost:5000/health

# Test DNS resolution
nslookup quantumrisefoundation.org

# Visit in browser
# https://quantumrisefoundation.org
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend not starting | Check logs: `sudo journalctl -u rise-backend.service -f` |
| Can't connect to database | Verify DATABASE_URL in `.env` and password |
| API key error | Check OPENAI_API_KEY is set correctly |
| Domain not resolving | Wait 5-30 min for DNS, or check registrar |
| HTTPS not working | Verify SSL cert: `sudo certbot certificates` |
| Port 443 blocked | Check firewall: `sudo ufw status` |

---

## 📊 Performance Stats

Raspberry Pi 5 can handle:
- **100-200 concurrent users**
- **500-1000 requests/second**
- **50-100MB RAM for app** (8GB total available)
- **Uptime: 99.5%+** (with stable power)

---

## 📚 Full Documentation

For detailed setup, troubleshooting, and optimization:
→ See `RASPBERRY_PI5_DEPLOYMENT.md` (this directory)

---

## 🎯 Next Steps After Deployment

1. **Create Admin User**
   - Visit admin panel or use API

2. **Add Lesson Content**
   - Upload learning materials
   - Configure AI Tutor

3. **Test Everything**
   - Create student account
   - Test lessons and AI features

4. **Share & Promote**
   - Send domain to students
   - Monitor performance

5. **Backup Setup**
   - Configure daily database backups
   - Test restore procedure

---

## 🆘 Need Help?

```bash
# Check all services
sudo systemctl status rise-backend.service nginx postgresql

# View recent errors
sudo journalctl -p err -b

# System performance
htop

# Database status
sudo -u postgres psql -c "SELECT version();"
```

---

**Repository**: https://github.com/bmarimuthu-docker/RISE-Fondation  
**Domain**: https://quantumrisefoundation.org  
**Deployed On**: Raspberry Pi 5  

🚀 **Happy Deploying!**
