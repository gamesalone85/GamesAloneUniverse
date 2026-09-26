/* =========================================================
   CHOCOLATE ARTÍSTICO SARITA
   APP.JS 2026
========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const COTIZACION_ENDPOINT =
        "https://script.google.com/macros/s/AKfycbx6M7ROD49A5-LDFiMxXqf9R8s_GzIfPaztTjcc4IKJb00tmtMJ1TMr9DU6U4P5gSM6/exec";

    const GA_MEASUREMENT_ID =
        "G-EGZ2977YBH";

    const CONSENT_KEY =
        "ga18_cookie_consent";


    /* =====================================================
       MODAL COTIZACIÓN
    ===================================================== */

    const modal =
        document.getElementById("cotizacionModal");

    const openBtn =
        document.getElementById("openModal");

    const openNavBtn =
        document.getElementById("openModalNav");

    const openCtaBtn =
        document.getElementById("openModalCta");

    const closeBtn =
        document.getElementById("closeModal");

    const cancelBtn =
        document.getElementById("cancelModalBtn");


    function openModal() {

        if (!modal) return;

        modal.classList.add("active");

        document.body.classList.add(
            "modal-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        window.setTimeout(() => {

            const firstInput =
                modal.querySelector(
                    "input:not([type='checkbox'])"
                );

            if (firstInput) {
                firstInput.focus();
            }

        }, 100);

    }


    function closeModal() {

        if (!modal) return;

        modal.classList.remove("active");

        document.body.classList.remove(
            "modal-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (openBtn) {

        openBtn.addEventListener(
            "click",
            openModal
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
            openModal
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

                if (event.target === modal) {
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
                modal.classList.contains("active")
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       FECHA MÍNIMA DEL EVENTO
    ===================================================== */

    const fechaEvento =
        document.getElementById(
            "fechaEvento"
        );


    if (fechaEvento) {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        fechaEvento.min =
            `${year}-${month}-${day}`;

    }


    /* =====================================================
       FORMULARIO DE COTIZACIÓN
    ===================================================== */

    const form =
        document.getElementById(
            "cotizacionForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                if (!form.checkValidity()) {

                    form.reportValidity();

                    return;

                }


                const submitBtn =
                    form.querySelector(
                        ".submit-btn"
                    );


                const originalText =
                    submitBtn
                        ? submitBtn.textContent
                        : "";


                if (submitBtn) {

                    submitBtn.disabled = true;

                    submitBtn.textContent =
                        "Enviando...";

                }


                const data =
                    new URLSearchParams({

                        nombre:
                            document
                                .getElementById("nombre")
                                ?.value
                                .trim() || "",

                        telefono:
                            document
                                .getElementById("telefono")
                                ?.value
                                .trim() || "",

                        correo:
                            document
                                .getElementById("correo")
                                ?.value
                                .trim() || "",

                        evento:
                            document
                                .getElementById("evento")
                                ?.value
                                .trim() || "",

                        cantidad:
                            document
                                .getElementById("cantidad")
                                ?.value || "",

                        fecha:
                            document
                                .getElementById("fechaEvento")
                                ?.value || "",

                        descripcion:
                            document
                                .getElementById("descripcion")
                                ?.value
                                .trim() || ""

                    });


                try {

                    const response =
                        await fetch(
                            COTIZACION_ENDPOINT,
                            {
                                method: "POST",
                                body: data
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            `HTTP ${response.status}`
                        );

                    }


                    form.reset();

                    closeModal();


                    showToast(
                        "Solicitud enviada",
                        "Recibimos tus datos. Nos pondremos en contacto contigo."
                    );


                } catch (error) {

                    console.error(
                        "Error al enviar cotización:",
                        error
                    );


                    showToast(
                        "No pudimos enviar la solicitud",
                        "Inténtalo nuevamente o contáctanos directamente por WhatsApp.",
                        true
                    );


                } finally {

                    if (submitBtn) {

                        submitBtn.disabled = false;

                        submitBtn.textContent =
                            originalText;

                    }

                }

            }
        );

    }


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
            document.createElement("div");


        toast.className =
            "sarita-toast" +
            (isError ? " error" : "");


        const toastTitle =
            document.createElement("strong");

        toastTitle.textContent =
            title;


        const toastMessage =
            document.createElement("span");

        toastMessage.textContent =
            message;


        toast.append(
            toastTitle,
            toastMessage
        );


        document.body.appendChild(
            toast
        );


        requestAnimationFrame(() => {

            toast.classList.add(
                "active"
            );

        });


        window.setTimeout(() => {

            toast.classList.remove(
                "active"
            );


            window.setTimeout(() => {

                toast.remove();

            }, 300);

        }, 5000);

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
    ===================================================== */

    const promoPopup =
        document.getElementById(
            "promoPopup"
        );

    const closePromo =
        document.getElementById(
            "closePromo"
        );


    let promoSeen = null;


    try {

        promoSeen =
            sessionStorage.getItem(
                "sarita_promo_seen"
            );

    } catch (error) {

        console.warn(
            "No se pudo leer sessionStorage:",
            error
        );

    }


    if (promoPopup) {

        if (promoSeen === "true") {

            promoPopup.classList.add(
                "hidden"
            );

            promoPopup.setAttribute(
                "aria-hidden",
                "true"
            );

        } else {

            promoPopup.classList.remove(
                "hidden"
            );

            promoPopup.setAttribute(
                "aria-hidden",
                "false"
            );

        }

    }


    function hidePromo() {

        if (!promoPopup) return;


        promoPopup.classList.add(
            "hidden"
        );

        promoPopup.setAttribute(
            "aria-hidden",
            "true"
        );


        try {

            sessionStorage.setItem(
                "sarita_promo_seen",
                "true"
            );

        } catch (error) {

            console.warn(
                "No se pudo guardar el estado del popup:",
                error
            );

        }

    }


    if (closePromo) {

        closePromo.addEventListener(
            "click",
            hidePromo
        );

    }


    if (promoPopup) {

        promoPopup.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === promoPopup
                ) {

                    hidePromo();

                }

            }
        );

    }


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


        let currentIndex = 0;


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

            if (!slides.length) return;


            const targetSlide =
                slides[currentIndex];


            if (!targetSlide) return;


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


        let touchStartX = 0;
        let touchEndX = 0;


        track.addEventListener(
            "touchstart",
            (event) => {

                touchStartX =
                    event.changedTouches[0]
                        .screenX;

            },
            {
                passive: true
            }
        );


        track.addEventListener(
            "touchend",
            (event) => {

                touchEndX =
                    event.changedTouches[0]
                        .screenX;


                const distance =
                    touchStartX -
                    touchEndX;


                if (
                    Math.abs(distance) < 45
                ) {

                    return;

                }


                if (distance > 0) {

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
                passive: true
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


    let analyticsLoaded = false;


    /* =====================================================
       MOSTRAR / OCULTAR CONSENTIMIENTO
    ===================================================== */

    function hideCookieBar() {

        if (!cookieBar) return;


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

        if (!cookieBar) return;


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

        /*
         * Analytics nunca se descarga antes
         * de que exista consentimiento.
         */

        if (
            readConsent() !==
            "accepted"
        ) {

            return;

        }


        /*
         * Evita cargar GA más de una vez.
         */

        if (analyticsLoaded) {

            return;

        }


        if (
            document.querySelector(
                'script[data-ga18-analytics="true"]'
            )
        ) {

            analyticsLoaded = true;

            return;

        }


        analyticsLoaded = true;


        window.dataLayer =
            window.dataLayer || [];


        window.gtag =
            window.gtag ||
            function () {

                window.dataLayer.push(
                    arguments
                );

            };


        /*
         * Consentimiento concedido antes
         * de inicializar la medición.
         */

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

                anonymize_ip: true,

                allow_google_signals: false,

                allow_ad_personalization_signals: false

            }
        );


        /*
         * Carga dinámica del script oficial.
         */

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
       ESTADO INICIAL DE CONSENTIMIENTO
    ===================================================== */

    const savedConsent =
        readConsent();


    /*
     * Usuario que ya aceptó anteriormente.
     */

    if (
        savedConsent ===
        "accepted"
    ) {

        hideCookieBar();


        setGoogleConsent(
            "granted"
        );


        /*
         * Retraso ligero para priorizar
         * la carga visual del sitio.
         */

        window.setTimeout(
            loadGoogleAnalytics,
            1200
        );

    }


    /*
     * Usuario que rechazó anteriormente.
     */

    else if (
        savedConsent ===
        "rejected"
    ) {

        hideCookieBar();


        setGoogleConsent(
            "denied"
        );

    }


    /*
     * Primera visita o sin decisión.
     */

    else {

        setGoogleConsent(
            "denied"
        );


        window.setTimeout(
            () => {

                if (
                    readConsent() === null
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
        .forEach((link) => {

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


                    if (!target) return;


                    event.preventDefault();


                    target.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "start"

                    });

                }
            );

        });


});
