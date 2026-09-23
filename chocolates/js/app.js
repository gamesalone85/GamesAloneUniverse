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

        document.body.classList.add("modal-open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * Colocamos el foco en el primer campo
         * después de mostrar el modal.
         */

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


    /*
     * El HTML anterior ya tenía este botón,
     * pero no siempre tenía asociado el cierre.
     */

    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            closeModal
        );

    }


    /*
     * Cerrar haciendo clic en el fondo.
     */

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


    /*
     * ESC cierra modal.
     */

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
        document.getElementById("fechaEvento");


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


                /*
                 * Validación HTML nativa.
                 */

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


                /*
                 * Conservamos los nombres esperados
                 * por el backend existente.
                 */

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

                    /*
                     * Apps Script puede responder con
                     * redirecciones/CORS particulares.
                     *
                     * Conservamos el envío POST mediante
                     * URLSearchParams.
                     */

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


                    /*
                     * Si Apps Script respondió
                     * correctamente, consideramos
                     * recibida la solicitud.
                     */

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
       NOTIFICACIÓN / TOAST
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


        document.body.appendChild(toast);


        requestAnimationFrame(() => {

            toast.classList.add("active");

        });


        window.setTimeout(() => {

            toast.classList.remove("active");


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


        /*
         * Cierra el cuadro si se pulsa fuera.
         */

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


    /*
     * Se muestra una vez por sesión.
     *
     * sessionStorage permite que una nueva
     * visita futura vuelva a mostrar una
     * promoción actualizada.
     */

    const promoSeen =
        sessionStorage.getItem(
            "sarita_promo_seen"
        );


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


        sessionStorage.setItem(
            "sarita_promo_seen",
            "true"
        );

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

                if (event.target === promoPopup) {
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


            /*
             * El desplazamiento se calcula
             * usando la posición real de cada
             * slide. Esto evita errores por gap.
             */

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


        /*
         * Soporte táctil sencillo.
         */

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


        /*
         * Al cambiar desktop/móvil,
         * recalculamos límites.
         */

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
       COOKIES / ALMACENAMIENTO TÉCNICO
    ===================================================== */

    const cookieBar =
        document.getElementById(
            "cookieBar"
        );

    const acceptCookies =
        document.getElementById(
            "acceptCookies"
        );


    const cookieAccepted =
        localStorage.getItem(
            "sarita_cookie_notice"
        );


    if (
        cookieBar &&
        cookieAccepted !== "accepted"
    ) {

        /*
         * Retrasamos ligeramente el aviso para
         * no competir visualmente con el popup.
         */

        window.setTimeout(
            () => {

                cookieBar.classList.add(
                    "active"
                );

            },
            700
        );

    }


    if (
        cookieBar &&
        acceptCookies
    ) {

        acceptCookies.addEventListener(
            "click",
            () => {

                localStorage.setItem(
                    "sarita_cookie_notice",
                    "accepted"
                );


                cookieBar.classList.remove(
                    "active"
                );

            }
        );

    }


    /* =====================================================
       SMOOTH SCROLL INTERNO
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
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


});
