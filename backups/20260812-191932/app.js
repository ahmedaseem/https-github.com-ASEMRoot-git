"use strict";

import { CONFIG } from "./config.js";

const API_BASE = CONFIG.api.real;

console.log("ASEM: app.js STARTED");

    /* ========================================================
       ASEM GLOBAL PLATFORM
       Main Frontend Controller
    ======================================================== */

    const ASEM = {

        selectors: {
            search: "#searchBox",
            language: "#langSwitch",
            theme: "#themeToggle",
            scrollTop: "#scrollTop",

            tourismGrid: "#tourismGrid",
            businessesGrid: "#businessesGrid",
            productsGrid: "#productsGrid",
            projectsGrid: "#projectsGrid",
            portfolioGrid: "#portfolioGrid"
        },

        api: {
            tourism: `${API_BASE}/tourism`,
            businesses: `${API_BASE}/businesses`,
            products: `${API_BASE}/products`,
            projects: `${API_BASE}/projects`
        },

        storage: {
            theme: "asem-theme",
            language: "asem-language"
        },

        requestTimeout:
            CONFIG?.timeout || 15000

    };


    /* ========================================================
       DOM HELPERS
    ======================================================== */

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        Array.from(root.querySelectorAll(selector));


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

        const keys = [
            "data",
            "items",
            "results",
            "tourism",
            "businesses",
            "products",
            "projects"
        ];

        for (const key of keys) {

            if (Array.isArray(data[key])) {
                return data[key];
            }
        }

        return [];
    }


    /* ========================================================
       NAVIGATION
    ======================================================== */

    function openPageSection(id) {

        const section =
            document.getElementById(id);

        if (!section) {

            console.warn(
                `ASEM: section #${id} not found`
            );

            return false;
        }

        section.hidden = false;

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return true;
    }


    function openExternalPage(page) {

        if (!page) {
            return;
        }

        window.location.href = page;
    }


    /* ========================================================
       API
    ======================================================== */

    async function apiRequest(endpoint) {

        const controller =
            new AbortController();

        const timer =
            window.setTimeout(
                () => controller.abort(),
                ASEM.requestTimeout
            );

        try {

            const response =
                await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        Accept:
                            "application/json"
                    },
                    cache: "no-store",
                    signal: controller.signal
                });

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
                contentType &&
                !contentType.includes(
                    "application/json"
                )
            ) {

                throw new Error(
                    "API did not return JSON"
                );
            }

            return await response.json();

        } finally {

            window.clearTimeout(timer);

        }
    }


    /* ========================================================
       GRID STATES
    ======================================================== */

    function setGridLoading(
        grid,
        message
    ) {

        if (!grid) {
            return;
        }

        grid.innerHTML = `
            <article class="card platform-state loading-state">

                <div
                    class="loading-spinner"
                    aria-hidden="true">
                </div>

                <h3>
                    ${escapeHTML(
                        message || "Loading..."
                    )}
                </h3>

                <p>
                    Please wait...
                </p>

            </article>
        `;

        grid.setAttribute(
            "aria-busy",
            "true"
        );
    }


    function setGridEmpty(
        grid,
        title,
        message
    ) {

        if (!grid) {
            return;
        }

        grid.innerHTML = `
            <article class="card platform-state empty-state">

                <span
                    class="platform-state-icon"
                    aria-hidden="true">
                    🌐
                </span>

                <h3>
                    ${escapeHTML(
                        title ||
                        "No data available"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        message ||
                        "No items available."
                    )}
                </p>

            </article>
        `;

        grid.setAttribute(
            "aria-busy",
            "false"
        );
    }


    function setGridError(
        grid,
        title,
        message
    ) {

        if (!grid) {
            return;
        }

        grid.innerHTML = `
            <article class="card platform-state error-state">

                <span
                    class="platform-state-icon"
                    aria-hidden="true">
                    ⚠️
                </span>

                <h3>
                    ${escapeHTML(
                        title ||
                        "Unable to load data"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        message ||
                        "Please try again later."
                    )}
                </p>

                <button
                    type="button"
                    class="btn"
                    data-retry-grid="${escapeHTML(
                        grid.id
                    )}">
                    Retry
                </button>

            </article>
        `;

        grid.setAttribute(
            "aria-busy",
            "false"
        );
    }


    function finishGrid(grid) {

        if (grid) {
            grid.setAttribute(
                "aria-busy",
                "false"
            );
        }
    }


    /* ========================================================
       CARD BUILDERS
    ======================================================== */

    function buildTourismCard(item) {

        const name =
            item.name ||
            item.title ||
            "Tourism Destination";

        const category =
            item.category ||
            "Tourism";

        const description =
            item.description ||
            "Discover this destination.";

        const image =
            item.image || "";

        return `
            <article
                class="card platform-result-card"
                data-type="tourism"
                data-id="${escapeHTML(
                    item.id || ""
                )}">

                ${
                    image
                        ? `
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(name)}"
                                loading="lazy"
                                class="platform-card-image"
                                onerror="this.style.display='none'">
                          `
                        : `
                            <div
                                class="platform-card-icon"
                                aria-hidden="true">
                                🏝️
                            </div>
                          `
                }

                <div class="platform-card-content">

                    <span
                        class="platform-card-category">
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
                                <div class="platform-rating">
                                    ⭐ ${escapeHTML(
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


    function buildBusinessCard(item) {

        const name =
            item.name ||
            item.title ||
            "Global Business";

        const category =
            item.category ||
            "Business";

        const description =
            item.description ||
            "Discover this business.";

        const image =
            item.logo ||
            item.cover_image ||
            item.image ||
            "";

        return `
            <article
                class="card platform-result-card"
                data-type="business"
                data-id="${escapeHTML(
                    item.id || ""
                )}">

                ${
                    image
                        ? `
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(name)}"
                                loading="lazy"
                                class="platform-card-image"
                                onerror="this.style.display='none'">
                          `
                        : `
                            <div
                                class="platform-card-icon"
                                aria-hidden="true">
                                🌍
                            </div>
                          `
                }

                <div class="platform-card-content">

                    <span
                        class="platform-card-category">
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
                                    📍 ${escapeHTML(
                                        item.address
                                    )}
                                </small>
                              `
                            : ""
                    }

                    ${
                        item.rating !== undefined
                            ? `
                                <div class="platform-rating">
                                    ⭐ ${escapeHTML(
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


    function buildProductCard(item) {

        const name =
            item.name ||
            item.title ||
            "Global Product";

        const category =
            item.category ||
            "Product";

        const description =
            item.description ||
            "Discover this product.";

        const image =
            item.image || "";

        return `
            <article
                class="card platform-result-card"
                data-type="product"
                data-id="${escapeHTML(
                    item.id || ""
                )}">

                ${
                    image
                        ? `
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(name)}"
                                loading="lazy"
                                class="platform-card-image"
                                onerror="this.style.display='none'">
                          `
                        : `
                            <div
                                class="platform-card-icon"
                                aria-hidden="true">
                                🛒
                            </div>
                          `
                }

                <div class="platform-card-content">

                    <span
                        class="platform-card-category">
                        ${escapeHTML(category)}
                    </span>

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(description)}
                    </p>

                    ${
                        item.price !== undefined
                            ? `
                                <strong class="product-price">
                                    ${escapeHTML(
                                        item.price
                                    )}
                                    ${escapeHTML(
                                        item.currency ||
                                        "USD"
                                    )}
                                </strong>
                              `
                            : ""
                    }

                    ${
                        item.rating !== undefined
                            ? `
                                <div class="platform-rating">
                                    ⭐ ${escapeHTML(
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


    function buildProjectCard(item) {

        const name =
            item.name ||
            item.title ||
            "ASEM Project";

        const description =
            item.description ||
            "ASEM Digital Solutions project.";

        const image =
            item.image || "";

        return `
            <article
                class="card project-card"
                data-type="project"
                data-id="${escapeHTML(
                    item.id || ""
                )}">

                ${
                    image
                        ? `
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(name)}"
                                loading="lazy"
                                class="platform-card-image"
                                onerror="this.style.display='none'">
                          `
                        : `
                            <div
                                class="platform-card-icon"
                                aria-hidden="true">
                                🚀
                            </div>
                          `
                }

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

            </article>
        `;
    }


    function renderGrid(
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

            setGridEmpty(
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

        finishGrid(grid);
    }


    /* ========================================================
       LOADERS
    ======================================================== */

    async function loadTourism() {

        const grid =
            $(ASEM.selectors.tourismGrid);

        if (!grid) {
            console.warn(
                "ASEM: tourismGrid not found"
            );
            return;
        }

        setGridLoading(
            grid,
            "Loading Global Tourism..."
        );

        try {

            const data =
                await apiRequest(
                    ASEM.api.tourism
                );

            renderGrid(
                grid,
                normalizeArray(data),
                buildTourismCard,
                "No tourism data yet",
                "Tourism destinations will appear here."
            );

        } catch (error) {

            console.error(
                "ASEM Tourism:",
                error
            );

            setGridError(
                grid,
                "Tourism is temporarily unavailable",
                "The tourism service could not be reached."
            );
        }
    }


    async function loadBusinesses() {

        const grid =
            $(ASEM.selectors.businessesGrid);

        if (!grid) {
            console.warn(
                "ASEM: businessesGrid not found"
            );
            return;
        }

        setGridLoading(
            grid,
            "Loading Global Businesses..."
        );

        try {

            const data =
                await apiRequest(
                    ASEM.api.businesses
                );

            renderGrid(
                grid,
                normalizeArray(data),
                buildBusinessCard,
                "No businesses yet",
                "Businesses will appear here."
            );

        } catch (error) {

            console.error(
                "ASEM Businesses:",
                error
            );

            setGridError(
                grid,
                "Businesses are temporarily unavailable",
                "The business service could not be reached."
            );
        }
    }


    async function loadProducts() {

        const grid =
            $(ASEM.selectors.productsGrid);

        if (!grid) {
            console.warn(
                "ASEM: productsGrid not found"
            );
            return;
        }

        setGridLoading(
            grid,
            "Loading Global Products..."
        );

        try {

            const data =
                await apiRequest(
                    ASEM.api.products
                );

            renderGrid(
                grid,
                normalizeArray(data),
                buildProductCard,
                "No products yet",
                "Products will appear here."
            );

        } catch (error) {

            console.error(
                "ASEM Products:",
                error
            );

            setGridError(
                grid,
                "Products are temporarily unavailable",
                "The products service could not be reached."
            );
        }
    }


    async function loadProjects() {

        const grid =
            $(ASEM.selectors.projectsGrid);

        if (!grid) {
            console.warn(
                "ASEM: projectsGrid not found"
            );
            return;
        }

        setGridLoading(
            grid,
            "Loading ASEM Projects..."
        );

        try {

            const data =
                await apiRequest(
                    ASEM.api.projects
                );

            renderGrid(
                grid,
                normalizeArray(data),
                buildProjectCard,
                "ASEM Projects",
                "Our projects will appear here."
            );

        } catch (error) {

            console.warn(
                "ASEM Projects:",
                error
            );

            setGridEmpty(
                grid,
                "ASEM Projects",
                "Our project showcase will appear here."
            );
        }
    }


    /* ========================================================
       PORTFOLIO
    ======================================================== */

    function openPortfolio() {

        openPageSection("portfolio");

        const grid =
            $(ASEM.selectors.portfolioGrid);

        if (!grid) {
            return;
        }

        if (!grid.children.length) {

            grid.innerHTML = `
                <article class="card portfolio-card">

                    <div
                        class="platform-card-icon"
                        aria-hidden="true">
                        💻
                    </div>

                    <h3>
                        ASEM Digital Solutions
                    </h3>

                    <p>
                        Global digital solutions,
                        software platforms and
                        modern technology services.
                    </p>

                </article>
            `;
        }
    }


    /* ========================================================
       SEARCH
    ======================================================== */

    function focusSearch() {

        const input =
            $(ASEM.selectors.search);

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
                .toLowerCase()
                .trim();

        const cards =
            $$(".platform-result-card, .project-card");

        if (!query) {

            cards.forEach(
                card => card.hidden = false
            );

            return;
        }

        cards.forEach(card => {

            card.hidden =
                !card.textContent
                    .toLowerCase()
                    .includes(query);

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
            $(ASEM.selectors.theme);

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
                ASEM.storage.theme,
                valid
            );

        } catch (error) {
            console.warn(
                "ASEM theme storage unavailable"
            );
        }

        return valid;
    }


    function initializeTheme() {

        let saved = null;

        try {

            saved =
                localStorage.getItem(
                    ASEM.storage.theme
                );

        } catch (error) {}

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
       LANGUAGE
    ======================================================== */

    function detectLanguage() {

        const language =
            navigator.language ||
            "en";

        if (
            language
                .toLowerCase()
                .startsWith("ar")
        ) {
            return "ar";
        }

        if (
            language
                .toLowerCase()
                .startsWith("fr")
        ) {
            return "fr";
        }

        if (
            language
                .toLowerCase()
                .startsWith("ja")
        ) {
            return "ja";
        }

        return "en";
    }


    function applyLanguage(language) {

        const selected =
            language === "auto"
                ? detectLanguage()
                : language || "en";

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

        try {

            localStorage.setItem(
                ASEM.storage.language,
                language || selected
            );

        } catch (error) {}

        document.dispatchEvent(
            new CustomEvent(
                "asem:languagechange",
                {
                    detail: {
                        language: selected
                    }
                }
            )
        );

        return selected;
    }


    function initializeLanguage() {

        const selector =
            $(ASEM.selectors.language);

        let saved = "auto";

        try {

            saved =
                localStorage.getItem(
                    ASEM.storage.language
                ) || "auto";

        } catch (error) {}

        if (selector) {

            const exists =
                Array.from(
                    selector.options
                ).some(
                    option =>
                        option.value === saved
                );

            if (exists) {
                selector.value = saved;
            }

            applyLanguage(
                selector.value || "auto"
            );

        } else {

            applyLanguage(saved);
        }
    }


    /* ========================================================
       EVENTS
    ======================================================== */

    function initializeThemeEvents() {

        const button =
            $(ASEM.selectors.theme);

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            toggleTheme
        );
    }


    function initializeLanguageEvents() {

        const selector =
            $(ASEM.selectors.language);

        if (!selector) {
            return;
        }

        selector.addEventListener(
            "change",
            event => {

                applyLanguage(
                    event.target.value
                );

            }
        );
    }


    function initializeSearch() {

        const input =
            $(ASEM.selectors.search);

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


    function initializeScrollTop() {

        const button =
            $(ASEM.selectors.scrollTop);

        if (!button) {
            return;
        }

        const update =
            () => {

                const visible =
                    window.scrollY > 400;

                button.classList.toggle(
                    "visible",
                    visible
                );

            };

        window.addEventListener(
            "scroll",
            update,
            { passive: true }
        );

        update();

        button.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
    }


    /* ========================================================
       PLATFORM ACTIONS
    ======================================================== */

    const actions = {
    tourism: () => handleSection("tourism-section", loadTourism),
    businesses: () => handleSection("businesses-section", loadBusinesses),
    products: () => handleSection("products-section", loadProducts),
    projects: () => handleSection("projects", loadProjects),
    portfolio: openPortfolio,
    services: () => openPageSection("services"),
    contact: () => openExternalPage("contact.html"),
    about: () => openExternalPage("about.html"),
    search: focusSearch,
    top: () => window.scrollTo({ top: 0, behavior: "smooth" })
};

function handleSection(sectionId, loader) {
    openPageSection(sectionId);
    if (typeof loader === "function") {
        loader();
    }
}
          
 


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

                const action =
                    element.dataset
                        .platformAction;

                const handler =
                    actions[action];

                if (
                    typeof handler !==
                    "function"
                ) {

                    console.warn(
                        `ASEM: unknown action ${action}`
                    );

                    return;
                }

                event.preventDefault();

                handler();

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

                const element =
                    event.target.closest(
                        "[data-platform-action]"
                    );

                if (!element) {
                    return;
                }

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {
                    return;
                }

                event.preventDefault();

                const action =
                    element.dataset
                        .platformAction;

                const handler =
                    actions[action];

                if (
                    typeof handler ===
                    "function"
                ) {
                    handler();
                }

            }
        );
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

                const id =
                    link
                        .getAttribute("href")
                        .substring(1);

                if (!id) {
                    return;
                }

                const section =
                    document.getElementById(id);

                if (!section) {
                    return;
                }

                event.preventDefault();

                openPageSection(id);

            }
        );
    }


    /* ========================================================
       GLOBAL COMPATIBILITY API
    ======================================================== */

    window.ASEM = ASEM;

    window.loadTourism =
        loadTourism;

    window.loadBusinesses =
        loadBusinesses;

    window.loadProducts =
        loadProducts;

    window.loadProjects =
        loadProjects;

    window.openPortfolio =
        openPortfolio;

    window.openPageSection =
        openPageSection;

    window.focusASEMSearch =
        focusSearch;

    window.focusSearch =
        focusSearch;

    window.searchASEM =
        search;

    window.applyASEMTheme =
        applyTheme;

    window.toggleASEMTheme =
        toggleTheme;

    window.applyASEMLanguage =
        applyLanguage;


    /* ========================================================
       STARTUP
    ======================================================== */

    function initialize() {

        initializeTheme();

        initializeLanguage();

        initializeThemeEvents();

        initializeLanguageEvents();

        initializeSearch();

        initializeScrollTop();

        initializeActionRouter();

        initializeKeyboard();

        initializeNavigation();

        console.info(
            "ASEM Global Platform READY"
        );

        console.info(
            `ASEM Mode: ${String(
                CONFIG.mode || "demo"
            ).toUpperCase()}`
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

