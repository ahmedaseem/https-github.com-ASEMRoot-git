use strict";

/*
 * ============================================================
 * ASEM DIGITAL SOLUTIONS
 * GLOBAL PLATFORM CONTROLLER
 * ============================================================
 *
 * Designed for:
 *
 * GitHub Pages
 * Static Hosting
 * Local Browser Testing
 * Future REST APIs
 *
 * FEATURES
 * ------------------------------------------------------------
 * ✓ Tourism Demo
 * ✓ Global Businesses Demo
 * ✓ Global Products Demo
 * ✓ Projects Demo
 * ✓ Portfolio
 * ✓ Services navigation
 * ✓ Contact navigation
 * ✓ Global Search
 * ✓ Dark / Light Mode
 * ✓ Auto / AR / EN / FR / JA
 * ✓ RTL / LTR
 * ✓ Scroll Top
 * ✓ Retry
 * ✓ Loading states
 * ✓ Empty states
 * ✓ Error states
 * ✓ Safe HTML escaping
 * ✓ Lazy images
 * ✓ Keyboard accessibility
 * ✓ GitHub Pages compatible
 * ✓ Future API support
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * GitHub Pages cannot execute /api/* backend routes.
 *
 * Therefore:
 *
 * GitHub Pages = DEMO MODE
 *
 * Future server = LIVE API MODE
 *
 * To enable your real API later:
 *
 * CONFIG.mode = "api";
 *
 * ============================================================
 */

