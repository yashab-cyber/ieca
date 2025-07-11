#!/bin/bash

# Database setup script for IECA project

echo "🚀 Setting up IECA PostgreSQL Database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "macOS: brew install postgresql"
    echo "Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

# Database configuration
DB_NAME="ieca_db"
DB_USER="ieca_user"
DB_PASSWORD="ieca_secure_password"

echo "📦 Creating database and user..."

# Connect to PostgreSQL as superuser and create database/user
sudo -u postgres psql << EOF
-- Create user if not exists
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Create database if not exists
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
GRANT CREATE ON SCHEMA public TO $DB_USER;

-- Enable necessary extensions
\c $DB_NAME;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\q
EOF

echo "✅ Database and user created successfully!"

# Update the DATABASE_URL in .env if needed
echo "🔧 Updating DATABASE_URL in .env file..."

if [ -f .env ]; then
    # Update existing DATABASE_URL
    sed -i 's|DATABASE_URL=.*|DATABASE_URL="postgresql://'$DB_USER':'$DB_PASSWORD'@localhost:5432/'$DB_NAME'?schema=public"|g' .env
    echo "✅ Updated DATABASE_URL in existing .env file"
else
    # Create new .env file
    cat > .env << EOF
# PostgreSQL Database Configuration
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"
POSTGRES_USER=$DB_USER
POSTGRES_PASSWORD=$DB_PASSWORD
POSTGRES_DB=$DB_NAME
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Add your other environment variables here
GEMINI_API_KEY=your_gemini_api_key_here
EOF
    echo "✅ Created new .env file with database configuration"
fi

echo "🔄 Running Prisma migrations..."

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

echo "🌱 Seeding database with initial data..."

# Run the seed script
npm run db:seed

echo "🎉 Database setup complete!"
echo ""
echo "📋 Database Information:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Host: localhost"
echo "   Port: 5432"
echo ""
echo "🔗 Connection URL:"
echo "   postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo ""
echo "🛠️  Next steps:"
echo "   1. Update your .env file with the correct GEMINI_API_KEY"
echo "   2. Run 'npm run dev' to start the application"
echo "   3. Visit http://localhost:9002 to see your application"
