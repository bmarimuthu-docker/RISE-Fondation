# Setup Guide for /var/www/quantumrisefoundation.org

Complete setup instructions for deploying to the web directory.

---

## 📋 Prerequisites

```bash
# SSH into your Raspberry Pi
ssh pi@your-pi-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL (if not already installed)
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (if not already installed)
sudo apt install -y nginx

# Verify installations
node --version
npm --version
postgres --version
nginx -v
```

---

## 🚀 Quick Setup (First Time Only)

### Step 1: Create Directory Structure
```bash
# Create web directory
sudo mkdir -p /var/www/quantumrisefoundation.org
sudo chown pi:pi /var/www/quantumrisefoundation.org

# Clone repository
cd /var/www/quantumrisefoundation.org
git clone https://github.com/bmarimuthu-docker/RISE-Fondation.git .
```

### Step 2: Setup Backend
```bash
# Navigate to backend
cd /var/www/quantumrisefoundation.org/backend

# Copy environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

Add these values:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://rise_user:your_password@localhost:5432/rise_foundation
OPENAI_API_KEY=sk-proj-your-key-here
CORS_ORIGIN=https://quantumrisefoundation.org
FRONTEND_URL=https://quantumrisefoundation.org
```

### Step 3: Setup Database
```bash
# Create database user
sudo -u postgres psql <<EOF
CREATE DATABASE rise_foundation;
CREATE USER rise_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE rise_foundation TO rise_user;
EOF
```

### Step 4: Install Dependencies
```bash
cd /var/www/quantumrisefoundation.org/backend
npm install

cd ../frontend
npm install
npm run build
```

### Step 5: Setup Systemd Service
```bash
# Copy service file
sudo cp /var/www/quantumrisefoundation.org/rise-backend.service /etc/systemd/system/

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable rise-backend.service
sudo systemctl start rise-backend.service

# Check status
sudo systemctl status rise-backend.service
```

### Step 6: Setup Nginx
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/quantumrisefoundation.org
```

Paste:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name quantumrisefoundation.org www.quantumrisefoundation.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name quantumrisefoundation.org www.quantumrisefoundation.org;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/quantumrisefoundation.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quantumrisefoundation.org/privkey.pem;

    # Security headers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend static files
    location / {
        root /var/www/quantumrisefoundation.org;
        try_files $uri $uri/ /index.html;
        expires 1h;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 600s;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/quantumrisefoundation.org \
           /etc/nginx/sites-enabled/

sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Get SSL Certificate
```bash
sudo certbot certonly --nginx \
  -d quantumrisefoundation.org \
  -d www.quantumrisefoundation.org
```

### Step 8: Verify Everything
```bash
# Check all services
sudo systemctl status rise-backend.service nginx postgresql

# Test backend
curl https://quantumrisefoundation.org/api/health

# View logs
sudo journalctl -u rise-backend.service -f
```

---

## 🔄 Deployment Commands

### Deploy Latest Changes
```bash
cd /var/www/quantumrisefoundation.org

# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

Or manually:
```bash
# Pull latest code
git pull origin Update1

# Install and build
cd backend && npm install
cd ../frontend && npm install && npm run build

# Restart services
sudo systemctl restart rise-backend.service
sudo systemctl restart nginx
```

### View Logs
```bash
# Backend logs
sudo journalctl -u rise-backend.service -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# All logs
sudo tail -f /var/log/syslog
```

### Restart Services
```bash
# Restart backend
sudo systemctl restart rise-backend.service

# Restart Nginx
sudo systemctl restart nginx

# Restart both
sudo systemctl restart rise-backend.service nginx
```

---

## 📁 Directory Structure

```
/var/www/quantumrisefoundation.org/
├── backend/              # Node.js backend
│   ├── server.js
│   ├── app.js
│   ├── package.json
│   └── .env             # (secrets - not in git)
├── frontend/            # React frontend
│   ├── src/
│   ├── dist/           # Built files (served by Nginx)
│   └── package.json
├── deploy.sh           # Deployment script
└── rise-backend.service # Systemd service file
```

---

## ⚡ Quick Commands for Daily Use

```bash
# Check if everything is running
sudo systemctl status rise-backend.service nginx postgresql

# Deploy latest changes
cd /var/www/quantumrisefoundation.org && ./deploy.sh

# View real-time backend logs
sudo journalctl -u rise-backend.service -f

# Restart backend only
sudo systemctl restart rise-backend.service

# Rebuild frontend only
cd /var/www/quantumrisefoundation.org/frontend && npm run build && sudo systemctl restart nginx

# Check website is alive
curl -I https://quantumrisefoundation.org
```

---

## 🔧 Troubleshooting

### Backend not starting
```bash
# Check logs
sudo journalctl -u rise-backend.service -n 50

# Verify dependencies
cd /var/www/quantumrisefoundation.org/backend
npm install

# Check port 5000 is available
sudo lsof -i :5000
```

### Nginx showing old content
```bash
# Clear Nginx cache
sudo systemctl stop nginx
sudo rm -rf /var/cache/nginx/*
sudo systemctl start nginx
```

### Database connection error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U rise_user -d rise_foundation -h localhost
```

### Deployment script permission denied
```bash
chmod +x /var/www/quantumrisefoundation.org/deploy.sh
```

---

## ✅ Success Checklist

- [ ] Repository cloned to `/var/www/quantumrisefoundation.org`
- [ ] Backend `.env` configured with API keys
- [ ] PostgreSQL database created
- [ ] Backend service running (`sudo systemctl status rise-backend.service`)
- [ ] Nginx configured and running
- [ ] SSL certificate installed
- [ ] Website accessible at https://quantumrisefoundation.org
- [ ] API working at https://quantumrisefoundation.org/api/health
- [ ] Deployment script executable and tested

---

## 📞 Support

For issues, check:
1. Logs: `sudo journalctl -u rise-backend.service -f`
2. Nginx errors: `sudo tail -f /var/log/nginx/error.log`
3. Services running: `sudo systemctl status rise-backend.service nginx postgresql`

Everything is now deployed at `/var/www/quantumrisefoundation.org` and ready to serve your website! 🎉
