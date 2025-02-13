#!/bin/sh

echo "Waiting for database to be ready..."
MAX_RETRIES=30
RETRIES=0

until nc -z db 5432 || [ $RETRIES -eq $MAX_RETRIES ]; do
  echo "Waiting for postgres server, $((MAX_RETRIES - RETRIES)) remaining attempts..."
  RETRIES=$((RETRIES+1))
  sleep 1
done

if [ $RETRIES -eq $MAX_RETRIES ]; then
  echo "Failed to connect to postgres server"
  exit 1
fi

echo "Database is ready!"

# Executa as migrações do Prisma
echo "Running migrations..."
npx prisma migrate deploy

# Inicia a aplicação
echo "Starting application..."
npm run start:prod