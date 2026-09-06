
// gps.js - FIXED VERSION

// Global state and utilities
const ASEM = {
state: {
location: null,
lastResults: []
}
};

// ============================================
// PLATFORM ACTION HANDLERS
// ============================================

const platformActions = {

global_search: () => {
const searchInput = document.getElementById("globalSearchInput");
if (searchInput) {
searchInput.focus();
}
},

nearby: () => requestGPS(),

explore: () => {
console.log("Explore action triggered");
}
};

// ============================================
// GPS / NEARBY LOCATION SEARCH
// ============================================

async function requestGPS() {
if (!navigator.geolocation) {
alert("Geolocation is not supported by this browser.");
return;
}

const button = document.getElementById("gpsButton");  
if (button) {  
    button.setAttribute("aria-busy", "true");  
}  

navigator.geolocation.getCurrentPosition(  
    async position => {  
        const {  
            latitude,  
            longitude,  
            accuracy  
        } = position.coords;  

        // Store user location in state  
        ASEM.state.location = {  
            latitude,  
            longitude,  
            accuracy  
        };  

        // Dispatch custom event for location change  
        document.dispatchEvent(  
            new CustomEvent("asem:locationchange", {  
                detail: ASEM.state.location  
            })  
        );  

        // Get search parameters  
        const type = document.getElementById("searchType")?.value || "all";  
        const radius = Number(document.getElementById("radiusKm")?.value || 25);  

        try {  
            // FIX: Changed 'lat' to 'latitude' - was undefined before  
            const params = new URLSearchParams({  
                latitude: latitude,  // ✅ FIXED: was 'lat' (undefined)  
                longitude: longitude,  
                radiusKm: radius,  
                type: type  
            });  

            const response = await fetch(  
                `/api/nearby?${params}`,  
                {  
                    headers: {  
                        Accept: "application/json"  
                    }  
                }  
            );  

            if (!response.ok) {  
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);  
            }  

            const results = await response.json();  
            ASEM.state.lastResults = results;  

            const grid = document.getElementById("searchResults");  
            if (!grid) {  
                console.warn("Search results grid not found");  
                return;  
            }  

            // Display results or "no results" message  
            if (!results || results.length === 0) {  
                grid.innerHTML = `  
                    <article class="card platform-state">  
                        <div class="platform-card-icon">📍</div>  
                        <h3>Nothing nearby</h3>  
                        <p>No platform records were found within ${radius} km.</p>  
                    </article>  
                `;  
                return;  
            }  

            // Build result cards  
            grid.innerHTML = results  
                .map(buildUnifiedResultCard)  
                .join("");  

            // Scroll to results  
            const section = grid.closest("section");  
            if (section) {  
                section.hidden = false;  
                section.scrollIntoView({  
                    behavior: "smooth",  
                    block: "start"  
                });  
            }  

        } catch (error) {  
            console.error("ASEM GPS search failed:", error);  
            alert("Your location was received, but the nearby search failed: " + error.message);  
        } finally {  
            if (button) {  
                button.removeAttribute("aria-busy");  
            }  
        }  
    },  

    error => {  
        if (button) {  
            button.removeAttribute("aria-busy");  
        }  

        const messages = {  
            1: "Location permission was denied.",  
            2: "Your location could not be determined.",  
            3: "The location request timed out."  
        };  

        alert(messages[error.code] || "Unable to obtain your location.");  
    },  

    {  
        enableHighAccuracy: true,  
        timeout: 12000,  
        maximumAge: 30000  
    }  
);

}

// ============================================
// GLOBAL SEARCH
// ============================================

async function performGlobalSearch(query) {
if (!query.trim()) {
alert("Please enter a search query");
return;
}

try {  
    const params = new URLSearchParams({ q: query });  
    const response = await fetch(`/api/search?${params}`, {  
        headers: { Accept: "application/json" }  
    });  

    if (!response.ok) {  
        throw new Error(`HTTP ${response.status}`);  
    }  

    const data = await response.json();  
      
    if (!data.success) {  
        throw new Error(data.message || "Search failed");  
    }  

    displaySearchResults(data.data);  
} catch (error) {  
    console.error("Global search error:", error);  
    alert("Search failed: " + error.message);  
}

}

function displaySearchResults(results) {
const grid = document.getElementById("searchResults");
if (!grid) return;

if (!results || results.length === 0) {  
    grid.innerHTML = `  
        <article class="card platform-state">  
            <div class="platform-card-icon">🔍</div>  
            <h3>No results found</h3>  
            <p>Try a different search term</p>  
        </article>  
    `;  
    return;  
}  

grid.innerHTML = results  
    .map(buildUnifiedResultCard)  
    .join("");  

const section = grid.closest("section");  
if (section) {  
    section.hidden = false;  
    section.scrollIntoView({ behavior: "smooth", block: "start" });  
}

}

// ============================================
// RESULT CARD BUILDER
// ============================================

