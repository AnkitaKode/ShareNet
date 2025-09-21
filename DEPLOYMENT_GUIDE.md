# ShareNet Deployment Guide

## 🚀 Quick Start (Development)

### Prerequisites
- Java 21 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Running Both Applications
```bash
# Option 1: Use the batch script (Windows)
./run-dev.bat

# Option 2: Manual start
# Terminal 1 - Backend
cd backend
./mvnw spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 Environment Configurations

### Frontend Environment Files
- `.env` - Development configuration
- `.env.staging` - Staging configuration  
- `.env.production` - Production configuration

### Backend Environment Profiles
- `application.properties` - Development configuration
- `application-staging.properties` - Staging configuration
- `application-prod.properties` - Production configuration

## 🏭 Production Deployment

### Option 1: Traditional Deployment
```bash
# Build and run production
./run-prod.bat
```

### Option 2: Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Configuration Variables

### Frontend (.env files)
```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Pass-It-On
VITE_APP_VERSION=1.0.0
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### Backend (application.properties)
```properties
# Database
DATABASE_URL=jdbc:mysql://localhost:3306/sharenet_db
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password

# Server
PORT=8080
ALLOWED_ORIGINS=https://your-domain.com

# SSL (Production)
SSL_ENABLED=false
SSL_KEYSTORE=path/to/keystore.p12
SSL_KEYSTORE_PASSWORD=your_keystore_password
```

## 🗄️ Database Setup

### Development
```sql
CREATE DATABASE IF NOT EXISTS sharenet_db;
USE sharenet_db;
-- Tables will be created automatically by Hibernate
```

### Production
```sql
CREATE DATABASE IF NOT EXISTS sharenet_db;
CREATE USER 'sharenet_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON sharenet_db.* TO 'sharenet_user'@'%';
FLUSH PRIVILEGES;
```

## 📊 Health Checks

### Backend Health Check
```bash
curl http://localhost:8080/health
```

### Frontend Health Check
```bash
curl http://localhost:3000
```

## 🔒 Security Considerations

### Production Checklist
- [ ] Change default database passwords
- [ ] Enable SSL/HTTPS
- [ ] Configure proper CORS origins
- [ ] Set secure environment variables
- [ ] Enable authentication/authorization
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging

## 📈 Monitoring

### Available Endpoints
- Health: `/actuator/health`
- Metrics: `/actuator/metrics`
- Info: `/actuator/info`

## 🐛 Troubleshooting

### Common Issues
1. **Port already in use**: Change ports in configuration files
2. **Database connection failed**: Check MySQL service and credentials
3. **CORS errors**: Verify allowed origins in backend configuration
4. **Build failures**: Ensure all dependencies are installed

### Logs Location
- Backend: Console output or configured log files
- Frontend: Browser console and terminal output

## 🚀 Deployment Platforms

### Recommended Platforms
- **Backend**: Heroku, AWS Elastic Beanstalk, Google Cloud Run
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Database**: AWS RDS, Google Cloud SQL, PlanetScale

### Environment Variables for Cloud Deployment
Set these in your cloud platform:
```
DATABASE_URL=your_cloud_database_url
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
ALLOWED_ORIGINS=https://your-frontend-domain.com
PORT=8080
```
