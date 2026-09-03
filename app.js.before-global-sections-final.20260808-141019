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

    async function loadProjects() {

        const grid = getElement(CONFIG.selectors.projectsGrid);

        if (!grid) {
            console.warn("ASEM: projectsGrid not found.");
            return;
        }

        grid.setAttribute("aria-busy", "true");

        try {

            const response = await fetch(
                `${CONFIG.apiBase}${CONFIG.endpoints.projects}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    },
                    credentials: "same-origin"
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Projects API returned HTTP ${response.status}`
                );
            }

            const projects = await response.json();

            grid.innerHTML = "";

            if (!Array.isArray(projects) || projects.length === 0) {

                grid.innerHTML = `
                    <article class="card project-card empty-card">
                        <div class="card-content">
                            <h3>Projects</h3>
                            <p>No projects are currently available.</p>
                        </div>
                    </article>
                `;

                return;
            }

            const escapeHtml = value => {
                const div = document.createElement("div");
                div.textContent =
                    value === null || value === undefined
                        ? ""
                        : String(value);
                return div.innerHTML;
            };

            const safeUrl = value => {
                if (!value) return "";

                const url = String(value).trim();

                if (
                    url.startsWith("/") ||
                    url.startsWith("./") ||
                    url.startsWith("../") ||
                    url.startsWith("#") ||
                    url.startsWith("https://") ||
                    url.startsWith("http://")
                ) {
                    return url;
                }

                return "";
            };

            projects.forEach(project => {

                const features = Array.isArray(project.features)
                    ? project.features
                    : [];

                const image = safeUrl(project.image);

                const page = safeUrl(project.page);
                const doc = safeUrl(project.doc);
                const download = safeUrl(project.download);
                const github = safeUrl(project.github);

                const links = [];

                if (page) {
                    links.push(
                        `<a class="project-link" href="${page}">
                            View Project
                        </a>`
                    );
                }

                if (doc) {
                    links.push(
                        `<a class="project-link" href="${doc}">
                            Documentation
                        </a>`
                    );
                }

                if (download) {
                    links.push(
                        `<a class="project-link" href="${download}">
                            Download
                        </a>`
                    );
                }

                if (github) {
                    links.push(
                        `<a class="project-link"
                           href="${github}"
                           target="_blank"
                           rel="noopener noreferrer">
                            GitHub
                        </a>`
                    );
                }

                const featureMarkup = features.length
                    ? `
                        <ul class="project-features">
                            ${features.map(feature =>
                                `<li>${escapeHtml(feature)}</li>`
                            ).join("")}
                        </ul>
                    `
                    : "";

                const imageMarkup = image
                    ? `
                        <div class="card-image">
                            <img
                                src="${image}"
                                alt="${escapeHtml(project.name)}"
                                loading="lazy"
                                onerror="this.style.display='none'"
                            >
                        </div>
                    `
                    : "";

                const card = document.createElement("article");

                card.className = "card project-card";

                card.innerHTML = `
                    ${imageMarkup}

                    <div class="card-content">

                        <h3>
                            ${escapeHtml(project.name)}
                        </h3>

                        ${
                            project.status
                                ? `<p class="project-status">
                                    ${escapeHtml(project.status)}
                                   </p>`
                                : ""
                        }

                        ${
                            project.version
                                ? `<p>
                                    <strong>Version:</strong>
                                    ${escapeHtml(project.version)}
                                   </p>`
                                : ""
                        }

                        ${
                            project.license
                                ? `<p>
                                    <strong>License:</strong>
                                    ${escapeHtml(project.license)}
                                   </p>`
                                : ""
                        }

                        ${
                            project.level
                                ? `<p>
                                    <strong>Level:</strong>
                                    ${escapeHtml(project.level)}
                                   </p>`
                                : ""
                        }

                        ${featureMarkup}

                        ${
                            links.length
                                ? `<div class="project-actions">
                                    ${links.join("")}
                                   </div>`
                                : ""
                        }

                    </div>
                `;

                grid.appendChild(card);
            });

        } catch (error) {

            console.error(
                "ASEM: failed to load projects.",
                error
            );

            grid.innerHTML = `
                <article class="card project-card error-card">
                    <div class="card-content">
                        <h3>Projects</h3>
                        <p>
                            Projects are temporarily unavailable.
                        </p>
                    </div>
                </article>
            `;

        } finally {

            grid.setAttribute("aria-busy", "false");

        }
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

/* =========================================================
   ASEM PLATFORM ICONS — FINAL INTERACTION
   ========================================================= */

