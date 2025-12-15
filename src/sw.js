// Service Worker para el Portafolio de Juan Pablo Huerta
// IMPORTANTE: cambia la versión cada vez que hagas cambios relevantes
const CACHE_NAME = 'portfolio-v1.0.1';
const urlsToCache = [
	'/',
	'/index.html',
	'/assets/img/linkedin.svg',
	'/assets/img/github.svg',
	'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
	'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				return cache.addAll(urlsToCache);
			})
			.catch((error) => {
				// Error al cachear archivos
			})
	);
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== CACHE_NAME) {
							return caches.delete(cacheName);
						}
					})
				)
			)
			.then(() => self.clients.claim())
	);
});

// Interceptación de peticiones
// Estrategia:
// - Para navegaciones/HTML: NETWORK FIRST (si no hay red, usar caché)
// - Para otros recursos estáticos (CSS, JS, imágenes, fuentes): CACHE FIRST
self.addEventListener('fetch', (event) => {
	// Solo manejamos peticiones GET
	if (event.request.method !== 'GET') {
		return;
	}

	// Navegaciones / documentos HTML: NETWORK FIRST
	if (
		event.request.mode === 'navigate' ||
		event.request.destination === 'document'
	) {
		event.respondWith(
			fetch(event.request)
				.then((response) => {
					// Guardamos en caché la versión más reciente
					const responseToCache = response.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseToCache);
					});
					return response;
				})
				.catch(() =>
					// Si no hay red, usamos lo que haya en caché
					caches.match(event.request).then((cachedResponse) => {
						return cachedResponse || caches.match('/index.html');
					})
				)
		);
		return;
	}

	// Otros recursos estáticos: CACHE FIRST
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response;
			}

			return fetch(event.request)
				.then((response) => {
					if (!response || response.status !== 200) {
						return response;
					}

					const responseToCache = response.clone();

					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseToCache);
					});

					return response;
				})
				.catch(() => {
					// Para recursos no críticos simplemente dejamos fallar
					return undefined;
				});
		})
	);
});

// Manejo de mensajes del Service Worker
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});
