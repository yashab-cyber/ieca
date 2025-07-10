// IECA Service Worker for Progressive Web App functionality
// Provides offline support, caching, and improved performance

const CACHE_NAME = 'ieca-v1.0.0';
const STATIC_CACHE = 'ieca-static-v1.0.0';
const DYNAMIC_CACHE = 'ieca-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/main.js',
    '/assets/1752137694206.jpg',
    '/manifest.json'
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
    '/backend-simulation.js',
    '/api/'
];

// Cache-first resources (use cache, fallback to network)
const CACHE_FIRST = [
    '/styles/',
    '/scripts/',
    '/assets/'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Service Worker: Caching static files...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - handle network requests with different strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests (different origin)
    if (url.origin !== location.origin) {
        return;
    }
    
    // Determine caching strategy based on request
    if (shouldUseNetworkFirst(request.url)) {
        event.respondWith(networkFirstStrategy(request));
    } else if (shouldUseCacheFirst(request.url)) {
        event.respondWith(cacheFirstStrategy(request));
    } else {
        event.respondWith(staleWhileRevalidateStrategy(request));
    }
});

// Network-first strategy: Try network first, fallback to cache
function networkFirstStrategy(request) {
    return fetch(request)
        .then((response) => {
            // Clone response for caching
            const responseClone = response.clone();
            
            // Cache successful responses
            if (response.status === 200) {
                caches.open(DYNAMIC_CACHE)
                    .then((cache) => {
                        cache.put(request, responseClone);
                    });
            }
            
            return response;
        })
        .catch(() => {
            // Network failed, try cache
            return caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('📱 Service Worker: Serving from cache (offline):', request.url);
                        return cachedResponse;
                    }
                    
                    // Return offline page for navigation requests
                    if (request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                    
                    // Return offline response
                    return new Response('Offline - IECA content not available', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                });
        });
}

// Cache-first strategy: Try cache first, fallback to network
function cacheFirstStrategy(request) {
    return caches.match(request)
        .then((cachedResponse) => {
            if (cachedResponse) {
                console.log('⚡ Service Worker: Serving from cache:', request.url);
                return cachedResponse;
            }
            
            // Not in cache, fetch from network
            return fetch(request)
                .then((response) => {
                    // Clone response for caching
                    const responseClone = response.clone();
                    
                    // Cache successful responses
                    if (response.status === 200) {
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseClone);
                            });
                    }
                    
                    return response;
                })
                .catch(() => {
                    // Both cache and network failed
                    return new Response('Resource not available offline', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
        });
}

// Stale-while-revalidate strategy: Serve from cache, update cache in background
function staleWhileRevalidateStrategy(request) {
    return caches.match(request)
        .then((cachedResponse) => {
            // Fetch from network in background to update cache
            const networkFetch = fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    
                    if (response.status === 200) {
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseClone);
                            });
                    }
                    
                    return response;
                })
                .catch(() => {
                    console.warn('⚠️ Service Worker: Network fetch failed for:', request.url);
                });
            
            // Return cached version immediately if available
            if (cachedResponse) {
                console.log('🔄 Service Worker: Serving from cache, updating in background:', request.url);
                return cachedResponse;
            }
            
            // No cached version, wait for network
            return networkFetch;
        });
}

// Helper functions to determine caching strategy
function shouldUseNetworkFirst(url) {
    return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

function shouldUseCacheFirst(url) {
    return CACHE_FIRST.some(pattern => url.includes(pattern));
}

// Background sync for form submissions (when available)
self.addEventListener('sync', (event) => {
    console.log('🔄 Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'application-submission') {
        event.waitUntil(syncApplicationSubmissions());
    } else if (event.tag === 'contact-submission') {
        event.waitUntil(syncContactSubmissions());
    }
});

// Sync pending application submissions
async function syncApplicationSubmissions() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const pendingSubmissions = await cache.match('/pending-applications');
        
        if (pendingSubmissions) {
            const submissions = await pendingSubmissions.json();
            
            for (const submission of submissions) {
                try {
                    // Attempt to submit to server
                    await fetch('/api/applications', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(submission)
                    });
                    
                    console.log('✅ Service Worker: Synced application submission:', submission.id);
                } catch (error) {
                    console.error('❌ Service Worker: Failed to sync application:', error);
                }
            }
            
            // Clear pending submissions after successful sync
            await cache.delete('/pending-applications');
        }
    } catch (error) {
        console.error('❌ Service Worker: Error during application sync:', error);
    }
}

