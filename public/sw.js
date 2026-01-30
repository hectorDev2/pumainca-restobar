/**
 * Service Worker para Pumainca Restobar PWA
 *
 * Este service worker implementa estrategias de caché inteligentes
 * para mejorar el rendimiento y habilitar funcionalidad offline.
 *
 * Estrategias implementadas:
 * - Cache First: Imágenes y recursos estáticos (CSS, JS, fonts)
 * - Network First: HTML y APIs (con fallback a caché)
 * - Stale While Revalidate: Para datos que cambian frecuentemente
 */

const CACHE_VERSION = "v1";
const CACHE_NAMES = {
  static: `pumainca-static-${CACHE_VERSION}`,
  images: `pumainca-images-${CACHE_VERSION}`,
  api: `pumainca-api-${CACHE_VERSION}`,
  pages: `pumainca-pages-${CACHE_VERSION}`,
};

// Recursos para pre-cachear al instalar el service worker
const PRECACHE_URLS = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    caches
      .open(CACHE_NAMES.static)
      .then((cache) => {
        console.log("[SW] Precaching static resources");
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        // Activar inmediatamente el nuevo service worker
        return self.skipWaiting();
      }),
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    // Limpiar cachés antiguos
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Si el caché no está en CACHE_NAMES, eliminarlo
            if (!Object.values(CACHE_NAMES).includes(cacheName)) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        // Tomar control de todas las páginas inmediatamente
        return self.clients.claim();
      }),
  );
});

// Interceptar todas las peticiones de red
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo cachear peticiones GET
  if (request.method !== "GET") {
    return;
  }

  // Estrategia basada en el tipo de recurso
  if (isImageRequest(url)) {
    // IMÁGENES: Cache First (usa caché, si falla descarga)
    event.respondWith(
      cacheFirst(request, CACHE_NAMES.images, 30 * 24 * 60 * 60 * 1000),
    ); // 30 días
  } else if (isStaticResource(url)) {
    // ESTÁTICOS (JS, CSS, Fonts): Cache First
    event.respondWith(
      cacheFirst(request, CACHE_NAMES.static, 365 * 24 * 60 * 60 * 1000),
    ); // 1 año
  } else if (isApiRequest(url)) {
    // APIs: Network First (red primero, fallback caché)
    event.respondWith(networkFirst(request, CACHE_NAMES.api, 5 * 60 * 1000)); // 5 minutos
  } else if (isPageRequest(url)) {
    // PÁGINAS HTML: Network First con fallback a /offline
    event.respondWith(networkFirstWithOffline(request, CACHE_NAMES.pages));
  }
});

/**
 * Estrategia: Cache First
 * Busca en caché primero, si no existe descarga de red
 */
async function cacheFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    // Verificar si está expirado
    const cachedTime = new Date(
      cached.headers.get("sw-cached-time") || 0,
    ).getTime();
    const now = Date.now();

    if (maxAge && now - cachedTime < maxAge) {
      return cached;
    }
  }

  // No está en caché o expiró, descargar de red
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Clonar para cachear (la respuesta solo se puede usar una vez)
      const responseToCache = response.clone();

      // Agregar timestamp al header
      const headers = new Headers(responseToCache.headers);
      headers.set("sw-cached-time", new Date().toISOString());

      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });

      cache.put(request, modifiedResponse);
    }
    return response;
  } catch (error) {
    // Si falla la red, devolver de caché aunque esté expirado
    if (cached) {
      return cached;
    }
    throw error;
  }
}

/**
 * Estrategia: Network First
 * Intenta red primero, si falla usa caché
 */
async function networkFirst(request, cacheName, timeout = 5000) {
  const cache = await caches.open(cacheName);

  try {
    // Intentar red con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Si falla la red, usar caché
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

/**
 * Estrategia: Network First con fallback a página offline
 */
async function networkFirstWithOffline(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Intentar caché
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    // Si no hay caché, mostrar página offline
    const offlinePage = await cache.match("/offline");
    if (offlinePage) {
      return offlinePage;
    }

    // Si todo falla, devolver respuesta básica
    return new Response("Offline", {
      status: 503,
      statusText: "Service Unavailable",
      headers: new Headers({
        "Content-Type": "text/plain",
      }),
    });
  }
}

// Helpers para identificar tipos de recursos
function isImageRequest(url) {
  return /\.(png|jpg|jpeg|webp|svg|gif|ico)(\?.*)?$/i.test(url.pathname);
}

function isStaticResource(url) {
  return /\.(js|css|woff|woff2|ttf|otf)(\?.*)?$/i.test(url.pathname);
}

function isApiRequest(url) {
  return url.pathname.startsWith("/api/");
}

function isPageRequest(url) {
  // Páginas HTML (sin extensión o .html)
  return (
    (url.origin === self.location.origin && !url.pathname.includes(".")) ||
    url.pathname.endsWith(".html")
  );
}

// Logging de eventos importantes
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

console.log("[SW] Service Worker loaded successfully");
