#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Create website directory
sudo mkdir -p /var/www/mineorigins
sudo chown -R www-data:www-data /var/www/mineorigins
sudo chmod -R 755 /var/www/mineorigins

# Generate DH parameters
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048

# Create config files from your project
sudo cp /path/to/your/project/etc/nginx/nginx.conf /etc/nginx/
sudo cp /path/to/your/project/etc/nginx/conf.d/* /etc/nginx/conf.d/
sudo cp /path/to/your/project/etc/nginx/sites-available/* /etc/nginx/sites-available/

# Enable site
sudo ln -sf /etc/nginx/sites-available/mineorigins.conf /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Get SSL certificate (ЗАМЕНИТЕ domein.ru на ваш домен!)
sudo certbot --nginx -d domein.ru -d www.domein.ru

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "✅ HTTPS setup completed!"