# ShareNet Frontend Deployment Guide

This guide will help you deploy the ShareNet frontend to various platforms.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API URL configured

## Environment Configuration

### 1. Update Production Environment Variables

Edit `.env.production` and update the following:

```bash
# Backend API URL - Change this to your production backend
VITE_API_URL=https://your-production-backend.com/api

# Other settings
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3
VITE_ENABLE_ANALYTICS=true
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   npm run deploy:vercel
   ```

3. **Or use the automated script**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   npm run deploy:netlify
   ```

### Option 3: Docker

1. **Build Docker image**:
   ```bash
   docker build -t sharenet-frontend .
   ```

2. **Run container**:
   ```bash
   docker run -p 80:80 sharenet-frontend
   ```

3. **For production with environment variables**:
   ```bash
   docker run -p 80:80 \
     -e VITE_API_URL=https://your-backend.com/api \
     sharenet-frontend
   ```

### Option 4: Static Hosting (GitHub Pages, S3, etc.)

1. **Build the application**:
   ```bash
   npm run build:production
   ```

2. **Upload the `dist` folder** to your hosting provider.

## Manual Build Process

If you want to build manually:

```bash
# Install dependencies
npm ci

# Build for production
npm run build:production

# Preview the build
npm run preview:production
```

## Configuration Files

- `vercel.json` - Vercel deployment configuration
- `netlify.toml` - Netlify deployment configuration
- `Dockerfile` - Docker container configuration
- `nginx.conf` - Nginx configuration for Docker deployment

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080/api` |
| `VITE_API_TIMEOUT` | API request timeout | `10000` |
| `VITE_API_RETRY_ATTEMPTS` | API retry attempts | `3` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `true` |
| `VITE_ENABLE_DEBUG` | Enable debug mode | `false` |

## Performance Optimizations

The production build includes:

- **Code splitting**: Vendor, router, UI, and utilities are split into separate chunks
- **Tree shaking**: Unused code is removed
- **Minification**: Code is minified using Terser
- **Gzip compression**: Enabled in nginx configuration
- **Browser caching**: Static assets are cached for 1 year
- **Security headers**: Added security headers for production

## Troubleshooting

### Build Issues

1. **Clear node modules**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version**:
   ```bash
   node --version  # Should be 18+
   ```

### Runtime Issues

1. **Check API connectivity**: Ensure `VITE_API_URL` is correct
2. **Check browser console** for any JavaScript errors
3. **Verify CORS settings** on the backend

### Deployment Issues

1. **Vercel**: Check `vercel.json` configuration
2. **Netlify**: Check `netlify.toml` configuration
3. **Docker**: Check Docker logs with `docker logs <container-id>`

## Monitoring and Analytics

To enable monitoring:

1. Set `VITE_ENABLE_ANALYTICS=true` in production
2. Add your analytics service to `src/components/Analytics.jsx`
3. Import and use the Analytics component in `App.jsx`

## Security Considerations

- Source maps are disabled in production
- Security headers are added via nginx configuration
- Environment variables are properly configured
- API calls should use HTTPS in production

## Support

For deployment issues:
1. Check the console logs
2. Verify environment variables
3. Ensure backend is accessible
4. Check network connectivity

## Next Steps

After deployment:
1. Test all functionality
2. Check API connectivity
3. Verify responsive design
4. Test on different browsers
5. Monitor performance metrics
