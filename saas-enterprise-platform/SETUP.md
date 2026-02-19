# SaaS Enterprise Platform - Setup Guide

Complete setup instructions for the production-grade microservices SaaS platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Docker Setup](#docker-setup)
- [Database Configuration](#database-configuration)
- [Service Architecture](#service-architecture)
- [Running Services](#running-services)
- [API Gateway](#api-gateway)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **MongoDB** 7.x or higher (for local development)
- **Docker** 20.x and **Docker Compose** 2.x (for containerized setup)
- **Git** 2.x

### System Requirements

- **RAM**: Minimum 4GB (8GB recommended for all services running)
- **Disk Space**: Minimum 2GB free
- **CPU**: Modern multi-core processor recommended

## Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repo-url>
cd saas-enterprise-platform

# Copy environment file
cp .env.example .env

# Install dependencies for API Gateway
cd services/api-gateway
npm install
cd ../..

# Install for each service
cd services/auth-service && npm install && cd ../..
cd services/link-service && npm install && cd ../..
cd services/analytics-service && npm install && cd ../..
cd services/billing-service && npm install && cd ../..
cd services/admin-service && npm install && cd ../..
cd services/audit-service && npm install && cd ../..
```

### 2. Configure MongoDB

**Option A: Local MongoDB**

```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install -y mongodb
sudo systemctl start mongod

# Windows
# Download from https://www.mongodb.com/try/download/community
# Run installer and follow prompts
```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Create a cluster
3. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/database`
4. Update `MONGO_URI` in `.env`

### 3. Configure Environment Variables

Edit `.env` with your settings:

```bash
# Core Settings
NODE_ENV=development
JWT_SECRET=your-secure-random-string-min-32-chars
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info

# MongoDB
MONGO_URI=mongodb://localhost:27017/saas-auth

# Service Ports
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
LINK_SERVICE_PORT=3002
ANALYTICS_SERVICE_PORT=3003
BILLING_SERVICE_PORT=3004
ADMIN_SERVICE_PORT=3005
AUDIT_SERVICE_PORT=3006
```

### 4. Run Services Locally

**Terminal 1 - API Gateway:**
```bash
cd services/api-gateway
npm run dev
# Server running on http://localhost:3000
```

**Terminal 2 - Auth Service:**
```bash
cd services/auth-service
npm run dev
# Server running on http://localhost:3001
```

**Terminal 3 - Link Service:**
```bash
cd services/link-service
npm run dev
# Server running on http://localhost:3002
```

**Terminal 4 - Analytics Service:**
```bash
cd services/analytics-service
npm run dev
# Server running on http://localhost:3003
```

**Terminal 5 - Billing Service:**
```bash
cd services/billing-service
npm run dev
# Server running on http://localhost:3004
```

**Terminal 6 - Admin Service:**
```bash
cd services/admin-service
npm run dev
# Server running on http://localhost:3005
```

**Terminal 7 - Audit Service:**
```bash
cd services/audit-service
npm run dev
# Server running on http://localhost:3006
```

## Docker Setup

### Quick Start with Docker Compose

```bash
# Navigate to project root
cd saas-enterprise-platform

# Copy environment file
cp .env.example .env

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps

# Stop services
docker-compose down
```

### Individual Service Management

```bash
# Start specific service
docker-compose up -d auth-service

# Restart a service
docker-compose restart auth-service

# View service logs
docker-compose logs -f auth-service

# Execute command in running container
docker-compose exec auth-service npm run dev
```

### Building Custom Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build auth-service

# Build with specific Node version
docker build --build-arg NODE_VERSION=18-alpine -t saas-auth:latest ./services/auth-service

# Push to registry (after tagging)
docker tag saas-auth:latest myregistry.azurecr.io/saas-auth:latest
docker push myregistry.azurecr.io/saas-auth:latest
```

## Database Configuration

### MongoDB Connection Examples

**Local Development:**
```
mongodb://localhost:27017/saas-auth
```

**With Authentication:**
```
mongodb://admin:password@localhost:27017/saas-auth?authSource=admin
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster.mongodb.net/saas-auth?retryWrites=true&w=majority
```

**Docker Compose:**
```
mongodb://admin:password@mongodb:27017/saas-auth?authSource=admin
```

### Database Initialization

Each service automatically creates its own database on first connection:
- `saas-auth` - User authentication data
- `saas-links` - Short link data
- `saas-analytics` - Analytics events
- `saas-billing` - Subscription and invoice data
- `saas-admin` - Admin data
- `saas-audit` - Audit logs

### Creating MongoDB Admin User

```bash
# Connect to MongoDB
mongosh

# Switch to admin database
use admin

# Create admin user
db.createUser({
  user: "admin",
  pwd: "password",
  roles: [ { role: "root", db: "admin" } ]
})

# Exit
exit
```

## Service Architecture

### API Gateway (Port 3000)

Entry point for all requests. Routes traffic to appropriate microservices.

**Routes:**
- `/auth/*` → Auth Service
- `/links/*` → Link Service
- `/analytics/*` → Analytics Service
- `/billing/*` → Billing Service
- `/admin/*` → Admin Service
- `/audit/*` → Audit Service
- `/health` → Health check

### Auth Service (Port 3001)

Handles user authentication, registration, and JWT token generation.

**Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/verify` - Verify token
- `POST /auth/generate-api-key` - Generate API key

### Link Service (Port 3002)

Manages short links and click tracking.

**Endpoints:**
- `POST /links/create` - Create short link
- `GET /links/list` - List user's links
- `GET /links/:id` - Get link details
- `PUT /links/:id` - Update link
- `DELETE /links/:id` - Delete link
- `GET /links/:id/stats` - Get link statistics
- `GET /links/redirect/:shortCode` - Redirect to original URL

### Analytics Service (Port 3003)

Tracks events and provides analytics dashboards.

**Endpoints:**
- `POST /analytics/events` - Track event
- `GET /analytics/events` - Get events
- `GET /analytics/dashboard` - Get dashboard data
- `GET /analytics/resources/stats` - Get resource statistics

### Billing Service (Port 3004)

Manages subscriptions and billing.

**Endpoints:**
- `GET /billing/subscription` - Get subscription
- `POST /billing/upgrade` - Upgrade plan
- `POST /billing/usage` - Record usage
- `GET /billing/invoices` - Get invoices
- `POST /billing/cancel` - Cancel subscription

### Admin Service (Port 3005)

Admin panel and system management (requires admin role).

**Endpoints:**
- `GET /admin/users/stats` - User statistics
- `GET /admin/system/health` - System health
- `POST /admin/users/:userId/suspend` - Suspend user
- `GET /admin/reports/revenue` - Revenue reports

### Audit Service (Port 3006)

Audit logging for compliance and security.

**Endpoints:**
- `POST /audit/log` - Log audit event
- `GET /audit/logs/:userId` - Get user's audit logs
- `GET /audit/logs-admin` - Get all audit logs (admin only)

## Running Services

### Development Mode

```bash
# Run individual service in watch mode
cd services/auth-service
npm run dev
```

### Production Mode

```bash
# Build and run service
cd services/auth-service
npm install --production
npm start
```

### Using PM2 for Process Management

```bash
# Install PM2 globally
npm install -g pm2

# Start all services with PM2
pm2 start ecosystem.config.js

# Monitor processes
pm2 monit

# View logs
pm2 logs

# Stop all processes
pm2 stop all
```

## API Gateway

### Service Proxying

The API Gateway acts as a reverse proxy, forwarding requests to the appropriate microservice:

```javascript
// Request flow
http://localhost:3000/auth/login
↓
API Gateway (port 3000)
↓
Auth Service (port 3001)
↓
Response back to client
```

### Health Checks

Each service provides a health endpoint:

```bash
# Check individual services
curl http://localhost:3000/health     # API Gateway
curl http://localhost:3001/health     # Auth Service
curl http://localhost:3002/health     # Link Service
curl http://localhost:3003/health     # Analytics Service
curl http://localhost:3004/health     # Billing Service
curl http://localhost:3005/health     # Admin Service
curl http://localhost:3006/health     # Audit Service

# With Docker Compose
docker-compose ps                      # Check container status
```

## Environment Variables

### Core Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | dev-secret |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | info |

### Database Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | mongodb://localhost:27017 |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB admin username | admin |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB admin password | password |

### Service Port Variables

| Variable | Service | Default |
|----------|---------|---------|
| `API_GATEWAY_PORT` | API Gateway | 3000 |
| `AUTH_SERVICE_PORT` | Auth Service | 3001 |
| `LINK_SERVICE_PORT` | Link Service | 3002 |
| `ANALYTICS_SERVICE_PORT` | Analytics Service | 3003 |
| `BILLING_SERVICE_PORT` | Billing Service | 3004 |
| `ADMIN_SERVICE_PORT` | Admin Service | 3005 |
| `AUDIT_SERVICE_PORT` | Audit Service | 3006 |

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh

# Check MongoDB status
systemctl status mongod

# Verify connection string
# Format: mongodb://[user:password@]host[:port]/database

# Check credentials
mongo -u admin -p password --authenticationDatabase admin
```

### Service Port Already in Use

```bash
# Find process using port
lsof -i :3000              # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>              # macOS/Linux
taskkill /PID <PID> /F     # Windows
```

### Docker Issues

```bash
# Check Docker installation
docker --version
docker-compose --version

# Rebuild images
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check container logs
docker-compose logs service-name
docker-compose logs --tail 100 -f

# Reset everything
docker-compose down -v     # Remove volumes too
```

### JWT Token Issues

```bash
# Generate new JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update in .env file
JWT_SECRET=<new-secret>

# Restart services
docker-compose restart
# or
npm run dev  # for local services
```

### Memory Issues

```bash
# Monitor Docker resource usage
docker stats

# Increase Docker memory limit
# Edit Docker Desktop settings or docker-compose.yml:
# services:
#   mongodb:
#     deploy:
#       resources:
#         limits:
#           memory: 2G
```

### Service Not Starting

```bash
# Check if MongoDB is accessible
curl http://localhost:27017/

# Verify environment variables
echo $MONGO_URI
echo $JWT_SECRET

# Run service with debug logging
LOG_LEVEL=debug npm run dev

# Check npm dependencies
npm install
npm audit fix
```

### Network Issues in Docker

```bash
# Check if services can communicate
docker-compose exec auth-service ping link-service

# Inspect network
docker network inspect saas-enterprise-platform_saas-network

# Recreate network
docker network rm saas-enterprise-platform_saas-network
docker-compose up -d --force-recreate
```

## Next Steps

1. **Create Frontend Dashboard** - See `ARCHITECTURE.md`
2. **Set Up CI/CD** - See deployment guide
3. **Configure Production MongoDB** - Use MongoDB Atlas or managed service
4. **Set Secure JWT Secret** - Generate using crypto
5. **Enable HTTPS** - Use reverse proxy (nginx/caddy)
6. **Set Up Monitoring** - Integration with monitoring service
7. **Configure Backups** - Database backup strategy

## Support & Documentation

- API Documentation: See `API.md`
- Architecture Overview: See `ARCHITECTURE.md`
- Docker Deployment: See `DOCKER.md`
- Production Deployment: See `DEPLOYMENT.md`
