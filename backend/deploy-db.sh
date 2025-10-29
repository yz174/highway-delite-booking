#!/bin/bash

# Database Deployment Script for Production
# This script helps deploy database migrations and seed data to production

echo "🚀 Highway Delite - Database Deployment Script"
echo "=============================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo ""
    echo "Please set it using one of these methods:"
    echo "1. Export it: export DATABASE_URL='your-connection-string'"
    echo "2. Use .env file: vercel env pull .env.production"
    echo "3. Pass inline: DATABASE_URL='your-url' ./deploy-db.sh"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Run migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed"
    exit 1
fi

echo ""

# Ask if user wants to seed
read -p "Do you want to seed the database? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run prisma:seed
    
    if [ $? -eq 0 ]; then
        echo "✅ Database seeded successfully"
    else
        echo "❌ Seeding failed"
        exit 1
    fi
fi

echo ""
echo "🎉 Database deployment completed!"
echo ""
echo "Next steps:"
echo "1. Test your backend: curl https://your-backend.vercel.app/health"
echo "2. Test API endpoints: curl https://your-backend.vercel.app/api/experiences"
echo "3. Deploy your frontend with the backend URL"
