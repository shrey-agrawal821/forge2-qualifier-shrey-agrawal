FROM php:8.4-cli

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files first (for Docker layer caching)
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts --ignore-platform-reqs

# Copy the rest of the application
COPY . .

# Re-run composer scripts after full copy
RUN composer dump-autoload --optimize --ignore-platform-reqs

# Create SQLite database directory and file
RUN mkdir -p /data && touch /data/database.sqlite

# Set permissions
RUN chmod -R 775 storage bootstrap/cache
RUN chmod 664 /data/database.sqlite

# Expose port
EXPOSE 10000

# Start script: run migrations, seed, then serve
CMD php artisan migrate --force && \
    php artisan db:seed --force 2>/dev/null; \
    php artisan serve --host=0.0.0.0 --port=10000
