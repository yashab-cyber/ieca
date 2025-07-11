#!/bin/bash

# IECA Platform Maintenance Script
# This script helps with common maintenance tasks

set -e

echo "🛠️  IECA Platform Maintenance Script"
echo "======================================"

function show_help() {
    echo "Usage: ./maintenance.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  health     - Check platform health status"
    echo "  logs       - View application logs"
    echo "  backup     - Create database backup"
    echo "  update     - Update dependencies and rebuild"
    echo "  clean      - Clean up build artifacts and logs"
    echo "  security   - Run security audit"
    echo "  test       - Run full test suite"
    echo "  lint-fix   - Fix linting issues automatically"
    echo "  help       - Show this help message"
}

function health_check() {
    echo "🔍 Checking platform health..."
    
    # Check if application is running
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Application is running"
    else
        echo "❌ Application is not responding"
    fi
    
    # Check database connection
    npm run db:test && echo "✅ Database connection OK" || echo "❌ Database connection failed"
    
    # Check disk space
    df -h | grep -E '(Filesystem|/$)' && echo "✅ Disk space checked"
    
    # Check memory usage
    free -h && echo "✅ Memory usage checked"
}

function view_logs() {
    echo "📋 Viewing application logs..."
    
    if command -v docker &> /dev/null && docker ps | grep -q ieca; then
        docker logs ieca-app --tail=50 -f
    else
        echo "📁 Looking for log files..."
        if [ -f "logs/app.log" ]; then
            tail -f logs/app.log
        else
            echo "ℹ️ No log files found. Check PM2 logs if using PM2."
        fi
    fi
}

function backup_database() {
    echo "💾 Creating database backup..."
    
    # Create backup directory
    mkdir -p backups
    
    # Generate backup filename with timestamp
    BACKUP_FILE="backups/ieca-backup-$(date +%Y%m%d_%H%M%S).sql"
    
    # Create backup (requires DATABASE_URL)
    if [ -n "$DATABASE_URL" ]; then
        pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
        echo "✅ Database backup created: $BACKUP_FILE"
    else
        echo "❌ DATABASE_URL not set. Please set it in .env file."
        exit 1
    fi
}

function update_platform() {
    echo "🔄 Updating platform..."
    
    # Pull latest changes
    git pull origin main
    
    # Update dependencies
    npm install
    
    # Run database migrations
    npm run db:push
    
    # Rebuild application
    npm run build
    
    echo "✅ Platform updated successfully"
}

function clean_platform() {
    echo "🧹 Cleaning up platform..."
    
    # Clean build artifacts
    rm -rf .next
    rm -rf dist
    rm -rf node_modules/.cache
    
    # Clean logs older than 7 days
    find logs -name "*.log" -mtime +7 -delete 2>/dev/null || echo "ℹ️ No old logs to clean"
    
    # Clean Docker images (if using Docker)
    if command -v docker &> /dev/null; then
        docker system prune -f
        echo "✅ Docker cleanup completed"
    fi
    
    echo "✅ Cleanup completed"
}

function security_audit() {
    echo "🔒 Running security audit..."
    
    # NPM audit
    npm audit
    
    # Check for updates
    npm outdated
    
    echo "✅ Security audit completed"
}

function run_tests() {
    echo "🧪 Running full test suite..."
    
    # Run type checking
    npm run typecheck
    
    # Run linting
    npm run lint
    
    # Run tests
    npm test
    
    # Run build to verify
    npm run build
    
    echo "✅ All tests completed"
}

function fix_linting() {
    echo "🔧 Fixing linting issues..."
    
    # Fix automatically fixable issues
    npx eslint src --fix
    
    # Format code
    npx prettier --write src
    
    echo "✅ Linting fixes applied"
}

# Main script logic
case "${1:-help}" in
    health)
        health_check
        ;;
    logs)
        view_logs
        ;;
    backup)
        backup_database
        ;;
    update)
        update_platform
        ;;
    clean)
        clean_platform
        ;;
    security)
        security_audit
        ;;
    test)
        run_tests
        ;;
    lint-fix)
        fix_linting
        ;;
    help|*)
        show_help
        ;;
esac
