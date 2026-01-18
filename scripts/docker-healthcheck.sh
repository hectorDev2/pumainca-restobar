#!/bin/sh
# Health check script para Docker
# Verifica que la aplicación esté respondiendo correctamente

set -e

# Esperar un poco para que el servidor inicie
sleep 2

# Verificar que el servidor responda
if curl -f http://localhost:3000 > /dev/null 2>&1; then
  echo "Health check passed"
  exit 0
else
  echo "Health check failed"
  exit 1
fi
