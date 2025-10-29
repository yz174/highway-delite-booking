@echo off
REM Database Setup Script for Highway Delite (Windows)

echo Starting database setup...

REM Check if .env file exists
if not exist .env (
    echo Error: .env file not found
    echo Please create a .env file based on .env.example
    exit /b 1
)

REM Generate Prisma Client
echo Generating Prisma Client...
call npm run prisma:generate

REM Run migrations
echo Running database migrations...
call npm run prisma:migrate

REM Seed database
echo Seeding database with sample data...
call npm run prisma:seed

echo Database setup complete!
echo.
echo You can now start the backend server with: npm run dev