(() => {

    "use strict";


    /* ========================================================
       ASEM CONFIGURATION
       ======================================================== */

        const CONFIG = {
    mode: "api",

    api: {
        tourism: "/api/tourism",
        businesses: "/api/businesses",
        products: "/api/products",
        projects: "/api/projects"
    },

    timeout: 15000,

    storage: {
        theme: "asem-theme",
        language: "asem-language"
    },

    demoDelay: 350
};



    /* ========================================================
       DEMO DATABASE
       ======================================================== */

    const DEMO_DATA = {

        tourism: [

            {
                id: "tourism-001",
                name: "Paris",
                category: "City",
                description:
                    "Discover Paris, its landmarks, culture, museums and unforgettable experiences.",
                image:
                    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
                rating: "4.9"
            },

            {
                id: "tourism-002",
                name: "Tokyo",
                category: "City",
                description:
                    "Explore Tokyo through technology, culture, food, shopping and modern attractions.",
                image:
                    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
                rating: "4.8"
            },

            {
                id: "tourism-003",
                name: "Dubai",
                category: "City",
                description:
                    "Experience modern architecture, luxury destinations and world-class attractions.",
                image:
                    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
                rating: "4.8"
            },

            {
                id: "tourism-004",
                name: "Bali",
                category: "Island",
                description:
                    "Discover beaches, nature, culture and unique experiences in Bali.",
                image:
                    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
                rating: "4.7"
            },

            {
                id: "tourism-005",
                name: "New York",
                category: "City",
                description:
                    "Explore one of the world's most iconic cities, from Manhattan to Brooklyn.",
                image:
                    "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=80",
                rating: "4.8"
            },

            {
                id: "tourism-006",
                name: "Cairo",
                category: "Historic City",
                description:
                    "Explore ancient history, Egyptian culture and the legendary pyramids.",
                image:
                    "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=900&q=80",
                rating: "4.7"
            }

        ],


        businesses: [

            {
                id: "business-001",
                name: "ASEM Technology Center",
                category: "Technology",
                description:
                    "Demo technology company for testing the ASEM global business platform.",
                address:
                    "Paris, France",
                rating: "4.9",
                image:
                    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"
            },

            {
                id: "business-002",
                name: "Global Digital Studio",
                category: "Digital Agency",
                description:
                    "Creative digital services, websites, automation and software solutions.",
                address:
                    "London, United Kingdom",
                rating: "4.8",
                image:
                    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
            },

            {
                id: "business-003",
                name: "World Restaurant",
                category: "Restaurant",
                description:
                    "International cuisine and dining experience for ASEM platform testing.",
                address:
                    "Dubai, UAE",
                rating: "4.7",
                image:
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
            },

            {
                id: "business-004",
                name: "Smart Cloud Services",
                category: "Cloud Services",
                description:
                    "Cloud infrastructure and digital solutions for modern organizations.",
                address:
                    "Tokyo, Japan",
                rating: "4.8",
                image:
                    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80"
            }

        ],


        products: [

            {
                id: "product-001",
                name: "ASEM Digital Starter",
                category: "Digital Service",
                description:
                    "Demo digital package for testing the ASEM product marketplace.",
                price: "49",
                currency: "USD",
                image:
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80"
            },

            {
                id: "product-002",
                name: "Business Website Package",
                category: "Web Development",
                description:
                    "Professional website package for businesses and organizations.",
                price: "199",
                currency: "USD",
                image:
                    "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=80"
            },

            {
                id: "product-003",
                name: "AI Automation Package",
                category: "AI",
                description:
                    "Demo automation package showing how AI services could be presented.",
                price: "299",
                currency: "USD",
                image:
                    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80"
            },

            {
                id: "product-004",
                name: "Cloud Starter",
                category: "Cloud",
                description:
                    "Starter cloud infrastructure package for digital projects.",
                price: "99",
                currency: "USD",
                image:
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80"
            }

        ],


        projects: [

            {
                id: "project-001",
                name: "ASEM Global Platform",
                description:
                    "Global platform connecting tourism, businesses, products and digital services."
            },

            {
                id: "project-002",
                name: "ASEM Tourism",
                description:
                    "Global tourism discovery system for destinations and attractions."
            },

            {
                id: "project-003",
                name: "ASEM Business Directory",
                description:
                    "Worldwide business and organization discovery platform."
            },

            {
                id: "project-004",
                name: "ASEM Digital Marketplace",
                description:
                    "Digital product discovery and future commerce platform."
            },

            {
                id: "project-005",
                name: "ASEM AI Automation",
                description:
                    "Artificial intelligence and automation solutions for organizations."
            }

        ]

    };


    /* ========================================================
       DOM HELPERS
       ======================================================== */

    const $ = (
        selector,
        root = document
    ) =>
        root.querySelector(selector);


    const $$ = (
        selector,
        root = document
    ) =>
        Array.from(
            root.querySelectorAll(selector)
        );


    /* ========================================================
       SECURITY
       ======================================================== */

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* ========================================================
       SAFE URL
       ======================================================== */

    function safeURL(value) {

        if (!value) {
            return "";
        }

        try {

            const url =
                new URL(
                    value,
                    window.location.href
                );

            if (
                url.protocol === "https:" ||
                url.protocol === "http:"
            ) {
                return url.href;
            }

        } catch (_) {}

        return "";
    }


    /* ========================================================
       NORMALIZE API RESPONSE
       ======================================================== */

    function normalizeArray(data) {

        if (Array.isArray(data)) {
            return data;
        }

        if (
            !data ||
            typeof data !== "object"
        ) {
            return [];
        }

        const possibleKeys = [

            "data",

            "items",

            "results",

            "tourism",

            "businesses",

            "products",

            "projects"

        ];

        for (
            const key of possibleKeys
        ) {

            if (
                Array.isArray(
                    data[key]
                )
            ) {
                return data[key];
            }

        }

        return [];
    }


    /* ========================================================
       NAVIGATION
       ======================================================== */

    function openSection(id) {

        const section =
            document.getElementById(id);

        if (!section) {

            console.warn(
                "ASEM section not found:",
                id
            );

            return false;
        }

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return true;
    }


    function openPage(page) {

        if (!page) {
            return;
        }

        window.location.assign(page);
    }


    /* ========================================================
       DEMO REQUEST
       ======================================================== */

    function demoRequest(type) {

        return new Promise(
            resolve => {

                window.setTimeout(
                    () => {

                        const data =
                            DEMO_DATA[type] || [];

                        resolve(
                            typeof structuredClone === "function"
    ? structuredClone(data)
    : JSON.parse(JSON.stringify(data))
                        );

                    },
                    CONFIG.demoDelay
                );

            }
        );
    }


    /* ========================================================
       LIVE API REQUEST
       ======================================================== */

    async function apiRequest(endpoint) {

        const controller =
            new AbortController();

        const timer =
            window.setTimeout(
                () =>
                    controller.abort(),
                CONFIG.timeout
            );

        try {

            const response =
                await fetch(
                    endpoint,
                    {
                        method: "GET",

                        headers: {
                            Accept:
                                "application/json"
                        },

                        cache: "no-store",

                        signal:
                            controller.signal
                    }
                );

            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";

            if (
                !contentType.includes(
                    "application/json"
                )
            ) {

                throw new Error(
                    "Expected JSON response"
                );
            }

            return normalizeArray(
                await response.json()
            );

        } finally {

            window.clearTimeout(
                timer
            );
        }
    }


    /* ========================================================
       UNIVERSAL DATA REQUEST
       ======================================================== */

    async function request(
        type
    ) {

        if (
            CONFIG.mode === "demo"
        ) {

            return demoRequest(
                type
            );
        }

        const endpoint =
            CONFIG.api[type];

        if (!endpoint) {

            throw new Error(
                `Unknown API: ${type}`
            );
        }

        return apiRequest(
            endpoint
        );
    }


    /* ========================================================
       STATE UI
       ======================================================== */

    function loading(
        grid,
        title
    ) {

        if (!grid) {
            return;
        }

        grid.setAttribute(
            "aria-busy",
            "true"
        );

        grid.innerHTML = `

            <article
                class="card platform-state"
            >

                <div
                    class="loading-spinner"
                    aria-hidden="true"
                ></div>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    Loading...
                </p>

            </article>

        `;
    }


    function empty(
        grid,
        title,
        message
    ) {

        if (!grid) {
            return;
        }

        grid.setAttribute(
            "aria-busy",
            "false"
        );

        grid.innerHTML = `

            <article
                class="card platform-state"
            >

                <span
                    class="platform-state-icon"
                    aria-hidden="true"
                >
                    🌐
                </span>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(message)}
                </p>

            </article>

        `;
    }


    function errorState(
        grid,
        title,
        message,
        type
    ) {

        if (!grid) {
            return;
        }

        grid.setAttribute(
            "aria-busy",
            "false"
        );

        grid.innerHTML = `

            <article
                class="card platform-state"
            >

                <span
                    class="platform-state-icon"
                    aria-hidden="true"
                >
                    ⚠️
                </span>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(message)}
                </p>

                <button
                    type="button"
                    class="btn"
                    data-retry-type="${escapeHTML(type)}"
                >
                    Retry
                </button>

            </article>

        `;
    }


    function render(
        grid,
        items,
        builder,
        emptyTitle,
        emptyMessage
    ) {

        if (!grid) {
            return;
        }

        if (!items.length) {

            empty(
                grid,
                emptyTitle,
                emptyMessage
            );

            return;
        }

        grid.innerHTML =
            items
                .map(builder)
                .join("");

        grid.setAttribute(
            "aria-busy",
            "false"
        );
    }


    /* ========================================================
       IMAGE HELPER
       ======================================================== */

    function imageHTML(
        image,
        alt,
        fallback
    ) {

        const url =
            safeURL(image);

        if (!url) {

            return `
                <div
                    class="platform-card-icon"
                    aria-hidden="true"
                >
                    ${fallback}
                </div>
            `;
        }

        return `

            <img
                src="${escapeHTML(url)}"
                alt="${escapeHTML(alt)}"
                loading="lazy"
                decoding="async"
                class="platform-card-image"
                referrerpolicy="no-referrer"
            >

        `;
    }


    /* ========================================================
       TOURISM CARD
       ======================================================== */

    function tourismCard(item) {

        const name =
            item.name ||
            item.title ||
            "Tourism Destination";

        const category =
            item.category ||
            "Tourism";

        const description =
            item.description ||
            "Discover this destination through ASEM.";

        return `

            <article
                class="card platform-result-card"
                data-type="tourism"
                data-id="${escapeHTML(item.id || "")}"
            >

                ${imageHTML(
                    item.image ||
                    item.image_url,
                    name,
                    "🏝️"
                )}

                <div
                    class="platform-card-content"
                >

                    <span
                        class="platform-card-category"
                    >
                        ${escapeHTML(category)}
                    </span>

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(description)}
                    </p>

                    ${
                        item.rating !== undefined
                            ? `
                                <div
                                    class="platform-rating"
                                >
                                    ⭐
                                    ${escapeHTML(item.rating)}
                                </div>
                            `
                            : ""
                    }

                </div>

            </article>

        `;
    }


    /* ========================================================
       BUSINESS CARD
       ======================================================== */

    function businessCard(item) {

        const name =
            item.name ||
            item.title ||
            "Global Business";

        const category =
            item.category ||
            "Business";

        const description =
            item.description ||
            "Discover this business through ASEM.";

        return `

            <article
                class="card platform-result-card"
                data-type="business"
                data-id="${escapeHTML(item.id || "")}"
            >

                ${imageHTML(
                    item.logo ||
                    item.cover_image ||
                    item.image,
                    name,
                    "🌍"
                )}

                <div
                    class="platform-card-content"
                >

                    <span
                        class="platform-card-category"
                    >
                        ${escapeHTML(category)}
                    </span>

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(description)}
                    </p>

                    ${
                        item.address
                            ? `
                                <small>
                                    📍
                                    ${escapeHTML(
                                        item.address
                                    )}
                                </small>
                            `
                            : ""
                    }

                    ${
                        item.rating !== undefined
                            ? `
                                <div
                                    class="platform-rating"
                                >
                                    ⭐
                                    ${escapeHTML(
                                        item.rating
                                    )}
                                </div>
                            `
                            : ""
                    }

                </div>

            </article>

        `;
    }


    /* ========================================================
       PRODUCT CARD
       ======================================================== */

    function productCard(item) {

        const name =
            item.name ||
            item.title ||
            "Global Product";

        const category =
            item.category ||
            "Product";

        const description =
            item.description ||
            "Discover this product through ASEM.";

        const price =
            item.price !== undefined &&
            item.price !== null
                ? `

                    <strong
                        class="product-price"
                    >
                        ${escapeHTML(
                            item.price
                        )}
                        ${escapeHTML(
                            item.currency ||
                            "USD"
                        )}
                    </strong>

                `
                : "";

        return `

            <article
                class="card platform-result-card"
                data-type="product"
                data-id="${escapeHTML(item.id || "")}"
            >

                ${imageHTML(
                    item.image ||
                    item.image_url,
                    name,
                    "🛒"
                )}

                <div
                    class="platform-card-content"
                >

                    <span
                        class="platform-card-category"
                    >
                        ${escapeHTML(category)}
                    </span>

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(description)}
                    </p>

                    ${price}

                </div>

            </article>

        `;
    }


    /* ========================================================
       PROJECT CARD
       ======================================================== */

    function projectCard(item) {

        const name =
            item.name ||
            item.title ||
            "ASEM Project";

        const description =
            item.description ||
            "ASEM Digital Solutions project.";

        return `

            <article
                class="card project-card"
                data-type="project"
                data-id="${escapeHTML(item.id || "")}"
            >

                <div
                    class="platform-card-icon"
                    aria-hidden="true"
                >
                    🚀
                </div>

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

            </article>

        `;
    }


    /* ========================================================
       LOAD GENERIC DATA
       ======================================================== */

    async function loadCollection({
        type,
        sectionId,
        gridId,
        loadingText,
        emptyTitle,
        emptyMessage,
        builder
    }) {

        const section =
            document.getElementById(
                sectionId
            );

        const grid =
            document.getElementById(
                gridId
            );

        if (!grid) {

            console.warn(
                `ASEM: ${gridId} not found`
            );

            return;
        }

        if (section) {
            section.hidden = false;
        }

        loading(
            grid,
            loadingText
        );

        try {

            const items =
                await request(type);

            render(
                grid,
                items,
                builder,
                emptyTitle,
                emptyMessage
            );

            if (section) {

                openSection(
                    section.id
                );
            }

        } catch (error) {

            console.error(
                `ASEM ${type}:`,
                error
            );

            errorState(
                grid,
                `${type} temporarily unavailable`,
                "Unable to load this service.",
                type
            );
        }
    }


    /* ========================================================
       PUBLIC LOAD FUNCTIONS
       ======================================================== */

    function loadTourism() {

        return loadCollection({

            type: "tourism",

            sectionId:
                "tourism-section",

            gridId:
                "tourismGrid",

            loadingText:
                "Loading Global Tourism...",

            emptyTitle:
                "No tourism data yet",

            emptyMessage:
                "Tourism destinations will appear here.",

            builder:
                tourismCard

        });
    }


    function loadBusinesses() {

        return loadCollection({

            type: "businesses",

            sectionId:
                "businesses-section",

            gridId:
                "businessesGrid",

            loadingText:
                "Loading Global Businesses...",

            emptyTitle:
                "No businesses yet",

            emptyMessage:
                "Businesses and services will appear here.",

            builder:
                businessCard

        });
    }


    function loadProducts() {

        return loadCollection({

            type: "products",

            sectionId:
                "products-section",

            gridId:
                "productsGrid",

            loadingText:
                "Loading Global Products...",

            emptyTitle:
                "No products yet",

            emptyMessage:
                "Products will appear here.",

            builder:
                productCard

        });
    }


    function loadProjects() {

        return loadCollection({

            type: "projects",

            sectionId:
                "projects",

            gridId:
                "projectsGrid",

            loadingText:
                "Loading ASEM Projects...",

            emptyTitle:
                "Projects are coming",

            emptyMessage:
                "Our project showcase will appear here.",

            builder:
                projectCard

        });
    }


    /* ========================================================
       PORTFOLIO
       ======================================================== */

    function openPortfolio() {

        openSection(
            "portfolio"
        );

        const grid =
            document.getElementById(
                "portfolioGrid"
            );

        if (
            grid &&
            !grid.children.length
        ) {

            grid.innerHTML = `

                <article
                    class="card portfolio-card"
                >

                    <div
                        class="platform-card-icon"
                        aria-hidden="true"
                    >
                        💻
                    </div>

                    <h3>
                        ASEM Digital Solutions
                    </h3>

                    <p>
                        Global digital solutions,
                        software platforms,
                        automation,
                        tourism,
                        business discovery
                        and modern technology services.
                    </p>

                </article>


                <article
                    class="card portfolio-card"
                >

                    <div
                        class="platform-card-icon"
                        aria-hidden="true"
                    >
                        🌍
                    </div>

                    <h3>
                        ASEM Global Platform
                    </h3>

                    <p>
                        A unified platform for
                        tourism, businesses,
                        products and digital services.
                    </p>

                </article>


                <article
                    class="card portfolio-card"
                >

                    <div
                        class="platform-card-icon"
                        aria-hidden="true"
                    >
                        🤖
                    </div>

                    <h3>
                        AI & Automation
                    </h3>

                    <p>
                        Intelligent automation
                        concepts for modern
                        organizations.
                    </p>

                </article>

            `;
        }
    }


/* ========================================================
   RESTAURANTS
======================================================== */

/*
 * Restaurants are currently represented by the
 * businesses API. This keeps the existing backend
 * unchanged while allowing a Restaurants icon to work.
 */
function openRestaurants() {

    return handleSection(
        "businesses-section",
        loadBusinesses
    );
}


/* ========================================================
   AI
======================================================== */

/*
 * The previous initializeAI() function only contained
 * comments, so the AI action had no actual frontend
 * behavior.
 *
 * The function below first looks for a dedicated AI
 * section. It supports both:
 *
 *     #ai
 *     #ai-section
 *
 * If neither exists, it looks for a dedicated AI page.
 */
function openAI() {

    const aiSection =
        document.getElementById("ai") ||
        document.getElementById("ai-section");

    if (aiSection) {

        aiSection.hidden = false;

        aiSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        document.dispatchEvent(
            new CustomEvent(
                "asem:ai:open"
            )
        );

        return true;
    }

    /*
     * If another AI module is installed on the page,
     * give it an event to initialize/open itself.
     */
    const aiEvent =
        new CustomEvent(
            "asem:ai:open"
        );

    document.dispatchEvent(
        aiEvent
    );

    /*
     * If an AI page exists in the project,
     * this provides a final navigation fallback.
     */
    const aiLink =
        document.querySelector(
            'a[href="ai.html"], a[href="./ai.html"]'
        );

    if (aiLink) {

        openExternalPage(
            aiLink.getAttribute("href")
        );

        return true;
    }

    console.warn(
        "ASEM: AI section or AI page not found"
    );

    return false;
}


function initializeAI() {

    /*
     * The AI runtime can listen for this event:
     *
     * document.addEventListener(
     *     "asem:ai:open",
     *     () => {
     *         // open AI interface
     *     }
     * );
     *
     * No external AI service is called here.
     * This keeps the frontend stable until the
     * actual AI interface/runtime is connected.
     */

    document.addEventListener(
        "asem:ai:open",
        () => {

            console.log(
                "ASEM AI: open request received"
            );
        }
    );
}


    /* ========================================================
       SEARCH
       ======================================================== */

    function focusSearch() {

        const input =
            document.getElementById(
                "searchBox"
            );

        if (!input) {
            return;
        }

        input.focus();

        input.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    function search(value) {

        const query =
            String(value || "")
                .toLocaleLowerCase()
                .trim();

        const cards =
            $$(
                ".platform-result-card, .project-card, .portfolio-card"
            );

        cards.forEach(card => {

            if (!query) {

                card.hidden = false;

                return;
            }

            const text =
                card.textContent
                    .toLocaleLowerCase();

            card.hidden =
                !text.includes(query);
        });
    }


    /* ========================================================
       THEME
       ======================================================== */

    function applyTheme(theme) {

        const valid =
            theme === "dark"
                ? "dark"
                : "light";

        document.documentElement
            .setAttribute(
                "data-theme",
                valid
            );

        const button =
            document.getElementById(
                "themeToggle"
            );

        if (button) {

            button.textContent =
                valid === "dark"
                    ? "☀️"
                    : "🌙";

            button.setAttribute(
                "aria-label",
                valid === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

            button.setAttribute(
                "title",
                valid === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }

        try {

            localStorage.setItem(
                CONFIG.storage.theme,
                valid
            );

        } catch (_) {}
    }


    function initializeTheme() {

        let saved = null;

        try {

            saved =
                localStorage.getItem(
                    CONFIG.storage.theme
                );

        } catch (_) {}

        if (
            saved === "dark" ||
            saved === "light"
        ) {

            applyTheme(saved);

            return;
        }

        const prefersDark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        applyTheme(
            prefersDark
                ? "dark"
                : "light"
        );
    }


    function toggleTheme() {

        const current =
            document.documentElement
                .getAttribute(
                    "data-theme"
                );

        applyTheme(
            current === "dark"
                ? "light"
                : "dark"
        );
    }


    /* ========================================================
       TRANSLATIONS
       ======================================================== */

    const translations = {

        en: {

            platform: "Global Platform",

            services: "Services",

            projects: "Projects",

            portfolio: "Portfolio",

            about: "About",

            contact: "Contact",

            hero_title:
                "ASEM Digital Solutions",

            hero_desc:
                "Free digital projects and custom software solutions for individuals and companies worldwide.",

            start_project:
                "Start Your Free Project",

            global_platform:
                "ASEM Global Platform 🌏",

            global_platform_desc:
                "Explore tourism destinations, global businesses, products and digital services through one unified platform.",

            tourism:
                "Tourism",

            tourism_desc:
                "Discover destinations, attractions and experiences around the world.",

            businesses:
                "Global Businesses",

            businesses_desc:
                "Explore businesses, restaurants, services and organizations worldwide.",

            products:
                "Global Products",

            products_desc:
                "Discover products and offerings from businesses around the world.",

            global_search:
                "Global Search",

            global_search_desc:
                "Search across the ASEM platform.",

            projects_desc:
                "Explore ASEM digital projects and software solutions.",

            portfolio_desc:
                "A selection of our global digital solutions.",

            services_desc:
                "Explore web development, AI, automation and cloud services.",

            contact_desc:
                "Contact ASEM Digital Solutions.",

            web_dev:
                "Web Development",

            web_dev_desc:
                "Modern, fast, secure websites and digital platforms.",

            ai_auto:
                "AI & Automation",

            ai_auto_desc:
                "Smart solutions powered by modern artificial intelligence and automation.",

            cloud:
                "Cloud Solutions",

            cloud_desc:
                "Scalable and reliable cloud infrastructure for modern organizations.",

            why_asem:
                "Why Choose ASEM",

            secure:
                "Enterprise-grade security",

            modern_tech:
                "Modern technologies",

            full_solutions:
                "Complete digital solutions",

            trusted_world:
                "Global digital platform",

            trusted_desc:
                "ASEM is building a global digital ecosystem connecting people, businesses, services, tourism and technology.",

            payments:
                "Supported Payment Methods"

        },


        ar: {

            platform:
                "المنصة العالمية",

            services:
                "الخدمات",

            projects:
                "المشاريع",

            portfolio:
                "معرض الأعمال",

            about:
                "عن ASEM",

            contact:
                "اتصل بنا",

            hero_title:
                "ASEM للحلول الرقمية",

            hero_desc:
                "مشاريع رقمية مجانية وحلول برمجية مخصصة للأفراد والشركات حول العالم.",

            start_project:
                "ابدأ مشروعك المجاني",

            global_platform:
                "منصة ASEM العالمية 🌏",

            global_platform_desc:
                "اكتشف السياحة والأعمال والمنتجات والخدمات الرقمية من خلال منصة عالمية موحدة.",

            tourism:
                "السياحة",

            tourism_desc:
                "اكتشف الوجهات والمعالم والتجارب حول العالم.",

            businesses:
                "الأعمال العالمية",

            businesses_desc:
                "استكشف الشركات والمطاعم والخدمات والمؤسسات حول العالم.",

            products:
                "المنتجات العالمية",

            products_desc:
                "اكتشف المنتجات والعروض من الشركات حول العالم.",

            global_search:
                "البحث العالمي",

            global_search_desc:
                "ابحث داخل منصة ASEM العالمية.",

            projects_desc:
                "استكشف مشاريع ASEM والحلول البرمجية الرقمية.",

            portfolio_desc:
                "مجموعة مختارة من حلولنا الرقمية العالمية.",

            services_desc:
                "استكشف تطوير المواقع والذكاء الاصطناعي والأتمتة والخدمات السحابية.",

            contact_desc:
                "تواصل مع ASEM للحلول الرقمية.",

            web_dev:
                "تطوير المواقع",

            web_dev_desc:
                "مواقع ومنصات رقمية حديثة وسريعة وآمنة.",

            ai_auto:
                "الذكاء الاصطناعي والأتمتة",

            ai_auto_desc:
                "حلول ذكية مدعومة بالذكاء الاصطناعي والأتمتة الحديثة.",

            cloud:
                "الحلول السحابية",

            cloud_desc:
                "بنية سحابية موثوقة وقابلة للتوسع للمؤسسات الحديثة.",

            why_asem:
                "لماذا تختار ASEM",

            secure:
                "أمان بمستوى المؤسسات",

            modern_tech:
                "تقنيات حديثة",

            full_solutions:
                "حلول رقمية متكاملة",

            trusted_world:
                "منصة رقمية عالمية",

            trusted_desc:
                "تبني ASEM منظومة رقمية عالمية تربط الأشخاص والشركات والخدمات والسياحة والتكنولوجيا.",

            payments:
                "طرق الدفع المدعومة"

        },


        fr: {

            platform:
                "Plateforme mondiale",

            services:
                "Services",

            projects:
                "Projets",

            portfolio:
                "Portfolio",

            about:
                "À propos",

            contact:
                "Contact",

            hero_title:
                "ASEM Digital Solutions",

            hero_desc:
                "Projets numériques gratuits et solutions logicielles personnalisées pour les particuliers et les entreprises dans le monde entier.",

            start_project:
                "Démarrer votre projet gratuit",

            global_platform:
                "Plateforme mondiale ASEM 🌏",

            global_platform_desc:
                "Découvrez le tourisme, les entreprises, les produits et les services numériques sur une plateforme mondiale unifiée.",

            tourism:
                "Tourisme",

            tourism_desc:
                "Découvrez des destinations, attractions et expériences dans le monde entier.",

            businesses:
                "Entreprises mondiales",

            businesses_desc:
                "Découvrez des entreprises, restaurants, services et organisations partout dans le monde.",

            products:
                "Produits mondiaux",

            products_desc:
                "Découvrez des produits et offres provenant d'entreprises du monde entier.",

            global_search:
                "Recherche mondiale",

            global_search_desc:
                "Recherchez sur la plateforme ASEM.",

            projects_desc:
                "Découvrez les projets numériques et solutions logicielles ASEM.",

            portfolio_desc:
                "Une sélection de nos solutions numériques mondiales.",

            services_desc:
                "Découvrez le développement web, l'IA, l'automatisation et les services cloud.",

            contact_desc:
                "Contactez ASEM Digital Solutions.",

            web_dev:
                "Développement Web",

            web_dev_desc:
                "Sites et plateformes numériques modernes, rapides et sécurisés.",

            ai_auto:
                "IA & Automatisation",

            ai_auto_desc:
                "Solutions intelligentes utilisant l'intelligence artificielle et l'automatisation.",

            cloud:
                "Solutions Cloud",

            cloud_desc:
                "Infrastructure cloud fiable et évolutive.",

            why_asem:
                "Pourquoi choisir ASEM",

            secure:
                "Sécurité de niveau entreprise",

            modern_tech:
                "Technologies modernes",

            full_solutions:
                "Solutions numériques complètes",

            trusted_world:
                "Plateforme numérique mondiale",

            trusted_desc:
                "ASEM construit un écosystème numérique mondial reliant personnes, entreprises, services, tourisme et technologie.",

            payments:
                "Méthodes de paiement prises en charge"

        },


        ja: {

            platform:
                "グローバルプラットフォーム",

            services:
                "サービス",

            projects:
                "プロジェクト",

            portfolio:
                "ポートフォリオ",

            about:
                "会社概要",

            contact:
                "お問い合わせ",

            hero_title:
                "ASEM Digital Solutions",

            hero_desc:
                "世界中の個人や企業向けに、無料のデジタルプロジェクトとカスタムソフトウェアソリューションを提供します。",

            start_project:
                "無料プロジェクトを開始",

            global_platform:
                "ASEM グローバルプラットフォーム 🌏",

            global_platform_desc:
                "観光、ビジネス、商品、デジタルサービスを一つのグローバルプラットフォームで探索できます。",

            tourism:
                "観光",

            tourism_desc:
                "世界中の目的地、観光名所、体験を発見できます。",

            businesses:
                "グローバルビジネス",

            businesses_desc:
                "世界中の企業、レストラン、サービス、組織を探索できます。",

            products:
                "グローバル商品",

            products_desc:
                "世界中の企業の商品やオファーを発見できます。",

            global_search:
                "グローバル検索",

            global_search_desc:
                "ASEMプラットフォーム全体を検索します。",

            projects_desc:
                "ASEMのデジタルプロジェクトとソフトウェアソリューションをご覧ください。",

            portfolio_desc:
                "ASEMのグローバルデジタルソリューションの一部をご紹介します。",

            services_desc:
                "Web開発、AI、自動化、クラウドサービスをご覧ください。",

            contact_desc:
                "ASEM Digital Solutionsへお問い合わせください。",

            web_dev:
                "Web開発",

            web_dev_desc:
                "最新で高速かつ安全なWebサイトとデジタルプラットフォーム。",

            ai_auto:
                "AIと自動化",

            ai_auto_desc:
                "人工知能と自動化を活用したスマートソリューション。",

            cloud:
                "クラウドソリューション",

            cloud_desc:
                "信頼性と拡張性に優れたクラウド基盤。",

            why_asem:
                "ASEMを選ぶ理由",

            secure:
                "エンタープライズレベルのセキュリティ",

            modern_tech:
                "最新テクノロジー",

            full_solutions:
                "包括的なデジタルソリューション",

            trusted_world:
                "グローバルデジタルプラットフォーム",

            trusted_desc:
                "ASEMは、人々、企業、サービス、観光、テクノロジーをつなぐグローバルなデジタルエコシステムを構築しています。",

            payments:
                "対応決済方法"

        }

    };


    /* ========================================================
       LANGUAGE
       ======================================================== */

    function detectLanguage() {

        const language =
            (
                navigator.language ||
                "en"
            ).toLowerCase();

        if (
            language.startsWith("ar")
        ) {
            return "ar";
        }

        if (
            language.startsWith("fr")
        ) {
            return "fr";
        }

        if (
            language.startsWith("ja")
        ) {
            return "ja";
        }

        return "en";
    }


    function applyLanguage(
        requested
    ) {

        const language =
            requested === "auto"
                ? detectLanguage()
                : translations[requested]
                    ? requested
                    : "en";

        const dictionary =
            translations[language];

        document.documentElement
            .setAttribute(
                "lang",
                language
            );

        document.documentElement
            .setAttribute(
                "dir",
                language === "ar"
                    ? "rtl"
                    : "ltr"
            );

        $$("[data-i18n]")
            .forEach(
                element => {

                    const key =
                        element.dataset.i18n;

                    if (
                        dictionary[key]
                    ) {

                        element.textContent =
                            dictionary[key];
                    }

                }
            );


        const searchBox =
            document.getElementById(
                "searchBox"
            );

        if (searchBox) {

            const placeholders = {

                en:
                    "🔍 Search...",

                ar:
                    "🔍 بحث...",

                fr:
                    "🔍 Rechercher...",

                ja:
                    "🔍 検索..."

            };

            searchBox.placeholder =
                placeholders[language];
        }


        try {

            localStorage.setItem(
                CONFIG.storage.language,
                requested
            );

        } catch (_) {}


        document.dispatchEvent(
            new CustomEvent(
                "asem:languagechange",
                {
                    detail: {
                        language
                    }
                }
            )
        );

    }


    /* ========================================================
       ACTION ROUTER
       ======================================================== */

    function getAction(
        element
    ) {

        if (!element) {
            return null;
        }

        if (
            element.dataset.platformAction
        ) {

            return element.dataset
                .platformAction;
        }

        const legacy =
            element.dataset.section;

        const map = {

            "tourism-section":
                "tourism",

            "tourism-results":
                "tourism",

            "businesses-section":
                "businesses",

            "businesses-results":
                "businesses",

            "products-section":
                "products",

            "products-results":
                "products",

            projects:
                "projects",

            portfolio:
                "portfolio",

            services:
                "services"

        };

        return map[legacy] || null;
    }


    function executeAction(
        element
    ) {

        const action =
            getAction(element);

        if (!action) {
            return false;
        }

        switch (action) {

            case "tourism":

                loadTourism();

                return true;


            case "businesses":

                loadBusinesses();

                return true;


            case "products":

                loadProducts();

                return true;


            case "projects":

                loadProjects();

                return true;


            case "portfolio":

                openPortfolio();

                return true;


            case "services":

                openSection(
                    "services"
                );

                return true;


            case "contact":

                openPage(
                    "contact.html"
                );

                return true;


            case "about":

                openPage(
                    "about.html"
                );

                return true;


            case "search":

                focusSearch();

                return true;


            case "top":

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

                return true;


            default:

                return false;

        }
    }


    /* ========================================================
       CLICK ENGINE
       ======================================================== */

    function initializeClicks() {

        document.addEventListener(
            "click",
            event => {

                const actionElement =
                    event.target.closest(
                        "[data-platform-action], [data-section]"
                    );

                if (
                    actionElement
                ) {

                    const handled =
                        executeAction(
                            actionElement
                        );

                    if (handled) {

                        event.preventDefault();

                        return;

                    }

                }


                const retry =
                    event.target.closest(
                        "[data-retry-type]"
                    );

                if (!retry) {
                    return;
                }

                const type =
                    retry.dataset.retryType;

                if (
                    type === "tourism"
                ) {
                    loadTourism();
                }

                else if (
                    type === "businesses"
                ) {
                    loadBusinesses();
                }

                else if (
                    type === "products"
                ) {
                    loadProducts();
                }

                else if (
                    type === "projects"
                ) {
                    loadProjects();
                }

            }
        );

    }



/* ========================================================
   GPS / GEOLOCATION
======================================================== */

function showLocationStatus(message) {

    const status =
        DOM.locationStatus;

    if (status) {
        status.textContent = message;
    }

    console.log(
        `ASEM GPS: ${message}`
    );
}


async function sendLocationToBackend(location) {

    if (!ASEM.api.location) {
        return null;
    }

    try {

        return await apiRequest(
            ASEM.api.location,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(location)
            }
        );

    } catch (error) {

        console.warn(
            "ASEM: location backend unavailable",
            error
        );

        return null;
    }
}


function requestGPS() {

    if (!navigator.geolocation) {

        showLocationStatus(
            "GPS / Geolocation is not supported by this browser."
        );

        return;
    }

    showLocationStatus(
        "Requesting your location..."
    );

    navigator.geolocation.getCurrentPosition(
        async position => {

            const location = {

                latitude:
                    position.coords.latitude,

                longitude:
                    position.coords.longitude,

                accuracy:
                    position.coords.accuracy,

                timestamp:
                    position.timestamp
            };

            window.ASEMLocation =
                location;

            showLocationStatus(
                `Location detected: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
            );

            await sendLocationToBackend(
                location
            );
        },

        error => {

            let message =
                "Unable to get location.";

            switch (error.code) {

                case error.PERMISSION_DENIED:

                    message =
                        "Location permission was denied.";

                    break;

                case error.POSITION_UNAVAILABLE:

                    message =
                        "Location information is unavailable.";

                    break;

                case error.TIMEOUT:

                    message =
                        "Location request timed out.";

                    break;
            }

            showLocationStatus(
                message
            );

            console.warn(
                "ASEM GPS:",
                error
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


/*
 * Kept for compatibility.
 * GPS clicks are handled by initializeActionRouter().
 */
function initializeGPS() {
    return true;
}




    /* ========================================================
       ANCHOR NAVIGATION
       ======================================================== */

    function initializeNavigation() {

        document.addEventListener(
            "click",
            event => {

                const link =
                    event.target.closest(
                        'a[href^="#"]'
                    );

                if (!link) {
                    return;
                }

                const href =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !href ||
                    href === "#"
                ) {
                    return;
                }

                const id =
                    href.substring(1);

                if (
                    document.getElementById(id)
                ) {

                    event.preventDefault();

                    openSection(id);

                }

            }
        );

    }


    /* ========================================================
       SEARCH
       ======================================================== */

    function initializeSearch() {

        const input =
            document.getElementById(
                "searchBox"
            );

        if (!input) {
            return;
        }

        input.addEventListener(
            "input",
            event => {

                search(
                    event.target.value
                );

            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    input.value = "";

                    search("");

                    input.blur();

                }

            }
        );

    }


    /* ========================================================
       THEME EVENTS
       ======================================================== */

    function initializeThemeEvents() {

        const button =
            document.getElementById(
                "themeToggle"
            );

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            toggleTheme
        );

    }


    /* ========================================================
       LANGUAGE EVENTS
       ======================================================== */

    function initializeLanguageEvents() {

        const selector =
            document.getElementById(
                "langSwitch"
            );

        if (!selector) {
            return;
        }

        let saved = "auto";

        try {

            saved =
                localStorage.getItem(
                    CONFIG.storage.language
                ) || "auto";

        } catch (_) {}


        const exists =
            Array.from(
                selector.options
            ).some(
                option =>
                    option.value === saved
            );


        selector.value =
            exists
                ? saved
                : "auto";


        applyLanguage(
            selector.value
        );


        selector.addEventListener(
            "change",
            event => {

                applyLanguage(
                    event.target.value
                );

            }
        );

    }

/* ========================================================
   KEYBOARD
======================================================== */

function initializeKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            const active =
                document.activeElement;

            const isInput =
                active &&
                (
                    active.tagName ===
                        "INPUT" ||
                    active.tagName ===
                        "TEXTAREA" ||
                    active.tagName ===
                        "SELECT" ||
                    active.isContentEditable
                );

            if (
                event.key === "/" &&
                !isInput
            ) {

                event.preventDefault();

                focusSearch();

                return;
            }

            if (
                event.key ===
                "Escape"
            ) {

                const input =
                    DOM.search;

                if (input) {
                    input.blur();
                }

                return;
            }

            if (
                event.key !==
                    "Enter" &&
                event.key !==
                    " "
            ) {
                return;
            }

            const target =
                event.target;

            if (
                !target ||
                typeof target.closest !==
                    "function"
            ) {
                return;
            }

            const element =
                target.closest(
                    "[data-platform-action]"
                );

            if (!element) {
                return;
            }

            if (
                isInput &&
                target !== element
            ) {
                return;
            }

            let action =
                element.dataset
                    .platformAction;

            if (!action) {
                return;
            }

            action =
                String(action)
                    .trim()
                    .toLowerCase()
                    .replace(
                        /[\s_-]+/g,
                        ""
                    );

            const handler =
                actions[action];

            if (
                typeof handler !==
                "function"
            ) {
                return;
            }

            event.preventDefault();

            try {

                const result =
                    handler();

                if (
                    result &&
                    typeof result.then ===
                    "function"
                ) {

                    result.catch(
                        error => {

                            console.error(
                                "ASEM keyboard action:",
                                error
                            );
                        }
                    );
                }

            } catch (error) {

                console.error(
                    "ASEM keyboard action:",
                    error
                );
            }
        }
    );
}


    /* ========================================================
       SCROLL TOP
       ======================================================== */

    function initializeScrollTop() {

        const button =
            document.getElementById(
                "scrollTop"
            );

        if (!button) {
            return;
        }


        const update =
            () => {

                const visible =
                    window.scrollY > 400;

                button.hidden =
                    !visible;

                button.classList.toggle(
                    "visible",
                    visible
                );

            };


        window.addEventListener(
            "scroll",
            update,
            {
                passive: true
            }
        );


        button.addEventListener(
            "click",
            () => {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );


        update();

    }


    /* ========================================================
       INITIAL RESULT STATE
       ======================================================== */

    function initializeResults() {

        [
            "tourism-section",

            "businesses-section",

            "products-section"

        ].forEach(
            id => {

                const section =
                    document.getElementById(
                        id
                    );

                if (section) {
                    section.hidden = true;
                }

            }
        );

    }


    /* ========================================================
       DEMO MODE BADGE
       ======================================================== */

    function initializeDemoIndicator() {

        if (
            CONFIG.mode !== "demo"
        ) {
            return;
        }

        const badge =
            document.createElement(
                "div"
            );

        badge.id =
            "asem-demo-mode";

        badge.textContent =
            "ASEM DEMO MODE";

        Object.assign(
            badge.style,
            {

                position: "fixed",

                bottom: "12px",

                left: "12px",

                zIndex: "99999",

                padding:
                    "7px 12px",

                borderRadius:
                    "999px",

                fontSize:
                    "12px",

                fontWeight:
                    "700",

                background:
                    "#00aeea",

                color:
                    "#ffffff",

                boxShadow:
                    "0 4px 15px rgba(0,0,0,.18)",

                pointerEvents:
                    "none"

            }
        );

        document.body.appendChild(
            badge
        );

    }


    /* ========================================================
       PUBLIC API
       ======================================================== */

    window.ASEM = {

        config:
            CONFIG,

        demo:
            DEMO_DATA,

        loadTourism,

        loadBusinesses,

        loadProducts,

        loadProjects,

        openPortfolio,

        openSection,

        focusSearch,

        search,

        applyTheme,

        applyLanguage

    };


/* ========================================================
   ADD PROJECT
======================================================== */

function addProject() {

    <section id="payments">
    <h2 data-i18n="payments">Supported Payment Methods</h2>

    <div class="payments">
        <img src="assets/visa.png" loading="lazy" alt="Visa">
        <img src="assets/mastercard.png" loading="lazy" alt="Mastercard">
        <img src="assets/paypal.png" loading="lazy" alt="PayPal">
        <img src="assets/googlepay.png" loading="lazy" alt="Google Pay">
        <img src="assets/applepay.png" loading="lazy" alt="Apple Pay">
    </div>
</section>

<div class="social">
    <a href="https://www.facebook.com/" target="_blank">Facebook</a>
    <a href="https://www.youtube.com/" target="_blank">YouTube</a>
    <a href="https://x.com/" target="_blank">X / Twitter</a>
    <a href="https://web.whatsapp.com/" target="_blank">WhatsApp</a>
</div>

</section>


    /* ========================================================
       STARTUP
       ======================================================== */

    function initialize() {

        initializeTheme();

        initializeThemeEvents();

        initializeLanguageEvents();

        initializeClicks();

        initializeKeyboard();

        initializeNavigation();

        initializeSearch();

        initializeScrollTop();

        initializeResults();

        initializeDemoIndicator();


        console.info(
            "ASEM Global Platform READY"
        );

        console.info(
            `ASEM Mode: ${CONFIG.mode.toUpperCase()}`
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();

    }

})();

