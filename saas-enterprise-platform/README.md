# SaaS Enterprise Platform 🚀

A **production-grade, enterprise-scale SaaS platform** built with **microservices architecture**. Complete with API Gateway, 6 specialized microservices, MongoDB database, Docker containerization, JWT authentication, and comprehensive monitoring.

## ✨ Features

### Core Features
- ✅ **User Authentication**: JWT-based auth with secure password hashing
- ✅ **URL Shortening**: Generate, manage, and track short links
- ✅ **Analytics**: Real-time event tracking and dashboards
- ✅ **Billing**: Subscription management with usage tracking
- ✅ **Admin Panel**: System monitoring and user management
- ✅ **Audit Logging**: Compliance-ready audit trails

### Enterprise Features
- 🔒 **Security**: Helmet headers, CORS, rate limiting, JWT validation
- 📊 **Monitoring**: Health checks, structured logging, error tracking
- 🐳 **Docker**: Complete containerization with docker-compose
- 🔄 **Scalable**: Microservices architecture for independent scaling
- 🗄️ **MongoDB**: Persistent data storage with proper indexing
- 🚀 **Production-Ready**: Error handling, validation, comprehensive logging

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         Frontend (Web/Mobile)        │
└────────────────────┬────────────────┘
                     │
              HTTPS + JWT Auth
                     │
┌────────────────────▼─────────────────┐
│          API Gateway (Port 3000)      │
│  Routing • Auth • CORS • Rate Limit   │
└──────┬────────┬────────┬────────┬────┘
       │        │        │        │
    HTTP    HTTP    HTTP    HTTP   HTTP
       │        │        │        │
┌──────▼┐ ┌─────▼─┐ ┌─────▼─┐ ┌──▼───┐
│ Auth  │ │ Links │ │        │ │      │
│:3001  │ │ :3002 │ │Analytics│Billing│...
└───┬───┘ └─────┬─┘ │ :3003   │ :3004 │
    │           │    └────┬────┘ └──┬───┘
    └───┬───────┴─────────┬─────────┘
        │                 │
    ┌───▼─────────────────▼───┐
    │   MongoDB Database      │
    │  (Separate DB per svc)  │
    └────────────────────────┘
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd saas-enterprise-platform
cp .env.example .env

# Install dependencies for all services
for dir in services/*/; do
  cd "$dir"
  npm install
  cd ../..
done
```

### 2. Start with Docker Compose

```bash
# Start all services (includes MongoDB)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api-gateway
```

### 3. Test the API

```bash
# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Create a short link
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}' \
  | jq -r '.token')

curl -X POST http://localhost:3000/links/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://github.com","title": "GitHub"}'
```

## 📁 Project Structure

```
saas-enterprise-platform/
├── services/
│   ├── api-gateway/          # Port 3000 - Request router
│   ├── auth-service/         # Port 3001 - User auth
│   ├── link-service/         # Port 3002 - URL shortening
│   ├── analytics-service/    # Port 3003 - Event tracking
│   ├── billing-service/      # Port 3004 - Subscriptions
│   ├── admin-service/        # Port 3005 - Admin panel
│   └── audit-service/        # Port 3006 - Audit logs
├── shared/
│   ├── logger.js             # Winston logging
│   ├── auth.js               # JWT middleware
│   └── rateLimiter.js        # Rate limiting
├── docker-compose.yml        # Complete Docker setup
├── .env.example              # Environment template
├── SETUP.md                  # Installation guide
├── ARCHITECTURE.md           # System design
├── API.md                    # API documentation
└── README.md                 # This file
```

## 🔧 Microservices

| Service | Port | Purpose |
|---------|------|---------|
| **API Gateway** | 3000 | Routes to microservices, auth, rate limiting |
| **Auth Service** | 3001 | User registration, login, JWT tokens |
| **Link Service** | 3002 | URL shortening, click tracking, statistics |
| **Analytics Service** | 3003 | Event tracking, dashboards, aggregation |
| **Billing Service** | 3004 | Subscriptions, usage tracking, invoices |
| **Admin Service** | 3005 | User stats, system health, revenue reports |
| **Audit Service** | 3006 | Compliance logging, action tracking |

## 💻 Tech Stack

- **Backend**: Node.js 18+, Express.js 4.18
- **Database**: MongoDB 7.0, Mongoose 7.0
- **Authentication**: JWT (jsonwebtoken 9.0)
- **Security**: bcryptjs 2.4, Helmet 7.0, CORS
- **Logging**: Winston 3.8
- **DevOps**: Docker 20.x, Docker Compose 2.x
- **ID Generation**: nanoid 4.0

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup, configuration, local & Docker deployment
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design, patterns, data flows, scaling
- **[API.md](./API.md)** - Complete API reference with examples

## 🔌 API Examples

**Register & Login**:
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John"
  }'
```

**Create Short Link**:
```bash
TOKEN="your-jwt-token"

curl -X POST http://localhost:3000/links/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://github.com/username/repo",
    "title": "My Repo"
  }'
```

**Get Analytics Dashboard**:
```bash
curl -X GET "http://localhost:3000/analytics/dashboard?days=30" \
  -H "Authorization: Bearer $TOKEN"
```

## 🚀 Deployment

### Development
```bash
# Run service with auto-reload
cd services/auth-service
npm run dev
```

### Docker Compose
```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production
See [SETUP.md](./SETUP.md) for:
- MongoDB Atlas setup
- Environment configuration
- SSL/TLS setup
- Kubernetes deployment

## 📊 Monitoring

```bash
# Health checks
curl http://localhost:3000/health     # API Gateway
curl http://localhost:3001/health     # Auth Service
# ... check all services

# View logs
docker-compose logs auth-service
docker-compose logs -f               # Follow in real-time
```

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT tokens (7-day expiry)
- ✅ CORS whitelist configuration
- ✅ Rate limiting (5 auth attempts/15min)
- ✅ Helmet security headers
- ✅ Input validation & sanitization
- ✅ Audit logging for compliance
- ✅ Environment variable secrets

## 📝 Environment Variables

```bash
# .env file
NODE_ENV=development
JWT_SECRET=your-secret-key (min 32 chars)
MONGO_URI=mongodb://localhost:27017/saas-auth
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

See `.env.example` for complete list.

## 📞 Support & Resources

- 📖 Full guide: [SETUP.md](./SETUP.md)
- 🏗️ Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🔌 API docs: [API.md](./API.md)
- 🐛 Issues: GitHub Issues
- 📧 Email: support@example.com

---

**Built with ❤️ for production-grade SaaS applications**

See `DEPLOYMENT.md` for complete deployment instructions.

## Documentation

- `ARCHITECTURE.md` - System design
- `API.md` - API documentation
- `SETUP.md` - Installation guide
- `DOCKER.md` - Docker deployment
