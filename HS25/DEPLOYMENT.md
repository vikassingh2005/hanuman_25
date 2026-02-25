# Deployment Guide

This guide provides instructions for deploying the full-stack application to production environments.

## Backend Deployment

### Option 1: Deploying to Heroku

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku CLI:
   ```
   heroku login
   ```
3. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```
4. Add MongoDB add-on or set environment variable for your MongoDB Atlas connection:
   ```
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   ```
5. Set JWT secret:
   ```
   heroku config:set JWT_SECRET=your_jwt_secret
   ```
6. Set other environment variables:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set JWT_EXPIRE=30d
   ```
7. Deploy the backend:
   ```
   git subtree push --prefix backend heroku main
   ```

### Option 2: Deploying to a VPS (Digital Ocean, AWS EC2, etc.)

1. SSH into your server
2. Install Node.js and npm
3. Clone your repository
4. Navigate to the backend directory
5. Install dependencies:
   ```
   npm install --production
   ```
6. Set up environment variables in a .env file
7. Install PM2 for process management:
   ```
   npm install -g pm2
   ```
8. Start the server with PM2:
   ```
   pm2 start src/server.js --name "fullstack-backend"
   ```
9. Set up PM2 to start on system reboot:
   ```
   pm2 startup
   pm2 save
   ```
10. Set up Nginx as a reverse proxy (optional but recommended)

## Frontend Deployment

### Option 1: Deploying to Netlify/Vercel

1. Build the React application:
   ```
   cd frontend
   npm run build
   ```
2. Install Netlify CLI:
   ```
   npm install -g netlify-cli
   ```
3. Deploy to Netlify:
   ```
   netlify deploy
   ```
4. Set up environment variables in Netlify dashboard
5. Configure redirects for React Router in `netlify.toml` or `_redirects` file

### Option 2: Serving from the Same Server as Backend

1. Build the React application:
   ```
   cd frontend
   npm run build
   ```
2. Move the build folder to your backend's public directory
3. Configure Express to serve static files:
   ```javascript
   // In server.js
   app.use(express.static('public'));
   
   // For all other routes, serve the React app
   app.get('*', (req, res) => {
     res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
   });
   ```

## Setting Up a CI/CD Pipeline (Optional)

### GitHub Actions

Create a `.github/workflows/main.yml` file:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - name: Install backend dependencies
        run: cd backend && npm ci
      - name: Run backend tests
        run: cd backend && npm test
      - name: Install frontend dependencies
        run: cd frontend && npm ci
      - name: Run frontend tests
        run: cd frontend && npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "your-app-name"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## Database Backups

For MongoDB Atlas:

1. Set up automated backups in the Atlas dashboard
2. For manual backups, use mongodump:
   ```
   mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/database"
   ```

## SSL Configuration

If using Nginx as a reverse proxy:

1. Install Certbot:
   ```
   sudo apt-get install certbot python3-certbot-nginx
   ```
2. Obtain SSL certificate:
   ```
   sudo certbot --nginx -d yourdomain.com
   ```
3. Set up auto-renewal:
   ```
   sudo certbot renew --dry-run
   ```

## Monitoring

1. Set up application monitoring with tools like:
   - PM2 monitoring
   - New Relic
   - Datadog
   - Sentry for error tracking

2. Set up server monitoring:
   - CPU, memory, and disk usage
   - Network traffic
   - Error logs