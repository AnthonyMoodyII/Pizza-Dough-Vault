#!/bin/sh
set -e

echo "Waiting for database and running migrations..."
until npx prisma migrate deploy 2>&1; do
  echo "  Migration failed (DB may not be ready yet), retrying in 3s..."
  sleep 3
done

echo "Migrations complete. Starting Next.js..."
exec npm start
