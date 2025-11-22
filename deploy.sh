#!/bin/bash

# RISE Foundation Deployment Script
# Deploys to /var/www/quantumrisefoundation.org/backend

set -e  # Exit on error

REPO_PATH="/var/www/quantumrisefoundation.org"
BACKEND_PATH="$REPO_PATH/backend"
FRONTEND_PATH="$REPO_PATH/frontend"
PROJECT_USER="pi"

echo "🚀 Starting RISE Foundation Deployment..."
echo "📍 Deployment Path: $REPO_PATH"

# ==========================================
# 1. Pull Latest Code
# ==========================================
echo "📥 Pulling latest code from GitHub..."
cd $REPO_PATH
git pull origin Update1

# ==========================================
# 2. Install Backend Dependencies
# ==========================================
echo "📦 Installing backend dependencies..."
cd $BACKEND_PATH
npm install

# ==========================================
# 3. Build Frontend
# ==========================================
echo "🎨 Building frontend..."
cd $FRONTEND_PATH
npm install
npm run build

# ==========================================
# 4. Copy Built Files to Nginx
# ==========================================
echo "📋 Copying frontend to Nginx..."
sudo cp -r $FRONTEND_PATH/dist/* /var/www/quantumrisefoundation.org/public/ 2>/dev/null || true

# ==========================================
# 5. Restart Services
# ==========================================
echo "🔄 Restarting services..."
sudo systemctl restart rise-backend.service
sudo systemctl restart nginx

# ==========================================
# 6. Wait and Verify
# ==========================================
echo "⏳ Waiting for services to start..."
sleep 3

# Check backend
if sudo systemctl is-active --quiet rise-backend.service; then
    echo "✅ Backend service: RUNNING"
else
    echo "❌ Backend service: FAILED"
    sudo journalctl -u rise-backend.service -n 20
fi

# Check nginx
if sudo systemctl is-active --quiet nginx; then
    echo "✅ Nginx service: RUNNING"
else
    echo "❌ Nginx service: FAILED"
fi

# ==========================================
# 7. Summary
# ==========================================
echo ""
echo "╔════════════════════════════════════════╗"
echo "║   ✅ Deployment Complete!              ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🌐 Website: https://quantumrisefoundation.org"
echo "📊 API: https://quantumrisefoundation.org/api"
echo "🔍 Health: https://quantumrisefoundation.org/api/health"
echo ""
echo "📝 Logs:"
echo "   Backend: sudo journalctl -u rise-backend.service -f"
echo "   Nginx: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "Last deployed: $(date)"
