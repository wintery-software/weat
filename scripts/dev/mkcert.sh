#!/bin/bash

# Usage: ./mkcert.sh
# Generates certificate for localhost, 127.0.0.1, 0.0.0.0, and a custom domain

set -e

CUSTOM_DOMAIN="${1:-$(hostname)}"
CERT_FILE="localhost.pem"
KEY_FILE="localhost-key.pem"
CERT_DIR="certificates"

mkcert -install

mkcert localhost 127.0.0.1 0.0.0.0 $CUSTOM_DOMAIN

# Create certificates directory if it doesn't exist
mkdir -p $CERT_DIR

# Move the generated files to the certificates folder
mv localhost+3.pem $CERT_DIR/$CERT_FILE
mv localhost+3-key.pem $CERT_DIR/$KEY_FILE

echo "$CERT_DIR/$CERT_FILE"
echo "$CERT_DIR/$KEY_FILE"