(function enablePlatformIcons() {

    function initPlatformIcons() {

        const icons = document.querySelectorAll(".platform-icon");

        if (!icons.length) {
            return;
        }

        /*
         * Primary targets.
         * If an icon already has data-target/href, that value wins.
         * Otherwise the fallback order below is used.
         */
        const fallbackTargets = [
            "#services",
            "#tourism",
            "#businesses",
            "#products",
            "#projects",
            "#portfolio",
            "#global-platform",
            "#services",
            "#tourism",
            "#businesses",
            "#products"
        ];

        const normalize = value =>
            String(value || "")
                .trim()
                .toLowerCase();

        function getTarget(button, index) {

            const explicit =
                button.dataset.target ||
                button.getAttribute("data-section") ||
                button.getAttribute("href");

            if (explicit && explicit !== "#") {
                return explicit;
            }

            const text = normalize(button.textContent);

            const labels = [
                ["service", "#services"],
                ["خدمات", "#services"],
                ["tourism", "#tourism"],
                ["سياح", "#tourism"],
                ["business", "#businesses"],
                ["أعمال", "#businesses"],
                ["product", "#products"],
                ["منتج", "#products"],
                ["project", "#projects"],
                ["مشروع", "#projects"],
                ["portfolio", "#portfolio"],
                ["أعمالنا", "#portfolio"],
                ["platform", "#global-platform"],
                ["منصة", "#global-platform"]
            ];

            for (const [keyword, target] of labels) {
                if (text.includes(keyword)) {
                    return target;
                }
            }

            return fallbackTargets[index] || "#global-platform";
        }

        function scrollToTarget(target) {

            if (!target) {
                return;
            }

            let element = null;

            try {
                element = document.querySelector(target);
            } catch (_) {
                return;
            }

            if (!element) {
                return;
            }

            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            /*
             * Keep the URL synchronized without reloading the page.
             */
            if (target.startsWith("#")) {
                try {
                    history.replaceState(
                        null,
                        "",
                        target
                    );
                } catch (_) {}
            }
        }

        icons.forEach((button, index) => {

            /*
             * Prevent duplicate listeners if this initializer
             * happens to run more than once.
             */
            if (button.dataset.asemIconReady === "true") {
                return;
            }

            button.dataset.asemIconReady = "true";

            const target = getTarget(button, index);

            button.setAttribute("role", "button");
            button.setAttribute("tabindex", "0");
            button.setAttribute(
                "aria-label",
                button.getAttribute("aria-label") ||
                button.textContent.trim() ||
                "ASEM Platform"
            );

            button.addEventListener("click", function(event) {

                /*
                 * If the element is an actual link, let an explicit
                 * external URL work normally.
                 */
                const href = button.getAttribute("href");

                if (
                    href &&
                    href !== "#" &&
                    !href.startsWith("#")
                ) {
                    return;
                }

                event.preventDefault();

                scrollToTarget(target);
            });

            button.addEventListener("keydown", function(event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    scrollToTarget(target);
                }
            });

        });

        console.info(
            `ASEM: ${icons.length} platform icons enabled.`
        );
    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initPlatformIcons,
            { once: true }
        );

    } else {

        initPlatformIcons();

    }

})();


/* =========================================================
   ASEM — ALL PROJECT ICONS FINAL HANDLERS
   ========================================================= */

(function enableAllProjectIcons() {

    function scrollToSection(selector) {

        if (!selector) {
            return false;
        }

        const element = document.querySelector(selector);

        if (!element) {
            console.warn("ASEM: target not found:", selector);
            return false;
        }

        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        try {
            history.replaceState(null, "", selector);
        } catch (_) {}

        return true;
    }

    function openSearch() {

        const searchBox =
            document.querySelector(
                "#searchBox, " +
                "[name='search'], " +
                "input[type='search'], " +
                ".search-box"
            );

        if (searchBox) {
            searchBox.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            try {
                searchBox.focus();
            } catch (_) {}

            return;
        }

        /*
         * If the project uses the existing global search
         * implementation, let it handle the action.
         */
        if (typeof window.openSearch === "function") {
            window.openSearch();
            return;
        }

        if (typeof window.loadSearch === "function") {
            window.loadSearch();
        }
    }

    function executePlatformAction(action) {

        switch (action) {

            case "tourism":
                return scrollToSection("#tourism");

            case "businesses":
                return scrollToSection("#businesses");

            case "products":
                return scrollToSection("#products");

            case "projects":
                return scrollToSection("#projects");

            case "portfolio":
                return scrollToSection("#portfolio");

            case "services":
                return scrollToSection("#services");

            case "contact":
                window.location.href = "contact.html";
                return true;

            case "search":
                openSearch();
                return true;

            default:
                console.warn(
                    "ASEM: unknown platform action:",
                    action
                );
                return false;
        }
    }

    function bindPlatformActions() {

        document
            .querySelectorAll("[data-platform-action]")
            .forEach(element => {

                if (element.dataset.asemActionReady === "true") {
                    return;
                }

                element.dataset.asemActionReady = "true";

                const action =
                    element.dataset.platformAction;

                element.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        executePlatformAction(action);
                    }
                );

                element.addEventListener(
                    "keydown",
                    function(event) {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            executePlatformAction(action);
                        }
                    }
                );

            });
    }

    /*
     * Services icons.
     *
     * These are visual cards, so make them useful:
     * clicking a service takes the visitor to the
     * services section and focuses the selected card.
     */
    function bindServiceIcons() {

        const serviceIcons =
            document.querySelectorAll(
                "#services .platform-icon"
            );

        serviceIcons.forEach((icon, index) => {

            if (icon.dataset.asemServiceReady === "true") {
                return;
            }

            icon.dataset.asemServiceReady = "true";

            const card =
                icon.closest(
                    ".card, article, .service-card, div"
                );

            if (card) {

                card.setAttribute(
                    "tabindex",
                    "0"
                );

                card.addEventListener(
                    "click",
                    function(event) {

                        /*
                         * Do not interfere with links/buttons
                         * that may later be added inside the card.
                         */
                        if (
                            event.target.closest(
                                "a, button"
                            )
                        ) {
                            return;
                        }

                        scrollToSection("#services");
                    }
                );

                card.addEventListener(
                    "keydown",
                    function(event) {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            scrollToSection("#services");
                        }
                    }
                );
            }

        });
    }

    /*
     * Every project/portfolio card link should work.
     * This does not replace real href values.
     */
    function bindCardLinks() {

        document
            .querySelectorAll(
                "#projectsGrid a, " +
                "#portfolioGrid a, " +
                "#tourismGrid a, " +
                "#businessesGrid a, " +
                "#productsGrid a"
            )
            .forEach(link => {

                if (link.dataset.asemLinkReady === "true") {
                    return;
                }

                link.dataset.asemLinkReady = "true";

                link.addEventListener(
                    "click",
                    function(event) {

                        const href =
                            link.getAttribute("href");

                        if (!href || href === "#") {
                            event.preventDefault();
                        }

                    }
                );
            });
    }

    /*
     * Footer placeholder links (#) must not silently do nothing.
     */
    function bindPlaceholderLinks() {

        document
            .querySelectorAll("a[href='#']")
            .forEach(link => {

                if (link.dataset.asemPlaceholderReady === "true") {
                    return;
                }

                link.dataset.asemPlaceholderReady = "true";

                link.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        const target =
                            link.dataset.target ||
                            link.dataset.section;

                        if (target) {
                            scrollToSection(target);
                        }
                    }
                );
            });
    }

    function initialize() {

        bindPlatformActions();
        bindServiceIcons();
        bindCardLinks();
        bindPlaceholderLinks();

        console.info(
            "ASEM: ALL PROJECT ICONS AND INTERACTIVE ACTIONS ENABLED."
        );
    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            { once: true }
        );

    } else {

        initialize();

    }

})();


