/* =========================================================
   CHOCOLATE ARTÍSTICO SARITA
   CATÁLOGO MULTIPRODUCTO
   2026
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
       ELEMENTOS DEL FORMULARIO EXISTENTE
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
            selected.reduce(
                (
                    total,
                    product
                ) =>
                    total +
                    product.quantity,
                0
            );


        const referencePrice =
            selected.reduce(
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


        /* ===============================================
           SIN PRODUCTOS
        =============================================== */

        if (selected.length === 0) {

            if (summaryItems) {
                summaryItems.innerHTML = "";
            }

            if (summaryEmpty) {
                summaryEmpty.hidden = false;
            }

            if (summaryTotals) {
                summaryTotals.hidden = true;
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
            summaryEmpty.hidden = true;
        }

        if (summaryTotals) {
            summaryTotals.hidden = false;
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

                        /*
                           Si todavía no está seleccionado,
                           lo agregamos con una caja.

                           Si ya tiene cantidad, agregamos
                           una caja adicional.
                        */

                        const next =
                            current === 0
                                ? 1
                                : current + 1;


                        if (
                            next >
                            MAX_PER_PRODUCT
                        ) {
                            return;
                        }


                        setQuantity(
                            card,
                            next
                        );

                        updateSummary();


                        /*
                           En móvil desplazamos suavemente
                           hacia el resumen solamente cuando
                           existe poco espacio horizontal.
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

        formResponse.textContent = "";

        formResponse.classList.remove(
            "success",
            "error"
        );

    }


    /* =====================================================
       ACTIVAR MODO PEDIDO
    ===================================================== */

    function selectOrderMode() {

        if (!tipoPedido) {
            return;
        }

        tipoPedido.checked = true;

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
       CONSTRUIR DESGLOSE PARA EL BACKEND
    ===================================================== */

    function buildProductDescription(
        selected
    ) {

        return selected
            .map(
                product =>
                    `${product.quantity} × ${product.name} — ${product.presentation} — ${formatMoney(product.price)} MXN`
            )
            .join("\n");

    }


    /* =====================================================
       CONTINUAR CON SOLICITUD
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
                    selected.reduce(
                        (
                            total,
                            product
                        ) =>
                            total +
                            product.quantity,
                        0
                    );


                const referencePrice =
                    selected.reduce(
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


                const productDescription =
                    buildProductDescription(
                        selected
                    );


                /* =======================================
                   PEDIDO
                ======================================= */

                selectOrderMode();


                /* =======================================
                   PRODUCTOS
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
                   CANTIDAD
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
                   DESCRIPCIÓN
                   NO SOBREESCRIBIR SI EL CLIENTE
                   YA HABÍA ESCRITO ALGO
                ======================================= */

                if (
                    descripcion &&
                    !descripcion.value.trim()
                ) {

                    descripcion.value =
                        `Selección realizada desde el catálogo web. Precio de referencia de la selección: ${formatMoney(referencePrice)} MXN. Precio final y disponibilidad sujetos a confirmación.`;

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


                        if (cantidad) {
                            cantidad.focus();
                        }

                    },
                    120
                );

            }
        );

    }


    /* =====================================================
       SOLICITUD PERSONALIZADA
    ===================================================== */

    if (customRequestButton) {

        customRequestButton.addEventListener(
            "click",
            () => {

                selectOrderMode();


                /*
                   En una solicitud personalizada
                   no arrastramos productos del catálogo.
                */

                if (productoProyecto) {

                    productoProyecto.value =
                        "Diseño personalizado / pedido especial";

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
                    cantidad.value = "";
                }


                clearFormResponse();

                openFormModal();


                window.setTimeout(
                    () => {

                        const nombre =
                            document.getElementById(
                                "nombre"
                            );

                        if (nombre) {
                            nombre.focus();
                        }

                    },
                    120
                );

            }
        );

    }


    /* =====================================================
       ESTADO INICIAL
    ===================================================== */

    updateSummary();

});
