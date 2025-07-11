# 🗄️ Database Setup Guide for IECA

This guide will help you set up the PostgreSQL database for the IECA (Indian Error Cyber Army) project.

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
# Make the setup script executable
chmod +x scripts/setup-database.sh

# Run the automated setup
npm run db:setup
```

### Option 2: Docker Setup (Easiest)
```bash
# Start PostgreSQL and pgAdmin using Docker Compose
docker-compose up -d

# Generate Prisma client
npm run db:generate

# Push the schema to database
npm run db:push

# Seed the database with initial data
npm run db:seed
```

### Option 3: Manual Setup
1. Install PostgreSQL on your system
2. Create database and user manually
3. Update environment variables
4. Run migrations and seed

## 📋 Database Schema Overview

### Core Tables

#### Users & Authentication
- **users**: Main user accounts (members, admins)
- **user_profiles**: Extended user information and preferences
- **activities**: User activity logs for audit trails

#### Application Management
- **applications**: Join requests from potential members
- **contact_forms**: Contact form submissions from website

#### Communication
- **chat_messages**: Live chat conversations and AI responses
- **notifications**: System-wide and user-specific notifications

#### Content Management
- **blog_posts**: News, announcements, and articles
- **comments**: User comments on blog posts
- **resources**: Cybersecurity materials and downloads

## 🔧 Environment Variables

Add these to your `.env` file:

```env
# PostgreSQL Database Configuration
DATABASE_URL="postgresql://ieca_user:ieca_secure_password@localhost:5432/ieca_db?schema=public"
POSTGRES_USER=ieca_user
POSTGRES_PASSWORD=ieca_secure_password
POSTGRES_DB=ieca_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please

# Google AI API Key for chat functionality
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📊 Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to database (development)
npm run db:push

# Create and run migrations (production)
npm run db:migrate

# Seed database with initial data
npm run db:seed

# Reset database (WARNING: Deletes all data)
npm run db:reset

# Open Prisma Studio (Database GUI)
npm run db:studio
```

## 🎯 Initial Data

The seed script creates:

### Admin User
- **Email**: yashabalam707@gmail.com
- **Password**: @Ethicalhacker07
- **Role**: Admin

### Sample Members
- 4 sample IECA members with different roles and skills

### Sample Data
- 3 cybersecurity resources
- 2 sample applications
- System notifications

## 🔐 Security Features

### Password Hashing
- Uses bcryptjs with salt rounds of 12
- Passwords are never stored in plain text

### JWT Authentication
- Secure token-based authentication
- 7-day token expiration
- Role-based access control

### Input Validation
- Zod schemas for API input validation
- SQL injection prevention through Prisma
- XSS protection built into Next.js

## 📈 API Endpoints

### Applications
- `POST /api/applications` - Submit new application
- `GET /api/applications` - Get all applications (admin only)

### Chat
- `POST /api/chat` - Send chat message and get AI response
- `GET /api/chat` - Get chat history

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact submissions (admin only)

### Analytics
- `GET /api/analytics` - Get dashboard statistics (admin only)

## 🛠️ Development Tools

### Prisma Studio
```bash
npm run db:studio
```
Opens a web interface at http://localhost:5555 to browse and edit your data.

### pgAdmin (with Docker)
- URL: http://localhost:5050
- Email: admin@ieca.local
- Password: admin123

## 🚨 Production Considerations

### Environment Variables
- Change all default passwords
- Use strong, unique JWT_SECRET
- Set up proper DATABASE_URL for production database

### Database Security
- Enable SSL connections
- Set up proper firewall rules
- Regular backups
- Monitor for suspicious activity

### Performance
- Set up connection pooling
- Add database indexes for frequently queried fields
- Monitor query performance

## 🔄 Migrations

When making schema changes:

1. Update `prisma/schema.prisma`
2. Run `npm run db:migrate` to create migration
3. Commit both schema and migration files
4. Deploy migrations to production

## 📝 Troubleshooting

### Common Issues

**Database connection failed**
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database and user exist

**Prisma Client not found**
- Run `npm run db:generate`
- Restart your development server

**Migration conflicts**
- Reset local database: `npm run db:reset`
- Or resolve conflicts manually

### Useful Commands

```bash
# Check database connection
npx prisma db pull

# View current migrations
npx prisma migrate status

# Create migration without applying
npx prisma migrate dev --create-only

# Apply pending migrations
npx prisma migrate deploy
```

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

For support, contact the development team or refer to the main project README.
