
const CACHE_NAME = "memorama-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icon-192.png"
];

self.addEventListener("install", (evento) => {
    evento.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ARCHIVOS);
            })
    );
});

self.addEventListener("fetch", (evento) => {
    evento.respondWith(
        caches.match(evento.request)
            .then((respuesta) => {
                if (respuesta) {
                    return respuesta;
                }

                return fetch(evento.request);
            })
    );
});
