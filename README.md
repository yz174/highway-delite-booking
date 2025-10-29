# Highway Delite - Travel Booking Application

A fullstack travel experience booking application built with React, TypeScript, Node.js, Express, and PostgreSQL. Users can browse travel experiences, view available time slots, make bookings with promo codes, and receive booking confirmations.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup Instructions](#detailed-setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Technology Stack](#technology-stack)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **Browse Experiences**: View a catalog of travel experiences with images, descriptions, and pricing
- **Search Functionality**: Filter experiences by name or location
- **Real-time Availability**: Check available dates and time slots with live capacity indicators
- **Dynamic Pricing**: Calculate prices with quantity selection, taxes, and promo code discounts
- **Promo Codes**: Apply discount codes (SAVE10 for 10% off, FLAT100 for ₹100 off)
- **Booking Management**: Create bookings with automatic slot availability management
- **Concurrent Booking Protection**: Transaction-based booking to prevent double-booking
- **Responsive Design**: Mobile-first design that works on all devices
- **Form Validation**: Real-time validation for user inputs

## 📁 Project Structure

```
highway-delite/
├── frontend/                 # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (Home, Details, Checkout, Confirmation)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API client services
│   │   ├── types/           # TypeScript type definitions
│   │   └── App.tsx          # Main app component with routing
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Express middleware
│   │   └── types/           # TypeScript type definitions
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seed script
│   └── package.json
│
├── E2E_TEST_CHECKLIST.md    # Manual testing checklist
├── RESPONSIVE_DESIGN_TEST.md # Responsive design testing guide
└── README.md
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning the repository)

### Verify Installation

```bash
node --version    # Should be v18 or higher
npm --version     # Should be 8 or higher
psql --version    # Should be 14 or higher
```

## 🚀 Quick Start

For a quick setup, follow these steps:

```bash
# 1. Clone the repository (or navigate to project directory)
cd highway-delite

# 2. Set up backend
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev

# 3. In a new terminal, set up frontend
cd frontend
npm install
cp .env.example .env
npm run dev

# 4. Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## 📖 Detailed Setup Instructions

### Backend Setup

#### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs:
- Express.js (web framework)
- Prisma (ORM)
- TypeScript
- CORS middleware
- Other dependencies

#### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://username:password@localhost:5432/highway_delite?schema=public"
```

**Important**: Replace `username` and `password` with your PostgreSQL credentials.

#### 3. Set Up Database

**Option A: Automatic Setup (Recommended)**

On Windows:
```bash
setup-database.bat
```

On Mac/Linux:
```bash
chmod +x setup-database.sh
./setup-database.sh
```

**Option B: Manual Setup**

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

#### 4. Start Backend Server

```bash
npm run dev
```

The backend will start on `http://localhost:3000`. You should see:
```
Server is running on port 3000
```

### Frontend Setup

#### 1. Install Dependencies

```bash
cd frontend
npm install
```

#### 2. Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

#### 3. Start Frontend Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`. You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend server port | 3000 | No |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 | Yes |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |

**DATABASE_URL Format:**
```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
```

Example:
```
postgresql://postgres:mypassword@localhost:5432/highway_delite?schema=public
```

### Frontend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | http://localhost:3000/api | Yes |

## 🗄️ Database Setup

### Creating the Database

If the database doesn't exist, create it:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE highway_delite;

# Exit
\q
```

### Database Schema

The application uses the following tables:

**Experience**
- Stores travel experience information (name, location, description, price, image)

**Slot**
- Stores available time slots for each experience
- Tracks total capacity and available count

**Booking**
- Stores customer bookings
- Includes pricing details and promo code information

**PromoCode**
- Stores discount codes with validation rules

### Seed Data

The seed script (`prisma/seed.ts`) populates the database with:

**5 Experiences:**
1. Kayaking in Udupi
2. Nandi Hills Sunrise Trek
3. Coffee Trail in Coorg
4. Boat Cruise in Goa
5. Bungee Jumping in Rishikesh

**Time Slots:**
- Multiple dates and times for each experience
- Varying availability (some sold out for testing)

**Promo Codes:**
- `SAVE10` - 10% discount
- `FLAT100` - ₹100 flat discount

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Available Scripts

#### Backend Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start with hot reload (nodemon) |
| Build | `npm run build` | Compile TypeScript to JavaScript |
| Start | `npm start` | Run production build |
| Prisma Generate | `npm run prisma:generate` | Generate Prisma Client |
| Prisma Migrate | `npm run prisma:migrate` | Run database migrations |
| Prisma Seed | `npm run prisma:seed` | Seed database with data |

#### Frontend Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start Vite dev server |
| Build | `npm run build` | Build for production |
| Preview | `npm run preview` | Preview production build |
| Lint | `npm run lint` | Run ESLint |

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Get All Experiences

```http
GET /api/experiences
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

#### 2. Get Experience Details

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

#### 3. Create Booking

```http
POST /api/bookings
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

**Error Response (400):**
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

#### 4. Validate Promo Code

```http
POST /api/promo/validate
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

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Invalid request data | 400 |
| `NOT_FOUND` | Resource not found | 404 |
| `SLOT_UNAVAILABLE` | Booking slot is full | 400 |
| `INVALID_PROMO_CODE` | Promo code invalid/expired | 400 |
| `INTERNAL_ERROR` | Server error | 500 |

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI library | 19.x |
| TypeScript | Type safety | 5.x |
| Vite | Build tool | 7.x |
| TailwindCSS | Styling | 4.x |
| React Router | Routing | 7.x |
| Axios | HTTP client | 1.x |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 18+ |
| Express | Web framework | 5.x |
| TypeScript | Type safety | 5.x |
| PostgreSQL | Database | 14+ |
| Prisma | ORM | 6.x |
| CORS | Cross-origin requests | 2.x |

## 🧪 Testing

### Manual Testing

Comprehensive test checklists are provided:

1. **E2E_TEST_CHECKLIST.md** - Complete user flow testing
   - Happy path booking flow
   - Error scenarios
   - Form validation
   - Promo code testing

2. **RESPONSIVE_DESIGN_TEST.md** - Responsive design testing
   - Mobile, tablet, desktop layouts
   - Touch interactions
   - Cross-browser compatibility

### Automated API Testing

Run end-to-end API tests:

```bash
cd backend
npx ts-node test-e2e.ts
```

Test concurrent bookings:

```bash
cd backend
npx ts-node test-concurrent-bookings.ts
```

**Note**: Ensure backend server is running before executing tests.

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Ensure database exists: `psql -U postgres -l`
- Check credentials are correct

#### 2. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
- Change PORT in backend `.env`
- Or kill process using port:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:3000 | xargs kill -9
  ```

#### 3. Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
cd backend
npm run prisma:generate
```

#### 4. CORS Error

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Verify FRONTEND_URL in backend `.env` matches frontend URL
- Restart backend server after changing `.env`

#### 5. Frontend Can't Connect to Backend

**Error:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution:**
- Verify backend is running on correct port
- Check VITE_API_URL in frontend `.env`
- Ensure no firewall blocking connections

#### 6. Seed Data Not Loading

**Error:** No experiences showing on home page

**Solution:**
```bash
cd backend
npm run prisma:seed
```

### Getting Help

If you encounter issues:

1. Check the error message carefully
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that PostgreSQL is running
5. Review the console logs for both frontend and backend

## 📝 License

This project is for educational purposes.

## 👥 Contributing

This is a demonstration project. For improvements or bug fixes, please follow standard Git workflow practices.
