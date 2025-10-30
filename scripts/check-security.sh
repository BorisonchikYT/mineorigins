#!/bin/bash

echo "🔍 Checking SSL configuration..."

# Check security headers
echo "1. Checking security headers..."
curl -I https://domein.ru

# Check HTTP to HTTPS redirect
echo "2. Checking HTTP to HTTPS redirect..."
curl -I http://domein.ru

# Check HSTS
echo "3. Checking HSTS header..."
curl -I https://domein.ru | grep Strict-Transport-Security

# Check SSL certificate
echo "4. Checking SSL certificate..."
openssl s_client -connect domein.ru:443 -servername domein.ru < /dev/null 2>/dev/null | openssl x509 -noout -dates

echo "✅ Security check completed"