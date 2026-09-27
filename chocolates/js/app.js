/* =========================================================
   CHOCOLATE ARTÍSTICO SARITA
   APP.JS 2026

   PEDIDOS DE CATÁLOGO
   DISEÑOS PERSONALIZADOS
   COLABORACIONES
========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const COTIZACION_ENDPOINT =
        "https://script.google.com/macros/s/AKfycbyuFPdF6OXOFT1J8MoUzU3ocvU-AXr43-aH1BPvQPx7kx46KzB-_x5OlZE2-rIkf-w/exec";

    const COTIZACION_TOKEN =
        "SARITA2026";

    const GA_MEASUREMENT_ID =
        "G-EGZ2977YBH";

    const CONSENT_KEY =
        "ga18_cookie_consent";


    /* =====================================================
       ELEMENTOS DEL MODAL
    ===================================================== */

    const modal =
        document.getElementById(
            "cotizacionModal"
        );

    const openBtn =
        document.getElementById(
            "openModal"
        );

    const openNavBtn =
        document.getElementById(
            "openModalNav"
        );

    const openCtaBtn =
        document.getElementById(
            "openModalCta"
        );

    const openAlianzaBtn =
        document.getElementById(
            "openAlianzaModal"
        );

    const openEdicionBtn =
        document.getElementById(
            "openEdicionModal"
        );

    const closeBtn =
        document.getElementById(
            "closeModal"
        );

    const cancelBtn =
        document.getElementById(
            "cancelModalBtn"
        );


    /* =====================================================
       ELEMENTOS NUEVOS DEL MODAL
    ===================================================== */

    const solicitudEyebrow =
        document.getElementById(
            "solicitudEyebrow"
        );

    const solicitudSubtitle =
        document.getElementById(
            "solicitudSubtitle"
        );

    const cotizacionTitle =
        document.getElementById(
            "cotizacionTitle"
        );

    const requestTypeGroup =
        document.getElementById(
            "requestTypeGroup"
        );

    const customDesignInfo =
        document.getElementById(
            "customDesignInfo"
        );


    /* =====================================================
       FORMULARIO
    ===================================================== */

    const form =
        document.getElementById(
            "cotizacionForm"
        );

    const tipoPedido =
        document.getElementById(
            "tipoPedido"
        );

    const tipoColaboracion =
        document.getElementById(
            "tipoColaboracion"
        );

    const productoProyecto =
        document.getElementById(
            "productoProyecto"
        );

    const productoProyectoLabel =
        document.getElementById(
            "productoProyectoLabel"
        );

    const productoProyectoHelper =
        document.getElementById(
            "productoProyectoHelper"
        );

    const cantidad =
        document.getElementById(
            "cantidad"
        );

    const cantidadLabel =
        document.getElementById(
            "cantidadLabel"
        );

    const fechaEvento =
        document.getElementById(
            "fechaEvento"
        );

    const fechaLabel =
        document.getElementById(
            "fechaLabel"
        );

    const descripcion =
        document.getElementById(
            "descripcion"
        );

    const descripcionLabel =
        document.getElementById(
            "descripcionLabel"
        );

    const requestInfo =
        document.getElementById(
            "requestInfo"
        );

    const formResponse =
        document.getElementById(
            "formResponse"
        );

    const submitSolicitud =
        document.getElementById(
            "submitSolicitud"
        );


    /* =====================================================
       ESTADO
    ===================================================== */

    let lastFocusedElement =
        null;

    let internalTypeChange =
        false;


    /*
       Valores posibles:

       ""
       DIRECT
       CATALOG
       CUSTOM
       COLLABORATION
       SPECIAL
    */

    function getRequestMode() {

        return String(
            window.SARITA_REQUEST_MODE ||
            ""
        ).toUpperCase();

    }


    function setRequestMode(mode) {

        window.SARITA_REQUEST_MODE =
            String(
                mode || ""
            ).toUpperCase();

    }


    /* =====================================================
       UTILIDADES
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


    function setFormResponse(
        message,
        type = ""
    ) {

        if (!formResponse) {
            return;
        }

        formResponse.textContent =
            message;

        formResponse.classList.remove(
            "success",
            "error"
        );

        if (type) {

            formResponse.classList.add(
                type
            );

        }

    }


    function getSelectedType() {

        const selected =
            document.querySelector(
                'input[name="tipo"]:checked'
            );

        return selected
            ? selected.value
            : "";

    }


    function scrollToCatalog() {

        const catalog =
            document.getElementById(
                "catalogo"
            );

        if (!catalog) {
            return;
        }

        catalog.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =====================================================
       CERRAR MODAL
    ===================================================== */

    function closeModal(
        restoreFocus = true
    ) {

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );


        if (
            restoreFocus &&
            lastFocusedElement &&
            typeof lastFocusedElement.focus ===
                "function"
        ) {

            window.setTimeout(
                () => {

                    try {

                        lastFocusedElement.focus();

                    } catch (error) {

                        /* Sin acción */

                    }

                },
                80
            );

        }

    }


    /* =====================================================
       ABRIR MODAL
    ===================================================== */

    function openModal(
        preferredType = "",
        preferredMode = ""
    ) {

        if (!modal) {
            return;
        }


        lastFocusedElement =
            document.activeElement;


        clearFormResponse();


        if (preferredMode) {

            setRequestMode(
                preferredMode
            );

        }


        if (preferredType) {

            selectRequestType(
                preferredType
            );

        } else {

            updateRequestType();

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


        window.setTimeout(
            () => {

                const firstFocusable =
                    modal.querySelector(
                        "input:not([type='hidden']):not([tabindex='-1']), button, textarea"
                    );

                if (firstFocusable) {

                    firstFocusable.focus();

                }

            },
            100
        );

    }


    /* =====================================================
       SELECCIONAR TIPO PROGRAMÁTICAMENTE
    ===================================================== */

    function selectRequestType(type) {

        internalTypeChange =
            true;


        if (
            type === "PEDIDO" &&
            tipoPedido
        ) {

            tipoPedido.checked =
                true;

        }


        if (
            type === "COLABORACION" &&
            tipoColaboracion
        ) {

            tipoColaboracion.checked =
                true;

        }


        updateRequestType();


        internalTypeChange =
            false;

    }


    /* =====================================================
       INTERFAZ: SIN TIPO
    ===================================================== */

    function setDefaultInterface() {

        if (solicitudEyebrow) {

            solicitudEyebrow.textContent =
                "CUÉNTANOS TU IDEA";

        }


        if (cotizacionTitle) {

            cotizacionTitle.textContent =
                "Solicitud Sarita";

        }


        if (solicitudSubtitle) {

            solicitudSubtitle.textContent =
                "Puedes elegir productos de nuestro catálogo, solicitar un diseño personalizado o proponernos una colaboración.";

        }


        if (requestTypeGroup) {

            requestTypeGroup.hidden =
                false;

        }


        if (customDesignInfo) {

            customDesignInfo.hidden =
                true;

        }


        if (productoProyectoLabel) {

            productoProyectoLabel.textContent =
                "¿Qué necesitas o qué proyecto tienes en mente?";

        }


        if (productoProyecto) {

            productoProyecto.readOnly =
                false;

            productoProyecto.placeholder =
                "Describe brevemente lo que necesitas";

        }


        if (productoProyectoHelper) {

            productoProyectoHelper.textContent =
                "Selecciona el tipo de solicitud para adaptar este formulario.";

        }


        if (cantidadLabel) {

            cantidadLabel.textContent =
                "Cantidad aproximada";

        }


        if (cantidad) {

            cantidad.readOnly =
                false;

            cantidad.placeholder =
                "Ej. 1 caja, 50 piezas...";

        }


        if (fechaLabel) {

            fechaLabel.textContent =
                "Fecha en que lo necesitas";

        }


        if (descripcionLabel) {

            descripcionLabel.textContent =
                "Cuéntanos cómo lo imaginas";

        }


        if (descripcion) {

            descripcion.readOnly =
                false;

            descripcion.placeholder =
                "Temática, colores, presentación, ocasión o cualquier detalle que quieras compartir.";

        }


        if (requestInfo) {

            requestInfo.textContent =
                "Selecciona Pedido o Colaboración para adaptar la solicitud a lo que necesitas.";

        }


        if (submitSolicitud) {

            submitSolicitud.textContent =
                "Enviar solicitud";

        }

    }


    /* =====================================================
       INTERFAZ: PEDIDO DESDE CATÁLOGO
    ===================================================== */

    function setCatalogInterface() {

        if (solicitudEyebrow) {

            solicitudEyebrow.textContent =
                "TU SELECCIÓN";

        }


        if (cotizacionTitle) {

            cotizacionTitle.textContent =
                "Completa tu solicitud";

        }


        if (solicitudSubtitle) {

            solicitudSubtitle.textContent =
                "Ya tenemos los chocolates que elegiste. Completa tus datos para que podamos confirmar disponibilidad, precio y fecha.";

        }


        /*
           Ocultamos los radios porque el cliente
           ya eligió el camino desde el catálogo.
        */

        if (requestTypeGroup) {

            requestTypeGroup.hidden =
                true;

        }


        if (customDesignInfo) {

            customDesignInfo.hidden =
                true;

        }


        if (productoProyectoLabel) {

            productoProyectoLabel.textContent =
                "Productos seleccionados";

        }


        if (productoProyecto) {

            productoProyecto.readOnly =
                true;

            productoProyecto.placeholder =
                "";

        }


        if (productoProyectoHelper) {

            productoProyectoHelper.textContent =
                "Esta selección proviene del catálogo. Para cambiar productos, cierra esta ventana y modifica tu selección.";

        }


        if (cantidadLabel) {

            cantidadLabel.textContent =
                "Cantidad seleccionada";

        }


        if (cantidad) {

            cantidad.readOnly =
                true;

        }


        if (fechaLabel) {

            fechaLabel.textContent =
                "Fecha en que lo necesitas";

        }


        if (descripcionLabel) {

            descripcionLabel.textContent =
                "Detalles de tu solicitud";

        }


        if (descripcion) {

            /*
               Dejamos editable la descripción porque
               el cliente puede agregar instrucciones.
            */

            descripcion.readOnly =
                false;

        }


        if (requestInfo) {

            requestInfo.textContent =
                "El precio mostrado en el catálogo es de referencia. Confirmaremos disponibilidad, precio final y fecha antes de iniciar el pedido.";

        }


        if (submitSolicitud) {

            submitSolicitud.textContent =
                "Enviar pedido";

        }

    }


    /* =====================================================
       INTERFAZ: DISEÑO PERSONALIZADO
    ===================================================== */

    function setCustomInterface() {

        if (solicitudEyebrow) {

            solicitudEyebrow.textContent =
                "DISEÑO PERSONALIZADO";

        }


        if (cotizacionTitle) {

            cotizacionTitle.textContent =
                "Cuéntanos tu idea";

        }


        if (solicitudSubtitle) {

            solicitudSubtitle.textContent =
                "¿Tienes una idea diferente a nuestro catálogo? Cuéntanos qué chocolate te gustaría crear y revisaremos contigo las posibilidades.";

        }


        if (requestTypeGroup) {

            requestTypeGroup.hidden =
                true;

        }


        if (customDesignInfo) {

            customDesignInfo.hidden =
                false;

        }


        if (productoProyectoLabel) {

            productoProyectoLabel.textContent =
                "¿Qué diseño tienes en mente?";

        }


        if (productoProyecto) {

            productoProyecto.readOnly =
                false;

            productoProyecto.placeholder =
                "Ej. Calaveras para una boda, chocolates con temática de dinosaurios, piezas con logotipo...";

        }


        if (productoProyectoHelper) {

            productoProyectoHelper.textContent =
                "Describe brevemente la idea principal. Más abajo podrás contarnos todos los detalles.";

        }


        if (cantidadLabel) {

            cantidadLabel.textContent =
                "Cantidad aproximada";

        }


        if (cantidad) {

            cantidad.readOnly =
                false;

            cantidad.placeholder =
                "Ej. 20 piezas, 5 cajas, 100 invitados...";

        }


        if (fechaLabel) {

            fechaLabel.textContent =
                "¿Para qué fecha lo necesitas?";

        }


        if (descripcionLabel) {

            descripcionLabel.textContent =
                "Explícanos cómo quieres tu diseño";

        }


        if (descripcion) {

            descripcion.readOnly =
                false;

            descripcion.placeholder =
                "Cuéntanos la ocasión, temática, colores, forma, personajes, texto, presentación, tamaño o cualquier detalle que nos ayude a imaginar lo que necesitas.";

        }


        if (requestInfo) {

            requestInfo.textContent =
                "Los diseños personalizados están sujetos a revisión de viabilidad, disponibilidad, tiempo de elaboración y cotización. Nos comunicaremos contigo antes de iniciar cualquier trabajo.";

        }


        if (submitSolicitud) {

            submitSolicitud.textContent =
                "Enviar mi idea";

        }

    }


    /* =====================================================
       INTERFAZ: COLABORACIÓN
    ===================================================== */

    function setCollaborationInterface() {

        if (solicitudEyebrow) {

            solicitudEyebrow.textContent =
                "COLABOREMOS";

        }


        if (cotizacionTitle) {

            cotizacionTitle.textContent =
                "Propuesta de colaboración";

        }


        if (solicitudSubtitle) {

            solicitudSubtitle.textContent =
                "Cuéntanos sobre tu proyecto, producción, evento, marca o propuesta y cómo imaginas la participación de Chocolate Artístico Sarita.";

        }


        if (requestTypeGroup) {

            requestTypeGroup.hidden =
                false;

        }


        if (customDesignInfo) {

            customDesignInfo.hidden =
                true;

        }


        if (productoProyectoLabel) {

            productoProyectoLabel.textContent =
                "Proyecto, evento o colaboración";

        }


        if (productoProyecto) {

            productoProyecto.readOnly =
                false;

            productoProyecto.placeholder =
                "Ej. Obra de teatro, marca, producción, evento o proyecto cultural";

        }


        if (productoProyectoHelper) {

            productoProyectoHelper.textContent =
                "Indícanos el nombre de tu proyecto, producción, evento, marca o propuesta.";

        }


        if (cantidadLabel) {

            cantidadLabel.textContent =
                "Cantidad o alcance aproximado";

        }


        if (cantidad) {

            cantidad.readOnly =
                false;

            cantidad.placeholder =
                "Ej. 100 piezas, 50 invitados, por definir...";

        }


        if (fechaLabel) {

            fechaLabel.textContent =
                "Fecha del proyecto o evento";

        }


        if (descripcionLabel) {

            descripcionLabel.textContent =
                "Cuéntanos tu propuesta";

        }


        if (descripcion) {

            descripcion.readOnly =
                false;

            descripcion.placeholder =
                "Explícanos en qué consiste el proyecto, qué tipo de colaboración imaginas y cómo te gustaría integrar Chocolate Artístico Sarita.";

        }


        if (requestInfo) {

            requestInfo.textContent =
                "Revisaremos la información de tu proyecto y nos comunicaremos contigo para conocer más detalles y valorar la propuesta.";

        }


        if (submitSolicitud) {

            submitSolicitud.textContent =
                "Enviar colaboración";

        }

    }


    /* =====================================================
       ACTUALIZAR FORMULARIO SEGÚN TIPO Y MODO
    ===================================================== */

    function updateRequestType() {

        const tipo =
            getSelectedType();

        const mode =
            getRequestMode();


        clearFormResponse();


        /*
           PEDIDO DESDE CATÁLOGO
        */

        if (
            tipo === "PEDIDO" &&
            mode === "CATALOG"
        ) {

            setCatalogInterface();

            return;

        }


        /*
           DISEÑO PERSONALIZADO
        */

        if (
            tipo === "PEDIDO" &&
            mode === "CUSTOM"
        ) {

            setCustomInterface();

            return;

        }


        /*
           PEDIDO DIRECTO.

           Aquí NO mostramos un formulario vacío.
           Lo mandaremos al catálogo desde el evento
           change del radio.
        */

        if (
            tipo === "PEDIDO"
        ) {

            setDefaultInterface();

            return;

        }


        /*
           COLABORACIÓN
        */

        if (
            tipo === "COLABORACION"
        ) {

            setRequestMode(
                "COLLABORATION"
            );

            setCollaborationInterface();

            return;

        }


        setDefaultInterface();

    }


    /* =====================================================
       PEDIDO SELECCIONADO DIRECTAMENTE

       Si el usuario abrió el formulario desde:
       - navegación
       - CTA
       - botón general

       y posteriormente selecciona "Pedido",
       lo llevamos al catálogo.

       Si PEDIDO fue marcado por catalogo.js,
       NO hacemos esta redirección.
    ===================================================== */

    if (tipoPedido) {

        tipoPedido.addEventListener(
            "change",
            () => {

                if (
                    !tipoPedido.checked
                ) {

                    return;

                }


                const mode =
                    getRequestMode();


                if (
                    mode === "CATALOG" ||
                    mode === "CUSTOM" ||
                    mode === "SPECIAL"
                ) {

                    updateRequestType();

                    return;

                }


                /*
                   Si el cambio fue programático desde
                   otra función interna tampoco hacemos
                   una navegación accidental.
                */

                if (
                    internalTypeChange &&
                    mode
                ) {

                    updateRequestType();

                    return;

                }


                /*
                   PEDIDO DIRECTO
                */

                setRequestMode(
                    "DIRECT"
                );


                closeModal(
                    false
                );


                window.setTimeout(
                    () => {

                        scrollToCatalog();

                    },
                    120
                );

            }
        );

    }


    if (tipoColaboracion) {

        tipoColaboracion.addEventListener(
            "change",
            () => {

                if (
                    !tipoColaboracion.checked
                ) {

                    return;

                }


                setRequestMode(
                    "COLLABORATION"
                );


                updateRequestType();

            }
        );

    }


    /* =====================================================
       CAMBIO DE MODO DESDE CATALOGO.JS
    ===================================================== */

    window.addEventListener(
        "sarita:request-mode",
        event => {

            const mode =
                event &&
                event.detail
                    ? event.detail.mode
                    : "";


            setRequestMode(
                mode
            );


            /*
               catalogo.js enviará después el change
               de PEDIDO, pero actualizamos también
               aquí para mantener sincronizada la UI.
            */

            updateRequestType();

        }
    );


    /* =====================================================
       BOTONES GENERALES PARA ABRIR MODAL
    ===================================================== */

    function openGeneralModal() {

        /*
           Una apertura general empieza sin contexto.
        */

        setRequestMode(
            ""
        );


        if (tipoPedido) {

            tipoPedido.checked =
                false;

        }


        if (tipoColaboracion) {

            tipoColaboracion.checked =
                false;

        }


        updateRequestType();


        openModal();

    }


    [
        openBtn,
        openNavBtn,
        openCtaBtn
    ].forEach(
        button => {

            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    openGeneralModal();

                }
            );

        }
    );


    /* =====================================================
       ALIANZA / COLABORACIÓN
    ===================================================== */

    if (openAlianzaBtn) {

        openAlianzaBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();


                setRequestMode(
                    "COLLABORATION"
                );


                openModal(
                    "COLABORACION",
                    "COLLABORATION"
                );

            }
        );

    }


    /* =====================================================
       EDICIÓN ESPECIAL

       Conservamos el comportamiento existente.
    ===================================================== */

    if (openEdicionBtn) {

        openEdicionBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();


                setRequestMode(
                    "SPECIAL"
                );


                openModal(
                    "PEDIDO",
                    "SPECIAL"
                );


                if (productoProyecto) {

                    productoProyecto.value =
                        "Edición especial Calaveras Sandungueras";

                }


                if (cantidad) {

                    cantidad.value =
                        "";

                }


                if (descripcion) {

                    descripcion.value =
                        "Solicitud relacionada con la edición especial Calaveras Sandungueras.";

                }


                /*
                   SPECIAL se presenta como diseño/pedido
                   especial y no como selección de catálogo.
                */

                setCustomInterface();


                if (solicitudEyebrow) {

                    solicitudEyebrow.textContent =
                        "EDICIÓN ESPECIAL";

                }


                if (cotizacionTitle) {

                    cotizacionTitle.textContent =
                        "Calaveras Sandungueras";

                }

            }
        );

    }


    /* =====================================================
       CERRAR MODAL
    ===================================================== */

    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            () => {

                closeModal();

            }
        );

    }


    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            () => {

                closeModal();

            }
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal &&
                modal.classList.contains(
                    "active"
                )
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       FECHA MÍNIMA
    ===================================================== */

    if (fechaEvento) {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );


        fechaEvento.min =
            `${year}-${month}-${day}`;

    }


    /* =====================================================
       VALIDACIONES
    ===================================================== */

    function isValidName(value) {

        const clean =
            String(
                value || ""
            ).trim();

        return (
            clean.length >= 2 &&
            clean.length <= 100
        );

    }


    function isValidEmail(value) {

        const clean =
            String(
                value || ""
            ).trim();

        return (
            clean.length <= 150 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                clean
            )
        );

    }


    function isValidPhone(value) {

        const clean =
            String(
                value || ""
            ).trim();

        if (
            clean.length < 7 ||
            clean.length > 30
        ) {

            return false;

        }


        return /^[0-9+\s().-]+$/.test(
            clean
        );

    }


    /* =====================================================
       ENVIAR FORMULARIO
    ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                clearFormResponse();


                const tipo =
                    getSelectedType();

                const mode =
                    getRequestMode();


                /* ==========================================
                   SEGURIDAD DEL FLUJO PEDIDO
                =========================================== */

                if (
                    tipo === "PEDIDO" &&
                    ![
                        "CATALOG",
                        "CUSTOM",
                        "SPECIAL"
                    ].includes(mode)
                ) {

                    closeModal(
                        false
                    );

                    scrollToCatalog();

                    return;

                }


                /* ==========================================
                   CAMPOS
                =========================================== */

                const nombreInput =
                    document.getElementById(
                        "nombre"
                    );

                const emailInput =
                    document.getElementById(
                        "email"
                    );

                const telefonoInput =
                    document.getElementById(
                        "telefono"
                    );

                const websiteInput =
                    document.getElementById(
                        "website"
                    );

                const consentimiento =
                    document.getElementById(
                        "consentimiento"
                    );


                const nombre =
                    nombreInput
                        ? nombreInput.value.trim()
                        : "";

                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";

                const telefono =
                    telefonoInput
                        ? telefonoInput.value.trim()
                        : "";

                const producto =
                    productoProyecto
                        ? productoProyecto.value.trim()
                        : "";

                const cantidadValue =
                    cantidad
                        ? cantidad.value.trim()
                        : "";

                const fecha =
                    fechaEvento
                        ? fechaEvento.value
                        : "";

                const descripcionValue =
                    descripcion
                        ? descripcion.value.trim()
                        : "";

                const website =
                    websiteInput
                        ? websiteInput.value.trim()
                        : "";


                /* ==========================================
                   VALIDACIÓN
                =========================================== */

                if (
                    tipo !== "PEDIDO" &&
                    tipo !== "COLABORACION"
                ) {

                    setFormResponse(
                        "Selecciona el tipo de solicitud.",
                        "error"
                    );

                    return;

                }


                if (
                    !isValidName(
                        nombre
                    )
                ) {

                    setFormResponse(
                        "Ingresa un nombre válido.",
                        "error"
                    );

                    if (nombreInput) {

                        nombreInput.focus();

                    }

                    return;

                }


                if (
                    !isValidEmail(
                        email
                    )
                ) {

                    setFormResponse(
                        "Ingresa un correo electrónico válido.",
                        "error"
                    );

                    if (emailInput) {

                        emailInput.focus();

                    }

                    return;

                }


                if (
                    !isValidPhone(
                        telefono
                    )
                ) {

                    setFormResponse(
                        "Ingresa un teléfono o WhatsApp válido.",
                        "error"
                    );

                    if (telefonoInput) {

                        telefonoInput.focus();

                    }

                    return;

                }


                if (
                    !producto ||
                    producto.length > 300
                ) {

                    setFormResponse(
                        "Describe brevemente el producto, diseño o proyecto.",
                        "error"
                    );

                    if (productoProyecto) {

                        productoProyecto.focus();

                    }

                    return;

                }


                if (
                    !cantidadValue ||
                    cantidadValue.length > 120
                ) {

                    setFormResponse(
                        "Indica una cantidad aproximada.",
                        "error"
                    );

                    if (cantidad) {

                        cantidad.focus();

                    }

                    return;

                }


                if (!fecha) {

                    setFormResponse(
                        "Selecciona una fecha.",
                        "error"
                    );

                    if (fechaEvento) {

                        fechaEvento.focus();

                    }

                    return;

                }


                if (
                    descripcionValue.length >
                    2000
                ) {

                    setFormResponse(
                        "La descripción es demasiado larga.",
                        "error"
                    );

                    if (descripcion) {

                        descripcion.focus();

                    }

                    return;

                }


                if (
                    consentimiento &&
                    !consentimiento.checked
                ) {

                    setFormResponse(
                        "Debes aceptar los Términos y Condiciones y el Aviso de Privacidad.",
                        "error"
                    );

                    consentimiento.focus();

                    return;

                }


                /* ==========================================
                   ENVIANDO
                =========================================== */

                if (submitSolicitud) {

                    submitSolicitud.disabled =
                        true;

                    submitSolicitud.dataset.originalText =
                        submitSolicitud.textContent;

                    submitSolicitud.textContent =
                        "Enviando...";

                }


                setFormResponse(
                    "Enviando solicitud..."
                );


                try {

                    const response =
                        await fetch(
                            COTIZACION_ENDPOINT,
                            {
                                method: "POST",

                                body:
                                    new URLSearchParams({

                                        token:
                                            COTIZACION_TOKEN,

                                        website:
                                            website,

                                        tipo:
                                            tipo,

                                        nombre:
                                            nombre,

                                        email:
                                            email,

                                        telefono:
                                            telefono,

                                        productoProyecto:
                                            producto,

                                        cantidad:
                                            cantidadValue,

                                        fecha:
                                            fecha,

                                        descripcion:
                                            descripcionValue

                                    })
                            }
                        );


                    const result =
                        String(
                            await response.text()
                        ).trim();


                    /* ======================================
                       ÉXITO
                    ======================================= */

                    if (
                        result.startsWith(
                            "RECIBIDO|"
                        )
                    ) {

                        const folio =
                            result.split("|")[1] ||
                            "";


                        setFormResponse(
                            `Solicitud recibida correctamente. Tu folio es ${folio}. También recibirás una confirmación por correo electrónico.`,
                            "success"
                        );


                        /* ==================================
                           ANALYTICS SIN PII
                        =================================== */

                        if (
                            window.__SARITA_GA_LOADED &&
                            typeof window.gtag ===
                                "function"
                        ) {

                            window.gtag(
                                "event",
                                tipo ===
                                    "COLABORACION"
                                    ? "sarita_collaboration_request"
                                    : (
                                        mode ===
                                            "CUSTOM"
                                            ? "sarita_custom_request"
                                            : "sarita_order_request"
                                    )
                            );

                        }


                        /* ==================================
                           RESETEAR FORMULARIO

                           Dejamos visible el folio.
                        =================================== */

                        form.reset();


                        setRequestMode(
                            ""
                        );


                        setDefaultInterface();


                        /*
                           Si el pedido salió del catálogo,
                           limpiamos también sus cantidades.
                        */

                        if (
                            mode === "CATALOG"
                        ) {

                            window.dispatchEvent(
                                new CustomEvent(
                                    "sarita:reset-catalog"
                                )
                            );

                        }


                        return;

                    }


                    /* ======================================
                       ERRORES DEL BACKEND
                    ======================================= */

                    const errors = {

                        "ERROR_TIPO":
                            "Selecciona un tipo de solicitud válido.",

                        "ERROR_NOMBRE":
                            "Revisa el nombre ingresado.",

                        "ERROR_EMAIL":
                            "Revisa el correo electrónico.",

                        "ERROR_TELEFONO":
                            "Revisa el teléfono o WhatsApp.",

                        "ERROR_PRODUCTO":
                            "Revisa la información del producto, diseño o proyecto.",

                        "ERROR_CANTIDAD":
                            "Revisa la cantidad indicada.",

                        "ERROR_FECHA":
                            "Revisa la fecha seleccionada.",

                        "ERROR_DESCRIPCION":
                            "Revisa la descripción de la solicitud.",

                        "ERROR_LIMITE":
                            "Se alcanzó temporalmente el límite de solicitudes. Espera unos minutos antes de intentarlo nuevamente.",

                        "ERROR_REPETIDO":
                            "Esta solicitud parece haberse enviado recientemente. No es necesario enviarla otra vez.",

                        "ERROR_OCUPADO":
                            "El sistema está procesando otra solicitud. Inténtalo nuevamente en unos momentos.",

                        "ERROR_CONTENIDO":
                            "No pudimos procesar parte del contenido. Revisa la información e inténtalo nuevamente.",

                        "ERROR_SPAM":
                            "No pudimos procesar la solicitud. Inténtalo nuevamente."

                    };


                    setFormResponse(
                        errors[result] ||
                        "No fue posible registrar la solicitud. Inténtalo nuevamente.",
                        "error"
                    );

                }

                catch (error) {

                    console.error(
                        "Chocolate Artístico Sarita:",
                        error
                    );


                    setFormResponse(
                        "No fue posible conectar con el sistema. Verifica tu conexión e inténtalo nuevamente.",
                        "error"
                    );

                }

                finally {

                    if (submitSolicitud) {

                        submitSolicitud.disabled =
                            false;

                        submitSolicitud.textContent =
                            submitSolicitud.dataset.originalText ||
                            "Enviar solicitud";

                    }

                }

            }
        );

    }


    /* =====================================================
       POPUP PROMOCIONAL
    ===================================================== */

    const promoPopup =
        document.getElementById(
            "promoPopup"
        );

    const closePromo =
        document.getElementById(
            "closePromo"
        );

    const continuePromo =
        document.getElementById(
            "continuePromo"
        );


    function hidePromo() {

        if (!promoPopup) {
            return;
        }


        promoPopup.classList.add(
            "hidden"
        );

        promoPopup.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    function showPromo() {

        if (!promoPopup) {
            return;
        }


        promoPopup.classList.remove(
            "hidden"
        );

        promoPopup.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    if (promoPopup) {

        window.setTimeout(
            showPromo,
            1800
        );

    }


    if (closePromo) {

        closePromo.addEventListener(
            "click",
            hidePromo
        );

    }


    if (continuePromo) {

        continuePromo.addEventListener(
            "click",
            hidePromo
        );

    }


    if (promoPopup) {

        promoPopup.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    promoPopup
                ) {

                    hidePromo();

                }

            }
        );

    }


    /* =====================================================
       WHATSAPP
    ===================================================== */

    const whatsappBot =
        document.getElementById(
            "whatsappBot"
        );

    const whatsappToggle =
        document.getElementById(
            "whatsappToggle"
        );

    const whatsappClose =
        document.getElementById(
            "whatsappClose"
        );


    function openWhatsAppBot() {

        if (!whatsappBot) {
            return;
        }


        whatsappBot.classList.add(
            "active"
        );

    }


    function closeWhatsAppBot() {

        if (!whatsappBot) {
            return;
        }


        whatsappBot.classList.remove(
            "active"
        );

    }


    if (whatsappToggle) {

        whatsappToggle.addEventListener(
            "click",
            openWhatsAppBot
        );

    }


    if (whatsappClose) {

        whatsappClose.addEventListener(
            "click",
            closeWhatsAppBot
        );

    }


    /* =====================================================
       MENÚ MÓVIL
    ===================================================== */

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const mainNav =
        document.getElementById(
            "mainNav"
        );


    if (
        menuToggle &&
        mainNav
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                const open =
                    mainNav.classList.toggle(
                        "active"
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
                    event.target.closest(
                        "a"
                    )
                ) {

                    mainNav.classList.remove(
                        "active"
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
       SCROLL SUAVE
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

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


                        const target =
                            document.querySelector(
                                href
                            );


                        if (!target) {
                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }
                );

            }
        );


    /* =====================================================
       GOOGLE CONSENT MODE
    ===================================================== */

    window.dataLayer =
        window.dataLayer || [];


    window.gtag =
        window.gtag ||
        function () {

            window.dataLayer.push(
                arguments
            );

        };


    window.gtag(
        "consent",
        "default",
        {
            analytics_storage:
                "denied",

            ad_storage:
                "denied",

            ad_user_data:
                "denied",

            ad_personalization:
                "denied"
        }
    );


    /* =====================================================
       GOOGLE ANALYTICS
    ===================================================== */

    function loadAnalytics() {

        if (
            window.__SARITA_GA_LOADED
        ) {

            return;

        }


        window.__SARITA_GA_LOADED =
            true;


        window.gtag(
            "consent",
            "update",
            {
                analytics_storage:
                    "granted",

                ad_storage:
                    "denied",

                ad_user_data:
                    "denied",

                ad_personalization:
                    "denied"
            }
        );


        window.gtag(
            "js",
            new Date()
        );


        window.gtag(
            "config",
            GA_MEASUREMENT_ID,
            {
                anonymize_ip:
                    true,

                allow_google_signals:
                    false,

                allow_ad_personalization_signals:
                    false
            }
        );


        const script =
            document.createElement(
                "script"
            );


        script.async =
            true;


        script.src =
            "https://www.googletagmanager.com/gtag/js?id=" +
            encodeURIComponent(
                GA_MEASUREMENT_ID
            );


        document.head.appendChild(
            script
        );

    }


    /* =====================================================
       COOKIES
    ===================================================== */

    const cookieBar =
        document.getElementById(
            "cookieBar"
        );

    const acceptCookies =
        document.getElementById(
            "acceptCookies"
        );

    const rejectCookies =
        document.getElementById(
            "rejectCookies"
        );


    function hideCookieBar() {

        if (!cookieBar) {
            return;
        }


        cookieBar.classList.remove(
            "active"
        );

        cookieBar.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    function showCookieBar() {

        if (!cookieBar) {
            return;
        }


        cookieBar.classList.add(
            "active"
        );

        cookieBar.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    let consentValue =
        null;


    try {

        consentValue =
            localStorage.getItem(
                CONSENT_KEY
            );

    } catch (error) {

        console.warn(
            "Chocolate Artístico Sarita: almacenamiento local no disponible."
        );

    }


    if (
        consentValue ===
        "accepted"
    ) {

        hideCookieBar();

        loadAnalytics();

    } else if (
        consentValue ===
        "rejected"
    ) {

        hideCookieBar();

    } else {

        showCookieBar();

    }


    if (acceptCookies) {

        acceptCookies.addEventListener(
            "click",
            () => {

                try {

                    localStorage.setItem(
                        CONSENT_KEY,
                        "accepted"
                    );

                } catch (error) {

                    console.warn(
                        "Chocolate Artístico Sarita: no se pudo guardar el consentimiento."
                    );

                }


                hideCookieBar();

                loadAnalytics();

            }
        );

    }


    if (rejectCookies) {

        rejectCookies.addEventListener(
            "click",
            () => {

                try {

                    localStorage.setItem(
                        CONSENT_KEY,
                        "rejected"
                    );

                } catch (error) {

                    console.warn(
                        "Chocolate Artístico Sarita: no se pudo guardar el rechazo."
                    );

                }


                hideCookieBar();


                window.gtag(
                    "consent",
                    "update",
                    {
                        analytics_storage:
                            "denied",

                        ad_storage:
                            "denied",

                        ad_user_data:
                            "denied",

                        ad_personalization:
                            "denied"
                    }
                );

            }
        );

    }


    /* =====================================================
       ESTADO INICIAL
    ===================================================== */

    setDefaultInterface();

});
