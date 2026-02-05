FROM php:8.2-cli

# System deps
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev \
    nodejs npm \
    && docker-php-ext-install pdo pdo_mysql

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install
RUN npm install

EXPOSE 8000
EXPOSE 5173

CMD sh -c "php artisan serve --host=0.0.0.0 & npm run dev"
