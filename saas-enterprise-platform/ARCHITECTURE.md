# SaaS Enterprise Platform - Architecture Documentation

Complete system architecture, design patterns, and service interactions.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Web/Mobile)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTPS/REST
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     API Gateway                              │
│          (Load Balancer & Request Router)                    │
│                   Port: 3000                                 │
└──────┬──────────┬──────────┬──────────┬──────────┬──────────┘
       │          │          │          │          │
   HTTP   HTTP   HTTP      HTTP       HTTP      HTTP
       │          │          │          │          │
┌──────▼─┐  ┌──────▼─┐  ┌──────▼─┐  ┌──────▼─┐  ┌──────▼─┐
│  Auth  │  │ Links  │  │Analytics│ │Billing │  │ Admin  │
│Service │  │Service │  │ Service │  │Service │  │Service │
│ :3001  │  │ :3002  │  │ :3003   │  │ :3004  │  │ :3005  │
└───┬────┘  └───┬────┘  └────┬────┘  └───┬────┘  └───┬────┘
    │          │             │            │          │
    │      ┌───▼────────────▼────────┐   │          │
    └──────┤                         │───┘          │
           │                         │              │
       ┌───▼──────────────────────────────────────┐ │
       │                                          │ │
       │     MongoDB Database Cluster             │ │
       │  (Separate DB per service)               │ │
       │                                          │ │
       └────────────────────────────────────────┬┘ │
                                                 │  │
                           ┌─────────────────────┘  │
                           │                        │
                      ┌────▼──────┐           ┌────▼──────┐
                      │   Audit   │           │Monitoring │
                      │  Service  │           │  & Logs   │
                      │  :3006    │           │  (Winston) │
                      └───────────┘           └───────────┘
```

## Microservices Architecture

### Principles

1. **Single Responsibility**: Each service handles one business domain
2. **Loose Coupling**: Services communicate via well-defined APIs
3. **High Cohesion**: Related functionality grouped together
4. **Independent Deployment**: Each service can be deployed independently
5. **Scalable**: Services can be scaled individually based on load

### Service Responsibilities

#### 1. API Gateway (Port 3000)

**Purpose**: Entry point for all client requests

**Responsibilities**:
- Route requests to appropriate microservices
- JWT token validation
- Request/response logging
- CORS handling
- Rate limiting

**Key Technologies**:
- Express.js
- http-proxy (for forwarding)
- Helmet (security headers)

**Dependencies**:
- All microservices (via HTTP proxies)

#### 2. Auth Service (Port 3001)

**Purpose**: User authentication and authorization

**Key Endpoints**:
- User registration and login
- Token generation and validation
- API key management
- User profile management

**Database Models**:
- User (email, password hash, profile, subscription, API keys)

**Key Technologies**:
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)

**Responsibilities**:
- Password security (hashing, salting)
- JWT token generation
- User session management
- Multi-factor authentication (future)

#### 3. Link Service (Port 3002)

**Purpose**: URL shortening and link management

**Key Endpoints**:
- Create short links
- Retrieve link details
- Update links
- Delete links
- Redirect to original URL
- Link statistics

**Database Models**:
- Link (originalUrl, shortCode, metadata, clickDetails)

**Key Technologies**:
- Express.js
- MongoDB
- nanoid (short code generation)

**Responsibilities**:
- URL validation and shortening
- Custom alias management
- Click tracking
- Link analytics
- Expiration management

#### 4. Analytics Service (Port 3003)

**Purpose**: Event tracking and analytics

**Key Endpoints**:
- Track events
- Retrieve events
- Dashboard data
- Resource statistics

**Database Models**:
- Event (userId, eventType, metadata, timestamp)

**Key Technologies**:
- Express.js
- MongoDB
- Aggregation pipelines

**Responsibilities**:
- Event ingestion
- Data aggregation
- Time-series analytics
- Report generation

#### 5. Billing Service (Port 3004)

**Purpose**: Subscription and payment management

**Key Endpoints**:
- Get subscription info
- Upgrade/downgrade plans
- Usage tracking
- Invoice management
- Subscription cancellation

**Database Models**:
- Subscription (plan, status, limits, usage)
- Invoice (billing details, line items)

**Key Technologies**:
- Express.js
- MongoDB
- (Future: Stripe integration)

**Responsibilities**:
- Subscription lifecycle management
- Usage tracking and enforcement
- Invoice generation
- Payment processing (future)

#### 6. Admin Service (Port 3005)

**Purpose**: Administrative functions and system management

**Key Endpoints**:
- User statistics
- System health checks
- User suspension/activation
- Revenue reports
- Feature flags

**Key Technologies**:
- Express.js
- Role-based access control

**Responsibilities**:
- Admin access control
- System monitoring
- User management
- Revenue reporting

#### 7. Audit Service (Port 3006)

**Purpose**: Compliance and security audit logging

**Key Endpoints**:
- Log audit events
- Retrieve audit logs
- Admin audit access

**Database Models**:
- AuditLog (userId, action, resource, timestamp)

**Key Technologies**:
- Express.js
- MongoDB

**Responsibilities**:
- Action logging
- Compliance tracking
- Security auditing
- Data retention

## Data Flow Patterns

### User Registration Flow

```
Client
  │ POST /auth/register
  ▼
