(() => {

  "use strict";


  /* =====================================================
     CONFIGURACIÓN MERCH
  ====================================================== */

  const MERCH_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbyyzzcsCub_MdFFAedrNSvkdbhB_4Ilw6NMqbMF6LbbS-kW6SmK2dI5-ZAF1QBM-5I/exec";

  const MERCH_TOKEN =
    "GA18MERCH";

  const MAX_ITEM_QUANTITY = 99;
  const MAX_TOTAL_QUANTITY = 100;


  /* =====================================================
     UTILIDADES
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


  function formatMoney(value) {

    return new Intl.NumberFormat(
      "es-MX",
      {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0
      }
    ).format(value);

  }


  function scrollToElement(element) {

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }


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
      (event) => {

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
     ELEMENTOS DEL CONSTRUCTOR
  ====================================================== */

  const merchItems =
    Array.from(
      document.querySelectorAll(
        "[data-merch-item]"
      )
    );


  const summaryEmpty =
    document.getElementById(
      "merchSummaryEmpty"
    );


  const summaryItems =
    document.getElementById(
      "merchSummaryItems"
    );


  const summaryTotals =
    document.getElementById(
      "merchSummaryTotals"
    );


  const totalItemsElement =
    document.getElementById(
      "merchTotalItems"
    );


  const referencePriceElement =
    document.getElementById(
      "merchReferencePrice"
    );


  const continueButton =
    document.getElementById(
      "merchContinue"
    );


  const clearButton =
    document.getElementById(
      "merchClear"
    );


  /* =====================================================
     ELEMENTOS DEL FORMULARIO
  ====================================================== */

  const merchForm =
    document.getElementById(
      "merchForm"
    );


  const productosInput =
    document.getElementById(
      "merchProducto"
    );


  const cantidadInput =
    document.getElementById(
      "merchCantidad"
    );


  const formSelection =
    document.getElementById(
      "merchFormSelection"
    );


  const formSelectionItems =
    document.getElementById(
      "merchFormSelectionItems"
    );


  const formReferencePrice =
    document.getElementById(
      "merchFormReferencePrice"
    );


  const editSelectionButton =
    document.getElementById(
      "merchEditSelection"
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


  const requestSection =
    document.getElementById(
      "solicitar"
    );


  const builderSection =
    document.getElementById(
      "armar-solicitud"
    );


  /* =====================================================
     ESTADO DE LA SELECCIÓN
  ====================================================== */

  const selection = new Map();


  merchItems.forEach(
    (item) => {

      const code =
        String(
          item.dataset.code || ""
        ).trim();


      if (!code) {
        return;
      }


      selection.set(
        code,
        {
          code: code,

          name:
            String(
              item.dataset.name || ""
            ).trim(),

          price:
            Number(
              item.dataset.price || 0
            ),

          alcohol:
            String(
              item.dataset.alcohol || ""
            ) === "true",

          quantity: 0,

          element: item
        }
      );

    }
  );


  /* =====================================================
     OBTENER PRODUCTOS SELECCIONADOS
  ====================================================== */

  function getSelectedItems() {

    return Array.from(
      selection.values()
    ).filter(
      (item) =>
        item.quantity > 0
    );

  }


  function getTotalQuantity() {

    return getSelectedItems()
      .reduce(
        (total, item) =>
          total + item.quantity,
        0
      );

  }


  function getReferenceTotal() {

    return getSelectedItems()
      .reduce(
        (total, item) =>
          total +
          (
            item.quantity *
            item.price
          ),
        0
      );

  }


  function containsAlcohol() {

    return getSelectedItems()
      .some(
        (item) =>
          item.alcohol
      );

  }


  /* =====================================================
     ACTUALIZAR CONTROLES + / -
  ====================================================== */

  function updateItemControl(item) {

    if (!item || !item.element) {
      return;
    }


    const valueElement =
      item.element.querySelector(
        ".merch-qty-value"
      );


    const minusButton =
      item.element.querySelector(
        ".merch-qty-minus"
      );


    const plusButton =
      item.element.querySelector(
        ".merch-qty-plus"
      );


    if (valueElement) {

      valueElement.textContent =
        String(item.quantity);

    }


    if (minusButton) {

      minusButton.disabled =
        item.quantity <= 0;

      minusButton.setAttribute(
        "aria-disabled",
        String(
          item.quantity <= 0
        )
      );

    }


    if (plusButton) {

      const total =
        getTotalQuantity();

      plusButton.disabled =
        item.quantity >=
          MAX_ITEM_QUANTITY ||
        total >=
          MAX_TOTAL_QUANTITY;

      plusButton.setAttribute(
        "aria-disabled",
        String(
          plusButton.disabled
        )
      );

    }


    item.element.classList.toggle(
      "has-selection",
      item.quantity > 0
    );

  }


  function updateAllControls() {

    selection.forEach(
      (item) => {

        updateItemControl(item);

      }
    );

  }


  /* =====================================================
     SERIALIZACIÓN PARA APPS SCRIPT
  ====================================================== */

  function buildBackendProductString() {

    return getSelectedItems()
      .map(
        (item) =>
          `${item.quantity}x ${item.name} ($${item.price})`
      )
      .join("; ");

  }


  /* =====================================================
     RESUMEN LATERAL
  ====================================================== */

  function renderSummary() {

    const selected =
      getSelectedItems();


    const totalQuantity =
      getTotalQuantity();


    const totalPrice =
      getReferenceTotal();


    if (
      productosInput
    ) {

      productosInput.value =
        buildBackendProductString();

    }


    if (
      cantidadInput
    ) {

      cantidadInput.value =
        totalQuantity > 0
          ? String(totalQuantity)
          : "";

    }


    if (
      summaryItems
    ) {

      summaryItems.innerHTML =
        selected
          .map(
            (item) => {

              const subtotal =
                item.quantity *
                item.price;


              return `
                <div class="merch-summary-item">

                  <div class="merch-summary-item-info">

                    <span class="merch-summary-item-name">
                      ${escapeHTML(item.name)}
                    </span>

                    <span class="merch-summary-item-price">
                      ${escapeHTML(
                        formatMoney(item.price)
                      )}
                      c/u ·
                      ${escapeHTML(
                        formatMoney(subtotal)
                      )}
                    </span>

                  </div>

                  <span class="merch-summary-item-quantity">
                    ${item.quantity} ×
                  </span>

                </div>
              `;

            }
          )
          .join("");

    }


    if (summaryEmpty) {

      summaryEmpty.hidden =
        selected.length > 0;

    }


    if (summaryTotals) {

      summaryTotals.hidden =
        selected.length === 0;

    }


    if (totalItemsElement) {

      totalItemsElement.textContent =
        String(totalQuantity);

    }


    if (referencePriceElement) {

      referencePriceElement.textContent =
        formatMoney(totalPrice);

    }


    updateAgeRequirement();

    updateAllControls();

  }


  /* =====================================================
     RESUMEN DENTRO DEL FORMULARIO
  ====================================================== */

  function renderFormSelection() {

    const selected =
      getSelectedItems();


    const totalPrice =
      getReferenceTotal();


    if (!selected.length) {

      if (formSelection) {

        formSelection.hidden =
          true;

      }

      if (formSelectionItems) {

        formSelectionItems.innerHTML =
          "";

      }

      return;

    }


    if (formSelection) {

      formSelection.hidden =
        false;

    }


    if (formSelectionItems) {

      formSelectionItems.innerHTML =
        selected
          .map(
            (item) => {

              const subtotal =
                item.quantity *
                item.price;


              return `
                <div class="merch-form-selection-item">

                  <span>
                    ${item.quantity} ×
                    ${escapeHTML(item.name)}
                  </span>

                  <strong>
                    ${escapeHTML(
                      formatMoney(subtotal)
                    )}
                  </strong>

                </div>
              `;

            }
          )
          .join("");

    }


    if (formReferencePrice) {

      formReferencePrice.textContent =
        formatMoney(totalPrice);

    }

  }


  /* =====================================================
     MAYORÍA DE EDAD
  ====================================================== */

  function updateAgeRequirement() {

    if (
      !ageConfirmation ||
      !confirmAge
    ) {

      return;

    }


    const required =
      containsAlcohol();


    ageConfirmation.hidden =
      !required;


    confirmAge.required =
      required;


    if (!required) {

      confirmAge.checked =
        false;

    }

  }


  /* =====================================================
     MODIFICAR CANTIDAD
  ====================================================== */

  function changeQuantity(
    code,
    difference
  ) {

    const item =
      selection.get(code);


    if (!item) {
      return;
    }


    const currentTotal =
      getTotalQuantity();


    if (
      difference > 0 &&
      currentTotal >=
        MAX_TOTAL_QUANTITY
    ) {

      return;

    }


    const newQuantity =
      Math.max(
        0,
        Math.min(
          MAX_ITEM_QUANTITY,
          item.quantity +
            difference
        )
      );


    item.quantity =
      newQuantity;


    renderSummary();

    renderFormSelection();

  }


  /* =====================================================
     EVENTOS + / -
  ====================================================== */

  merchItems.forEach(
    (element) => {

      const code =
        String(
          element.dataset.code || ""
        ).trim();


      const minusButton =
        element.querySelector(
          ".merch-qty-minus"
        );


      const plusButton =
        element.querySelector(
          ".merch-qty-plus"
        );


      if (minusButton) {

        minusButton.addEventListener(
          "click",
          () => {

            changeQuantity(
              code,
              -1
            );

          }
        );

      }


      if (plusButton) {

        plusButton.addEventListener(
          "click",
          () => {

            changeQuantity(
              code,
              1
            );

          }
        );

      }

    }
  );


  /* =====================================================
     VACIAR SELECCIÓN
  ====================================================== */

  function clearSelection() {

    selection.forEach(
      (item) => {

        item.quantity = 0;

      }
    );


    if (confirmAge) {

      confirmAge.checked =
        false;

    }


    renderSummary();

    renderFormSelection();

  }


  if (clearButton) {

    clearButton.addEventListener(
      "click",
      clearSelection
    );

  }


  /* =====================================================
     CONTINUAR AL FORMULARIO
  ====================================================== */

  if (continueButton) {

    continueButton.addEventListener(
      "click",
      () => {

        if (
          getTotalQuantity() <= 0
        ) {

          return;

        }


        renderFormSelection();


        scrollToElement(
          requestSection
        );


        window.setTimeout(
          () => {

            const nombre =
              document.getElementById(
                "merchNombre"
              );


            if (nombre) {

              nombre.focus({
                preventScroll: true
              });

            }

          },
          450
        );

      }
    );

  }


  /* =====================================================
     MODIFICAR SELECCIÓN
  ====================================================== */

  if (editSelectionButton) {

    editSelectionButton.addEventListener(
      "click",
      () => {

        scrollToElement(
          builderSection
        );

      }
    );

  }


  /* =====================================================
     ENLACES "AGREGAR A MI SOLICITUD"
  ====================================================== */

  document
    .querySelectorAll(
      ".product-request-link"
    )
    .forEach(
      (link) => {

        link.addEventListener(
          "click",
          () => {

            window.setTimeout(
              () => {

                if (builderSection) {

                  builderSection.focus?.();

                }

              },
              300
            );

          }
        );

      }
    );


  /* =====================================================
     MOSTRAR MENSAJES
  ====================================================== */

  function showMerchMessage(
    type,
    html
  ) {

    if (!merchResponse) {
      return;
    }


    merchResponse.className =
      "merch-response " +
      type;


    merchResponse.innerHTML =
      html;

  }


  /* =====================================================
     LIMPIAR MENSAJE
  ====================================================== */

  function clearMerchMessage() {

    if (!merchResponse) {
      return;
    }


    merchResponse.className =
      "merch-response";


    merchResponse.innerHTML =
      "";

  }


  /* =====================================================
     VALIDACIÓN DE SELECCIÓN
  ====================================================== */

  function validateSelection() {

    const total =
      getTotalQuantity();


    if (total <= 0) {

      showMerchMessage(
        "error",
        `
        <div class="merch-message-card">
          <strong>⚠ Selecciona al menos un producto</strong>
          <p>
            Regresa a “Arma tu solicitud” y agrega
            uno o más productos antes de continuar.
          </p>
        </div>
        `
      );


      scrollToElement(
        builderSection
      );


      return false;

    }


    if (
      total >
      MAX_TOTAL_QUANTITY
    ) {

      showMerchMessage(
        "error",
        `
        <div class="merch-message-card">
          <strong>⚠ Cantidad no válida</strong>
          <p>
            La solicitud admite hasta
            ${MAX_TOTAL_QUANTITY}
            artículos en total.
          </p>
        </div>
        `
      );


      return false;

    }


    const productString =
      buildBackendProductString();


    if (
      !productString ||
      productString.length > 500
    ) {

      showMerchMessage(
        "error",
        `
        <div class="merch-message-card">
          <strong>⚠ No pudimos preparar la selección</strong>
          <p>
            Revisa los productos seleccionados
            e inténtalo nuevamente.
          </p>
        </div>
        `
      );


      return false;

    }


    return true;

  }


  /* =====================================================
     ENVÍO DEL FORMULARIO
  ====================================================== */

  if (merchForm) {

    merchForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        clearMerchMessage();


        /* -----------------------------------------------
           SELECCIÓN
        ------------------------------------------------ */

        if (!validateSelection()) {

          return;

        }


        renderFormSelection();


        /* -----------------------------------------------
           VALIDACIÓN NATIVA
        ------------------------------------------------ */

        if (!merchForm.checkValidity()) {

          merchForm.reportValidity();

          return;

        }


        /* -----------------------------------------------
           +18
        ------------------------------------------------ */

        if (
          containsAlcohol() &&
          (
            !confirmAge ||
            !confirmAge.checked
          )
        ) {

          showMerchMessage(
            "error",
            `
            <div class="merch-message-card">

              <strong>
                ⚠ Confirmación requerida
              </strong>

              <p>
                Tu solicitud incluye bebidas
                alcohólicas. Para continuar debes
                confirmar que eres mayor de 18 años.
              </p>

            </div>
            `
          );


          if (confirmAge) {

            confirmAge.focus();

          }


          return;

        }


        /* -----------------------------------------------
           DATOS
        ------------------------------------------------ */

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
          buildBackendProductString();


        const cantidad =
          String(
            getTotalQuantity()
          );


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


        /* -----------------------------------------------
           SINCRONIZAR HIDDEN
        ------------------------------------------------ */

        if (productosInput) {

          productosInput.value =
            productos;

        }


        if (cantidadInput) {

          cantidadInput.value =
            cantidad;

        }


        /* -----------------------------------------------
           CARGANDO
        ------------------------------------------------ */

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

            <strong>
              Procesando solicitud...
            </strong>

            <p>
              Estamos registrando la información.
            </p>

          </div>
          `
        );


        try {

          /* ---------------------------------------------
             PETICIÓN
          ---------------------------------------------- */

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


          /* ---------------------------------------------
             RECIBIDO
          ---------------------------------------------- */

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
                  Mantente atento al medio de contacto
                  proporcionado para confirmar existencia,
                  precio y entrega.
                </p>

                <small>
                  Esta solicitud no representa todavía
                  una confirmación de compra.
                </small>

              </div>
              `
            );


            /* -------------------------------------------
               ANALYTICS
            -------------------------------------------- */

            if (
              window.__GA18_ANALYTICS_LOADED &&
              typeof window.gtag ===
              "function"
            ) {

              window.gtag(
                "event",
                "merch_request",
                {

                  item_count:
                    getTotalQuantity(),

                  has_alcohol:
                    containsAlcohol()

                }
              );

            }


            /* -------------------------------------------
               RESETEAR DESPUÉS DE ÉXITO
            -------------------------------------------- */

            merchForm.reset();

            clearSelection();


            if (formSelection) {

              formSelection.hidden =
                true;

            }


            return;

          }


          /* ---------------------------------------------
             ERRORES BACKEND
          ---------------------------------------------- */

          if (
            data === "ERROR_NOMBRE"
          ) {

            showMerchMessage(
              "error",
              `
              <div class="merch-message-card">

                <strong>
                  ⚠ Revisa tu nombre
                </strong>

                <p>
                  Ingresa un nombre válido
                  para continuar.
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

                <strong>
                  ⚠ Correo no válido
                </strong>

                <p>
                  Revisa el correo electrónico
                  e inténtalo nuevamente.
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

                <strong>
                  ⚠ Revisa tu teléfono
                </strong>

                <p>
                  Ingresa un número de teléfono
                  o WhatsApp válido.
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

                <strong>
                  ⚠ Revisa los productos
                </strong>

                <p>
                  No pudimos procesar la selección
                  de productos.
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

                <strong>
                  ⚠ Cantidad no válida
                </strong>

                <p>
                  La cantidad total debe estar
                  entre 1 y 100 artículos.
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

                <strong>
                  ⚠ Comentario demasiado largo
                </strong>

                <p>
                  Reduce el texto de tus comentarios
                  e inténtalo nuevamente.
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

                <strong>
                  ⚠ Demasiadas solicitudes
                </strong>

                <p>
                  Se alcanzó temporalmente el límite
                  de solicitudes. Espera unos minutos
                  antes de intentarlo nuevamente.
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

                <strong>
                  Solicitud ya recibida
                </strong>

                <p>
                  Detectamos un envío reciente con
                  los mismos datos. No es necesario
                  enviarlo nuevamente.
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

                <strong>
                  Servicio ocupado
                </strong>

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

                <strong>
                  ⚠ No pudimos procesar el contenido
                </strong>

                <p>
                  Revisa los datos ingresados
                  e inténtalo nuevamente.
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

                <strong>
                  No pudimos procesar la solicitud
                </strong>

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

                <strong>
                  ⚠ No se pudo registrar la solicitud
                </strong>

                <p>
                  Inténtalo nuevamente más tarde
                  o contáctanos directamente
                  por WhatsApp.
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

              <strong>
                ⚠ Error de conexión
              </strong>

              <p>
                No fue posible conectar con el sistema.
                Verifica tu conexión e inténtalo
                nuevamente.
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
     ESTADO INICIAL DEL CONSTRUCTOR
  ====================================================== */

  renderSummary();

  renderFormSelection();


  /* =====================================================
     GOOGLE CONSENT
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
     GOOGLE ANALYTICS
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
      consent === "accepted"
    ) {

      banner.classList.add(
        "cookie-hidden"
      );


      loadAnalytics();

    }


    else if (
      consent === "rejected"
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
