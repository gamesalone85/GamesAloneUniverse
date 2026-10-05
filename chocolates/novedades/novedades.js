(() => {

    "use strict";


    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const API_URL =
        "https://script.google.com/macros/s/AKfycbzKiV8v95MkVD9Pk9RQa6ThfcqEEzTssYWeuEkdxpc88K-SJZFObPHRfmHE5WWaBkU/exec";


    const INITIAL_VISIBLE = 6;

    const LOAD_MORE_AMOUNT = 6;


    /* =====================================================
       ESTADO
    ===================================================== */

    let novedades = [];

    let filtroActual = "TODAS";

    let visibles = INITIAL_VISIBLE;

    let detalleAbierto = null;


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const grid =
        document.getElementById("campaignGrid");

    const detail =
        document.getElementById("campaignDetail");

    const loading =
        document.getElementById("loadingState");

    const errorState =
        document.getElementById("errorState");

    const emptyState =
        document.getElementById("emptyState");

    const retryButton =
        document.getElementById("retryButton");

    const loadMoreWrap =
        document.getElementById("loadMoreWrap");

    const loadMoreButton =
        document.getElementById("loadMoreButton");

    const counter =
        document.getElementById("hubCounter");

    const filters =
        document.getElementById("filters");

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");


    /* =====================================================
       UTILIDADES
    ===================================================== */

    function text(value) {

        return String(value ?? "").trim();

    }


    function normalize(value) {

        return text(value)
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toUpperCase();

    }


    /*
     * Valores provisionales que NO deben
     * aparecer públicamente.
     */
    function isPending(value) {

        const valueNormalized =
            normalize(value);


        if (!valueNormalized) {
            return true;
        }


        return [
            "(POR DEFINIR)",
            "POR DEFINIR",
            "(LO DEFINIREMOS)",
            "LO DEFINIREMOS",
            "PENDIENTE",
            "(PENDIENTE)"
        ].includes(
            valueNormalized
        );

    }


    /*
     * Escape HTML.
     *
     * Todo el contenido procedente de Sheets
     * se trata como texto, nunca como HTML.
     */
    function escapeHTML(value) {

        return text(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    function validImage(value) {

        const image =
            text(value);


        if (!image) {
            return "";
        }


        /*
         * Rutas internas del sitio.
         */
        if (
            image.startsWith("/") &&
            !image.startsWith("//")
        ) {
            return image;
        }


        /*
         * Imágenes HTTPS externas.
         */
        try {

            const url =
                new URL(image);


            if (
                url.protocol === "https:"
            ) {
                return url.href;
            }

        } catch (_) {

            return "";

        }


        return "";

    }


    function formatStatus(status) {

        switch (
            normalize(status)
        ) {

            case "ACTIVA":
                return "Activa";

            case "PROXIMAMENTE":
                return "Próximamente";

            case "FINALIZADA":
                return "Finalizada";

            default:
                return text(status);

        }

    }


    function statusClass(status) {

        switch (
            normalize(status)
        ) {

            case "ACTIVA":
                return "status-active";

            case "PROXIMAMENTE":
                return "status-upcoming";

            case "FINALIZADA":
                return "status-finished";

            default:
                return "";

        }

    }


    function formatType(type) {

        const typeNormalized =
            normalize(type);


        const names = {

            DINAMICA:
                "Dinámica",

            COLABORACION:
                "Colaboración",

            TEMPORADA:
                "Temporada",

            LANZAMIENTO:
                "Lanzamiento",

            EVENTO:
                "Evento"

        };


        return names[typeNormalized] ||
            text(type);

    }


    /*
     * Convierte:
     *
     * 01/11/2026
     *
     * en:
     *
     * NOV 2026
     */
    function shortDate(value) {

        const raw =
            text(value);


        const match =
            raw.match(
                /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
            );


        if (!match) {

            return isPending(raw)
                ? ""
                : raw;

        }


        const month =
            Number(match[2]);

        const year =
            match[3];


        const months = [
            "",
            "ENE",
            "FEB",
            "MAR",
            "ABR",
            "MAY",
            "JUN",
            "JUL",
            "AGO",
            "SEP",
            "OCT",
            "NOV",
            "DIC"
        ];


        if (
            month < 1 ||
            month > 12
        ) {
            return raw;
        }


        return `${months[month]} ${year}`;

    }


    function getFiltered() {

        if (
            filtroActual === "TODAS"
        ) {
            return novedades;
        }


        return novedades.filter(
            item =>
                normalize(item.estado) ===
                filtroActual
        );

    }


    /* =====================================================
       CARGAR API
    ===================================================== */

    async function loadNovedades() {

        setLoading();


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            if (
                !data ||
                data.ok !== true ||
                !Array.isArray(
                    data.novedades
                )
            ) {

                throw new Error(
                    "Respuesta inválida"
                );

            }


            novedades =
                data.novedades;


            filtroActual =
                "TODAS";

            visibles =
                INITIAL_VISIBLE;

            detalleAbierto =
                null;


            updateFilterButtons();

            render();

        } catch (error) {

            console.error(
                "Novedades Sarita:",
                error
            );


            showError();

        }

    }


    function setLoading() {

        loading.hidden =
            false;

        errorState.hidden =
            true;

        emptyState.hidden =
            true;

        grid.innerHTML =
            "";

        detail.hidden =
            true;

        detail.innerHTML =
            "";

        loadMoreWrap.hidden =
            true;

        counter.textContent =
            "";

    }


    function showError() {

        loading.hidden =
            true;

        errorState.hidden =
            false;

        emptyState.hidden =
            true;

        grid.innerHTML =
            "";

        detail.hidden =
            true;

        loadMoreWrap.hidden =
            true;

        counter.textContent =
            "";

    }


    /* =====================================================
       RENDER PRINCIPAL
    ===================================================== */

    function render() {

        loading.hidden =
            true;

        errorState.hidden =
            true;


        const filtered =
            getFiltered();


        updateCounter(
            filtered.length
        );


        if (
            filtered.length === 0
        ) {

            grid.innerHTML =
                "";

            emptyState.hidden =
                false;

            loadMoreWrap.hidden =
                true;

            closeDetail(false);

            return;

        }


        emptyState.hidden =
            true;


        const visibleItems =
            filtered.slice(
                0,
                visibles
            );


        grid.innerHTML =
            visibleItems
                .map(
                    createCard
                )
                .join("");


        loadMoreWrap.hidden =
            filtered.length <= visibles;


        /*
         * Si el detalle abierto ya no pertenece
         * al filtro actual, se cierra.
         */
        if (
            detalleAbierto &&
            !filtered.some(
                item =>
                    item.id ===
                    detalleAbierto
            )
        ) {

            closeDetail(false);

        }

    }


    function updateCounter(total) {

        if (total === 1) {

            counter.textContent =
                "1 novedad";

            return;

        }


        counter.textContent =
            `${total} novedades`;

    }


    /* =====================================================
       TARJETA
    ===================================================== */

    function createCard(item) {

        const image =
            validImage(
                item.imagen
            );


        const status =
            formatStatus(
                item.estado
            );


        const date =
            shortDate(
                item.fecha_inicio
            );


        const meta = [];


        if (date) {

            meta.push(
                `<span>${escapeHTML(date)}</span>`
            );

        }


        if (
            !isPending(
                item.ubicacion
            )
        ) {

            meta.push(
                `<span>${escapeHTML(item.ubicacion)}</span>`
            );

        }


        const imageHTML =
            image
                ? `
                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(item.titulo)}"
                        loading="lazy"
                        decoding="async"
                    >
                `
                : `
                    <div
                        class="image-placeholder"
                        aria-hidden="true"
                    ></div>
                `;


        return `
            <article
                class="campaign-card"
                data-id="${escapeHTML(item.id)}"
            >

                <div class="card-image">

                    ${imageHTML}

                    ${
                        status
                            ? `
                                <span
                                    class="status-badge ${statusClass(item.estado)}"
                                >
                                    ${escapeHTML(status)}
                                </span>
                            `
                            : ""
                    }

                </div>


                <div class="card-content">

                    <p class="card-type">
                        ${escapeHTML(
                            formatType(
                                item.tipo
                            )
                        )}
                    </p>


                    <h3>
                        ${escapeHTML(item.titulo)}
                    </h3>


                    ${
                        !isPending(
                            item.resumen
                        )
                            ? `
                                <p class="card-summary">
                                    ${escapeHTML(item.resumen)}
                                </p>
                            `
                            : ""
                    }


                    ${
                        meta.length
                            ? `
                                <div class="card-meta">
                                    ${meta.join("")}
                                </div>
                            `
                            : ""
                    }


                    <button
                        type="button"
                        class="card-action"
                        data-action="open"
                        data-id="${escapeHTML(item.id)}"
                        aria-expanded="${
                            detalleAbierto === item.id
                                ? "true"
                                : "false"
                        }"
                    >

                        <span>
                            ${escapeHTML(
                                item.texto_boton ||
                                "Ver dinámica"
                            )}
                        </span>

                        <span aria-hidden="true">
                            →
                        </span>

                    </button>

                </div>

            </article>
        `;

    }


    /* =====================================================
       DETALLE
    ===================================================== */

    function openDetail(id) {

        const item =
            novedades.find(
                novelty =>
                    novelty.id === id
            );


        if (!item) {
            return;
        }


        detalleAbierto =
            id;


        renderDetail(item);


        /*
         * Actualizamos aria-expanded.
         */
        document
            .querySelectorAll(
                ".card-action"
            )
            .forEach(
                button => {

                    button.setAttribute(
                        "aria-expanded",
                        button.dataset.id === id
                            ? "true"
                            : "false"
                    );

                }
            );


        requestAnimationFrame(
            () => {

                detail.scrollIntoView({
                    behavior:
                        window.matchMedia(
                            "(prefers-reduced-motion: reduce)"
                        ).matches
                            ? "auto"
                            : "smooth",

                    block:"start"
                });

            }
        );

    }


    function renderDetail(item) {

        const image =
            validImage(
                item.imagen
            );


        const status =
            formatStatus(
                item.estado
            );


        const date =
            shortDate(
                item.fecha_inicio
            );


        const pistas =
            Array.isArray(
                item.pistas
            )
                ? item.pistas.filter(
                    pista =>
                        !isPending(
                            pista.titulo
                        ) ||
                        !isPending(
                            pista.recompensa
                        )
                )
                : [];


        const participation =
            Array.isArray(
                item.como_participar
            )
                ? item.como_participar.filter(
                    value =>
                        !isPending(value)
                )
                : [];


        const conditions =
            Array.isArray(
                item.condiciones
            )
                ? item.condiciones.filter(
                    value =>
                        !isPending(value)
                )
                : [];


        const hasPrize =
            !isPending(
                item.premio
            ) ||
            !isPending(
                item.disponibilidad
            );


        detail.innerHTML = `

            <div class="detail-top">

                ${
                    image
                        ? `
                            <div class="detail-image">

                                <img
                                    src="${escapeHTML(image)}"
                                    alt="${escapeHTML(item.titulo)}"
                                    decoding="async"
                                >

                            </div>
                        `
                        : ""
                }


                <div class="detail-copy">

                    <div class="detail-toolbar">

                        <span class="detail-type">
                            ${escapeHTML(
                                formatType(
                                    item.tipo
                                )
                            )}
                        </span>


                        <button
                            type="button"
                            class="detail-close"
                            data-action="close"
                        >
                            Cerrar ×
                        </button>

                    </div>


                    <h2>
                        ${escapeHTML(item.titulo)}
                    </h2>


                    ${
                        !isPending(
                            item.resumen
                        )
                            ? `
                                <p class="detail-summary">
                                    ${escapeHTML(item.resumen)}
                                </p>
                            `
                            : ""
                    }


                    ${
                        !isPending(
                            item.descripcion
                        )
                            ? `
                                <p class="detail-description">
                                    ${escapeHTML(item.descripcion)}
                                </p>
                            `
                            : ""
                    }


                    <div class="detail-meta">

                        ${
                            status
                                ? `
                                    <span>
                                        ${escapeHTML(status)}
                                    </span>
                                `
                                : ""
                        }

                        ${
                            date
                                ? `
                                    <span>
                                        ${escapeHTML(date)}
                                    </span>
                                `
                                : ""
                        }

                        ${
                            !isPending(
                                item.ubicacion
                            )
                                ? `
                                    <span>
                                        ${escapeHTML(item.ubicacion)}
                                    </span>
                                `
                                : ""
                        }

                    </div>

                </div>

            </div>


            <div class="detail-body">


                ${
                    pistas.length
                        ? createRewards(
                            pistas
                        )
                        : ""
                }


                ${
                    participation.length
                        ? createListSection(
                            "CÓMO PARTICIPAR",
                            "Sigue la dinámica.",
                            participation
                        )
                        : ""
                }


                ${
                    hasPrize
                        ? createPrize(
                            item
                        )
                        : ""
                }


                ${
                    conditions.length
                        ? createListSection(
                            "CONDICIONES",
                            "Información importante.",
                            conditions
                        )
                        : ""
                }


            </div>
        `;


        detail.hidden =
            false;

    }


    function createRewards(pistas) {

        return `

            <section class="detail-section">

                <p class="detail-section-label">
                    LA DINÁMICA
                </p>

                <h3>
                    Encuentra las pistas.
                </h3>


                <div class="reward-grid">

                    ${
                        pistas
                            .map(
                                pista => `

                                    <article class="reward-item">

                                        <span class="reward-number">
                                            ${escapeHTML(
                                                pista.cantidad
                                            )}
                                        </span>

                                        <div>

                                            ${
                                                !isPending(
                                                    pista.titulo
                                                )
                                                    ? `
                                                        <h4>
                                                            ${escapeHTML(
                                                                pista.titulo
                                                            )}
                                                        </h4>
                                                    `
                                                    : ""
                                            }

                                            ${
                                                !isPending(
                                                    pista.recompensa
                                                )
                                                    ? `
                                                        <p>
                                                            ${escapeHTML(
                                                                pista.recompensa
                                                            )}
                                                        </p>
                                                    `
                                                    : ""
                                            }

                                        </div>

                                    </article>

                                `
                            )
                            .join("")
                    }

                </div>

            </section>
        `;

    }


    function createListSection(
        label,
        title,
        items
    ) {

        return `

            <section class="detail-section">

                <p class="detail-section-label">
                    ${escapeHTML(label)}
                </p>

                <h3>
                    ${escapeHTML(title)}
                </h3>


                <ol class="detail-list">

                    ${
                        items
                            .map(
                                (item, index) => `

                                    <li>

                                        <span class="detail-list-number">
                                            ${String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                        <span>
                                            ${escapeHTML(item)}
                                        </span>

                                    </li>

                                `
                            )
                            .join("")
                    }

                </ol>

            </section>
        `;

    }


    function createPrize(item) {

        return `

            <section class="detail-section">

                <p class="detail-section-label">
                    PREMIO
                </p>

                <h3>
                    Recompensa especial.
                </h3>


                <div class="prize-box">

                    ${
                        !isPending(
                            item.premio
                        )
                            ? `
                                <div>

                                    <span>
                                        PREMIO
                                    </span>

                                    <strong>
                                        ${escapeHTML(item.premio)}
                                    </strong>

                                </div>
                            `
                            : ""
                    }


                    ${
                        !isPending(
                            item.disponibilidad
                        )
                            ? `
                                <div>

                                    <span>
                                        DISPONIBILIDAD
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            item.disponibilidad
                                        )}
                                    </strong>

                                </div>
                            `
                            : ""
                    }

                </div>

            </section>
        `;

    }


    function closeDetail(scroll = true) {

        if (
            detail.hidden
        ) {
            return;
        }


        detalleAbierto =
            null;


        detail.hidden =
            true;

        detail.innerHTML =
            "";


        document
            .querySelectorAll(
                ".card-action"
            )
            .forEach(
                button => {

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );


        if (scroll) {

            const hub =
                document.querySelector(
                    ".news-hub"
                );


            if (hub) {

                hub.scrollIntoView({
                    behavior:
                        window.matchMedia(
                            "(prefers-reduced-motion: reduce)"
                        ).matches
                            ? "auto"
                            : "smooth",

                    block:"start"
                });

            }

        }

    }


    /* =====================================================
       FILTROS
    ===================================================== */

    function changeFilter(filter) {

        filtroActual =
            normalize(filter);

        visibles =
            INITIAL_VISIBLE;


        closeDetail(false);

        updateFilterButtons();

        render();

    }


    function updateFilterButtons() {

        document
            .querySelectorAll(
                ".filter-button"
            )
            .forEach(
                button => {

                    const active =
                        normalize(
                            button.dataset.filter
                        ) === filtroActual;


                    button.classList.toggle(
                        "is-active",
                        active
                    );


                    button.setAttribute(
                        "aria-pressed",
                        String(active)
                    );

                }
            );

    }


    /* =====================================================
       EVENTOS
    ===================================================== */

    filters.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".filter-button"
                );


            if (!button) {
                return;
            }


            changeFilter(
                button.dataset.filter
            );

        }
    );


    grid.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    '[data-action="open"]'
                );


            if (!button) {
                return;
            }


            openDetail(
                button.dataset.id
            );

        }
    );


    detail.addEventListener(
        "click",
        event => {

            const close =
                event.target.closest(
                    '[data-action="close"]'
                );


            if (!close) {
                return;
            }


            closeDetail();

        }
    );


    loadMoreButton.addEventListener(
        "click",
        () => {

            visibles +=
                LOAD_MORE_AMOUNT;

            render();

        }
    );


    retryButton.addEventListener(
        "click",
        loadNovedades
    );


    /* =====================================================
       MENÚ MÓVIL
    ===================================================== */

    if (
        menuToggle &&
        mainNav
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                const open =
                    mainNav.classList.toggle(
                        "is-open"
                    );


                menuToggle.classList.toggle(
                    "is-open",
                    open
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    String(open)
                );

            }
        );


        mainNav.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest("a")
                ) {

                    mainNav.classList.remove(
                        "is-open"
                    );


                    menuToggle.classList.remove(
                        "is-open"
                    );


                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }


    /* =====================================================
       INICIO
    ===================================================== */

    loadNovedades();


})();
