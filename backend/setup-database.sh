#!/bin/bash

# Database Setup Script for Highway Delite

echo "🚀 Starting database setup..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create a .env file based on .env.example"
    exit 1
fi

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npm run prisma:generate

# Run migrations
echo "🔄 Running database migrations..."
npm run prisma:migrate

# Seed database
echo "🌱 Seeding database with sample data..."
npm run prisma:seed

echo "✅ Database setup complete!"
echo ""
echo "You can now start the backend server with: npm run dev"
