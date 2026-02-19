# SaaS Enterprise Platform - API Documentation

Complete API reference for all microservices.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://api.yourdomain.com`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Obtaining a Token

**Register:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": "userId",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "subscription": {
      "plan": "free",
      "active": true
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Auth Service API

### Register User

```
POST /auth/register
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "userId",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "token": "jwt_token"
}
```

### Login User

```
POST /auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {...},
  "token": "jwt_token"
}
```

### Verify Token

```
GET /auth/verify
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "userId",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "subscription": {...}
  }
}
```

### Generate API Key

```
POST /auth/generate-api-key
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Production API Key"
}
```

**Response:**
```json
{
  "message": "API key generated",
  "apiKey": "api_key_string",
  "expiresIn": "1 year"
}
```

## Link Service API

### Create Short Link

```
POST /links/create
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "originalUrl": "https://example.com/very-long-url-that-is-hard-to-share",
  "customAlias": "mylink",
  "title": "My Custom Link",
  "description": "A helpful short link",
  "tags": ["marketing", "social"],
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "message": "Link created successfully",
  "link": {
    "id": "linkId",
    "shortCode": "abc123",
    "originalUrl": "https://example.com/very-long-url...",
    "shortUrl": "http://localhost:3000/l/abc123",
    "title": "My Custom Link",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get User's Links

```
GET /links/list?page=1&limit=20&tag=marketing
Authorization: Bearer <token>
```

**Response:**
```json
{
  "links": [
    {
      "id": "linkId",
      "shortCode": "abc123",
      "originalUrl": "https://example.com/...",
      "title": "My Link",
      "clicks": 150,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 250,
    "pages": 13
  }
}
```

### Get Link Details

```
GET /links/:linkId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "linkId",
  "shortCode": "abc123",
  "originalUrl": "https://example.com/...",
  "title": "My Link",
  "description": "Description",
  "tags": ["marketing"],
  "clicks": 150,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Update Link

```
PUT /links/:linkId
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "tags": ["marketing", "social", "new"],
  "isActive": true
}
```

**Response:**
```json
{
  "message": "Link updated successfully",
  "link": {...}
}
```

### Delete Link

```
DELETE /links/:linkId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Link deleted successfully"
}
```

### Get Link Statistics

```
GET /links/:linkId/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "shortCode": "abc123",
  "totalClicks": 1500,
  "recentClicks": 120,
  "topCountries": [
    {"country": "US", "count": 450},
    {"country": "UK", "count": 300},
    {"country": "CA", "count": 200}
  ],
  "clickTrend": [
    {"date": "2024-01-15", "clicks": 120},
    {"date": "2024-01-14", "clicks": 110}
  ]
}
```

### Redirect to Original URL

```
GET /links/redirect/:shortCode
```

**Response:** 302 redirect to original URL

## Analytics Service API

### Track Event

```
POST /analytics/events
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "eventType": "link_clicked",
  "resourceType": "link",
  "resourceId": "linkId",
  "metadata": {
    "country": "US",
    "device": "mobile",
    "browser": "Chrome",
    "referer": "https://twitter.com"
  }
}
```

**Response:**
```json
{
  "message": "Event tracked successfully",
  "eventId": "eventId"
}
```

### Get Events

```
GET /analytics/events?eventType=link_created&page=1&limit=50
Authorization: Bearer <token>
```

**Response:**
```json
{
  "events": [
    {
      "_id": "eventId",
      "userId": "userId",
      "eventType": "link_created",
      "resourceType": "link",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1250,
    "pages": 25
  }
}
```

### Get Dashboard

```
GET /analytics/dashboard?days=30
Authorization: Bearer <token>
```

**Response:**
```json
{
  "summary": {
    "totalEvents": 5000,
    "averagePerDay": 167,
    "uniqueDays": 30
  },
  "eventsByType": {
    "link_created": 150,
    "link_clicked": 4500,
    "api_call": 350
  },
  "eventsByDay": [
    {"date": "2024-01-15", "count": 180},
    {"date": "2024-01-14", "count": 165}
  ],
  "topCountries": [
    {"name": "US", "count": 2500},
    {"name": "UK", "count": 1200}
  ],
  "topDevices": [
    {"name": "mobile", "count": 3000},
    {"name": "desktop", "count": 2000}
  ]
}
```

## Billing Service API

### Get Subscription

```
GET /billing/subscription
Authorization: Bearer <token>
```

**Response:**
```json
{
  "subscription": {
    "userId": "userId",
    "plan": "free",
    "status": "active",
    "billingCycle": {
      "start": "2024-01-01T00:00:00Z",
      "renewDate": "2024-02-01T00:00:00Z"
    },
    "usage": {
      "linksCreated": 45,
      "apiCallsUsed": 5000
    }
  },
  "limits": {
    "linksPerMonth": 100,
    "customDomains": false,
    "teamMembers": 1,
    "apiRequests": 10000
  }
}
```

### Upgrade Plan

```
POST /billing/upgrade
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "newPlan": "pro"
}
```

**Response:**
```json
{
  "message": "Plan upgraded successfully",
  "subscription": {...},
  "invoice": "INV-123456789"
}
```

### Record Usage

```
POST /billing/usage
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "linksCreated": 5,
  "apiCallsUsed": 250
}
```

**Response:**
```json
{
  "message": "Usage recorded",
  "usage": {
    "linksCreated": 50,
    "apiCallsUsed": 5250
  },
  "limits": {...}
}
```

### Get Invoices

```
GET /billing/invoices?page=1&limit=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "invoices": [
    {
      "_id": "invoiceId",
      "invoiceNumber": "INV-123456",
      "amount": 29.00,
      "currency": "USD",
      "status": "paid",
      "dueDate": "2024-02-15T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "pages": 1
  }
}
```

### Cancel Subscription

```
POST /billing/cancel
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Subscription canceled",
  "subscription": {...}
}
```

## Admin Service API

### Get User Statistics (Admin Only)

```
GET /admin/users/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "totalUsers": 1250,
  "activeUsers": 890,
  "newUsersThisMonth": 145,
  "churnRate": 2.3,
  "avgSubscriptionValue": 65.50
}
```

### Get System Health (Admin Only)

```
GET /admin/system/health
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": 86400,
  "memory": {
    "rss": "128 MB",
    "heapUsed": "64 MB",
    "heapTotal": "256 MB"
  },
  "services": {
    "auth": "operational",
    "links": "operational",
    "analytics": "operational",
    "billing": "operational"
  }
}
```

### Get Revenue Reports (Admin Only)

```
GET /admin/reports/revenue?month=2024-01
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "month": "2024-01",
  "totalRevenue": 45230.50,
  "subscriptionRevenue": 40000,
  "apiCallRevenue": 5230.50,
  "byPlan": {
    "free": 0,
    "pro": 25000,
    "enterprise": 15000
  }
}
```

## Audit Service API

### Log Audit Event

```
POST /audit/log
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "userId": "userId",
  "action": "link_created",
  "resource": "link",
  "resourceId": "linkId",
  "changes": {
    "title": "My Link"
  },
  "ipAddress": "192.168.1.1"
}
```

**Response:**
```json
{
  "message": "Audit logged",
  "logId": "auditLogId"
}
```

### Get User Audit Logs

```
GET /audit/logs/:userId?page=1&limit=50&action=link_created
Authorization: Bearer <token>
```

**Response:**
```json
{
  "logs": [
    {
      "id": "logId",
      "userId": "userId",
      "action": "link_created",
      "resource": "link",
      "resourceId": "linkId",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 250,
    "pages": 5
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## Rate Limiting

- **Auth endpoints**: 5 requests per 15 minutes per IP
- **API endpoints**: 100 requests per 15 minutes per token

Rate limit headers:
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## Pagination

List endpoints support pagination:

```
GET /endpoint?page=1&limit=20
```

Response includes pagination object:
```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "pages": 25
  }
}
```

## Testing with cURL

```bash
# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123!","firstName":"Test","lastName":"User"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123!"}' | jq -r '.token')

# Create link
curl -X POST http://localhost:3000/links/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com","title":"My Link"}'

# Get links
curl -X GET http://localhost:3000/links/list \
  -H "Authorization: Bearer $TOKEN"
```

## Testing with Postman

1. Import the [Postman Collection](./postman-collection.json)
2. Set environment variable: `token` = Your JWT token
3. Use pre-built requests for all endpoints

## Webhooks (Future Feature)

Planned webhook events:
- `link.created`
- `link.deleted`
- `click.tracked`
- `subscription.upgraded`
- `subscription.downgraded`
- `invoice.generated`

## Contact & Support

- API Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Email: support@example.com
- Slack: [Join our community](https://slack.example.com)
