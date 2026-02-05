#!/bin/sh

# Wait for MySQL
./docker/wait-for-it.sh mysql:3306 --timeout=30 --strict -- echo "MySQL is up"

# Clear config only (safe, no DB hit)
php artisan config:clear

# Run migrations FIRST
php artisan migrate --force

# Now it's safe to clear cache
php artisan cache:clear

# Start Laravel server
php artisan serve --host=0.0.0.0 --port=8000 &

# Start Vite (foreground)
npm run dev
