/* =========================================================
   CHOCOLATE ARTÍSTICO SARITA
   APP.JS 2026
   PEDIDOS + COLABORACIONES
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
        document.getElementById("cotizacionModal");

    const openBtn =
        document.getElementById("openModal");

    const openNavBtn =
        document.getElementById("openModalNav");

    const openCtaBtn =
        document.getElementById("openModalCta");

    const openAlianzaBtn =
        document.getElementById("openAlianzaModal");

    const openEdicionBtn =
        document.getElementById("openEdicionModal");

    const closeBtn =
        document.getElementById("closeModal");

    const cancelBtn =
        document.getElementById("cancelModalBtn");


    /* =====================================================
       ELEMENTOS DEL FORMULARIO
    ===================================================== */

    const form =
        document.getElementById("cotizacionForm");

    const tipoPedido =
        document.getElementById("tipoPedido");

    const tipoColaboracion =
        document.getElementById("tipoColaboracion");

    const productoProyecto =
        document.getElementById("productoProyecto");

    const productoProyectoLabel =
        document.getElementById("productoProyectoLabel");

    const productoProyectoHelper =
        document.getElementById("productoProyectoHelper");

    const cantidad =
        document.getElementById("cantidad");

    const fechaEvento =
        document.getElementById("fechaEvento");

    const fechaLabel =
        document.getElementById("fechaLabel");

    const descripcion =
        document.getElementById("descripcion");

    const descripcionLabel =
        document.getElementById("descripcionLabel");

    const requestInfo =
        document.getElementById("requestInfo");

    const formResponse =
        document.getElementById("formResponse");

    const submitSolicitud =
        document.getElementById("submitSolicitud");


    /* =====================================================
       LIMPIAR RESPUESTA
    ===================================================== */

    function clearFormResponse() {

        if (!formResponse) return;

        formResponse.textContent = "";

        formResponse.classList.remove(
            "success",
            "error"
        );

    }


    /* =====================================================
       MOSTRAR RESPUESTA
    ===================================================== */

    function setFormResponse(
        message,
        type = ""
    ) {

        if (!formResponse) return;

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


    /* =====================================================
       TIPO SELECCIONADO
    ===================================================== */

    function getSelectedType() {

        const selected =
            document.querySelector(
                'input[name="tipo"]:checked'
            );

        return selected
            ? selected.value
            : "";

    }


    /* =====================================================
       ACTUALIZAR FORMULARIO SEGÚN TIPO
    ===================================================== */

    function updateRequestType() {

        const tipo =
            getSelectedType();


        clearFormResponse();


        if (tipo === "PEDIDO") {


            if (productoProyectoLabel) {

                productoProyectoLabel.textContent =
                    "¿Qué necesitas?";

            }


            if (productoProyecto) {

                productoProyecto.placeholder =
                    "Ej. Caja de 20 chocolates para cumpleaños";

            }


            if (productoProyectoHelper) {

                productoProyectoHelper.textContent =
                    "No necesitas elegir de un catálogo. Describe libremente el producto o presentación que necesitas.";

            }


            if (cantidad) {

                cantidad.placeholder =
                    "Ej. 1 caja, 50 piezas, 100 chocolates...";

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

                descripcion.placeholder =
                    "Ej. Temática, colores, presentación, ocasión, decoración o cualquier detalle que quieras compartir.";

            }


            if (requestInfo) {

                requestInfo.textContent =
                    "Revisaremos tu solicitud y nos comunicaremos contigo para confirmar diseño, cantidad, precio, disponibilidad y entrega.";

            }


            if (submitSolicitud) {

                submitSolicitud.textContent =
                    "Enviar pedido";

            }


            return;

        }


        if (tipo === "COLABORACION") {


            if (productoProyectoLabel) {

                productoProyectoLabel.textContent =
                    "Nombre del proyecto, marca, evento o producción";

            }


            if (productoProyecto) {

                productoProyecto.placeholder =
                    "Ej. Calaveras Sandungueras, obra de teatro, marca o evento";

            }


            if (productoProyectoHelper) {

                productoProyectoHelper.textContent =
                    "Indícanos el nombre de tu proyecto, producción, evento, marca o propuesta.";

            }


            if (cantidad) {

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


            return;

        }


        /* SIN SELECCIÓN */

        if (productoProyectoLabel) {

            productoProyectoLabel.textContent =
                "¿Qué necesitas o qué proyecto tienes en mente?";

        }


        if (productoProyecto) {

            productoProyecto.placeholder =
                "Ej. Caja de chocolates para regalo o nombre de tu proyecto";

        }


        if (productoProyectoHelper) {

            productoProyectoHelper.textContent =
                "No necesitas elegir de un catálogo. Describe libremente lo que necesitas.";

        }


        if (cantidad) {

            cantidad.placeholder =
                "Ej. 1 caja, 100 piezas...";

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
       SELECCIONAR TIPO PROGRAMÁTICAMENTE
    ===================================================== */

    function selectRequestType(type) {

        if (
            type === "PEDIDO" &&
            tipoPedido
        ) {

            tipoPedido.checked = true;

        }


        if (
            type === "COLABORACION" &&
            tipoColaboracion
        ) {

            tipoColaboracion.checked = true;

        }


        updateRequestType();

    }


    /* =====================================================
       ABRIR MODAL
    ===================================================== */

    function openModal(
        preferredType = ""
    ) {

        if (!modal) return;


        clearFormResponse();


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

        document.body.classList.add(
            "modal-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        window.setTimeout(
            () => {

                const selectedType =
                    modal.querySelector(
                        'input[name="tipo"]:checked'
                    );


                const focusTarget =
                    selectedType ||
                    modal.querySelector(
                        'input[name="tipo"]'
                    );


                if (focusTarget) {

                    focusTarget.focus();

                }

            },
            100
        );

    }


    /* =====================================================
       CERRAR MODAL
    ===================================================== */

    function closeModal() {

        if (!modal) return;


        modal.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "modal-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       BOTONES DEL MODAL
    ===================================================== */

    if (openBtn) {

        openBtn.addEventListener(
            "click",
            () => {

                openModal();

            }
        );

    }


    if (openNavBtn) {

        openNavBtn.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openModal();

            }
        );

    }


    if (openCtaBtn) {

        openCtaBtn.addEventListener(
            "click",
            () => {

                openModal();

            }
        );

    }


    /*
       ALIANZA CALAVERAS SANDUNGUERAS
       ABRE DIRECTAMENTE COMO COLABORACIÓN
    */

    if (openAlianzaBtn) {

        openAlianzaBtn.addEventListener(
            "click",
            () => {

                openModal(
                    "COLABORACION"
                );

            }
        );

    }


    /*
       EDICIÓN CALAVERAS
       LA ABRIMOS COMO PEDIDO
       PORQUE EL USUARIO ESTÁ CONSULTANDO
       LA EDICIÓN DE CHOCOLATE.
    */

    if (openEdicionBtn) {

        openEdicionBtn.addEventListener(
            "click",
            () => {

                openModal(
                    "PEDIDO"
                );


                if (productoProyecto) {

                    productoProyecto.value =
                        "Edición especial Calaveras Sandungueras";

                }

            }
        );

    }


    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeModal
        );

    }


    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            closeModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            (event) => {

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
        (event) => {

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
       CAMBIO PEDIDO / COLABORACIÓN
    ===================================================== */

    if (tipoPedido) {

        tipoPedido.addEventListener(
            "change",
            updateRequestType
        );

    }


    if (tipoColaboracion) {

        tipoColaboracion.addEventListener(
            "change",
            updateRequestType
        );

    }


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
       FORMULARIO
    ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                clearFormResponse();


                if (!form.checkValidity()) {

                    form.reportValidity();

                    return;

                }


                const tipo =
                    getSelectedType();


                if (
                    tipo !== "PEDIDO" &&
                    tipo !== "COLABORACION"
                ) {

                    setFormResponse(
                        "Selecciona si deseas realizar un pedido o proponer una colaboración.",
                        "error"
                    );

                    return;

                }


                const submitBtn =
                    submitSolicitud ||
                    form.querySelector(
                        ".submit-btn"
                    );


                const originalText =
                    submitBtn
                        ? submitBtn.textContent
                        : "Enviar solicitud";


                if (submitBtn) {

                    submitBtn.disabled =
                        true;

                    submitBtn.textContent =
                        "Enviando...";

                }


                const data =
                    new URLSearchParams({

                        token:
                            COTIZACION_TOKEN,

                        website:
                            document
                                .getElementById(
                                    "website"
                                )
                                ?.value
                                .trim() || "",

                        tipo:
                            tipo,

                        nombre:
                            document
                                .getElementById(
                                    "nombre"
                                )
                                ?.value
                                .trim() || "",

                        email:
                            document
                                .getElementById(
                                    "email"
                                )
                                ?.value
                                .trim() || "",

                        telefono:
                            document
                                .getElementById(
                                    "telefono"
                                )
                                ?.value
                                .trim() || "",

                        productoProyecto:
                            productoProyecto
                                ?.value
                                .trim() || "",

                        cantidad:
                            cantidad
                                ?.value
                                .trim() || "",

                        fecha:
                            fechaEvento
                                ?.value || "",

                        descripcion:
                            descripcion
                                ?.value
                                .trim() || ""

                    });


                try {

                    const response =
                        await fetch(
                            COTIZACION_ENDPOINT,
                            {
                                method:
                                    "POST",

                                body:
                                    data
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            `HTTP ${response.status}`
                        );

                    }


                    const result =
                        (
                            await response.text()
                        ).trim();


                    /* -------------------------------------
                       SOLICITUD RECIBIDA
                    ------------------------------------- */

                    if (
                        result.startsWith(
                            "RECIBIDO|"
                        )
                    ) {

                        const folio =
                            result
                                .split("|")[1]
                                ?.trim() || "";


                        const successMessage =
                            tipo === "PEDIDO"

                                ? (
                                    "Recibimos tu solicitud" +
                                    (
                                        folio
                                            ? ` con folio ${folio}.`
                                            : "."
                                    ) +
                                    " Revisaremos los detalles y nos comunicaremos contigo."
                                )

                                : (
                                    "Recibimos tu propuesta de colaboración" +
                                    (
                                        folio
                                            ? ` con folio ${folio}.`
                                            : "."
                                    ) +
                                    " Revisaremos el proyecto y nos comunicaremos contigo."
                                );


                        setFormResponse(
                            successMessage,
                            "success"
                        );


                        showToast(
                            "Solicitud recibida",
                            folio
                                ? `Tu folio es ${folio}.`
                                : "Tu información fue registrada correctamente."
                        );


                        /*
                           Guardamos temporalmente el mensaje
                           antes del reset para que el usuario
                           pueda verlo dentro del modal.
                        */

                        if (form) {

                            form.reset();

                        }


                        updateRequestType();


                        /*
                           updateRequestType limpia la respuesta,
                           así que la restauramos.
                        */

                        setFormResponse(
                            successMessage,
                            "success"
                        );


                        /*
                           Cerramos después de unos segundos
                           para que el folio sea visible.
                        */

                        window.setTimeout(
                            () => {

                                closeModal();

                                clearFormResponse();

                            },
                            3500
                        );


                        return;

                    }


                    /* -------------------------------------
                       ERRORES DEL BACKEND
                    ------------------------------------- */

                    const errorMessages = {

                        ERROR_TOKEN:
                            "No fue posible validar la solicitud.",

                        ERROR_DATOS:
                            "Faltan datos necesarios para procesar la solicitud.",

                        ERROR_SPAM:
                            "La solicitud no pudo ser procesada.",

                        ERROR_TIPO:
                            "Selecciona Pedido o Colaboración.",

                        ERROR_NOMBRE:
                            "Revisa el nombre ingresado.",

                        ERROR_EMAIL:
                            "Ingresa un correo electrónico válido.",

                        ERROR_TELEFONO:
                            "Revisa el teléfono o WhatsApp ingresado.",

                        ERROR_PRODUCTO:
                            tipo === "PEDIDO"
                                ? "Describe qué chocolates o presentación necesitas."
                                : "Indica el nombre de tu proyecto, marca, evento o producción.",

                        ERROR_CANTIDAD:
                            "Indica una cantidad aproximada válida.",

                        ERROR_DESCRIPCION:
                            "La descripción es demasiado extensa.",

                        ERROR_CONTENIDO:
                            "La solicitud contiene información que no pudo ser procesada.",

                        ERROR_LIMITE:
                            "Se han realizado varios intentos. Espera unos minutos antes de volver a enviar.",

                        ERROR_REPETIDO:
                            "Esta solicitud parece haberse enviado recientemente. Revisa tu correo o espera un momento antes de intentarlo nuevamente.",

                        ERROR_OCUPADO:
                            "El sistema está procesando otra solicitud. Inténtalo nuevamente en unos segundos.",

                        ERROR:
                            "No pudimos registrar la solicitud en este momento."

                    };


                    const message =
                        errorMessages[result] ||
                        "No pudimos procesar la solicitud. Inténtalo nuevamente o contáctanos por WhatsApp.";


                    setFormResponse(
                        message,
                        "error"
                    );


                    showToast(
                        "No pudimos enviar la solicitud",
                        message,
                        true
                    );


                } catch (error) {

                    console.error(
                        "Error al enviar solicitud Sarita:",
                        error
                    );


                    const message =
                        "No pudimos comunicarnos con el sistema. Inténtalo nuevamente o contáctanos directamente por WhatsApp.";


                    setFormResponse(
                        message,
                        "error"
                    );


                    showToast(
                        "Error de conexión",
                        message,
                        true
                    );


                } finally {

                    if (submitBtn) {

                        submitBtn.disabled =
                            false;


                        /*
                           Si el formulario fue reiniciado,
                           el botón vuelve al texto general.
                        */

                        if (
                            !getSelectedType()
                        ) {

                            submitBtn.textContent =
                                "Enviar solicitud";

                        } else {

                            submitBtn.textContent =
                                originalText;

                        }

                    }

                }

            }
        );

    }


    /* =====================================================
       ESTADO INICIAL DEL FORMULARIO
    ===================================================== */

    updateRequestType();


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(
        title,
        message,
        isError = false
    ) {

        const existingToast =
            document.querySelector(
                ".sarita-toast"
            );


        if (existingToast) {

            existingToast.remove();

        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "sarita-toast" +
            (
                isError
                    ? " error"
                    : ""
            );


        const toastTitle =
            document.createElement(
                "strong"
            );

        toastTitle.textContent =
            title;


        const toastMessage =
            document.createElement(
                "span"
            );

        toastMessage.textContent =
            message;


        toast.append(
            toastTitle,
            toastMessage
        );


        document.body.appendChild(
            toast
        );


        requestAnimationFrame(
            () => {

                toast.classList.add(
                    "active"
                );

            }
        );


        window.setTimeout(
            () => {

                toast.classList.remove(
                    "active"
                );


                window.setTimeout(
                    () => {

                        toast.remove();

                    },
                    300
                );

            },
            5000
        );

    }


    /* =====================================================
       WHATSAPP
    ===================================================== */

    const whatsappToggle =
        document.getElementById(
            "toggleWhatsapp"
        );

    const whatsappBot =
        document.getElementById(
            "whatsappBot"
        );


    if (
        whatsappToggle &&
        whatsappBot
    ) {

        whatsappToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        whatsappToggle.addEventListener(
            "click",
            () => {

                whatsappBot.classList.toggle(
                    "active"
                );


                const isOpen =
                    whatsappBot.classList.contains(
                        "active"
                    );


                whatsappToggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );


        document.addEventListener(
            "click",
            (event) => {

                if (
                    !whatsappBot.contains(
                        event.target
                    ) &&
                    !whatsappToggle.contains(
                        event.target
                    )
                ) {

                    whatsappBot.classList.remove(
                        "active"
                    );

                    whatsappToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }


    /* =====================================================
       POPUP PROMOCIONAL
       SE MUESTRA EN CADA CARGA
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


    let promoTimer = null;


    function openPromoPopup() {

        if (!promoPopup) return;


        promoPopup.classList.remove(
            "hidden"
        );

        promoPopup.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "promo-open"
        );

    }


    function closePromoPopup() {

        if (!promoPopup) return;


        promoPopup.classList.add(
            "hidden"
        );

        promoPopup.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "promo-open"
        );

    }


    /*
       El popup aparece un segundo después
       de cada carga.

       No utilizamos almacenamiento para
       ocultarlo permanentemente.
    */

    if (promoPopup) {

        promoPopup.classList.add(
            "hidden"
        );

        promoPopup.setAttribute(
            "aria-hidden",
            "true"
        );


        promoTimer =
            window.setTimeout(
                () => {

                    openPromoPopup();

                    promoTimer =
                        null;

                },
                1000
            );

    }


    if (closePromo) {

        closePromo.addEventListener(
            "click",
            () => {

                if (promoTimer) {

                    window.clearTimeout(
                        promoTimer
                    );

                    promoTimer =
                        null;

                }


                closePromoPopup();

            }
        );

    }


    if (continuePromo) {

        continuePromo.addEventListener(
            "click",
            () => {

                if (promoTimer) {

                    window.clearTimeout(
                        promoTimer
                    );

                    promoTimer =
                        null;

                }


                closePromoPopup();

            }
        );

    }


    if (promoPopup) {

        promoPopup.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    promoPopup
                ) {

                    if (promoTimer) {

                        window.clearTimeout(
                            promoTimer
                        );

                        promoTimer =
                            null;

                    }


                    closePromoPopup();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                promoPopup &&
                !promoPopup.classList.contains(
                    "hidden"
                )
            ) {

                if (promoTimer) {

                    window.clearTimeout(
                        promoTimer
                    );

                    promoTimer =
                        null;

                }


                closePromoPopup();

            }

        }
    );


    /* =====================================================
       CARRUSEL
    ===================================================== */

    const carousel =
        document.querySelector(
            ".carousel-container"
        );

    const track =
        document.querySelector(
            ".carousel-track"
        );

    const prevBtn =
        document.querySelector(
            ".carousel-btn.prev"
        );

    const nextBtn =
        document.querySelector(
            ".carousel-btn.next"
        );


    if (
        carousel &&
        track &&
        prevBtn &&
        nextBtn
    ) {

        const slides =
            Array.from(
                track.children
            );


        let currentIndex =
            0;


        function getVisibleSlides() {

            if (
                window.matchMedia(
                    "(max-width: 760px)"
                ).matches
            ) {

                return 1;

            }


            return 3;

        }


        function getMaxIndex() {

            return Math.max(
                0,
                slides.length -
                getVisibleSlides()
            );

        }


        function updateCarousel() {

            if (!slides.length) {

                return;

            }


            const targetSlide =
                slides[currentIndex];


            if (!targetSlide) {

                return;

            }


            const offset =
                targetSlide.offsetLeft;


            track.style.transform =
                `translateX(-${offset}px)`;


            prevBtn.disabled =
                currentIndex === 0;


            nextBtn.disabled =
                currentIndex >=
                getMaxIndex();

        }


        prevBtn.addEventListener(
            "click",
            () => {

                currentIndex =
                    Math.max(
                        0,
                        currentIndex - 1
                    );


                updateCarousel();

            }
        );


        nextBtn.addEventListener(
            "click",
            () => {

                currentIndex =
                    Math.min(
                        getMaxIndex(),
                        currentIndex + 1
                    );


                updateCarousel();

            }
        );


        let touchStartX =
            0;

        let touchEndX =
            0;


        track.addEventListener(
            "touchstart",
            (event) => {

                touchStartX =
                    event
                        .changedTouches[0]
                        .screenX;

            },
            {
                passive:
                    true
            }
        );


        track.addEventListener(
            "touchend",
            (event) => {

                touchEndX =
                    event
                        .changedTouches[0]
                        .screenX;


                const distance =
                    touchStartX -
                    touchEndX;


                if (
                    Math.abs(
                        distance
                    ) < 45
                ) {

                    return;

                }


                if (
                    distance > 0
                ) {

                    currentIndex =
                        Math.min(
                            getMaxIndex(),
                            currentIndex + 1
                        );

                } else {

                    currentIndex =
                        Math.max(
                            0,
                            currentIndex - 1
                        );

                }


                updateCarousel();

            },
            {
                passive:
                    true
            }
        );


        let resizeTimer;


        window.addEventListener(
            "resize",
            () => {

                clearTimeout(
                    resizeTimer
                );


                resizeTimer =
                    window.setTimeout(
                        () => {

                            currentIndex =
                                Math.min(
                                    currentIndex,
                                    getMaxIndex()
                                );


                            updateCarousel();

                        },
                        100
                    );

            }
        );


        updateCarousel();

    }


    /* =====================================================
       PRIVACIDAD Y GOOGLE ANALYTICS
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


    let analyticsLoaded =
        false;


    /* =====================================================
       MOSTRAR / OCULTAR CONSENTIMIENTO
    ===================================================== */

    function hideCookieBar() {

        if (!cookieBar) {

            return;

        }


        cookieBar.classList.remove(
            "active"
        );

        cookieBar.classList.add(
            "hidden"
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


        cookieBar.classList.remove(
            "hidden"
        );

        cookieBar.classList.add(
            "active"
        );


        cookieBar.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    /* =====================================================
       LEER CONSENTIMIENTO
    ===================================================== */

    function readConsent() {

        try {

            return localStorage.getItem(
                CONSENT_KEY
            );

        } catch (error) {

            console.warn(
                "No se pudo leer la preferencia de Analytics:",
                error
            );


            return null;

        }

    }


    /* =====================================================
       GUARDAR CONSENTIMIENTO
    ===================================================== */

    function saveConsent(value) {

        try {

            localStorage.setItem(
                CONSENT_KEY,
                value
            );

        } catch (error) {

            console.warn(
                "No se pudo guardar la preferencia de Analytics:",
                error
            );

        }

    }


    /* =====================================================
       CONSENTIMIENTO GOOGLE
    ===================================================== */

    function setGoogleConsent(value) {

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
            "update",
            {

                analytics_storage:
                    value,

                ad_storage:
                    "denied",

                ad_user_data:
                    "denied",

                ad_personalization:
                    "denied"

            }
        );

    }


    /* =====================================================
       CARGAR GOOGLE ANALYTICS
    ===================================================== */

    function loadGoogleAnalytics() {

        if (
            readConsent() !==
            "accepted"
        ) {

            return;

        }


        if (analyticsLoaded) {

            return;

        }


        if (
            document.querySelector(
                'script[data-ga18-analytics="true"]'
            )
        ) {

            analyticsLoaded =
                true;

            return;

        }


        analyticsLoaded =
            true;


        window.dataLayer =
            window.dataLayer || [];


        window.gtag =
            window.gtag ||
            function () {

                window.dataLayer.push(
                    arguments
                );

            };


        setGoogleConsent(
            "granted"
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


        const analyticsScript =
            document.createElement(
                "script"
            );


        analyticsScript.async =
            true;


        analyticsScript.src =
            "https://www.googletagmanager.com/gtag/js?id=" +
            encodeURIComponent(
                GA_MEASUREMENT_ID
            );


        analyticsScript.dataset.ga18Analytics =
            "true";


        document.head.appendChild(
            analyticsScript
        );

    }


    /* =====================================================
       ESTADO INICIAL DEL CONSENTIMIENTO
    ===================================================== */

    const savedConsent =
        readConsent();


    if (
        savedConsent ===
        "accepted"
    ) {

        hideCookieBar();


        setGoogleConsent(
            "granted"
        );


        window.setTimeout(
            loadGoogleAnalytics,
            1200
        );

    }


    else if (
        savedConsent ===
        "rejected"
    ) {

        hideCookieBar();


        setGoogleConsent(
            "denied"
        );

    }


    else {

        setGoogleConsent(
            "denied"
        );


        window.setTimeout(
            () => {

                if (
                    readConsent() ===
                    null
                ) {

                    showCookieBar();

                }

            },
            700
        );

    }


    /* =====================================================
       ACEPTAR ANALYTICS
    ===================================================== */

    if (acceptCookies) {

        acceptCookies.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();


                saveConsent(
                    "accepted"
                );


                hideCookieBar();


                setGoogleConsent(
                    "granted"
                );


                loadGoogleAnalytics();

            }
        );

    }


    /* =====================================================
       RECHAZAR ANALYTICS
    ===================================================== */

    if (rejectCookies) {

        rejectCookies.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();


                saveConsent(
                    "rejected"
                );


                hideCookieBar();


                setGoogleConsent(
                    "denied"
                );

            }
        );

    }


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

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

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });

                    }
                );

            }
        );


});
