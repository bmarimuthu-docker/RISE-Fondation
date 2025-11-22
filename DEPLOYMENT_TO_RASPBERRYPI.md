# Deploy Authentication System to Raspberry Pi 5

## Prerequisites
- SSH access to Raspberry Pi
- `/var/www/quantumrisefoundation.org` directory exists
- PostgreSQL installed on Raspberry Pi
- Node.js v16+ installed

## Deployment Steps

### 1. Pull Latest Code from GitHub

```bash
# SSH into Raspberry Pi
ssh pi@your-pi-ip

# Navigate to project directory
cd /var/www/quantumrisefoundation.org

# Pull latest code from Update1 branch
git pull origin Update1

# Verify new files are present
ls -la | grep AUTH
ls frontend/src/pages/ | grep -E "Forgot|Reset|Verify"
```

### 2. Install Backend Dependencies

```bash
cd backend

# Install nodemailer if not already installed
npm install nodemailer

# Verify installation
npm list nodemailer
```

### 3. Create/Update Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database (if not exists)
CREATE DATABASE rise_foundation;

# Create user (if not exists)
CREATE USER rise_user WITH PASSWORD 'your_secure_password';

# Grant privileges
ALTER ROLE rise_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE rise_foundation TO rise_user;

# Exit psql
\q

# Run migrations
psql -U rise_user -d rise_foundation -f migrations/001_create_users_table.sql

# Verify tables created
psql -U rise_user -d rise_foundation -dt
```

### 4. Configure Environment Variables

```bash
# Edit .env file
nano /var/www/quantumrisefoundation.org/backend/.env

# Add/Update the following:
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

DB_HOST=localhost
DB_PORT=5432
DB_NAME=rise_foundation
DB_USER=rise_user
DB_PASSWORD=your_secure_password

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-specific-password

FRONTEND_URL=https://quantumrisefoundation.org
NODE_ENV=production

# Save: Ctrl+O, Enter, Ctrl+X
```

### 5. Update Frontend Environment

```bash
# Edit frontend .env if using Vite
nano /var/www/quantumrisefoundation.org/frontend/.env

# Add:
VITE_API_URL=https://quantumrisefoundation.org/api
VITE_FRONTEND_URL=https://quantumrisefoundation.org
```

### 6. Install Dependencies & Build

```bash
# Backend
cd /var/www/quantumrisefoundation.org/backend
npm install

# Frontend
cd /var/www/quantumrisefoundation.org/frontend
npm install
npm run build

# Verify build
ls -la dist/
```

### 7. Setup Systemd Service (Auto-start)

```bash
# Copy service file
sudo cp /var/www/quantumrisefoundation.org/rise-backend.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service (auto-start on boot)
sudo systemctl enable rise-backend.service

# Start service
sudo systemctl start rise-backend.service

# Check status
sudo systemctl status rise-backend.service

# View logs
sudo journalctl -u rise-backend.service -f
```

### 8. Setup Nginx (Reverse Proxy)

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/quantumrisefoundation.org

# Paste this configuration:
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name quantumrisefoundation.org www.quantumrisefoundation.org;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name quantumrisefoundation.org www.quantumrisefoundation.org;
    
    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/quantumrisefoundation.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quantumrisefoundation.org/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Frontend static files
    root /var/www/quantumrisefoundation.org/frontend/dist;
    index index.html;
    
    # Frontend routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API routes (backend)
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/quantumrisefoundation.org /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

### 9. Setup SSL/TLS with Let's Encrypt (if not already done)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d quantumrisefoundation.org -d www.quantumrisefoundation.org

# Verify certificate
sudo certbot certificates

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 10. Test Backend API

```bash
# Test from Pi
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# Or from another machine
curl -X POST https://quantumrisefoundation.org/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### 11. Test Website

```bash
# Visit website
https://quantumrisefoundation.org

# Test signup
Click "Sign Up" → Fill form → Check email for verification

# Test login
Click "Login" → Enter credentials → Should login successfully

# Check logs
sudo journalctl -u rise-backend.service -f
```

### 12. Monitor Services

```bash
# Check all services running
sudo systemctl status postgresql
sudo systemctl status rise-backend.service
sudo systemctl status nginx

# View backend logs
sudo journalctl -u rise-backend.service -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check database
psql -U rise_user -d rise_foundation -c "SELECT COUNT(*) FROM users;"
```

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
sudo journalctl -u rise-backend.service -n 50

# Verify environment variables
cat /var/www/quantumrisefoundation.org/backend/.env | grep -v "^#"

# Test database connection
psql -U rise_user -h localhost -d rise_foundation -c "SELECT 1;"
```

### Email Not Sending
```bash
# Check Gmail credentials in .env
# Verify app password is correct (use app password, not Gmail password)
# Check nodemailer is installed: npm list nodemailer
# Check logs: sudo journalctl -u rise-backend.service
```

### Database Connection Error
```bash
# Verify PostgreSQL running
sudo systemctl status postgresql

# Check database exists
psql -U postgres -l | grep rise_foundation

# Check user permissions
psql -U postgres -c "SELECT * FROM pg_user WHERE usename='rise_user';"
```

### Nginx 502 Bad Gateway
```bash
# Check backend running
sudo systemctl status rise-backend.service

# Check port 5000 is listening
netstat -tulpn | grep 5000

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Deployment Checklist

- [ ] Code pulled from GitHub
- [ ] Dependencies installed (`npm install nodemailer`)
- [ ] Database created and migrated
- [ ] .env configured with secrets
- [ ] Frontend built (`npm run build`)
- [ ] Systemd service installed
- [ ] Nginx configured
- [ ] SSL/TLS working (HTTPS)
- [ ] Backend service running
- [ ] Nginx service running
- [ ] PostgreSQL running
- [ ] API endpoint responding
- [ ] Signup form working
- [ ] Email verification working
- [ ] Login working
- [ ] Password reset working
- [ ] All logs monitored

## Daily Operations

### Restart Backend
```bash
sudo systemctl restart rise-backend.service
```

### Restart Nginx
```bash
sudo systemctl restart nginx
```

### View Backend Logs
```bash
sudo journalctl -u rise-backend.service -f
```

### Check Database
```bash
psql -U rise_user -d rise_foundation
SELECT COUNT(*) FROM users;
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
\q
```

### Manual Backup
```bash
# Backup database
pg_dump -U rise_user rise_foundation > ~/rise_foundation_backup.sql

# Backup to external drive
cp ~/rise_foundation_backup.sql /mnt/backup/
```

## Support

For issues, check:
1. `/var/www/quantumrisefoundation.org/AUTHENTICATION_COMPLETE.md` - Full documentation
2. Backend logs: `sudo journalctl -u rise-backend.service`
3. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Database: `psql -U rise_user -d rise_foundation`

## Next Steps

1. ✅ Deploy authentication system
2. Test all flows (signup, login, password reset)
3. Monitor logs for errors
4. Add Google OAuth (optional)
5. Setup monitoring/alerts
6. Regular backups
7. Security updates
