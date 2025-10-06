const CACHE_NAME = 'astroflix-cache-v1';

// ATUALIZE ESTA LISTA COM TODOS OS ARQUIVOS DO SEU PROJETO!
const urlsToCache = [
    '/', // A rota raiz
    '/index.html',
    '/series.html',
    '/filmes.html',
    '/noticias.html',
    '/cinemas.html',
    '/logo.jpeg', // Sua logo do header
    '/logo-footer.png', // Sua logo do footer
    '/icon-192x192.jpeg', // Seus ícones (Manifesto)
    '/icon-512x512.png',
    
    // Nomes de imagens/posters (Ajuste ou adicione mais conforme o seu projeto)
    '/demonslayer.png',
    '/ne zha.jpg',
    '/nsei.jpg',
    '/goat.jpg',
    '/tron.jpg',

    // Se você tivesse um arquivo CSS separado, ele entraria aqui
    // Como o CSS está no index, apenas os arquivos de fonte (se houver) entrariam
];

// 1. Instalação: Armazena os arquivos estáticos no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Arquivos em cache.');
                return cache.addAll(urlsToCache).catch(error => {
                    console.error('Falha ao adicionar ao cache:', error);
                });
            })
    );
    self.skipWaiting(); // Força o novo Service Worker a ativar imediatamente
});

// 2. Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Deletando cache antigo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// 3. Fetch: Tenta buscar da rede, mas usa o cache como fallback offline
self.addEventListener('fetch', event => {
    // Apenas intercepta requisições HTTP/HTTPS
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    // Retorna o recurso do cache se estiver lá
                    if (response) {
                        return response;
                    }

                    // Se não estiver no cache, tenta buscar na rede
                    return fetch(event.request).catch(() => {
                        // Se a busca falhar (usuário offline ou problema),
                        // você pode retornar uma página offline padrão aqui
                        // (ex: caches.match('/offline.html'))
                    });
                })
        );
    }
});