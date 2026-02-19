# 🏗️ Production-Grade Architecture Documentation

## Project Structure - Scalable Architecture

This dashboard has been refactored into a production-grade, scalable architecture following industry best practices.

---

## 📁 Backend Folder Structure

```
backend/
│
├── 📁 controllers/              ← Request handlers
│   ├── authController.js        ✅ Auth logic
│   └── linkController.js        ✅ Link logic
│
├── 📁 services/                 ← Business logic layer
│   ├── authService.js           ✅ Auth operations
│   └── linkService.js           ✅ Link operations
│
├── 📁 models/                   ← Database schemas
│   ├── User.js
│   └── Link.js
│
├── 📁 routes/                   ← Route definitions
│   ├── authRoutes.js            ✅ Auth endpoints
│   └── linkRoutes.js            ✅ Link endpoints
│
├── 📁 middleware/               ← Request processing
│   ├── auth.js                  ✅ JWT verification
│   ├── requestLogger.js         ✅ Request logging
│   ├── rateLimiter.js           ✅ Rate limiting
│   └── validators.js            ✅ Input validation
│
├── 📁 utils/                    ← Utility functions
│   ├── logger.js                ✅ Logging system
│   └── errorHandler.js          ✅ Error handling
│
├── 📁 config/                   ← Configuration (future)
│
├── 📁 logs/                     ← Application logs (auto-created)
│   ├── app-2026-02-19.log
│   └── error-2026-02-19.log
│
├── server.js                    ✅ Main app file
├── package.json
└── .env
```

---

## 🏛️ Architecture Layers

### 1️⃣ **Route Layer** (Entry Point)
```
Routes → Define endpoints
        → Validate input
        → Call controllers
```

**Files:** `routes/authRoutes.js`, `routes/linkRoutes.js`

**Example:**
```javascript
router.post('/login', validateEmail, validatePassword, authController.login);
```

---

### 2️⃣ **Controller Layer** (Request Handler)
```
Controller → Receive request
           → Validate with middleware
           → Call service
           → Return response
```

**Files:** `controllers/authController.js`, `controllers/linkController.js`

**Responsibilities:**
- Extract request data
- Call service methods
- Format responses
- Handle HTTP status codes

**Example:**
```javascript
login = catchAsync(async (req, res, next) => {
  const user = await authService.loginUser(email, password);
  const token = authService.generateToken(user.id);
  res.status(200).json({ success: true, token, user });
});
```

---

### 3️⃣ **Service Layer** (Business Logic)
```
Service → Implement business rules
        → Access database
        → Perform calculations
        → Validate data
        → Throw errors
```

**Files:** `services/authService.js`, `services/linkService.js`

**Responsibilities:**
- All business logic
- Database operations
- Validation logic
- Error handling
- Logging

**Example:**
```javascript
async loginUser(email, password) {
  // Validation
  if (!email || !password) {
    throw new AppError('Email and password required', 400);
  }

  // Find user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  logger.info('User logged in', { userId: user._id });
  return { id: user._id, email: user.email };
}
```

---

### 4️⃣ **Middleware Layer** (Request Processing)
```
Middleware → Validate input
           → Log requests
           → Check authentication
           → Rate limit
           → Handle errors
```

**Files in `middleware/` folder:**

| File | Purpose |
|------|---------|
| `auth.js` | JWT verification |
| `requestLogger.js` | Request/response logging |
| `rateLimiter.js` | Rate limiting |
| `validators.js` | Input validation |

**Example - Auth Middleware:**
```javascript
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) throw new AppError('No token', 401);
  
  const decoded = authService.verifyToken(token);
  req.user = decoded;
  next();
};
```

---

### 5️⃣ **Model Layer** (Database)
```
Model → Define schema
      → Apply validation
      → Create hooks
      → Interact with MongoDB
```

**Files:** `models/User.js`, `models/Link.js`

---

### 6️⃣ **Utils Layer** (Support Functions)
```
Utils → Logger
      → Error handler
      → Helpers
```

**Files in `utils/` folder:**

| File | Purpose |
|------|---------|
| `logger.js` | Centralized logging |
| `errorHandler.js` | Error handling & async wrapper |

---

## 🔄 Request Flow Diagram

