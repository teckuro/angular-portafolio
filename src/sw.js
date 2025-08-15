// Service Worker para el Portafolio de Juan Pablo Huerta
const CACHE_NAME = 'portfolio-v1.0.0';
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
				console.log('Cache abierto');
				return cache.addAll(urlsToCache);
			})
			.catch((error) => {
				console.log('Error al cachear archivos:', error);
			})
	);
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						console.log('Eliminando cache antiguo:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

// Interceptación de peticiones
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			// Si la respuesta está en cache, la devolvemos
			if (response) {
				return response;
			}

			// Si no está en cache, hacemos la petición a la red
			return fetch(event.request)
				.then((response) => {
					// Verificamos que la respuesta sea válida
					if (
						!response ||
						response.status !== 200 ||
						response.type !== 'basic'
					) {
						return response;
					}

					// Clonamos la respuesta para poder cachearla
					const responseToCache = response.clone();

					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseToCache);
					});

					return response;
				})
				.catch(() => {
					// Si falla la petición a la red, devolvemos una página offline
					if (event.request.destination === 'document') {
						return caches.match('/index.html');
					}
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
