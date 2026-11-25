FROM php:8.4-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY src/ src/
COPY public/ public/
COPY database/seed.php database/seed.php
COPY database/seeders/ database/seeders/
COPY apache.conf /etc/apache2/sites-available/000-default.conf

RUN php database/seed.php \
    && chown -R www-data:www-data database