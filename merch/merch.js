(() => {

  "use strict";


  /* =====================================================
     CONFIGURACIÓN MERCH
  ====================================================== */

  const MERCH_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbyyzzcsCub_MdFFAedrNSvkdbhB_4Ilw6NMqbMF6LbbS-kW6SmK2dI5-ZAF1QBM-5I/exec";


  const MERCH_TOKEN =
    "GA18MERCH";


  /* =====================================================
     MENÚ MÓVIL
  ====================================================== */

  const menuToggle =
    document.getElementById("menuToggle");

  const mainNav =
    document.getElementById("mainNav");


  if (menuToggle && mainNav) {

    menuToggle.addEventListener(
      "click",
      () => {

        const open =
          mainNav.classList.toggle("is-open");

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
      (event) => {

        if (event.target.closest("a")) {

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
     FORMULARIO MERCH
  ====================================================== */

  const merchForm =
    document.getElementById(
      "merchForm"
    );


  const productSelect =
    document.getElementById(
      "merchProducto"
    );


  const ageConfirmation =
    document.getElementById(
      "ageConfirmation"
    );


  const confirmAge =
    document.getElementById(
      "confirmAge"
    );


  const merchResponse =
    document.getElementById(
      "merchResponse"
    );


  const merchSubmit =
    document.getElementById(
      "merchSubmit"
    );


  /* =====================================================
     PRODUCTO +18
  ====================================================== */

  function updateAgeRequirement() {

    if (
      !productSelect ||
      !ageConfirmation ||
      !confirmAge
    ) {

      return;

    }


    const isAlcohol =
      productSelect.value ===
      "Colección Universo / Cerveza";


    ageConfirmation.hidden =
      !isAlcohol;


    confirmAge.required =
      isAlcohol;


    if (!isAlcohol) {

      confirmAge.checked =
        false;

    }

  }


  if (productSelect) {

    productSelect.addEventListener(
      "change",
      updateAgeRequirement
    );


    updateAgeRequirement();

  }


  /* =====================================================
     MOSTRAR RESPUESTAS
  ====================================================== */

  function showMerchMessage(
    type,
    html
  ) {

    if (!merchResponse) {
      return;
    }


    merchResponse.className =
      "merch-response " + type;


    merchResponse.innerHTML =
      html;

  }


  /* =====================================================
     ESCAPAR HTML
  ====================================================== */

  function escapeHTML(value) {

    return String(
      value == null ? "" : value
    )

    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  }


  /* =====================================================
     ENVÍO DE SOLICITUD
  ====================================================== */

  if (merchForm) {

    merchForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        /* -------------------------------------------------
           VALIDACIÓN NATIVA
        -------------------------------------------------- */

        if (!merchForm.checkValidity()) {

          merchForm.reportValidity();

          return;

        }


        /* -------------------------------------------------
           DATOS
        -------------------------------------------------- */

        const nombre =
          document
            .getElementById(
              "merchNombre"
            )
            .value
            .trim();


        const email =
          document
            .getElementById(
              "merchEmail"
            )
            .value
            .trim();


        const telefono =
          document
            .getElementById(
              "merchTelefono"
            )
            .value
            .trim();


        const productos =
          productSelect
            ? productSelect.value
            : "";


        const cantidad =
          document
            .getElementById(
              "merchCantidad"
            )
            .value
            .trim();


        const comentarios =
          document
            .getElementById(
              "merchComentarios"
            )
            .value
            .trim();


        const website =
          document
            .getElementById(
              "website"
            )
            .value
            .trim();


        /* -------------------------------------------------
           VALIDACIÓN +18
        -------------------------------------------------- */

        if (
          productos ===
          "Colección Universo / Cerveza"
        ) {

          if (
            !confirmAge ||
            !confirmAge.checked
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>⚠ Confirmación requerida</strong>
                <p>
                  Para solicitar la Colección Universo
                  debes confirmar que eres mayor de 18 años.
                </p>
              </div>
              `
            );

            return;

          }

        }


        /* -------------------------------------------------
           ESTADO CARGANDO
        -------------------------------------------------- */

        if (merchSubmit) {

          merchSubmit.disabled =
            true;

          merchSubmit.dataset.originalText =
            merchSubmit.textContent;

          merchSubmit.textContent =
            "Enviando solicitud...";

        }


        showMerchMessage(
          "loading",
          `
          <div class="merch-message-card">
            <strong>Procesando solicitud...</strong>
            <p>
              Estamos registrando la información.
            </p>
          </div>
          `
        );


        try {

          /* -----------------------------------------------
             PETICIÓN
          ------------------------------------------------ */

          const response =
            await fetch(
              MERCH_ENDPOINT,
              {

                method: "POST",

                body:
                  new URLSearchParams({

                    nombre:
                      nombre,

                    email:
                      email,

                    telefono:
                      telefono,

                    productos:
                      productos,

                    cantidad:
                      cantidad,

                    comentarios:
                      comentarios,

                    website:
                      website,

                    token:
                      MERCH_TOKEN

                  })

              }
            );


          const data =
            String(
              await response.text()
            ).trim();


          /* -----------------------------------------------
             SOLICITUD RECIBIDA
          ------------------------------------------------ */

          if (
            data.startsWith(
              "RECIBIDO|"
            )
          ) {

            const partes =
              data.split("|");


            const folio =
              partes[1] || "";


            showMerchMessage(
              "success",
              `
              <div class="merch-success-card">

                <div
                  class="merch-success-icon"
                  aria-hidden="true"
                >
                  ✓
                </div>

                <span class="merch-success-label">
                  SOLICITUD RECIBIDA
                </span>

                <h3>
                  ¡Gracias por tu solicitud!
                </h3>

                <p>
                  Tu folio es:
                </p>

                <strong class="merch-folio">
                  ${escapeHTML(folio)}
                </strong>

                <p>
                  Te enviamos una confirmación por correo.
                  Mantente atento al medio de contacto que
                  proporcionaste para continuar con
                  disponibilidad y entrega.
                </p>

                <small>
                  Esta solicitud no representa todavía
                  una confirmación de compra.
                </small>

              </div>
              `
            );


            merchForm.reset();

            updateAgeRequirement();


            /* ---------------------------------------------
               ANALYTICS OPCIONAL
            ---------------------------------------------- */

            if (
              window.__GA18_ANALYTICS_LOADED &&
              typeof window.gtag ===
              "function"
            ) {

              window.gtag(
                "event",
                "merch_request",
                {

                  product:
                    productos

                }
              );

            }


            return;

          }


          /* -----------------------------------------------
             ERRORES DEL BACKEND
          ------------------------------------------------ */

          if (
            data === "ERROR_NOMBRE"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>⚠ Revisa tu nombre</strong>
                <p>
                  Ingresa un nombre válido para continuar.
                </p>
              </div>
              `
            );

          }


          else if (
            data === "ERROR_EMAIL"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>⚠ Correo no válido</strong>
                <p>
                  Revisa el correo electrónico e inténtalo nuevamente.
                </p>
              </div>
              `
            );

          }


          else if (
            data === "ERROR_TELEFONO"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>⚠ Revisa tu teléfono</strong>
                <p>
                  Ingresa un número de teléfono o WhatsApp válido.
                </p>
              </div>
              `
            );

          }


          else if (
            data === "ERROR_PRODUCTOS"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>⚠ Selecciona un producto</strong>
                <p>
                  Necesitamos saber qué producto deseas solicitar.
                </p>
              </div>
              `
            );

          }


          else if (
            data === "ERROR_CANTIDAD"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>⚠ Cantidad no válida</strong>
                <p>
                  Indica una cantidad válida entre 1 y 100.
                </p>
              </div>
              `
            );

          }


          else if (
            data === "ERROR_COMENTARIOS"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>⚠ Comentario demasiado largo</strong>
                <p>
                  Reduce el texto de tus comentarios e inténtalo nuevamente.
                </p>
              </div>
              `
            );

          }


          else if (
            data === "ERROR_LIMITE"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>⚠ Demasiadas solicitudes</strong>
                <p>
                  Se alcanzó temporalmente el límite de solicitudes.
                  Espera unos minutos antes de intentarlo nuevamente.
                </p>
              </div>
              `
            );

          }


          else if (
            data === "ERROR_REPETIDO"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>Solicitud ya recibida</strong>
                <p>
                  Detectamos un envío reciente con los mismos datos.
                  No es necesario enviarlo nuevamente.
                </p>
              </div>
              `
            );

          }


          else if (
            data === "ERROR_OCUPADO"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>Servicio ocupado</strong>
                <p>
                  Estamos procesando otras solicitudes.
                  Inténtalo nuevamente en unos momentos.
                </p>
              </div>
              `
            );

          }


          else if (
            data === "ERROR_CONTENIDO"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>⚠ No pudimos procesar el contenido</strong>
                <p>
                  Revisa los datos ingresados e inténtalo nuevamente.
                </p>
              </div>
              `
            );

          }


          else if (
            data === "ERROR_SPAM"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>No pudimos procesar la solicitud</strong>
                <p>
                  Inténtalo nuevamente.
                </p>
              </div>
              `
            );

          }


          else {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">
                <strong>⚠ No se pudo registrar la solicitud</strong>
                <p>
                  Inténtalo nuevamente más tarde o
                  contáctanos directamente por WhatsApp.
                </p>
              </div>
              `
            );

          }

        }

        catch (error) {

          console.error(
            "GamesAlone18 Merch:",
            error
          );


          showMerchMessage(
            "error",
            `
            <div class="merch-message-card">
              <strong>⚠ Error de conexión</strong>
              <p>
                No fue posible conectar con el sistema.
                Verifica tu conexión e inténtalo nuevamente.
              </p>
            </div>
            `
          );

        }

        finally {

          if (merchSubmit) {

            merchSubmit.disabled =
              false;


            merchSubmit.textContent =
              merchSubmit.dataset.originalText ||
              "Enviar solicitud";

          }

        }

      }
    );

  }


  /* =====================================================
     GOOGLE CONSENT - ESTADO INICIAL
  ====================================================== */

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
     ANALYTICS
  ====================================================== */

  function loadAnalytics() {

    if (
      window.__GA18_ANALYTICS_LOADED
    ) {

      return;

    }


    window.__GA18_ANALYTICS_LOADED =
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
      "G-EGZ2977YBH",
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
      "https://www.googletagmanager.com/gtag/js?id=G-EGZ2977YBH";


    document.head.appendChild(
      script
    );

  }


  /* =====================================================
     COOKIE CONSENT
  ====================================================== */

  const banner =
    document.getElementById(
      "cookie-consent"
    );


  const acceptButton =
    document.getElementById(
      "accept-cookies"
    );


  const rejectButton =
    document.getElementById(
      "reject-cookies"
    );


  if (
    banner &&
    acceptButton &&
    rejectButton
  ) {

    let consent =
      null;


    try {

      consent =
        localStorage.getItem(
          "ga18_cookie_consent"
        );

    }

    catch (error) {

      console.warn(
        "GamesAlone18: almacenamiento local no disponible."
      );

    }


    if (
      consent ===
      "accepted"
    ) {

      banner.classList.add(
        "cookie-hidden"
      );

      loadAnalytics();

    }


    else if (
      consent ===
      "rejected"
    ) {

      banner.classList.add(
        "cookie-hidden"
      );

    }


    else {

      banner.classList.remove(
        "cookie-hidden"
      );

    }


    acceptButton.addEventListener(
      "click",
      () => {

        try {

          localStorage.setItem(
            "ga18_cookie_consent",
            "accepted"
          );

        }

        catch (error) {

          console.warn(
            "GamesAlone18: no se pudo guardar el consentimiento."
          );

        }


        banner.classList.add(
          "cookie-hidden"
        );


        loadAnalytics();

      }
    );


    rejectButton.addEventListener(
      "click",
      () => {

        try {

          localStorage.setItem(
            "ga18_cookie_consent",
            "rejected"
          );

        }

        catch (error) {

          console.warn(
            "GamesAlone18: no se pudo guardar el rechazo."
          );

        }


        banner.classList.add(
          "cookie-hidden"
        );


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

})();