// Sync pending contact submissions
async function syncContactSubmissions() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const pendingContacts = await cache.match('/pending-contacts');
        
        if (pendingContacts) {
            const contacts = await pendingContacts.json();
            
            for (const contact of contacts) {
                try {
                    // Attempt to submit to server
                    await fetch('/api/contacts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(contact)
                    });
                    
                    console.log('✅ Service Worker: Synced contact submission:', contact.id);
                } catch (error) {
                    console.error('❌ Service Worker: Failed to sync contact:', error);
                }
            }
            
            // Clear pending contacts after successful sync
            await cache.delete('/pending-contacts');
        }
    } catch (error) {
        console.error('❌ Service Worker: Error during contact sync:', error);
    }
}

// Push notification handling (for future admin notifications)
self.addEventListener('push', (event) => {
    console.log('📱 Service Worker: Push notification received');
    
    let notificationData = {
        title: 'IECA Notification',
        body: 'You have a new message from IECA',
        icon: '/assets/1752137694206.jpg',
        badge: '/assets/1752137694206.jpg',
        tag: 'ieca-notification',
        data: {
            url: '/'
        }
    };
    
    if (event.data) {
        try {
            const pushData = event.data.json();
            notificationData = { ...notificationData, ...pushData };
        } catch (error) {
            console.error('❌ Service Worker: Error parsing push data:', error);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            tag: notificationData.tag,
            data: notificationData.data,
            actions: [
                {
                    action: 'open',
                    title: 'Open IECA'
                },
                {
                    action: 'close',
                    title: 'Dismiss'
                }
            ]
        })
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Service Worker: Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    // Open the app
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((clientList) => {
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // Open new window
                if (clients.openWindow) {
                    const url = event.notification.data?.url || '/';
                    return clients.openWindow(url);
                }
            })
    );
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    console.log('💬 Service Worker: Message received:', event.data);
    
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches()
                .then(() => {
                    event.ports[0].postMessage({ success: true });
                })
                .catch((error) => {
                    event.ports[0].postMessage({ error: error.message });
                });
            break;
            
        case 'CACHE_URLS':
            if (payload && payload.urls) {
                cacheUrls(payload.urls)
                    .then(() => {
                        event.ports[0].postMessage({ success: true });
                    })
                    .catch((error) => {
                        event.ports[0].postMessage({ error: error.message });
                    });
            }
            break;
    }
});

// Utility function to clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ Service Worker: All caches cleared');
}

// Utility function to cache specific URLs
async function cacheUrls(urls) {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.addAll(urls);
    console.log('📦 Service Worker: URLs cached:', urls);
}

// Error handling
self.addEventListener('error', (event) => {
    console.error('❌ Service Worker: Global error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Service Worker: Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Periodic background sync (when available)
self.addEventListener('periodicsync', (event) => {
    console.log('⏰ Service Worker: Periodic sync triggered:', event.tag);
    
    if (event.tag === 'update-cache') {
        event.waitUntil(updateCriticalResources());
    }
});

// Update critical resources in background
async function updateCriticalResources() {
    try {
        const cache = await caches.open(STATIC_CACHE);
        
        // Update critical resources
        const criticalUrls = [
            '/',
            '/styles/main.css',
            '/scripts/main.js'
        ];
        
        await Promise.all(
            criticalUrls.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (response.status === 200) {
                        await cache.put(url, response);
                        console.log('🔄 Service Worker: Updated cache for:', url);
                    }
                } catch (error) {
                    console.warn('⚠️ Service Worker: Failed to update cache for:', url, error);
                }
            })
        );
        
        console.log('✅ Service Worker: Critical resources updated');
    } catch (error) {
        console.error('❌ Service Worker: Error updating critical resources:', error);
    }
}

// Log service worker lifecycle
console.log('🛡️ IECA Service Worker loaded successfully');
console.log('📦 Cache version:', CACHE_NAME);
console.log('🔒 Ready to protect IECA offline experience');
