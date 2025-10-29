# Backend - Highway Delite

Node.js + Express + TypeScript backend API for the Highway Delite travel booking application.

## 📋 Overview

RESTful API built with Express.js, TypeScript, and Prisma ORM. Provides endpoints for managing travel experiences, bookings, and promo codes with PostgreSQL database.

## 🏗️ Architecture

### Project Structure

```
backend/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── experiences.controller.ts
│   │   ├── bookings.controller.ts
│   │   └── promo.controller.ts
│   │
│   ├── routes/              # API routes
│   │   ├── experiences.routes.ts
│   │   ├── bookings.routes.ts
│   │   └── promo.routes.ts
│   │
│   ├── middleware/          # Express middleware
│   │   └── errorHandler.ts
│   │
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   │
│   └── index.ts             # Entry point
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Database migrations
│   └── seed.ts              # Seed script
│
├── test-e2e.ts              # End-to-end API tests
├── test-concurrent-bookings.ts  # Concurrent booking tests
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json
├── tsconfig.json            # TypeScript configuration
└── nodemon.json             # Nodemon configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://username:password@localhost:5432/highway_delite?schema=public"
```

**DATABASE_URL Components:**
- `username`: PostgreSQL username
- `password`: PostgreSQL password
- `localhost`: Database host
- `5432`: PostgreSQL port
- `highway_delite`: Database name

### Database Setup

**Create Database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE highway_delite;

# Exit
\q
```

**Run Migrations:**

```bash
npm run prisma:migrate
```

This creates the following tables:
- `experiences` - Travel experiences
- `slots` - Available time slots
- `bookings` - Customer bookings
- `promo_codes` - Discount codes

**Seed Data:**

```bash
npm run prisma:seed
```

This populates:
- 5 sample experiences
- Multiple time slots per experience
- 2 promo codes (SAVE10, FLAT100)

## 📡 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Experiences

#### Get All Experiences

```http
GET /api/experiences
GET /api/experiences?search=kayaking
```

**Query Parameters:**
- `search` (optional) - Filter by name or location

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Kayaking",
      "location": "Udupi, Karnataka",
      "description": "Curated small-group experience...",
      "imageUrl": "https://...",
      "startingPrice": 999
    }
  ]
}
```

#### Get Experience by ID

```http
GET /api/experiences/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Kayaking",
    "location": "Udupi, Karnataka",
    "description": "...",
    "about": "...",
    "price": 999,
    "imageUrl": "https://...",
    "availableDates": [
      {
        "date": "2025-10-30",
        "slots": [
          {
            "id": "slot-uuid",
            "time": "09:00",
            "availableCount": 4,
            "totalCapacity": 10
          }
        ]
      }
    ]
  }
}
```

### Bookings

#### Create Booking

```http
POST /api/bookings
Content-Type: application/json
```

**Request Body:**
```json
{
  "experienceId": "uuid",
  "slotId": "uuid",
  "date": "2025-10-30",
  "time": "09:00",
  "quantity": 2,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "promoCode": "SAVE10",
  "agreedToTerms": true,
  "basePrice": 999,
  "discountAmount": 99.9,
  "taxAmount": 53.95,
  "totalAmount": 952.95
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "bookingId": "uuid",
    "referenceId": "ABC123XY",
    "status": "confirmed"
  }
}
```

**Error Responses:**

Slot Unavailable (400):
```json
{
  "success": false,
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "The selected time slot is no longer available",
    "details": {
      "requested": 2,
      "available": 1
    }
  }
}
```

