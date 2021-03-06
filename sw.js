/* Setting up the variable for the service worker functions */
const staticCacheName = 'restaurant-reviews-v4';

/* Installs the data to store */
self.addEventListener('install', function (event) {
    // console.log("Service Worker installed");
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                '/',
                'css/styles.css',
                'https://chefrate.glitch.me/restaurants/',
                'img/1.jpg',
                'img/10.jpg',
                'img/2.jpg',
                'img/3.jpg',
                'img/4.jpg',
                'img/5.jpg',
                'img/6.jpg',
                'img/7.jpg',
                'img/8.jpg',
                'img/9.jpg',
                'img/10.jpg',
                'img/favicon-32x32.png',
                'img/marker-icon-2x-red.png',
                'img/marker-shadow.png',
                'manifest.json',
                'js/idb.js',
                'js/dbhelper.js',
                'js/bouncemarker.js',
                'js/main.js',
                'js/restaurant_info.js',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
                'restaurant.html',
            ]);
        })
    );
    // console.log("cache successful");
});


// deletes old cache
self.addEventListener('activate', function (event) {
            // console.log("Service Worker activated");
            event.waitUntil(
                caches.keys().then(function (cacheNames) {
                    return Promise.all(
                        cacheNames.filter(function (cacheName) {
                            return cacheName.startsWith('restaurant-reviews-') &&
                                cacheName != staticCacheName;
                        }).map(function (cacheName) {
                            return caches.delete(cacheName);
                        })
                    );
                    // console.log("Old cache removed");
                })
            );
        });

    self.addEventListener('fetch', function (event) {
        // console.log("Service Worker starting fetch");
        event.respondWith(
            caches.open(staticCacheName).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    if (response) {
                        // console.log("data fetched from cache");
                        return response;
                    }
                    else {
                        return fetch(event.request).then(function (networkResponse) {
                            // console.log("data fetched from network", event.request.url);
                            //cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        }).catch(function (error) {
                            console.log('Unable to fetch data from network', event.request.url, error);
                        });
                    }
                });
            }).catch(function (error) {
                console.log('Something went wrong with Service Worker fetch intercept', error);
            })
        );
    });