```
CLIENT REQUEST
    ↓
┌─────────────────────────────────────┐
│ ROUTE LAYER                         │
│ POST /api/auth/login                │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ MIDDLEWARE LAYER                    │
│ ├─ validateEmail()                  │
│ ├─ validatePassword()               │
│ └─ errorHandler                     │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ CONTROLLER LAYER                    │
│ authController.login()              │
│ ├─ Extract email, password          │
│ ├─ Call authService.loginUser()     │
│ └─ Return JSON response             │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ SERVICE LAYER                       │
│ authService.loginUser()             │
│ ├─ Validate input                   │
│ ├─ Query database                   │
│ ├─ Check password                   │
│ ├─ Log activity                     │
│ └─ Return user object               │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ MODEL LAYER                         │
│ User.findOne() → MongoDB            │
│ user.matchPassword() → bcrypt       │
└─────────────────┬───────────────────┘
                  ↓
            RESPONSE
```

---

## 📊 Error Handling Flow

```
ERROR OCCURS
    ↓
┌─────────────────────────────────────┐
│ SERVICE LAYER                       │
│ throw new AppError(msg, status)     │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ CONTROLLER LAYER                    │
│ catchAsync catches error            │
│ Passes to next(error)               │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ ERROR HANDLER MIDDLEWARE            │
│ ├─ Log error to file                │
│ ├─ Format error message             │
│ ├─ Determine status code            │
│ └─ Send JSON response               │
└─────────────────┬───────────────────┘
                  ↓
            CLIENT RESPONSE
```

---

## 🔒 Middleware Pipeline

```
REQUEST
  ↓
requestLogger()  ← Logs incoming request
  ↓
rateLimiter()    ← Checks rate limits
  ↓
cors()           ← Handles cross-origin
  ↓
express.json()   ← Parses JSON body
  ↓
validators()     ← Validates input
  ↓
auth()           ← Verifies JWT token
  ↓
CONTROLLER/ROUTE
  ↓
errorHandler()   ← Catches all errors
  ↓
RESPONSE
```

---

## 💾 Logging System

### Log File Locations
```
logs/
├── app-2026-02-19.log      ← Info & debug logs
└── error-2026-02-19.log    ← Error logs only
```

### Log Levels

| Level | Purpose | Example |
|-------|---------|---------|
| **INFO** | General information | User registered |
| **WARN** | Warnings | Rate limit warning |
| **ERROR** | Errors | Failed login attempt |
| **DEBUG** | Development details | Token generated |

### Example Log Output
```
[2026-02-19T10:30:45.123Z] [INFO] User registered successfully {"userId":"507f1f77bcf86cd799439011","email":"user@example.com"}
[2026-02-19T10:30:52.456Z] [WARN] Login failed - invalid password {"email":"user@example.com"}
[2026-02-19T10:31:00.789Z] [ERROR] Error in POST /api/links {"message":"Short link already exists"}
```

---

## 🛡️ Error Handling

### Custom AppError Class
```javascript
throw new AppError('User not found', 404);
// Automatically caught and formatted
```

### Error Handler Features
- ✅ Catches all errors automatically
- ✅ Logs errors to file
- ✅ Formats error responses
- ✅ Distinguishes operational vs programming errors
- ✅ Different responses for dev vs production

### Error Response Example
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

---

## 🎯 Key Benefits of This Architecture

### ✅ **Separation of Concerns**
- Routes → Endpoints
- Controllers → Request handling
- Services → Business logic
- Models → Data layer
- Middleware → Cross-cutting concerns

### ✅ **Scalability**
- Easy to add new features
- Each layer can scale independently
- Services can be extracted to microservices
- Easy to add new middleware

### ✅ **Maintainability**
- Clear file organization
- Single responsibility
- Easy to find & modify code
- Self-documenting structure

### ✅ **Testability**
- Services can be tested independently
- Middleware can be tested in isolation
- Controllers are thin and easy to mock
- Errors are predictable

### ✅ **Security**
- Centralized error handling
- Input validation in middleware
- Comprehensive logging
- Rate limiting

### ✅ **Reliability**
- Comprehensive error handling
- Graceful shutdown
- Unhandled error catching
- Detailed logging

---

## 📝 Adding New Features

### Example: Add "Link Statistics" Feature

1. **Add Route** (`routes/linkRoutes.js`)
   ```javascript
   router.get('/stats', auth, linkController.getStats);
   ```

2. **Add Controller** (`controllers/linkController.js`)
   ```javascript
   getStats = catchAsync(async (req, res) => {
     const stats = await linkService.getStats(req.user.id);
     res.json({ success: true, data: stats });
   });
   ```

