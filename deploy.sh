#!/bin/bash

# IECA Deployment Script
# This script helps deploy the IECA application

set -e

echo "🚀 IECA Deployment Script"
echo "========================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed!"
    echo "Please install Docker to continue."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed!"
    echo "Please install Docker Compose to continue."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Function to deploy in development mode
deploy_dev() {
    echo "🔧 Deploying in development mode..."
    
    # Stop existing containers
    docker-compose down
    
    # Start database
    docker-compose up -d postgres
    
    # Wait for database to be ready
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    # Run database migrations
    echo "🗄️ Running database migrations..."
    npm run db:push
    
    # Seed database (optional)
    read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run db:seed
    fi
    
    # Start development server
    echo "🏃 Starting development server..."
    npm run dev
}

# Function to deploy in production mode
deploy_prod() {
    echo "🏭 Deploying in production mode..."
    
    # Build the application
    echo "🔨 Building application..."
    npm run build
    
    # Stop existing containers
    docker-compose -f docker-compose.prod.yml down
    
    # Build and start all services
    echo "🐳 Building and starting Docker containers..."
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # Wait for database to be ready
    echo "⏳ Waiting for database to be ready..."
    sleep 15
    
    # Run database migrations in the app container
    echo "🗄️ Running database migrations..."
    docker-compose -f docker-compose.prod.yml exec app npx prisma db push
    
    echo "✅ Production deployment completed!"
    echo "🌐 Application is now available at http://localhost"
    echo "🔧 PgAdmin is available at http://localhost:5050"
}

# Function to show logs
show_logs() {
    if [ "$1" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml logs -f
    else
        docker-compose logs -f
    fi
}

# Function to stop services
stop_services() {
    if [ "$1" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml down
    else
        docker-compose down
    fi
    echo "✅ Services stopped"
}

# Function to show status
show_status() {
    if [ "$1" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml ps
    else
        docker-compose ps
    fi
}

# Function to backup database
backup_db() {
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="backup_${timestamp}.sql"
    
    echo "💾 Creating database backup: $backup_file"
    
    if [ "$1" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U ieca_user ieca_db > "$backup_file"
    else
        docker-compose exec postgres pg_dump -U ieca_user ieca_db > "$backup_file"
    fi
    
    echo "✅ Database backup created: $backup_file"
}

# Main menu
case "${1:-}" in
    "dev")
        deploy_dev
        ;;
    "prod")
        deploy_prod
        ;;
    "logs")
        show_logs "${2:-}"
        ;;
    "stop")
        stop_services "${2:-}"
        ;;
    "status")
        show_status "${2:-}"
        ;;
    "backup")
        backup_db "${2:-}"
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command] [option]"
        echo ""
        echo "Commands:"
        echo "  dev           Deploy in development mode"
        echo "  prod          Deploy in production mode"
        echo "  logs [prod]   Show application logs"
        echo "  stop [prod]   Stop services"
        echo "  status [prod] Show service status"
        echo "  backup [prod] Create database backup"
        echo "  help          Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 dev              # Start development environment"
        echo "  $0 prod             # Deploy to production"
        echo "  $0 logs prod        # Show production logs"
        echo "  $0 stop prod        # Stop production services"
        ;;
    *)
        echo "❓ Usage: $0 [dev|prod|logs|stop|status|backup|help]"
        echo "Run '$0 help' for more information."
        exit 1
        ;;
esac
