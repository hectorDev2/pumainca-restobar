#!/bin/bash
# Wrapper script para docker compose que detecta automáticamente el comando disponible

# Función para detectar qué comando usar
detect_compose_command() {
    if command -v docker &> /dev/null; then
        if docker compose version &> /dev/null 2>&1; then
            echo "docker compose"
            return 0
        elif command -v docker-compose &> /dev/null; then
            echo "docker-compose"
            return 0
        else
            echo "none"
            return 1
        fi
    else
        echo "none"
        return 1
    fi
}

COMPOSE_CMD=$(detect_compose_command)

if [ "$COMPOSE_CMD" = "none" ]; then
    echo "❌ Error: Docker no está instalado o Docker Compose no está disponible."
    echo ""
    echo "Por favor instala Docker Desktop:"
    echo "  macOS: https://www.docker.com/products/docker-desktop"
    echo "  Linux: https://docs.docker.com/engine/install/"
    echo ""
    echo "O instala docker-compose manualmente:"
    echo "  curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose"
    echo "  chmod +x /usr/local/bin/docker-compose"
    exit 1
fi

# Ejecutar el comando con todos los argumentos pasados
exec $COMPOSE_CMD "$@"
