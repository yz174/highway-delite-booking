# Database Setup Guide

## Prerequisites

- PostgreSQL installed and running on your system
- Node.js and npm installed

## Setup Steps

### 1. Configure Database Connection

Update the `DATABASE_URL` in your `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/highway_delite?schema=public"
```

Replace:
- `username` with your PostgreSQL username
- `password` with your PostgreSQL password
- `localhost:5432` with your database host and port (if different)
- `highway_delite` with your desired database name

### 2. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

### 3. Run Database Migrations

```bash
npm run prisma:migrate
```

This will:
- Create the database if it doesn't exist
- Create all tables (Experience, Slot, Booking, PromoCode)
- Apply all constraints and relations

### 4. Seed the Database

```bash
npm run prisma:seed
```

This will populate the database with:
- **5 sample experiences**: Kayaking, Nandi Hills Sunrise, Coffee Trail, Boat Cruise, Bungee Jumping
- **600 time slots**: 4 slots per day for 30 days for each experience
- **2 promo codes**: SAVE10 (10% discount) and FLAT100 (₹100 flat discount)

## Database Schema

### Experience
- Travel activities/tours that users can book
- Fields: id, name, location, description, about, imageUrl, price

### Slot
- Specific date/time combinations for experiences
- Fields: id, experienceId, date, time, totalCapacity, availableCount
- Unique constraint on (experienceId, date, time)

### Booking
- User reservations for experience slots
- Fields: id, referenceId, experienceId, slotId, customerName, customerEmail, quantity, basePrice, discountAmount, taxAmount, totalAmount, promoCode, status

### PromoCode
- Discount codes for bookings
- Fields: id, code, discountType, discountValue, validFrom, validUntil, isActive

## Troubleshooting

### Database Connection Error

If you get `Can't reach database server`, ensure:
1. PostgreSQL service is running
2. Database credentials in `.env` are correct
3. Database port (default 5432) is accessible

### Migration Errors

If migrations fail:
1. Check if the database exists
2. Verify user has proper permissions
3. Try resetting: `npx prisma migrate reset` (WARNING: This deletes all data)

## Useful Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (deletes all data and re-runs migrations)
npx prisma migrate reset

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy
```
