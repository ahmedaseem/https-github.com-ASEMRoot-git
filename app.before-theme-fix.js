/* =========================================================
   ASEM DIGITAL SOLUTIONS
   GLOBAL PLATFORM APPLICATION
   Frontend Interaction & API Controller
   ========================================================= */

"use strict";

(() => {

    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const CONFIG = Object.freeze({
        apiBase: "/api",

        endpoints: Object.freeze({
            tourism: "/tourism",
            businesses: "/businesses",
            products: "/products",
            projects: "/projects"
        }),

        selectors: Object.freeze({
            searchBox: "#searchBox",
            langSwitch: "#langSwitch",
            themeToggle: "#themeToggle",
            scrollTop: "#scrollTop",

            tourismGrid: "#tourismGrid",
            businessesGrid: "#businessesGrid",
            productsGrid: "#productsGrid",
            projectsGrid: "#projectsGrid",
            portfolioGrid: "#portfolioGrid"
        }),

        storage: Object.freeze({
            theme: "asem-theme",
            language: "asem-language"
        }),

        scrollBehavior: "smooth"
    });


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    const $ = selector => document.querySelector(selector);

    const $$ = selector =>
        Array.from(document.querySelectorAll(selector));


    function getElement(selector) {
        return $(selector);
    }


    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       API
       ===================================================== */

    async function apiRequest(endpoint, options = {}) {

        const url = `${CONFIG.apiBase}${endpoint}`;

        const response = await fetch(url, {
            method: options.method || "GET",
            headers: {
                "Accept": "application/json",
                ...(options.body
                    ? {
                        "Content-Type": "application/json"
                    }
                    : {}),
                ...(options.headers || {})
            },
            body: options.body
                ? JSON.stringify(options.body)
                : undefined,
            credentials: "same-origin"
        });

        if (!response.ok) {

            throw new Error(
                `API request failed: ${response.status} ${response.statusText}`
            );
        }

        const contentType =
            response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            return [];
        }

        return await response.json();
    }


    function normalizeCollection(data) {

        if (Array.isArray(data)) {
            return data;
        }

        if (data && Array.isArray(data.data)) {
            return data.data;
        }

        if (data && Array.isArray(data.results)) {
            return data.results;
        }

        if (data && Array.isArray(data.items)) {
            return data.items;
        }

        return [];
    }


    /* =====================================================
       UI STATES
       ===================================================== */

    function showLoading(grid, message = "Loading...") {

        if (!grid) {
            return;
        }

        grid.innerHTML = `
            <div class="card platform-state" aria-live="polite">
                <p>${escapeHTML(message)}</p>
            </div>
        `;
    }


    function showEmpty(grid, message) {

        if (!grid) {
            return;
        }

        grid.innerHTML = `
            <div class="card platform-state" aria-live="polite">
                <h3>No data available</h3>
                <p>${escapeHTML(message)}</p>
            </div>
        `;
    }


    function showError(grid, message) {

        if (!grid) {
            return;
        }

        grid.innerHTML = `
            <div class="card platform-state platform-error" role="alert">
                <h3>Unable to load data</h3>
                <p>${escapeHTML(message)}</p>
                <button
                    type="button"
                    class="btn"
                    data-platform-action="retry"
                    data-retry-target="${escapeHTML(
                        grid.dataset.loader || ""
                    )}"
                >
                    Try Again
                </button>
            </div>
        `;
    }


    /* =====================================================
       SECTION NAVIGATION
       ===================================================== */

    function openPageSection(sectionId) {

        const section = document.getElementById(sectionId);

        if (!section) {

            console.warn(
                `ASEM: Section not found: #${sectionId}`
            );

            return false;
        }

        section.hidden = false;

        section.scrollIntoView({
            behavior: CONFIG.scrollBehavior,
            block: "start"
        });

        return true;
    }


    function hidePlatformResults() {

        $$(".platform-results").forEach(section => {
            section.hidden = true;
        });
    }


    function openPlatformSection(sectionId) {

        hidePlatformResults();

        const section = document.getElementById(sectionId);

        if (!section) {

            console.warn(
                `ASEM: Platform section not found: #${sectionId}`
            );

            return false;
        }

        section.hidden = false;

        section.scrollIntoView({
            behavior: CONFIG.scrollBehavior,
            block: "start"
        });

        return true;
    }


    /* =====================================================
       TOURISM
       ===================================================== */

    async function loadTourism() {

        const grid =
            getElement(CONFIG.selectors.tourismGrid);

        if (!grid) {
            console.warn("ASEM: tourismGrid not found.");
            return;
        }

        grid.dataset.loader = "tourism";

        openPlatformSection("tourism-section");

        showLoading(
            grid,
            "Loading global tourism..."
        );

        try {

            const response =
                await apiRequest(
                    CONFIG.endpoints.tourism
                );

            const items =
                normalizeCollection(response);

            if (!items.length) {

                showEmpty(
                    grid,
                    "Tourism destinations will appear here when data becomes available."
                );

                return;
            }

            renderTourism(items);

        } catch (error) {

            console.error(
                "ASEM Tourism:",
                error
            );

            showError(
                grid,
                "The tourism service is temporarily unavailable."
            );
        }
    }


    function renderTourism(items) {

        const grid =
            getElement(CONFIG.selectors.tourismGrid);

        if (!grid) {
            return;
        }

        grid.innerHTML = items.map(item => {

            const name =
                item.name || "Tourism Destination";

            const category =
                item.category || "Tourism";

            const description =
                item.description ||
                "Discover this destination.";

            const image =
                item.image || "";

            const rating =
                item.rating ?? 0;

            return `
                <article class="card platform-card-result">

                    ${
                        image
                            ? `
                                <img
                                    src="${escapeHTML(image)}"
                                    alt="${escapeHTML(name)}"
                                    loading="lazy"
                                >
                            `
                            : ""
                    }

                    <div class="card-content">

                        <span class="platform-badge">
                            🏝️ ${escapeHTML(category)}
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
                                    <p>
                                        📍 ${escapeHTML(item.address)}
                                    </p>
                                `
                                : ""
                        }

                        <div class="platform-meta">

                            <span>
                                ⭐ ${escapeHTML(rating)}
                            </span>

                            ${
                                item.verified
                                    ? `
                                        <span>
                                            ✓ Verified
                                        </span>
                                    `
                                    : ""
                            }

                        </div>

                    </div>

                </article>
            `;

        }).join("");
    }


    /* =====================================================
       BUSINESSES
       ===================================================== */

    async function loadBusinesses() {

        const grid =
            getElement(CONFIG.selectors.businessesGrid);

        if (!grid) {
            console.warn("ASEM: businessesGrid not found.");
            return;
        }

        grid.dataset.loader = "businesses";

        openPlatformSection("businesses-section");

        showLoading(
            grid,
            "Loading global businesses..."
        );

        try {

            const response =
                await apiRequest(
                    CONFIG.endpoints.businesses
                );

            const items =
                normalizeCollection(response);

            if (!items.length) {

                showEmpty(
                    grid,
                    "Businesses and services will appear here when data becomes available."
                );

                return;
            }

            renderBusinesses(items);

        } catch (error) {

            console.error(
                "ASEM Businesses:",
                error
            );

            showError(
                grid,
                "The business service is temporarily unavailable."
            );
        }
    }


    function renderBusinesses(items) {

        const grid =
            getElement(CONFIG.selectors.businessesGrid);

        if (!grid) {
            return;
        }

        grid.innerHTML = items.map(item => {

            const name =
                item.name || "Global Business";

            const category =
                item.category || "Business";

            const description =
                item.description ||
                "Explore this business and its services.";

            const logo =
                item.logo || "";

            const rating =
                item.rating ?? 0;

            return `
                <article class="card platform-card-result">

                    ${
                        logo
                            ? `
                                <img
                                    src="${escapeHTML(logo)}"
                                    alt="${escapeHTML(name)}"
                                    loading="lazy"
                                >
                            `
                            : ""
                    }

                    <div class="card-content">

                        <span class="platform-badge">
                            🌍 ${escapeHTML(category)}
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
                                    <p>
                                        📍 ${escapeHTML(item.address)}
                                    </p>
                                `
                                : ""
                        }

                        ${
                            item.phone
                                ? `
                                    <p>
                                        📞 ${escapeHTML(item.phone)}
                                    </p>
                                `
                                : ""
                        }

                        <div class="platform-meta">

                            <span>
                                ⭐ ${escapeHTML(rating)}
                            </span>

                            ${
                                item.verified
                                    ? `
                                        <span>
                                            ✓ Verified
                                        </span>
                                    `
                                    : ""
                            }

                        </div>

                    </div>

                </article>
            `;

        }).join("");
    }


    /* =====================================================
       PRODUCTS
       ===================================================== */

    async function loadProducts() {

        const grid =
            getElement(CONFIG.selectors.productsGrid);

        if (!grid) {
            console.warn("ASEM: productsGrid not found.");
            return;
        }

        grid.dataset.loader = "products";

        openPlatformSection("products-section");

        showLoading(
            grid,
            "Loading global products..."
        );

        try {

            const response =
                await apiRequest(
                    CONFIG.endpoints.products
                );

            const items =
                normalizeCollection(response);

            if (!items.length) {

                showEmpty(
                    grid,
                    "Products will appear here when product data becomes available."
                );

                return;
            }

            renderProducts(items);

        } catch (error) {

            console.error(
                "ASEM Products:",
                error
            );

            showError(
                grid,
                "The product service is temporarily unavailable."
            );
        }
    }


    function renderProducts(items) {

        const grid =
            getElement(CONFIG.selectors.productsGrid);

        if (!grid) {
            return;
        }

        grid.innerHTML = items.map(item => {

            const name =
                item.name || "Global Product";

            const category =
                item.category || "Product";

            const description =
                item.description ||
                "Discover this product.";

            const image =
                item.image || "";

            const currency =
                item.currency || "USD";

            const price =
                item.price !== null &&
                item.price !== undefined
                    ? `${item.price} ${currency}`
                    : "Price available soon";

            const rating =
                item.rating ?? 0;

            return `
                <article class="card platform-card-result">

                    ${
                        image
                            ? `
                                <img
                                    src="${escapeHTML(image)}"
                                    alt="${escapeHTML(name)}"
                                    loading="lazy"
                                >
                            `
                            : ""
                    }

                    <div class="card-content">

                        <span class="platform-badge">
                            🛒 ${escapeHTML(category)}
                        </span>

                        <h3>
                            ${escapeHTML(name)}
                        </h3>

                        <p>
                            ${escapeHTML(description)}
                        </p>

                        <strong>
                            ${escapeHTML(price)}
                        </strong>

                        <div class="platform-meta">

                            <span>
                                ⭐ ${escapeHTML(rating)}
                            </span>

                            ${
                                item.is_available
                                    ? `
                                        <span>
                                            ✓ Available
                                        </span>
                                    `
                                    : `
                                        <span>
                                            Currently unavailable
                                        </span>
                                    `
                            }

                        </div>

                    </div>

                </article>
            `;

        }).join("");
    }


    /* =====================================================
       PROJECTS
       ===================================================== */

    function loadProjects() {

        const grid =
            getElement(CONFIG.selectors.projectsGrid);

        if (!grid) {
            openPageSection("projects");
            return;
        }

        openPageSection("projects");

        if (grid.children.length) {
            return;
        }

        showEmpty(
            grid,
            "Projects will appear here as they are published."
        );
    }


    /* =====================================================
       PORTFOLIO
       ===================================================== */

    function loadPortfolio() {

        const grid =
            getElement(CONFIG.selectors.portfolioGrid);

        openPageSection("portfolio");

        if (!grid) {
            return;
        }

        if (grid.children.length) {
            return;
        }

        showEmpty(
            grid,
            "Our portfolio will appear here as projects are published."
        );
    }


    /* =====================================================
       SERVICES
       ===================================================== */

    function loadServices() {

        openPageSection("services");
    }


    /* =====================================================
       CONTACT
       ===================================================== */

    function openContact() {

        window.location.href = "contact.html";
    }


    /* =====================================================
       GLOBAL SEARCH
       ===================================================== */

    function focusSearch() {

        const searchBox =
            getElement(CONFIG.selectors.searchBox);

        if (!searchBox) {
            return;
        }

        searchBox.focus();

        searchBox.scrollIntoView({
            behavior: CONFIG.scrollBehavior,
            block: "center"
        });
    }


    function performSearch(value) {

        const query =
            String(value || "")
                .trim()
                .toLowerCase();

        const searchableCards =
            $$(
                ".platform-card-result, " +
                "#projectsGrid .card, " +
                "#portfolioGrid .card, " +
                "#services .card"
            );

        if (!query) {

            searchableCards.forEach(card => {
                card.hidden = false;
            });

            return;
        }

        searchableCards.forEach(card => {

            const text =
                card.textContent
                    .toLowerCase();

            card.hidden =
                !text.includes(query);
        });
    }


    /* =====================================================
       THEME
       ===================================================== */

    function applyTheme(theme) {

        const validTheme =
            theme === "dark"
                ? "dark"
                : "light";

        document.documentElement
            .setAttribute(
                "data-theme",
                validTheme
            );

        localStorage.setItem(
            CONFIG.storage.theme,
            validTheme
        );

        const button =
            getElement(
                CONFIG.selectors.themeToggle
            );

        if (button) {

            button.textContent =
                validTheme === "dark"
                    ? "☀️"
                    : "🌙";

            button.setAttribute(
                "aria-label",
                validTheme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }
    }


    function toggleTheme() {

        const current =
            document.documentElement
                .getAttribute("data-theme");

        applyTheme(
            current === "dark"
                ? "light"
                : "dark"
        );
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    function applyLanguage(language) {

        const supported = [
            "auto",
            "ar",
            "en",
            "fr",
            "ja"
        ];

        const selected =
            supported.includes(language)
                ? language
                : "auto";

        localStorage.setItem(
            CONFIG.storage.language,
            selected
        );

        if (selected === "auto") {

            document.documentElement
                .removeAttribute("lang");

            document.documentElement
                .removeAttribute("dir");

            return;
        }

        document.documentElement
            .setAttribute(
                "lang",
                selected
            );

        document.documentElement
            .setAttribute(
                "dir",
                selected === "ar"
                    ? "rtl"
                    : "ltr"
            );
    }


    /* =====================================================
       SCROLL TO TOP
       ===================================================== */

    function updateScrollTop() {

        const button =
            getElement(
                CONFIG.selectors.scrollTop
            );

        if (!button) {
            return;
        }

        button.hidden =
            window.scrollY < 400;
    }


    function scrollToTop() {

        window.scrollTo({
            top: 0,
            behavior: CONFIG.scrollBehavior
        });
    }


    /* =====================================================
       PLATFORM ACTION ROUTER
       ===================================================== */

    const actions = {

        tourism: loadTourism,

        businesses: loadBusinesses,

        products: loadProducts,

        projects: loadProjects,

        portfolio: loadPortfolio,

        services: loadServices,

        contact: openContact,

        search: focusSearch,

        top: scrollToTop,

        retry: (element) => {

            const target =
                element.dataset.retryTarget;

            if (target === "tourism") {
                loadTourism();
            }

            if (target === "businesses") {
                loadBusinesses();
            }

            if (target === "products") {
                loadProducts();
            }
        }
    };


    function executePlatformAction(element) {

        if (!element) {
            return;
        }

        const action =
            element.dataset.platformAction;

        if (!action) {
            return;
        }

        const handler =
            actions[action];

        if (typeof handler !== "function") {

            console.warn(
                `ASEM: Unknown platform action "${action}"`
            );

            return;
        }

        try {

            handler(element);

        } catch (error) {

            console.error(
                `ASEM: Action "${action}" failed`,
                error
            );
        }
    }


    /* =====================================================
       GLOBAL CLICK HANDLER
       ===================================================== */

    function initializeActionRouter() {

        document.addEventListener(
            "click",
            event => {

                const element =
                    event.target.closest(
                        "[data-platform-action]"
                    );

                if (!element) {
                    return;
                }

                executePlatformAction(element);
            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {
                    return;
                }

                const element =
                    event.target.closest(
                        "[data-platform-action]"
                    );

                if (!element) {
                    return;
                }

                event.preventDefault();

                executePlatformAction(element);
            }
        );
    }


    /* =====================================================
       SEARCH EVENTS
       ===================================================== */

    function initializeSearch() {

        const searchBox =
            getElement(
                CONFIG.selectors.searchBox
            );

        if (!searchBox) {
            return;
        }

        searchBox.addEventListener(
            "input",
            event => {
                performSearch(
                    event.target.value
                );
            }
        );
    }


    /* =====================================================
       THEME EVENTS
       ===================================================== */

    function initializeTheme() {

        const savedTheme =
            localStorage.getItem(
                CONFIG.storage.theme
            );

        if (savedTheme) {
            applyTheme(savedTheme);
        } else {

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

        const button =
            getElement(
                CONFIG.selectors.themeToggle
            );

        if (button) {

            button.addEventListener(
                "click",
                toggleTheme
            );
        }
    }


    /* =====================================================
       LANGUAGE EVENTS
       ===================================================== */

    function initializeLanguage() {

        const select =
            getElement(
                CONFIG.selectors.langSwitch
            );

        const savedLanguage =
            localStorage.getItem(
                CONFIG.storage.language
            ) || "auto";

        applyLanguage(savedLanguage);

        if (select) {

            select.value = savedLanguage;

            select.addEventListener(
                "change",
                event => {
                    applyLanguage(
                        event.target.value
                    );
                }
            );
        }
    }


    /* =====================================================
       SCROLL EVENTS
       ===================================================== */

    function initializeScroll() {

        window.addEventListener(
            "scroll",
            updateScrollTop,
            {
                passive: true
            }
        );

        const button =
            getElement(
                CONFIG.selectors.scrollTop
            );

        if (button) {

            button.addEventListener(
                "click",
                scrollToTop
            );
        }

        updateScrollTop();
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.loadTourism = loadTourism;
    window.loadBusinesses = loadBusinesses;
    window.loadProducts = loadProducts;
    window.loadProjects = loadProjects;
    window.loadPortfolio = loadPortfolio;
    window.loadServices = loadServices;


    /* =====================================================
       APPLICATION BOOTSTRAP
       ===================================================== */

    function initializeApplication() {

        initializeActionRouter();
        initializeSearch();
        initializeTheme();
        initializeLanguage();
        initializeScroll();

        console.info(
            "ASEM Global Platform initialized successfully."
        );
    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeApplication,
            {
                once: true
            }
        );

    } else {

        initializeApplication();
    }


})();
