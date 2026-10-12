/* =========================================================
   CHOCOLATE ARTÍSTICO SARITA
   CATÁLOGO MULTIPRODUCTO
   2026

   MODOS:
   - PEDIDO DESDE CATÁLOGO
   - DISEÑO PERSONALIZADO
========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTOS DEL CATÁLOGO
    ===================================================== */

    const catalogItems =
        Array.from(
            document.querySelectorAll(
                "[data-catalog-item]"
            )
        );


    const summaryEmpty =
        document.getElementById(
            "catalogoSummaryEmpty"
        );


    const summaryItems =
        document.getElementById(
            "catalogoSummaryItems"
        );


    const summaryTotals =
        document.getElementById(
            "catalogoSummaryTotals"
        );


    const totalBoxesElement =
        document.getElementById(
            "catalogoTotalBoxes"
        );


    const referencePriceElement =
        document.getElementById(
            "catalogoReferencePrice"
        );


    const continueButton =
        document.getElementById(
            "catalogoContinue"
        );


    const clearButton =
        document.getElementById(
            "catalogoClear"
        );


    const customRequestButton =
        document.getElementById(
            "catalogoCustomRequest"
        );


    /* =====================================================
       ELEMENTOS DEL FORMULARIO
    ===================================================== */

    const modal =
        document.getElementById(
            "cotizacionModal"
        );


    const tipoPedido =
        document.getElementById(
            "tipoPedido"
        );


    const productoProyecto =
        document.getElementById(
            "productoProyecto"
        );


    const cantidad =
        document.getElementById(
            "cantidad"
        );


    const descripcion =
        document.getElementById(
            "descripcion"
        );


    const formResponse =
        document.getElementById(
            "formResponse"
        );


    /* =====================================================
       LÍMITES
    ===================================================== */

    const MAX_PER_PRODUCT = 100;

    const MAX_TOTAL_BOXES = 120;


    /* =====================================================
       UTILIDADES
    ===================================================== */

    function getQuantity(card) {

        const valueElement =
            card.querySelector(
                ".quantity-value"
            );


        if (!valueElement) {
            return 0;
        }


        const value =
            Number.parseInt(
                valueElement.textContent,
                10
            );


        if (!Number.isFinite(value)) {
            return 0;
        }


        return Math.max(
            0,
            Math.min(
                value,
                MAX_PER_PRODUCT
            )
        );

    }


    function setQuantity(
        card,
        quantity
    ) {

        const valueElement =
            card.querySelector(
                ".quantity-value"
            );


        if (!valueElement) {
            return;
        }


        const safeQuantity =
            Math.max(
                0,
                Math.min(
                    Number(quantity) || 0,
                    MAX_PER_PRODUCT
                )
            );


        valueElement.textContent =
            String(safeQuantity);


        if (safeQuantity > 0) {

            card.classList.add(
                "has-selection"
            );

        } else {

            card.classList.remove(
                "has-selection"
            );

        }

    }


    function getProduct(card) {

        return {

            code:
                String(
                    card.dataset.code || ""
                ).trim(),

            name:
                String(
                    card.dataset.name || ""
                ).trim(),

            presentation:
                String(
                    card.dataset.presentation || ""
                ).trim(),

            price:
                Number(
                    card.dataset.price || 0
                ),

            quantity:
                getQuantity(card)

        };

    }


    function getSelectedProducts() {

        return catalogItems
            .map(getProduct)
            .filter(
                product =>
                    product.quantity > 0
            );

    }


    function getTotalBoxes(
        selected =
            getSelectedProducts()
    ) {

        return selected.reduce(
            (
                total,
                product
            ) =>
                total +
                product.quantity,
            0
        );

    }


    function getReferencePrice(
        selected =
            getSelectedProducts()
    ) {

        return selected.reduce(
            (
                total,
                product
            ) =>
                total +
                (
                    product.price *
                    product.quantity
                ),
            0
        );

    }


    function formatMoney(value) {

        return new Intl.NumberFormat(
            "es-MX",
            {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        ).format(value);

    }


    function escapeHTML(value) {

        return String(value)
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                "\"",
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }


    /* =====================================================
       ACTUALIZAR RESUMEN
    ===================================================== */

    function updateSummary() {

        const selected =
            getSelectedProducts();


        const totalBoxes =
            getTotalBoxes(
                selected
            );


        const referencePrice =
            getReferencePrice(
                selected
            );


        /* ===============================================
           SIN PRODUCTOS
        =============================================== */

        if (selected.length === 0) {

            if (summaryItems) {

                summaryItems.innerHTML =
                    "";

            }


            if (summaryEmpty) {

                summaryEmpty.hidden =
                    false;

            }


            if (summaryTotals) {

                summaryTotals.hidden =
                    true;

            }


            if (totalBoxesElement) {

                totalBoxesElement.textContent =
                    "0";

            }


            if (referencePriceElement) {

                referencePriceElement.textContent =
                    "$0 MXN";

            }


            return;

        }


        /* ===============================================
           CON PRODUCTOS
        =============================================== */

        if (summaryEmpty) {

            summaryEmpty.hidden =
                true;

        }


        if (summaryTotals) {

            summaryTotals.hidden =
                false;

        }


        if (summaryItems) {

            summaryItems.innerHTML =
                selected
                    .map(
                        product => {

                            const subtotal =
                                product.price *
                                product.quantity;


                            return `
                                <div class="summary-item">

                                    <div class="summary-item-info">

                                        <strong class="summary-item-name">
                                            ${escapeHTML(product.name)}
                                        </strong>

                                        <span class="summary-item-presentation">
                                            ${escapeHTML(product.presentation)}
                                        </span>

                                        <span class="summary-item-price">
                                            ${formatMoney(product.price)}
                                            por caja ·
                                            ${formatMoney(subtotal)}
                                            referencia
                                        </span>

                                    </div>

                                    <span class="summary-item-quantity">
                                        × ${product.quantity}
                                    </span>

                                </div>
                            `;

                        }
                    )
                    .join("");

        }


        if (totalBoxesElement) {

            totalBoxesElement.textContent =
                String(totalBoxes);

        }


        if (referencePriceElement) {

            referencePriceElement.textContent =
                `${formatMoney(referencePrice)} MXN`;

        }

    }


    /* =====================================================
       COMPROBAR LÍMITE TOTAL
    ===================================================== */

    function canAddAnotherBox() {

        return (
            getTotalBoxes() <
            MAX_TOTAL_BOXES
        );

    }


    /* =====================================================
       BOTONES + / -
    ===================================================== */

    catalogItems.forEach(
        card => {

            const plusButton =
                card.querySelector(
                    ".quantity-plus"
                );


            const minusButton =
                card.querySelector(
                    ".quantity-minus"
                );


            const addButton =
                card.querySelector(
                    ".catalogo-add"
                );


            /* ===========================================
               SUMAR
            =========================================== */

            if (plusButton) {

                plusButton.addEventListener(
                    "click",
                    () => {

                        const current =
                            getQuantity(card);


                        if (
                            current >=
                            MAX_PER_PRODUCT
                        ) {

                            return;

                        }


                        if (
                            !canAddAnotherBox()
                        ) {

                            return;

                        }


                        setQuantity(
                            card,
                            current + 1
                        );


                        updateSummary();

                    }
                );

            }


            /* ===========================================
               RESTAR
            =========================================== */

            if (minusButton) {

                minusButton.addEventListener(
                    "click",
                    () => {

                        const current =
                            getQuantity(card);


                        if (current <= 0) {

                            return;

                        }


                        setQuantity(
                            card,
                            current - 1
                        );


                        updateSummary();

                    }
                );

            }


            /* ===========================================
               AGREGAR PRODUCTO
            =========================================== */

            if (addButton) {

                addButton.addEventListener(
                    "click",
                    () => {

                        const current =
                            getQuantity(card);


                        if (
                            current >=
                            MAX_PER_PRODUCT
                        ) {

                            return;

                        }


                        if (
                            !canAddAnotherBox()
                        ) {

                            return;

                        }


                        const next =
                            current === 0
                                ? 1
                                : current + 1;


                        setQuantity(
                            card,
                            next
                        );


                        updateSummary();


                        /*
                           En móvil mostramos el resumen
                           después de agregar.
                        */

                        if (
                            window.matchMedia(
                                "(max-width: 620px)"
                            ).matches
                        ) {

                            const summary =
                                document.getElementById(
                                    "catalogoSummary"
                                );


                            if (summary) {

                                summary.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                });

                            }

                        }

                    }
                );

            }

        }
    );


    /* =====================================================
       VACIAR SELECCIÓN
    ===================================================== */

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                catalogItems.forEach(
                    card => {

                        setQuantity(
                            card,
                            0
                        );

                    }
                );


                updateSummary();

            }
        );

    }


    /* =====================================================
       ABRIR MODAL
    ===================================================== */

    function openFormModal() {

        if (!modal) {
            return;
        }


        modal.classList.add(
            "active"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );

    }


    /* =====================================================
       LIMPIAR RESPUESTA ANTERIOR
    ===================================================== */

    function clearFormResponse() {

        if (!formResponse) {
            return;
        }


        formResponse.textContent =
            "";


        formResponse.classList.remove(
            "success",
            "error"
        );

    }


    /* =====================================================
       AVISAR A APP.JS DEL MODO DE APERTURA

       Esto permite distinguir:

       CATALOG
       CUSTOM
    ===================================================== */

    function setSaritaRequestMode(
        mode
    ) {

        window.SARITA_REQUEST_MODE =
            mode;


        window.dispatchEvent(
            new CustomEvent(
                "sarita:request-mode",
                {
                    detail: {
                        mode: mode
                    }
                }
            )
        );

    }


    /* =====================================================
       ACTIVAR PEDIDO PROGRAMÁTICAMENTE
    ===================================================== */

    function selectOrderMode() {

        if (!tipoPedido) {
            return;
        }


        tipoPedido.checked =
            true;


        tipoPedido.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );

    }


    /* =====================================================
       DESCRIPCIÓN COMPACTA PARA BACKEND

       Evitamos superar los 300 caracteres del campo
       productoProyecto cuando hay varios productos.
    ===================================================== */

    function getCompactProductName(
        product
    ) {

        const code =
            String(
                product.code || ""
            ).toUpperCase();


        const compactNames = {

            "SAR-CAL-01":
                "Calaveras",

            "SAR-PDM-01":
                "Pan de muerto",

            "SAR-MIN-01":
                "Mini barritas",

            "SAR-COR-01":
                "Corazón diamante",

            "SAR-LDG-01":
                "Lenguas de gato"

        };


        if (
            compactNames[code]
        ) {

            return compactNames[code];

        }


        return (
            product.name ||
            product.code ||
            "Chocolate"
        );

    }


    function buildProductDescription(
        selected
    ) {

        return selected
            .map(
                product =>
                    `${getCompactProductName(product)} x${product.quantity}`
            )
            .join(" | ");

    }


    /* =====================================================
       DESCRIPCIÓN DETALLADA DEL CATÁLOGO

       Esta información va en descripción y no en
       productoProyecto, por lo que conservamos
       presentación y precio de referencia.
    ===================================================== */

    function buildCatalogDetails(
        selected,
        referencePrice
    ) {

        const details =
            selected
                .map(
                    product => {

                        const subtotal =
                            product.price *
                            product.quantity;


                        return (
                            `${product.quantity} × ` +
                            `${product.name} — ` +
                            `${product.presentation} — ` +
                            `${formatMoney(subtotal)}`
                        );

                    }
                )
                .join("\n");


        return (
            "Selección realizada desde el catálogo web:\n\n" +
            details +
            "\n\n" +
            "Precio de referencia de la selección: " +
            `${formatMoney(referencePrice)} MXN. ` +
            "Precio final y disponibilidad sujetos a confirmación."
        );

    }


    /* =====================================================
       CONTINUAR CON SOLICITUD DE CATÁLOGO
    ===================================================== */

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            () => {

                const selected =
                    getSelectedProducts();


                if (
                    selected.length === 0
                ) {

                    return;

                }


                const totalBoxes =
                    getTotalBoxes(
                        selected
                    );


                if (
                    totalBoxes < 1 ||
                    totalBoxes >
                        MAX_TOTAL_BOXES
                ) {

                    return;

                }


                const referencePrice =
                    getReferencePrice(
                        selected
                    );


                const productDescription =
                    buildProductDescription(
                        selected
                    );


                /* =======================================
                   IMPORTANTE:

                   Avisamos PRIMERO a app.js que este
                   PEDIDO viene del catálogo.

                   De esta forma app.js NO lo devuelve
                   nuevamente al catálogo.
                ======================================= */

                setSaritaRequestMode(
                    "CATALOG"
                );


                /* =======================================
                   PEDIDO
                ======================================= */

                selectOrderMode();


                /* =======================================
                   PRODUCTOS COMPACTOS
                ======================================= */

                if (productoProyecto) {

                    productoProyecto.value =
                        productDescription;


                    productoProyecto.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                /* =======================================
                   CANTIDAD TOTAL
                ======================================= */

                if (cantidad) {

                    cantidad.value =
                        totalBoxes === 1
                            ? "1 caja en total"
                            : `${totalBoxes} cajas en total`;


                    cantidad.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                /* =======================================
                   DETALLE DEL PEDIDO

                   Aquí sí conservamos la información
                   completa del catálogo.
                ======================================= */

                if (descripcion) {

                    descripcion.value =
                        buildCatalogDetails(
                            selected,
                            referencePrice
                        );


                    descripcion.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                clearFormResponse();


                openFormModal();


                /* =======================================
                   FOCO
                ======================================= */

                window.setTimeout(
                    () => {

                        const nombre =
                            document.getElementById(
                                "nombre"
                            );


                        if (
                            nombre &&
                            !nombre.value.trim()
                        ) {

                            nombre.focus();

                            return;

                        }


                        const telefono =
                            document.getElementById(
                                "telefono"
                            );


                        if (
                            telefono &&
                            !telefono.value.trim()
                        ) {

                            telefono.focus();

                            return;

                        }


                        const email =
                            document.getElementById(
                                "email"
                            );


                        if (
                            email &&
                            !email.value.trim()
                        ) {

                            email.focus();

                            return;

                        }


                        const fecha =
                            document.getElementById(
                                "fechaEvento"
                            );


                        if (fecha) {

                            fecha.focus();

                        }

                    },
                    120
                );

            }
        );

    }


    /* =====================================================
       SOLICITAR DISEÑO PERSONALIZADO
    ===================================================== */

    if (customRequestButton) {

        customRequestButton.addEventListener(
            "click",
            () => {

                /*
                   Este sigue siendo PEDIDO para Apps Script.

                   CUSTOM solamente sirve para que la
                   interfaz sepa que NO es un producto
                   existente del catálogo.
                */

                setSaritaRequestMode(
                    "CUSTOM"
                );


                selectOrderMode();


                /*
                   No arrastramos ningún producto del
                   catálogo al diseño personalizado.
                */

                if (productoProyecto) {

                    productoProyecto.value =
                        "";


                    productoProyecto.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                if (cantidad) {

                    cantidad.value =
                        "";


                    cantidad.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                if (descripcion) {

                    descripcion.value =
                        "";


                    descripcion.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                clearFormResponse();


                openFormModal();


                /* =======================================
                   FOCO
                ======================================= */

                window.setTimeout(
                    () => {

                        const nombre =
                            document.getElementById(
                                "nombre"
                            );


                        if (
                            nombre &&
                            !nombre.value.trim()
                        ) {

                            nombre.focus();

                            return;

                        }


                        if (productoProyecto) {

                            productoProyecto.focus();

                        }

                    },
                    120
                );

            }
        );

    }


    /* =====================================================
       RESETEAR MODO EXTERNO

       app.js podrá disparar este evento después de
       enviar correctamente una solicitud.
    ===================================================== */

    window.addEventListener(
        "sarita:reset-catalog",
        () => {

            catalogItems.forEach(
                card => {

                    setQuantity(
                        card,
                        0
                    );

                }
            );


            updateSummary();


            window.SARITA_REQUEST_MODE =
                "";

        }
    );


    /* =====================================================
       ESTADO INICIAL
    ===================================================== */

    updateSummary();

});
