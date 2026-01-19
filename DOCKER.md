# 🐳 Guía de Dockerización - Pumainca Restobar

Esta guía explica cómo usar Docker para desarrollar y desplegar la aplicación.

## 📋 Prerrequisitos

- Docker Desktop instalado ([Descargar](https://www.docker.com/products/docker-desktop))
- Docker Compose v2.0+ (incluido en Docker Desktop)
- Variables de entorno configuradas en `.env.local`

### Verificar instalación

```bash
# Verificar Docker
docker --version

# Verificar Docker Compose (plugin moderno)
docker compose version

# Si tienes docker-compose legacy, también funcionará
docker-compose --version
```

## 🚀 Desarrollo Local con Docker

### Iniciar el entorno de desarrollo

```bash
# Construir e iniciar contenedores (recomendado)
npm run docker:dev

# O con docker compose directamente (plugin moderno)
docker compose up

# O con docker-compose (legacy, si está instalado)
docker-compose up

# En modo detached (background)
docker compose up -d
```

La aplicación estará disponible en: http://localhost:3000

### Comandos útiles para desarrollo

```bash
# Ver logs en tiempo real
npm run docker:dev:logs
# O
docker compose logs -f app

# Reconstruir contenedores después de cambios en Dockerfile
npm run docker:dev:build

# Detener contenedores
npm run docker:dev:down
# O
docker compose down

# Acceder al shell del contenedor
docker compose exec app sh

# Instalar nueva dependencia
docker compose exec app bun add nombre-paquete

# Ver estado de contenedores
docker compose ps
```

### Hot Reload

El volumen montado (`.:/app`) permite que los cambios en el código se reflejen automáticamente sin reconstruir el contenedor.

## 🏗️ Build de Producción

### Construir imagen de producción

```bash
# Construir imagen localmente
npm run docker:build

# O con docker directamente
docker build -t pumainca-restobar .
```

### Ejecutar contenedor de producción localmente

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=tu_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key \
  -e SUPABASE_SERVICE_ROLE_KEY=tu_service_key \
  pumainca-restobar
```

## 🚢 Despliegue en Producción

### Con Docker Compose

1. **Crear archivo `.env.production`** con las variables de entorno de producción:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_key
NEXT_PUBLIC_API_BASE_URL=https://tu-dominio.com/api
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=tu_imagekit_url
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=tu_public_key
IMAGEKIT_PRIVATE_KEY=tu_private_key
```

2. **Iniciar servicios de producción**:

```bash
npm run docker:prod

# O
docker-compose -f docker-compose.prod.yml up -d
```

3. **Ver logs de producción**:

```bash
npm run docker:prod:logs
```

### Despliegue en Cloud Providers

#### AWS ECS/Fargate

```bash
# 1. Autenticarse en ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# 2. Crear repositorio (solo primera vez)
aws ecr create-repository --repository-name pumainca-restobar --region us-east-1

# 3. Build y tag
docker build -t pumainca-restobar .
docker tag pumainca-restobar:latest <account>.dkr.ecr.us-east-1.amazonaws.com/pumainca-restobar:latest

# 4. Push a ECR
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/pumainca-restobar:latest

# 5. Crear task definition y servicio en ECS
```

#### Railway

1. Conecta tu repositorio GitHub a Railway
2. Railway detectará automáticamente el Dockerfile
3. Configura las variables de entorno en el dashboard
4. Deploy automático en cada push

#### Render

1. Conecta tu repositorio GitHub
2. Selecciona "Docker" como entorno
3. Render usará el Dockerfile automáticamente
4. Configura variables de entorno

#### Fly.io

```bash
# Instalar flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Inicializar app (solo primera vez)
fly launch

# Deploy
fly deploy
```

## 🔧 Configuración Avanzada

### Variables de Entorno

Las variables de entorno se pueden pasar de varias formas:

1. **Archivo `.env.local`** (desarrollo)
2. **Archivo `.env.production`** (producción con docker-compose)
3. **Variables directas** en docker-compose.yml
4. **Secrets de Docker** (producción)

### Health Checks

Los contenedores incluyen health checks que verifican que la aplicación esté funcionando:

- **Desarrollo**: Verifica que el servidor responda en `/`
- **Producción**: Verifica que el servidor responda en `/`

### Recursos y Límites

En producción (`docker-compose.prod.yml`), los recursos están limitados a:
- **CPU**: Máximo 1.0, Reservado 0.5
- **Memoria**: Máximo 1GB, Reservado 512MB

Ajusta estos valores según tus necesidades.

## 🐛 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs detallados
docker compose logs app

# Verificar que el puerto 3000 no esté en uso
lsof -i :3000

# Reconstruir desde cero
docker compose build --no-cache
```

### Cambios no se reflejan

```bash
# Verificar que los volúmenes estén montados correctamente
docker compose exec app ls -la /app

# Reiniciar contenedor
docker compose restart app
```

### Problemas con dependencias

```bash
# Limpiar cache y reinstalar
docker compose exec app rm -rf node_modules
docker compose exec app bun install
```

### Error: "docker-compose: command not found"

Si ves este error, significa que Docker Compose no está instalado como binario separado. Las versiones modernas de Docker incluyen Compose como plugin. Usa:

```bash
# En lugar de: docker-compose
docker compose

# O instala docker-compose legacy:
# macOS/Linux:
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Imagen muy grande

El Dockerfile usa multi-stage build para optimizar el tamaño. Si necesitas reducir más:

```bash
# Ver tamaño de imagen
docker images pumainca-restobar

# Usar distroless o alpine para runtime
# (requiere ajustar Dockerfile)
```

## 📊 Monitoreo

### Ver uso de recursos

```bash
docker stats
```

### Inspeccionar contenedor

```bash
docker inspect pumainca-restobar
```

## 🔐 Seguridad

- ✅ Usuario no-root (`nextjs`) en producción
- ✅ Variables sensibles en secrets/env files
- ✅ Health checks configurados
- ✅ Límites de recursos para prevenir DoS

## 📚 Recursos Adicionales

- [Documentación de Docker](https://docs.docker.com/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
