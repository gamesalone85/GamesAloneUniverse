(() => {

  "use strict";


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

          mainNav.classList.remove("is-open");

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

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

      window.dataLayer.push(arguments);

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
      document.createElement("script");


    script.async = true;


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

    let consent = null;


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


    /* =================================================
       CONSENTIMIENTO YA OTORGADO
    ================================================== */

    if (
      consent === "accepted"
    ) {

      banner.classList.add(
        "cookie-hidden"
      );

      loadAnalytics();

    }


    /* =================================================
       CONSENTIMIENTO YA RECHAZADO
    ================================================== */

    else if (
      consent === "rejected"
    ) {

      banner.classList.add(
        "cookie-hidden"
      );

    }


    /* =================================================
       SIN DECISIÓN
    ================================================== */

    else {

      banner.classList.remove(
        "cookie-hidden"
      );

    }


    /* =================================================
       ACEPTAR
    ================================================== */

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


    /* =================================================
       RECHAZAR
    ================================================== */

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
