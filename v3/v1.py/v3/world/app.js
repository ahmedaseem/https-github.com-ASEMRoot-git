"use strict";

/*
 * ============================================================
 * ASEM DIGITAL SOLUTIONS
 * GLOBAL PLATFORM CONTROLLER
 * ============================================================
 *
 * One controller for:
 *
 * Tourism
 * Businesses
 * Products
 * Projects
 * Portfolio
 * Services
 * Contact
 * Global Search
 * Theme
 * Languages
 * Scroll Top
 *
 * IMPORTANT:
 * This version supports BOTH:
 *
 * data-platform-action="tourism"
 *
 * AND legacy:
 *
 * data-section="tourism-results"
 *
 * so old cards do not stop working.
 * ============================================================
 */

(() => {

    const ASEM = {

        api: {
            tourism: "/api/tourism",
            businesses: "/api/businesses",
            products: "/api/products",
            projects: "/api/projects"
        },

        storage: {
            theme: "asem-theme",
            language: "asem-language"
        },

        timeout: 15000

    };


    /* ========================================================
       DOM
       ======================================================== */

    const $ = (selector, root = document) =>
        root.querySelector(selector);


    const $$ = (selector, root = document) =>
        Array.from(root.querySelectorAll(selector));


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
       ARRAY NORMALIZATION
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

    function openSection(id) {

        const section =
            document.getElementById(id);

        pages = {
    "home": self.page_home,
    "files": self.page_files,
    "notes": self.page_notes,
    "music": self.page_music,
    "browser": self.page_browser,
    "settings": self.page_settings,
    "services": self.page_services,
    "projects": self.page_projects,
    "about": self.page_about,
    "contact": self.page_contact,
}
"business": self.page_business,
"tourism": self.page_tourism,
"restaurants": self.page_restaurants,
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

        window.location.href = page;
    }


    /* ========================================================
       API
       ======================================================== */

    async function request(endpoint) {

        const controller =
            new AbortController();

        const timer =
            setTimeout(
                () => controller.abort(),
                ASEM.timeout
            );

        try {

            const response =
                await fetch(
                    endpoint,
                    {
                        method: "GET",
                        headers: {
                            "Accept": "application/json"
                        },
                        cache: "no-store",
                        signal: controller.signal
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
                    "Server did not return JSON"
                );
            }

            return await response.json();

        } finally {

            clearTimeout(timer);

        }
    }


    /* ========================================================
       GRID STATES
       ======================================================== */

    function loading(grid, text) {

        if (!grid) {
            return;
        }

        grid.setAttribute(
            "aria-busy",
            "true"
        );

        grid.innerHTML = `
            <article class="card platform-state">
                <div
                    class="loading-spinner"
                    aria-hidden="true">
                </div>

                <h3>
                    ${escapeHTML(text)}
                </h3>

                <p>
                    Please wait...
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
            <article class="card platform-state">

                <span
                    class="platform-state-icon"
                    aria-hidden="true">
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
            <article class="card platform-state">

                <span
                    class="platform-state-icon"
                    aria-hidden="true">
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
                    data-retry-grid="${escapeHTML(
                        grid.id
                    )}">
                    Retry
                </button>

            </article>
        `;
    }


    /* ========================================================
       RENDER
       ======================================================== */

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

        const image =
            item.image ||
            item.image_url ||
            "";

        return `
            <article
                class="card platform-result-card"
                data-type="tourism"
                data-id="${escapeHTML(item.id || "")}"
            >

                ${
                    image
                        ? `
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(name)}"
                                loading="lazy"
                                class="platform-card-image"
                            >
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

                    <span class="platform-card-category">
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
                                    ⭐ ${escapeHTML(item.rating)}
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

        const image =
            item.logo ||
            item.cover_image ||
            item.image ||
            "";

        return `
            <article
                class="card platform-result-card"
                data-type="business"
                data-id="${escapeHTML(item.id || "")}"
            >

                ${
                    image
                        ? `
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(name)}"
                                loading="lazy"
                                class="platform-card-image"
                            >
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

                    <span class="platform-card-category">
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
                                    📍 ${escapeHTML(item.address)}
                                </small>
                            `
                            : ""
                    }

                    ${
                        item.rating !== undefined
                            ? `
                                <div class="platform-rating">
                                    ⭐ ${escapeHTML(item.rating)}
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

        const image =
            item.image ||
            item.image_url ||
            "";

        const price =
            item.price !== undefined &&
            item.price !== null
                ? `
                    <strong class="product-price">
                        ${escapeHTML(item.price)}
                        ${escapeHTML(
                            item.currency || "USD"
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

                ${
                    image
                        ? `
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(name)}"
                                loading="lazy"
                                class="platform-card-image"
                            >
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

                    <span class="platform-card-category">
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
                    aria-hidden="true">
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
       LOAD TOURISM
       ======================================================== */

    async function loadTourism() {

        const section =
            document.getElementById(
                "tourism-section"
            );

        const grid =
            document.getElementById(
                "tourismGrid"
            );

        if (!grid) {
            console.warn(
                "ASEM: tourismGrid missing"
            );
            return;
        }

        if (section) {
            section.hidden = false;
        }

        loading(
            grid,
            "Loading Global Tourism..."
        );

        try {

            const data =
                await request(
                    ASEM.api.tourism
                );

            const items =
                normalizeArray(data);

            render(
                grid,
                items,
                tourismCard,
                "No tourism data yet",
                "Tourism destinations will appear here."
            );

            openSection(
                section
                    ? section.id
                    : "tourism-section"
            );

        } catch (error) {

            console.error(
                "ASEM Tourism:",
                error
            );

            errorState(
                grid,
                "Tourism temporarily unavailable",
                "The tourism service could not be reached."
            );
        }
    }


    /* ========================================================
       LOAD BUSINESSES
       ======================================================== */

    async function loadBusinesses() {

        const section =
            document.getElementById(
                "businesses-section"
            );

        const grid =
            document.getElementById(
                "businessesGrid"
            );

        if (!grid) {
            console.warn(
                "ASEM: businessesGrid missing"
            );
            return;
        }

        if (section) {
            section.hidden = false;
        }

        loading(
            grid,
            "Loading Global Businesses..."
        );

        try {

            const data =
                await request(
                    ASEM.api.businesses
                );

            const items =
                normalizeArray(data);

            render(
                grid,
                items,
                businessCard,
                "No businesses yet",
                "Businesses and services will appear here."
            );

            openSection(
                section
                    ? section.id
                    : "businesses-section"
            );

        } catch (error) {

            console.error(
                "ASEM Businesses:",
                error
            );

            errorState(
                grid,
                "Businesses temporarily unavailable",
                "The business service could not be reached."
            );
        }
    }


    /* ========================================================
       LOAD PRODUCTS
       ======================================================== */

    async function loadProducts() {

        const section =
            document.getElementById(
                "products-section"
            );

        const grid =
            document.getElementById(
                "productsGrid"
            );

        if (!grid) {
            console.warn(
                "ASEM: productsGrid missing"
            );
            return;
        }

        if (section) {
            section.hidden = false;
        }

        loading(
            grid,
            "Loading Global Products..."
        );

        try {

            const data =
                await request(
                    ASEM.api.products
                );

            const items =
                normalizeArray(data);

            render(
                grid,
                items,
                productCard,
                "No products yet",
                "Products will appear here."
            );

            openSection(
                section
                    ? section.id
                    : "products-section"
            );

        } catch (error) {

            console.error(
                "ASEM Products:",
                error
            );

            errorState(
                grid,
                "Products temporarily unavailable",
                "The products service could not be reached."
            );
        }
    }


    /* ========================================================
       LOAD PROJECTS
       ======================================================== */

    async function loadProjects() {

        const grid =
            document.getElementById(
                "projectsGrid"
            );

        if (!grid) {
            return;
        }

        loading(
            grid,
            "Loading ASEM Projects..."
        );

        try {

            const data =
                await request(
                    ASEM.api.projects
                );

            const items =
                normalizeArray(data);

            render(
                grid,
                items,
                projectCard,
                "Projects are coming",
                "Our project showcase will appear here."
            );

        } catch (error) {

            console.warn(
                "ASEM Projects:",
                error
            );

            empty(
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
                        software platforms and modern
                        technology services.
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
                .toLowerCase()
                .trim();

        const cards =
            $$(".platform-result-card, .project-card");

        cards.forEach(card => {

            if (!query) {

                card.hidden = false;

                return;
            }

            const text =
                card.textContent
                    .toLowerCase();

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
        }

        try {

            localStorage.setItem(
                ASEM.storage.theme,
                valid
            );

        } catch (_) {}
    }


    function initializeTheme() {

        let saved = null;

        try {

            saved =
                localStorage.getItem(
                    ASEM.storage.theme
                );

        } catch (_) {}

        if (
            saved === "dark" ||
            saved === "light"
        ) {

            applyTheme(saved);

            return;
        }

        const dark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        applyTheme(
            dark
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

    const translations = {

        en: {
            platform: "Global Platform",
            services: "Services",
            projects: "Projects",
            portfolio: "Portfolio",
            about: "About",
            contact: "Contact",
            hero_title: "ASEM Digital Solutions",
            hero_desc:
                "Free digital projects and custom software solutions for individuals and companies worldwide.",
            start_project:
                "Start Your Free Project",
            global_platform:
                "ASEM Global Platform 🌏",
            global_platform_desc:
                "Explore tourism destinations, global businesses, products and digital services through one unified platform.",
            tourism: "Tourism",
            tourism_desc:
                "Discover destinations, attractions and experiences around the world.",
            businesses: "Global Businesses",
            businesses_desc:
                "Explore businesses, restaurants, services and organizations worldwide.",
            products: "Global Products",
            products_desc:
                "Discover products and offerings from businesses around the world.",
            global_search: "Global Search",
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
            web_dev: "Web Development",
            web_dev_desc:
                "Modern, fast, secure websites and digital platforms.",
            ai_auto: "AI & Automation",
            ai_auto_desc:
                "Smart solutions powered by modern artificial intelligence and automation.",
            cloud: "Cloud Solutions",
            cloud_desc:
                "Scalable and reliable cloud infrastructure for modern organizations.",
            why_asem: "Why Choose ASEM",
            secure: "Enterprise-grade security",
            modern_tech: "Modern technologies",
            full_solutions: "Complete digital solutions",
            trusted_world: "Global digital platform",
            trusted_desc:
                "ASEM is building a global digital ecosystem connecting people, businesses, services, tourism and technology.",
            payments:
                "Supported Payment Methods"
        },

        ar: {
            platform: "المنصة العالمية",
            services: "الخدمات",
            projects: "المشاريع",
            portfolio: "معرض الأعمال",
            about: "عن ASEM",
            contact: "اتصل بنا",
            hero_title: "ASEM للحلول الرقمية",
            hero_desc:
                "مشاريع رقمية مجانية وحلول برمجية مخصصة للأفراد والشركات حول العالم.",
            start_project:
                "ابدأ مشروعك المجاني",
            global_platform:
                "منصة ASEM العالمية 🌏",
            global_platform_desc:
                "اكتشف السياحة والأعمال والمنتجات والخدمات الرقمية من خلال منصة عالمية موحدة.",
            tourism: "السياحة",
            tourism_desc:
                "اكتشف الوجهات والمعالم والتجارب حول العالم.",
            businesses: "الأعمال العالمية",
            businesses_desc:
                "استكشف الشركات والمطاعم والخدمات والمؤسسات حول العالم.",
            products: "المنتجات العالمية",
            products_desc:
                "اكتشف المنتجات والعروض من الشركات حول العالم.",
            global_search: "البحث العالمي",
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
            web_dev: "تطوير المواقع",
            web_dev_desc:
                "مواقع ومنصات رقمية حديثة وسريعة وآمنة.",
            ai_auto: "الذكاء الاصطناعي والأتمتة",
            ai_auto_desc:
                "حلول ذكية مدعومة بالذكاء الاصطناعي والأتمتة الحديثة.",
            cloud: "الحلول السحابية",
            cloud_desc:
                "بنية سحابية موثوقة وقابلة للتوسع للمؤسسات الحديثة.",
            why_asem: "لماذا تختار ASEM",
            secure: "أمان بمستوى المؤسسات",
            modern_tech: "تقنيات حديثة",
            full_solutions: "حلول رقمية متكاملة",
            trusted_world: "منصة رقمية عالمية",
            trusted_desc:
                "تبني ASEM منظومة رقمية عالمية تربط الأشخاص والشركات والخدمات والسياحة والتكنولوجيا.",
            payments:
                "طرق الدفع المدعومة"
        },

        fr: {
            platform: "Plateforme mondiale",
            services: "Services",
            projects: "Projets",
            portfolio: "Portfolio",
            about: "À propos",
            contact: "Contact",
            hero_title: "ASEM Digital Solutions",
            hero_desc:
                "Projets numériques gratuits et solutions logicielles personnalisées pour les particuliers et les entreprises dans le monde entier.",
            start_project:
                "Démarrer votre projet gratuit",
            global_platform:
                "Plateforme mondiale ASEM 🌏",
            global_platform_desc:
                "Découvrez le tourisme, les entreprises, les produits et les services numériques sur une plateforme mondiale unifiée.",
            tourism: "Tourisme",
            tourism_desc:
                "Découvrez des destinations, attractions et expériences dans le monde entier.",
            businesses: "Entreprises mondiales",
            businesses_desc:
                "Découvrez des entreprises, restaurants, services et organisations partout dans le monde.",
            products: "Produits mondiaux",
            products_desc:
                "Découvrez des produits et offres provenant d'entreprises du monde entier.",
            global_search: "Recherche mondiale",
            global_search_desc:
                "Recherchez sur la plateforme ASEM.",
            web_dev: "Développement Web",
            web_dev_desc:
                "Sites et plateformes numériques modernes, rapides et sécurisés.",
            ai_auto: "IA & Automatisation",
            ai_auto_desc:
                "Solutions intelligentes utilisant l'intelligence artificielle et l'automatisation.",
            cloud: "Solutions Cloud",
            cloud_desc:
                "Infrastructure cloud fiable et évolutive.",
            why_asem: "Pourquoi choisir ASEM",
            secure: "Sécurité de niveau entreprise",
            modern_tech: "Technologies modernes",
            full_solutions: "Solutions numériques complètes",
            trusted_world: "Plateforme numérique mondiale",
            trusted_desc:
                "ASEM construit un écosystème numérique mondial reliant personnes, entreprises, services, tourisme et technologie.",
            payments:
                "Méthodes de paiement prises en charge"
        },

        ja: {
            platform: "グローバルプラットフォーム",
            services: "サービス",
            projects: "プロジェクト",
            portfolio: "ポートフォリオ",
            about: "会社概要",
            contact: "お問い合わせ",
            hero_title: "ASEM Digital Solutions",
            hero_desc:
                "世界中の個人や企業向けに、無料のデジタルプロジェクトとカスタムソフトウェアソリューションを提供します。",
            start_project:
                "無料プロジェクトを開始",
            global_platform:
                "ASEM グローバルプラットフォーム 🌏",
            global_platform_desc:
                "観光、ビジネス、商品、デジタルサービスを一つのグローバルプラットフォームで探索できます。",
            tourism: "観光",
            tourism_desc:
                "世界中の目的地、観光名所、体験を発見できます。",
            businesses: "グローバルビジネス",
            businesses_desc:
                "世界中の企業、レストラン、サービス、組織を探索できます。",
            products: "グローバル商品",
            products_desc:
                "世界中の企業の商品やオファーを発見できます。",
            global_search: "グローバル検索",
            global_search_desc:
                "ASEMプラットフォーム全体を検索します。",
            web_dev: "Web開発",
            web_dev_desc:
                "最新で高速かつ安全なWebサイトとデジタルプラットフォーム。",
            ai_auto: "AIと自動化",
            ai_auto_desc:
                "人工知能と自動化を活用したスマートソリューション。",
            cloud: "クラウドソリューション",
            cloud_desc:
                "最新組織向けの信頼性と拡張性に優れたクラウド基盤。",
            why_asem: "ASEMを選ぶ理由",
            secure: "エンタープライズレベルのセキュリティ",
            modern_tech: "最新テクノロジー",
            full_solutions: "包括的なデジタルソリューション",
            trusted_world: "グローバルデジタルプラットフォーム",
            trusted_desc:
                "ASEMは、人々、企業、サービス、観光、テクノロジーをつなぐグローバルなデジタルエコシステムを構築しています。",
            payments:
                "対応決済方法"
        }

    };


    function detectLanguage() {

        const browser =
            navigator.language
                .toLowerCase();

        if (browser.startsWith("ar")) {
            return "ar";
        }

        if (browser.startsWith("fr")) {
            return "fr";
        }

        if (browser.startsWith("ja")) {
            return "ja";
        }

        return "en";
    }


    function applyLanguage(language) {

        const lang =
            language === "auto"
                ? detectLanguage()
                : (
                    translations[language]
                        ? language
                        : "en"
                );

        const dictionary =
            translations[lang];

        document.documentElement
            .setAttribute(
                "lang",
                lang
            );

        document.documentElement
            .setAttribute(
                "dir",
                lang === "ar"
                    ? "rtl"
                    : "ltr"
            );

        $$("[data-i18n]")
            .forEach(element => {

                const key =
                    element.dataset.i18n;

                if (
                    dictionary[key]
                ) {

                    element.textContent =
                        dictionary[key];
                }

            });

        const search =
            document.getElementById(
                "searchBox"
            );

        if (search) {

            const placeholders = {

                en: "🔍 Search...",
                ar: "🔍 بحث...",
                fr: "🔍 Rechercher...",
                ja: "🔍 検索..."
            };

            search.placeholder =
                placeholders[lang];
        }

        try {

            localStorage.setItem(
                ASEM.storage.language,
                language
            );

        } catch (_) {}

        document.dispatchEvent(
            new CustomEvent(
                "asem:languagechange",
                {
                    detail: {
                        language: lang
                    }
                }
            )
        );
    }


    /* ========================================================
       LEGACY ACTION COMPATIBILITY
       ======================================================== */

    function actionFromElement(element) {

        if (!element) {
            return null;
        }

        const direct =
            element.dataset.platformAction;

        if (direct) {
            return direct;
        }

        const legacy =
            element.dataset.section;

        if (!legacy) {
            return null;
        }

        const map = {

            "tourism-results":
                "tourism",

            "tourism-section":
                "tourism",

            "businesses-results":
                "businesses",

            "businesses-section":
                "businesses",

            "products-results":
                "products",

            "products-section":
                "products",

            "projects":
                "projects",

            "portfolio":
                "portfolio",

            "services":
                "services"

        };

        return map[legacy] || null;
    }


    /* ========================================================
       ACTION ROUTER
       ======================================================== */

    function executeAction(element) {

        const action =
            actionFromElement(element);

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

                openSection(
                    "projects"
                );

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

                console.warn(
                    "ASEM: Unknown action:",
                    action
                );

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

                /*
                 * Find BOTH modern and legacy cards.
                 */

                const element =
                    event.target.closest(
                        "[data-platform-action], [data-section]"
                    );

                if (element) {

                    const handled =
                        executeAction(
                            element
                        );

                    if (handled) {

                        event.preventDefault();

                        return;
                    }
                }


                /*
                 * Retry
                 */

                const retry =
                    event.target.closest(
                        "[data-retry-grid]"
                    );

                if (!retry) {
                    return;
                }

                const id =
                    retry.dataset.retryGrid;

                if (
                    id === "tourismGrid"
                ) {

                    loadTourism();

                } else if (
                    id === "businessesGrid"
                ) {

                    loadBusinesses();

                } else if (
                    id === "productsGrid"
                ) {

                    loadProducts();

                } else if (
                    id === "projectsGrid"
                ) {

                    loadProjects();
                }

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

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {
                    return;
                }

                const element =
                    event.target.closest(
                        "[data-platform-action], [data-section]"
                    );

                if (!element) {
                    return;
                }

                event.preventDefault();

                executeAction(
                    element
                );
            }
        );
    }


    /* ========================================================
       NAVIGATION LINKS
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
       SEARCH EVENTS
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

        selector.addEventListener(
            "change",
            event => {

                applyLanguage(
                    event.target.value
                );
            }
        );

        let saved = "auto";

        try {

            saved =
                localStorage.getItem(
                    ASEM.storage.language
                ) || "auto";

        } catch (_) {}

        if (
            Array.from(
                selector.options
            ).some(
                option =>
                    option.value === saved
            )
        ) {

            selector.value =
                saved;
        }

        applyLanguage(
            selector.value
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
       INITIAL RESULT STATE
       ======================================================== */

    function initializeResults() {

        [
            "tourism-section",
            "businesses-section",
            "products-section"
        ].forEach(id => {

            const section =
                document.getElementById(id);

            if (section) {
                section.hidden = true;
            }

        });
    }


    /* ========================================================
       PUBLIC API
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

    window.openPageSection =
        openSection;

    window.openPortfolio =
        openPortfolio;

    window.focusASEMSearch =
        focusSearch;


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

        console.info(
            "ASEM Global Platform: READY"
        );
    }


    if (
        document.readyState === "loading"
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