API Gateway (Port 3000)
  │ route: /auth/*
  ▼
Auth Service (Port 3001)
  │ 1. Validate email format
  │ 2. Check for existing user
  │ 3. Hash password with bcrypt
  │ 4. Create user document
  │ 5. Generate JWT token
  ▼
MongoDB (saas-auth)
  │ Insert User document
  ▼
Response with token & user data
  │
  ▼
Audit Service (Port 3006) [Async]
  │ Log: user.registered event
  ▼
Client receives token
```

### Link Creation Flow

```
Client (with valid JWT)
  │ POST /links/create
  ▼
API Gateway (Port 3000)
  │ Verify JWT token
  │ route: /links/*
  ▼
Link Service (Port 3002)
  │ 1. Validate original URL
  │ 2. Generate short code (or use custom alias)
  │ 3. Check for conflicts
  │ 4. Create link document
  │ 5. Emit event
  ▼
MongoDB (saas-links)
  │ Insert Link document
  ▼
Analytics Service (Port 3003) [Async]
  │ Track: link.created event
  ▼
Billing Service (Port 3004) [Async]
  │ Record: 1 link created
  │ Check: usage limits
  ▼
Audit Service (Port 3006) [Async]
  │ Log: link.created action
  ▼
Response with short link
  │
  ▼
Client
```

### Click Tracking Flow

```
External User
  │ GET /l/abc123 (from social media, email, etc.)
  ▼
API Gateway → Link Service (Port 3002)
  │ 1. Look up short code
  │ 2. Increment click counter
  │ 3. Log click details (country, device, referer)
  │ 4. Cap click details to 1000
  ▼
MongoDB (saas-links)
  │ Update Link document
  ▼
Analytics Service (Port 3003) [Async]
  │ Track: link.clicked event
  │ Timestamp & metadata
  ▼
302 Redirect to original URL
  │
  ▼
External User → Original URL
```

### Analytics Dashboard Flow

```
Client (with valid JWT)
  │ GET /analytics/dashboard?days=30
  ▼
API Gateway (Port 3000)
  │ Verify JWT token
  │ route: /analytics/*
  ▼
Analytics Service (Port 3003)
  │ 1. Query events from last 30 days
  │ 2. Group by event type
  │ 3. Aggregate by day
  │ 4. Calculate country distribution
  │ 5. Calculate device distribution
  ▼
MongoDB (saas-analytics)
  │ Aggregation pipeline
  │ $match -> $group -> $sort
  ▼
Response with dashboard data
  │ {
  │   summary: {...},
  │   eventsByType: {...},
  │   eventsByDay: [...],
  │   topCountries: [...],
  │   topDevices: [...]
  │ }
  ▼
Client renders charts/graphs
```

## Communication Patterns

### Synchronous Communication

Direct HTTP requests between services (via API Gateway):

```
Service A
  │ HTTP POST/GET
  ▼
Service B
  │ Process & Response
  ▼
Service A
```

**Use Case**: User login validation, link retrieval

**Pros**:
- Simple request/response
- Strong consistency
- Real-time feedback

**Cons**:
- Tight coupling
- Potential cascading failures

### Asynchronous Communication

Event-driven patterns (future implementation):

```
Service A (Events Publisher)
  │ Emit event: "link.created"
  ▼
Event Bus / Message Queue
  │ Kafka / RabbitMQ / Redis Pub/Sub
  ▼
Service B (Subscriber)
Service C (Subscriber)
Service D (Subscriber)
  │ Process event independently
```

**Use Cases**:
- Analytics tracking
- Audit logging
- Email notifications
- Webhook dispatching

**Benefits**:
- Loose coupling
- Scalability
- Resilience

## Database Design

### MongoDB Collections per Service

```
saas-auth/
├── users (user accounts)
├── sessions (optional)

saas-links/
├── links (short links)

saas-analytics/
├── events (tracked events)

saas-billing/
├── subscriptions (user subscriptions)
├── invoices (billing history)

saas-admin/
├── (no persistent data, stateless)

saas-audit/
├── auditLogs (compliance logs)
```

### Indexing Strategy

**High-traffic collections** (links, events):
```javascript
// Composite indexes for common queries
db.links.createIndex({ userId: 1, createdAt: -1 })
db.links.createIndex({ shortCode: 1 })
db.links.createIndex({ userId: 1, isActive: 1 })

db.events.createIndex({ userId: 1, timestamp: -1 })
db.events.createIndex({ eventType: 1, timestamp: -1 })
```

### Data Retention Policies

- **Events**: 90 days (TTL index)
- **Audit Logs**: 1 year (compliance requirement)
- **Links**: Permanent (or configurable expiration)
- **Invoices**: 7 years (tax requirement)

## Authentication & Authorization

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user",
    "iat": 1516239022,
    "exp": 1516325422
  }
}
```

**Token Expiry**: 7 days

### Role-Based Access Control

```javascript
// User Roles
roles = {
  "user": ["read_own_links", "create_links", "view_analytics"],
  "admin": ["read_all_users", "suspend_users", "view_reports", "system_health"],
  "superadmin": ["all_permissions"]
}
```

### Middleware Chain

```
Request
  ├─ Express Middleware
  │  ├─ Helmet (security headers)
  │  ├─ CORS
  │  └─ Request logging
  │
  ├─ Route Handler
  │  ├─ JWT verification (if protected route)
  │  ├─ Authorization check
  │  └─ Business logic
  │
  └─ Response
     ├─ Status code
     ├─ Error handling
     └─ Logging
```

## Scaling Architecture

### Horizontal Scaling

Each service can be scaled independently:

```
┌─────────────────────────────────────┐
│      Load Balancer (nginx)           │
│  Routes across service instances    │
└────────┬────────────────────────────┘
         │
    ┌────┼────┬────┬────┐
    │    │    │    │    │
┌───▼─┐┌──▼──┐┌──▼──┐┌──▼──┐
│Auth │ Auth │ Auth │ Auth │
│ S1  │ S2   │ S3   │ S4   │
└─────┘└─────┘└─────┘└─────┘

┌───────┬───────┬───────┬───────┐
│ Link  │ Link  │ Link  │       │
│ S1    │ S2    │ S3    │       │
└───────┴───────┴───────┴───────┘

MongoDB Replica Set
├─ Primary (writes)
├─ Secondary (reads)
└─ Secondary (backup)
```

### Caching Strategy

**In-Memory Caching** (Redis - future):
- User sessions
- Short links (frequently accessed)
- API rate limit counters

**Database Query Caching**:
- Dashboard aggregations (cache for 5 minutes)
- User subscription info (cache for 1 hour)

## Deployment Topology

### Development

```
Single Machine
├─ API Gateway (port 3000)
├─ Auth Service (port 3001)
├─ Link Service (port 3002)
├─ Analytics Service (port 3003)
├─ Billing Service (port 3004)
├─ Admin Service (port 3005)
├─ Audit Service (port 3006)
└─ MongoDB (port 27017)
```

### Staging

```
Docker Compose on staging server
├─ API Gateway container
├─ 6 Service containers
├─ MongoDB container
└─ Volumes for persistence
```

### Production

```
Kubernetes Cluster
├─ Ingress Controller (SSL/TLS)
├─ API Gateway Service (replicas: 3)
├─ Auth Service (replicas: 5)
├─ Link Service (replicas: 5)
├─ Analytics Service (replicas: 3)
├─ Billing Service (replicas: 3)
├─ Admin Service (replicas: 2)
├─ Audit Service (replicas: 2)
├─ MongoDB StatefulSet (replicas: 3)
├─ ConfigMaps (configuration)
├─ Secrets (credentials)
└─ PersistentVolumes (data storage)
```

## Monitoring & Observability

### Health Checks

Each service exposes `/health` endpoint:

```bash
curl http://localhost:3001/health

Response:
{
  "status": "healthy",
  "service": "auth-service",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Logging

**Winston Logger** (all services):
- Log files: `logs/` directory
- Console output: development
- Log levels: error, warn, info, debug

**Structured Logging**:
```javascript
logger.info('User registered', {
  service: 'auth-service',
  userId: '507f1f77bcf86cd799439011',
  email: 'user@example.com',
  timestamp: new Date()
})
```

### Metrics

**Prometheus metrics** (future):
- Request latency
- Error rates
- CPU/Memory usage
- Database query times

### Distributed Tracing

**Jaeger tracing** (future):
- Request flow across services
- Service dependencies
- Performance bottlenecks

## Error Handling

### Error Categories

| Type | Cause | Action |
|------|-------|--------|
| 4xx Client | Invalid request | Return error response |
| 5xx Server | Internal error | Log, retry, alert |
| Database | Connection loss | Failover, circuit breaker |
| External API | Timeout | Retry with exponential backoff |

### Circuit Breaker Pattern

```
Service A calls Service B
  │
  ├─ Success → Closed state → try next time
  ├─ Failure → Half-open state → test recovery
  └─ Consecutive failures → Open state → fail fast
```

## Security Architecture

### Defense Layers

1. **Network Layer**:
   - HTTPS/TLS encryption
   - VPN/Private network between services
   - Firewall rules

2. **Application Layer**:
   - JWT token validation
   - Input validation & sanitization
   - CORS policy enforcement
   - Rate limiting

3. **Data Layer**:
   - Database authentication
   - Encryption at rest
   - Encryption in transit
   - Access control lists

4. **Operational Layer**:
   - Audit logging
   - Security monitoring
   - Incident response
   - Regular backups

## Future Enhancements

- [ ] Implement message queue (Kafka/RabbitMQ)
- [ ] Add caching layer (Redis)
- [ ] Implement gRPC for service communication
- [ ] Add WebSocket support for real-time updates
- [ ] Implement API versioning
- [ ] Add GraphQL support
- [ ] Implement OAuth2/OpenID Connect
- [ ] Add multi-tenancy support
- [ ] Implement service mesh (Istio)
- [ ] Add machine learning features

## References

- Microservices Architecture: Newman, S. (2015)
- Domain-Driven Design: Evans, E. (2003)
- Distributed Systems: Kleppmann, M. (2017)