/* =========================================================
   ASEM — ALL PROJECT ICONS FINAL ROUTING
   ========================================================= */

(function enableAllProjectIconsFinal() {

    "use strict";

    const targets = {
        tourism: "#tourismGrid",
        businesses: "#businessesGrid",
        products: "#productsGrid",
        projects: "#projectsGrid",
        portfolio: "#portfolioGrid",
        services: "#services",
        contact: "contact.html",
        search: "#global-search"
    };

    function goToTarget(action) {

        const target = targets[action];

        if (!target) {
            console.warn("ASEM: unknown platform action:", action);
            return;
        }

        /*
         * Real page navigation.
         */
        if (
            target.endsWith(".html") ||
            target.startsWith("http://") ||
            target.startsWith("https://")
        ) {
            window.location.href = target;
            return;
        }

        const element = document.querySelector(target);

        /*
         * Some sections use a wrapper instead of the grid itself.
         * If the exact target is absent, use the closest known section.
         */
        if (!element) {

            const fallbacks = {
                tourism: "#tourism",
                businesses: "#businesses",
                products: "#products",
                projects: "#projects",
                portfolio: "#portfolio",
                services: "#services",
                search: "#search"
            };

            const fallback = fallbacks[action];

            if (fallback) {
                const fallbackElement =
                    document.querySelector(fallback);

                if (fallbackElement) {
                    fallbackElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                    return;
                }
            }

            console.warn(
                "ASEM: target not found for:",
                action,
                target
            );

            return;
        }

        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    function bindPlatformIcons() {

        const buttons = document.querySelectorAll(
            "[data-platform-action]"
        );

        buttons.forEach(button => {

            /*
             * Prevent duplicate handlers.
             */
            if (button.dataset.asemIconsBound === "true") {
                return;
            }

            button.dataset.asemIconsBound = "true";

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    const action =
                        button.getAttribute(
                            "data-platform-action"
                        );

                    goToTarget(action);
                }
            );

            /*
             * Keyboard accessibility.
             */
            button.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        const action =
                            button.getAttribute(
                                "data-platform-action"
                            );

                        goToTarget(action);
                    }
                }
            );
        });
    }


    function bindServiceIcons() {

        const serviceIcons =
            document.querySelectorAll(
                ".service-card .platform-icon, " +
                ".service-item .platform-icon, " +
                "[data-service-action]"
            );

        serviceIcons.forEach(icon => {

            if (icon.dataset.asemServiceBound === "true") {
                return;
            }

            icon.dataset.asemServiceBound = "true";

            icon.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    const action =
                        icon.getAttribute(
                            "data-service-action"
                        );

                    if (action) {
                        goToTarget(action);
                    }
                }
            );
        });
    }


    function initializeAllIcons() {

        bindPlatformIcons();
        bindServiceIcons();

        console.info(
            "ASEM: all project icon handlers initialized."
        );
    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAllIcons,
            { once: true }
        );

    } else {

        initializeAllIcons();

    }

})();