Validation Error (400):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required fields",
    "details": {
      "required": ["experienceId", "slotId", "customerName", "customerEmail"]
    }
  }
}
```

### Promo Codes

#### Validate Promo Code

```http
POST /api/promo/validate
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "SAVE10",
  "subtotal": 1000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "code": "SAVE10",
    "discountType": "percentage",
    "discountValue": 10,
    "discountAmount": 100
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PROMO_CODE",
    "message": "Invalid or expired promo code"
  }
}
```

## 🗄️ Database Schema

### Prisma Schema

```prisma
model Experience {
  id          String   @id @default(uuid())
  name        String
  location    String
  description String
  about       String?
  imageUrl    String
  price       Decimal
  slots       Slot[]
  bookings    Booking[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Slot {
  id             String     @id @default(uuid())
  experienceId   String
  experience     Experience @relation(fields: [experienceId], references: [id])
  date           DateTime
  time           DateTime
  totalCapacity  Int
  availableCount Int
  bookings       Booking[]
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  
  @@unique([experienceId, date, time])
}

model Booking {
  id             String     @id @default(uuid())
  referenceId    String     @unique
  experienceId   String
  experience     Experience @relation(fields: [experienceId], references: [id])
  slotId         String
  slot           Slot       @relation(fields: [slotId], references: [id])
  customerName   String
  customerEmail  String
  quantity       Int
  basePrice      Decimal
  discountAmount Decimal    @default(0)
  taxAmount      Decimal
  totalAmount    Decimal
  promoCode      String?
  status         String     @default("confirmed")
  createdAt      DateTime   @default(now())
}

model PromoCode {
  id            String   @id @default(uuid())
  code          String   @unique
  discountType  String
  discountValue Decimal
  validFrom     DateTime
  validUntil    DateTime
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
}
```

### Database Constraints

**Slot Table:**
- Unique constraint on (experienceId, date, time)
- Check constraint: availableCount >= 0 AND availableCount <= totalCapacity

**Booking Table:**
- Unique constraint on referenceId
- Check constraint: quantity > 0

## 🔒 Transaction Handling

### Concurrent Booking Protection

The booking controller uses Prisma transactions to prevent race conditions:

```typescript
const booking = await prisma.$transaction(async (tx) => {
  // 1. Check slot availability
  const slot = await tx.slot.findUnique({ where: { id: slotId } });
  
  if (slot.availableCount < quantity) {
    throw new Error('Slot unavailable');
  }
  
  // 2. Decrement availability
  await tx.slot.update({
    where: { id: slotId },
    data: { availableCount: { decrement: quantity } }
  });
  
  // 3. Create booking
  return await tx.booking.create({ data: bookingData });
});
```

This ensures:
- Atomic operations (all or nothing)
- No double-booking
- Consistent slot availability

## 🛡️ Error Handling

### Error Middleware

Custom error handler in `middleware/errorHandler.ts`:

```typescript
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';
  
  res.status(status).json({
    success: false,
    error: { code, message, details: err.details }
  });
};
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `NOT_FOUND` | 404 | Resource not found |
| `SLOT_UNAVAILABLE` | 400 | Booking slot is full |
| `INVALID_PROMO_CODE` | 400 | Promo code invalid/expired |
| `INTERNAL_ERROR` | 500 | Server error |

## 🧪 Testing

### API Tests

Run end-to-end API tests:

```bash
npx ts-node test-e2e.ts
```

Tests:
- Get all experiences
- Search experiences
- Get experience details
- Validate promo codes
- Create bookings
- Handle validation errors
- Handle sold-out slots

### Concurrent Booking Tests

Test race condition handling:

```bash
npx ts-node test-concurrent-bookings.ts
```

This simulates multiple users booking the same slot simultaneously and verifies:
- Only available slots are booked
- Excess bookings receive errors
- Slot availability is correctly decremented
- No double-booking occurs

### Manual Testing with cURL

**Get Experiences:**
```bash
curl http://localhost:3000/api/experiences
```

**Get Experience Details:**
```bash
curl http://localhost:3000/api/experiences/{id}
```

**Create Booking:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "experienceId": "uuid",
    "slotId": "uuid",
    "date": "2025-10-30",
    "time": "09:00",
    "quantity": 1,
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "agreedToTerms": true
  }'
```

**Validate Promo Code:**
```bash
curl -X POST http://localhost:3000/api/promo/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "SAVE10", "subtotal": 1000}'
```

## 🔍 Debugging

### Enable Debug Logging

Add to `.env`:
```env
DEBUG=express:*
NODE_ENV=development
```

### Prisma Studio

Visual database browser:

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

### Database Queries

View generated SQL:

```bash
# Enable query logging in schema.prisma
generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}
```

## 📦 Build & Deployment

### Development

```bash
npm run dev
```

Uses nodemon for hot reload.

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Deployment Platforms

**Railway:**
1. Connect GitHub repository
2. Set environment variables
3. Railway auto-detects Node.js
4. Add PostgreSQL database

**Render:**
1. Create new Web Service
2. Connect repository
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add PostgreSQL database
6. Set environment variables

**Heroku:**
```bash
# Install Heroku CLI
heroku create highway-delite-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate
```

### Environment Variables for Production

```env
PORT=3000
FRONTEND_URL=https://your-frontend.com
DATABASE_URL=postgresql://...
NODE_ENV=production
```

## 🔐 Security

### Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **CORS**: Configure allowed origins
3. **Input Validation**: Validate all user inputs
4. **SQL Injection**: Use Prisma parameterized queries
5. **Rate Limiting**: Add rate limiting middleware (optional)
6. **HTTPS**: Use HTTPS in production

### CORS Configuration

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

When contributing:

1. Follow existing code style
2. Use TypeScript types
3. Add error handling
4. Test API endpoints
5. Update documentation
6. Run tests before committing

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production server |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed database with sample data |