function buildUnifiedResultCard(item) {
const name = item.name || item.title || "Unknown";
const description = item.description || item.summary || "";
const icon = item.icon || item.category_icon || "📌";

// Calculate distance if coordinates are available  
let distanceHTML = "";  
if (item.latitude && item.longitude && ASEM.state.location) {  
    const distance = calculateDistance(  
        ASEM.state.location.latitude,  
        ASEM.state.location.longitude,  
        item.latitude,  
        item.longitude  
    );  
    distanceHTML = `<span class="distance-badge">${distance.toFixed(1)} km</span>`;  
}  

return `  
    <article class="card search-result" data-id="${item.id || ''}">  
        <div class="card-header">  
            <div class="card-icon">${icon}</div>  
            <div class="card-title">  
                <h3>${escapeHtml(name)}</h3>  
                ${distanceHTML}  
            </div>  
        </div>  
        <p class="card-description">${escapeHtml(description)}</p>  
        ${item.address ? `<p class="card-meta">📍 ${escapeHtml(item.address)}</p>` : ""}  
        ${item.phone ? `<p class="card-meta">📞 ${escapeHtml(item.phone)}</p>` : ""}  
    </article>  
`;

}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**

Calculate distance between two coordinates using Haversine formula

Returns distance in kilometers
*/
function calculateDistance(lat1, lon1, lat2, lon2) {
const R = 6371; // Earth's radius in kilometers
const dLat = (lat2 - lat1) * Math.PI / 180;
const dLon = (lon2 - lon1) * Math.PI / 180;

const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
Math.sin(dLon / 2) * Math.sin(dLon / 2);

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
return R * c;
}


function escapeHtml(text) {
if (!text) return "";
const div = document.createElement("div");
div.textContent = text;
return div.innerHTML;
}

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
// Setup platform action buttons
document.querySelectorAll("[data-platform-action]").forEach(btn => {
btn.addEventListener("click", (e) => {
e.preventDefault();
const action = btn.getAttribute("data-platform-action");
if (platformActions[action]) {
platformActionsaction;
}
});
});

// Setup global search form  
const searchForm = document.getElementById("globalSearchForm");  
if (searchForm) {  
    searchForm.addEventListener("submit", (e) => {  
        e.preventDefault();  
        const input = document.getElementById("globalSearchInput");  
        if (input) {  
            performGlobalSearch(input.value);  
        }  
    });  
}  

// Setup GPS button  
const gpsButton = document.getElementById("gpsButton");  
if (gpsButton) {  
    gpsButton.addEventListener("click", requestGPS);  
}

});

// ============================================
// INTERNATIONALIZATION (i18n) STRINGS
// ============================================

const i18n = {
ar: {
global_search: "البحث العالمي",
global_search_desc: "ابحث داخل منصة ASEM.",
nearby: "قريب",
nearby_desc: "ابحث عن الأماكن والشركات القريبة منك.",
search_placeholder: "ابحث...",
no_results: "لا توجد نتائج",
loading: "جاري التحميل...",
error: "حدث خطأ"
},
en: {
global_search: "Global Search",
global_search_desc: "Search across the ASEM platform.",
nearby: "Nearby",
nearby_desc: "Find nearby businesses, products and platform results.",
search_placeholder: "Search...",
no_results: "No results found",
loading: "Loading...",
error: "An error occurred"
},
fr: {
global_search: "Recherche mondiale",
global_search_desc: "Recherchez sur la plateforme ASEM.",
nearby: "À proximité",
nearby_desc: "Trouvez les entreprises et produits à proximité.",
search_placeholder: "Rechercher...",
no_results: "Aucun résultat trouvé",
loading: "Chargement...",
error: "Une erreur s'est produite"
},
de: {
global_search: "Globale Suche",
global_search_desc: "Durchsuchen Sie die ASEM-Plattform.",
nearby: "In der Nähe",
nearby_desc: "Finden Sie Unternehmen und Produkte in der Nähe.",
search_placeholder: "Suchen...",
no_results: "Keine Ergebnisse gefunden",
loading: "Wird geladen...",
error: "Ein Fehler ist aufgetreten"
},
it: {
global_search: "Ricerca globale",
global_search_desc: "Cerca nella piattaforma ASEM.",
nearby: "Vicino",
nearby_desc: "Trova aziende e prodotti nelle vicinanze.",
search_placeholder: "Cerca...",
no_results: "Nessun risultato trovato",
loading: "Caricamento...",
error: "Si è verificato un errore"
},
es: {
global_search: "Búsqueda global",
global_search_desc: "Busca en la plataforma ASEM.",
nearby: "Cerca",
nearby_desc: "Encuentra empresas y productos cercanos.",
search_placeholder: "Buscar...",
no_results: "No se encontraron resultados",
loading: "Cargando...",
error: "Ocurrió un error"
},
nl: {
global_search: "Wereldwijd zoeken",
global_search_desc: "Zoek binnen het ASEM-platform.",
nearby: "Dichtbij",
nearby_desc: "Vind bedrijven en producten in de buurt.",
search_placeholder: "Zoeken...",
no_results: "Geen resultaten gevonden",
loading: "Laden...",
error: "Er is een fout opgetreden"
}
};

// Translation helper
function t(key, lang = "en") {
return i18n[lang]?.[key] || i18n.en[key] || key;
}
