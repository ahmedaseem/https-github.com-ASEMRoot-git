const CACHE_NAME = "asem-v1";

const BASE = "/asem.digital-solutions";

const FILES = [
    BASE + "/",
    BASE + "/index.html",
    BASE + "/style.css",
    BASE + "/app.js",
    BASE + "/manifest.json",
    BASE + "/assets/logos/asem-logo.png",
    BASE + "/assets/icons/icon-192.png",
    BASE + "/assets/icons/icon-512.png"
];


self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(FILES))
    );

});


self.addEventListener("fetch", event => {

    event.respondWith(
        caches.match(event.request)
        .then(response => {

            return response || fetch(event.request);

        {
  "project_name": "ASEM Global Platform",
  "category": "Web Application",
  "technologies": ["HTML", "JavaScript", "AI"],
  "version": "1.0.0",
  "status": "Completed"
}
    );

};