3. **Add Service** (`services/linkService.js`)
   ```javascript
   async getStats(userId) {
     const links = await Link.find({ userId });
     return {
       total: links.length,
       totalClicks: links.reduce((sum, l) => sum + l.clicks, 0)
     };
   }
   ```

4. **Done!** The error handling, logging, and validation are automatic.

---

## 🚀 Production Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Setup monitoring on logs
- [ ] Configure backup for logs
- [ ] Use reverse proxy (Nginx)
- [ ] Enable HTTPS
- [ ] Setup error alerts
- [ ] Monitor log file size
- [ ] Implement log rotation

---

## 📚 File-by-File Breakdown

### `server.js`
- ✅ Express app configuration
- ✅ Middleware setup
- ✅ Route registration
- ✅ Error handling
- ✅ Graceful shutdown
- ✅ Process error handlers

### `controllers/authController.js`
- ✅ Register handler
- ✅ Login handler
- ✅ Token verification
- ✅ Using services for logic
- ✅ Formatting responses

### `controllers/linkController.js`
- ✅ Get links handler
- ✅ Create link handler
- ✅ Delete link handler
- ✅ Analytics handler
- ✅ Short link redirect

### `services/authService.js`
- ✅ User registration logic
- ✅ User login logic
- ✅ Token generation
- ✅ Token verification
- ✅ Comprehensive logging

### `services/linkService.js`
- ✅ Get user links
- ✅ Create link
- ✅ Delete link
- ✅ Click tracking
- ✅ Analytics calculation
- ✅ Error handling

### `middleware/auth.js`
- ✅ JWT extraction
- ✅ Token verification
- ✅ User attachment
- ✅ Error throwing

### `middleware/requestLogger.js`
- ✅ Request/response logging
- ✅ Duration tracking
- ✅ Status code logging
- ✅ IP and user agent logging

### `middleware/rateLimiter.js`
- ✅ Simple in-memory rate limiting
- ✅ Per-IP limiting
- ✅ Configurable limits
- ✅ Error responses

### `middleware/validators.js`
- ✅ Email validation
- ✅ Password validation
- ✅ URL validation
- ✅ Reusable validators

### `utils/logger.js`
- ✅ File logging
- ✅ Multiple log levels
- ✅ Daily log files
- ✅ Formatted messages
- ✅ Development/production modes

### `utils/errorHandler.js`
- ✅ Custom AppError class
- ✅ Global error handler middleware
- ✅ Async wrapper
- ✅ Error logging
- ✅ Status code handling

---

## 🔗 Layer Communication

```
REQUEST HANDLING:
Route → Controller → Service → Model → Database

RESPONSE HANDLING:
Model → Service → Controller → Route → Client

ERROR HANDLING:
Any Layer → AppError → errorHandler Middleware → Client

LOGGING:
Any Layer → logger.js → File

VALIDATION:
Middleware → Validators → Service → Model
```

---

## 🎓 Best Practices Implemented

✅ **DRY (Don't Repeat Yourself)**
- Reusable services
- Centralized validators
- Shared error handling

✅ **SOLID Principles**
- Single Responsibility: Each file has one purpose
- Open/Closed: Easy to extend without modifying
- Liskov Substitution: Services are interchangeable
- Interface Segregation: Thin controllers
- Dependency Inversion: Services handle logic

✅ **Clean Code**
- Clear naming
- Small functions
- Well-organized folders
- Comprehensive comments

✅ **Error Handling**
- Try-catch blocks
- Custom errors
- Logging
- User-friendly messages

✅ **Performance**
- Rate limiting
- Early validation
- Efficient queries
- Error caching

✅ **Security**
- Input validation
- JWT tokens
- Password hashing
- CORS protection

---

## 📈 Scaling Strategy

### Current State (Monolith)
All features in one Express app

### Scale Level 1: Separate Services
- Auth service (dedicated server)
- Link service (dedicated server)
- Shared database

### Scale Level 2: Microservices
- Separate Node servers
- API Gateway
- Message queue (RabbitMQ)
- Service discovery

### Scale Level 3: Cloud Native
- Docker containers
- Kubernetes orchestration
- Serverless functions
- CDN for static assets

---

## 🚀 Ready for Production!

This architecture is:
- ✅ Scalable
- ✅ Maintainable
- ✅ Testable
- ✅ Secure
- ✅ Reliable
- ✅ Professional-grade

Start building with confidence! 🎉

---

*Architecture documentation for Full Stack SaaS Dashboard*  
*Version: 2.0 - Production-Grade*  
*Date: February 19, 2026*
