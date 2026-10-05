(() => {

  "use strict";


  /* =========================================================
     CONFIGURACIÓN
  ========================================================= */

  const API_URL =
    "https://script.google.com/macros/s/AKfycbw-wkJ3dP0lV8KCpr7m-VwBrE81lOHwVxplcNi_seHWKp6SDW-aWGz90t17oMxBlYE/exec";


  const TIME_ZONE =
    "America/Mexico_City";


  /* =========================================================
     ELEMENTOS
  ========================================================= */

  const menuToggle =
    document.getElementById(
      "menuToggle"
    );


  const mainNav =
    document.getElementById(
      "mainNav"
    );


  const monthNavigation =
    document.getElementById(
      "monthNavigation"
    );


  const agendaContent =
    document.getElementById(
      "agendaContent"
    );


  const agendaLoading =
    document.getElementById(
      "agendaLoading"
    );


  const agendaError =
    document.getElementById(
      "agendaError"
    );


  const agendaEmpty =
    document.getElementById(
      "agendaEmpty"
    );


  const upcomingCount =
    document.getElementById(
      "upcomingCount"
    );


  const currentMonthLabel =
    document.getElementById(
      "currentMonthLabel"
    );


  const cookieBanner =
    document.getElementById(
      "cookie-consent"
    );


  const acceptCookies =
    document.getElementById(
      "accept-cookies"
    );


  const rejectCookies =
    document.getElementById(
      "reject-cookies"
    );


  const cookiePreferences =
    document.getElementById(
      "cookiePreferences"
    );


  /* =========================================================
     ESTADO
  ========================================================= */

  let allEvents =
    [];


  let months =
    [];


  let activeMonth =
    null;


  /* =========================================================
     MENÚ MÓVIL
  ========================================================= */

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


  /* =========================================================
     FECHA LOCAL CDMX
  ========================================================= */

  function getTodayParts() {

    const formatter =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone:
            TIME_ZONE,

          year:
            "numeric",

          month:
            "2-digit",

          day:
            "2-digit"
        }
      );


    const parts =
      formatter.formatToParts(
        new Date()
      );


    const values =
      {};


    parts.forEach(
      part => {

        if (
          part.type !==
          "literal"
        ) {

          values[
            part.type
          ] =
            part.value;

        }

      }
    );


    return {

      year:
        Number(
          values.year
        ),

      month:
        Number(
          values.month
        ),

      day:
        Number(
          values.day
        ),

      iso:
        `${values.year}-${values.month}-${values.day}`

    };

  }


  /* =========================================================
     PARSEAR FECHA
  ========================================================= */

  function parseDate(
    isoDate
  ) {

    if (
      !isoDate ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        isoDate
      )
    ) {

      return null;

    }


    const [
      year,
      month,
      day
    ] =
      isoDate
        .split("-")
        .map(Number);


    if (
      !year ||
      !month ||
      !day
    ) {

      return null;

    }


    return {

      year,
      month,
      day,

      iso:
        isoDate,

      monthKey:
        `${year}-${String(month).padStart(2, "0")}`

    };

  }


  /* =========================================================
     COMPARAR FECHAS
  ========================================================= */

  function compareISODate(
    a,
    b
  ) {

    return String(a)
      .localeCompare(
        String(b)
      );

  }


  /* =========================================================
     NORMALIZAR EVENTOS
  ========================================================= */

  function normalizeEvents(
    events
  ) {

    if (
      !Array.isArray(events)
    ) {

      return [];

    }


    return events
      .map(
        event => {

          const date =
            parseDate(
              event.fecha
            );


          if (!date) {
            return null;
          }


          return {

            id:
              String(
                event.id || ""
              ).trim(),

            fecha:
              date.iso,

            date,

            hora:
              String(
                event.hora || ""
              ).trim(),

            tipo:
              String(
                event.tipo || ""
              ).trim(),

            titulo:
              String(
                event.titulo || ""
              ).trim(),

            lugar:
              String(
                event.lugar || ""
              ).trim(),

            modalidad:
              String(
                event.modalidad || ""
              ).trim(),

            descripcion:
              String(
                event.descripcion || ""
              ).trim(),

            enlace:
              String(
                event.enlace || ""
              ).trim(),

            textoBoton:
              String(
                event.texto_boton ||
                "Ver más"
              ).trim(),

            imagen:
              String(
                event.imagen || ""
              ).trim(),

            estado:
              String(
                event.estado || ""
              )
                .trim()
                .toUpperCase()

          };

        }
      )
      .filter(Boolean)
      .sort(
        (a, b) => {

          const dateCompare =
            compareISODate(
              a.fecha,
              b.fecha
            );


          if (
            dateCompare !== 0
          ) {

            return dateCompare;

          }


          return String(
            a.hora
          ).localeCompare(
            String(
              b.hora
            )
          );

        }
      );

  }


  /* =========================================================
     ESTADO AUTOMÁTICO
  ========================================================= */

  function getEventStatus(
    event
  ) {

    const today =
      getTodayParts();


    if (
      event.estado ===
      "CANCELADO"
    ) {

      return {
        label:
          "CANCELADO",

        className:
          "finished",

        finished:
          true
      };

    }


    if (
      event.fecha ===
      today.iso
    ) {

      return {
        label:
          "HOY",

        className:
          "today",

        finished:
          false
      };

    }


    if (
      compareISODate(
        event.fecha,
        today.iso
      ) < 0
    ) {

      return {
        label:
          "FINALIZADO",

        className:
          "finished",

        finished:
          true
      };

    }


    return {

      label:
        event.estado ||
        "PRÓXIMAMENTE",

      className:
        "",

      finished:
        false

    };

  }


  /* =========================================================
     NOMBRES DE MES
  ========================================================= */

  function getMonthName(
    month
  ) {

    const names =
      [
        "ENERO",
        "FEBRERO",
        "MARZO",
        "ABRIL",
        "MAYO",
        "JUNIO",
        "JULIO",
        "AGOSTO",
        "SEPTIEMBRE",
        "OCTUBRE",
        "NOVIEMBRE",
        "DICIEMBRE"
      ];


    return names[
      month - 1
    ] || "";

  }


  function getShortMonthName(
    month
  ) {

    const names =
      [
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


    return names[
      month - 1
    ] || "";

  }


  /* =========================================================
     MESES DISPONIBLES
  ========================================================= */

  function buildMonths() {

    const map =
      new Map();


    allEvents.forEach(
      event => {

        const key =
          event.date.monthKey;


        if (
          !map.has(key)
        ) {

          map.set(
            key,
            {
              key,

              year:
                event.date.year,

              month:
                event.date.month,

              events:
                []
            }
          );

        }


        map
          .get(key)
          .events
          .push(event);

      }
    );


    months =
      Array.from(
        map.values()
      ).sort(
        (a, b) =>
          a.key.localeCompare(
            b.key
          )
      );

  }


  /* =========================================================
     MES INICIAL
  ========================================================= */

  function selectInitialMonth() {

    if (
      months.length === 0
    ) {

      activeMonth =
        null;

      return;

    }


    const today =
      getTodayParts();


    const currentKey =
      `${today.year}-${String(today.month).padStart(2, "0")}`;


    const exactMonth =
      months.find(
        month =>
          month.key ===
          currentKey
      );


    if (exactMonth) {

      activeMonth =
        exactMonth.key;

      return;

    }


    const nextMonth =
      months.find(
        month =>
          month.key >
          currentKey
      );


    if (nextMonth) {

      activeMonth =
        nextMonth.key;

      return;

    }


    activeMonth =
      months[
        months.length - 1
      ].key;

  }


  /* =========================================================
     RESUMEN HERO
  ========================================================= */

  function updateSummary() {

    const today =
      getTodayParts();


    const upcoming =
      allEvents.filter(
        event => {

          const status =
            getEventStatus(
              event
            );


          return (
            compareISODate(
              event.fecha,
              today.iso
            ) >= 0 &&
            event.estado !==
              "CANCELADO" &&
            !status.finished
          );

        }
      );


    if (upcomingCount) {

      upcomingCount.textContent =
        String(
          upcoming.length
        );

    }


    if (
      currentMonthLabel
    ) {

      currentMonthLabel.textContent =
        `${getShortMonthName(today.month)} ${today.year}`;

    }

  }


  /* =========================================================
     CREAR ELEMENTO SEGURO
  ========================================================= */

  function createElement(
    tag,
    className,
    text
  ) {

    const element =
      document.createElement(
        tag
      );


    if (className) {

      element.className =
        className;

    }


    if (
      text !== undefined &&
      text !== null
    ) {

      element.textContent =
        text;

    }


    return element;

  }


  /* =========================================================
     DETALLE DEL EVENTO
  ========================================================= */

  function addDetail(
    container,
    text
  ) {

    if (!text) {
      return;
    }


    const detail =
      createElement(
        "span",
        "event-detail",
        text
      );


    container.appendChild(
      detail
    );

  }


  /* =========================================================
     VALIDAR URL
  ========================================================= */

  function getSafeURL(
    value
  ) {

    if (!value) {
      return null;
    }


    try {

      const url =
        new URL(
          value,
          window.location.origin
        );


      if (
        url.protocol !==
          "http:" &&
        url.protocol !==
          "https:"
      ) {

        return null;

      }


      return url.href;

    }

    catch (error) {

      return null;

    }

  }


  /* =========================================================
     CREAR TARJETA
  ========================================================= */

  function createEventCard(
    event
  ) {

    const status =
      getEventStatus(
        event
      );


    const article =
      createElement(
        "article",
        "event-card"
      );


    if (
      status.finished
    ) {

      article.classList.add(
        "is-finished"
      );

    }


    if (event.id) {

      article.dataset.eventId =
        event.id;

    }


    /* FECHA */

    const dateBox =
      createElement(
        "div",
        "event-date"
      );


    dateBox.appendChild(
      createElement(
        "span",
        "event-day",
        String(
          event.date.day
        ).padStart(
          2,
          "0"
        )
      )
    );


    dateBox.appendChild(
      createElement(
        "span",
        "event-month",
        getShortMonthName(
          event.date.month
        )
      )
    );


    dateBox.appendChild(
      createElement(
        "span",
        "event-year",
        String(
          event.date.year
        )
      )
    );


    article.appendChild(
      dateBox
    );


    /* INFORMACIÓN */

    const main =
      createElement(
        "div",
        "event-main"
      );


    const badges =
      createElement(
        "div",
        "event-badges"
      );


    if (event.tipo) {

      badges.appendChild(
        createElement(
          "span",
          "event-badge type",
          event.tipo
        )
      );

    }


    const statusBadge =
      createElement(
        "span",
        "event-badge",
        status.label
      );


    if (
      status.className
    ) {

      statusBadge.classList.add(
        status.className
      );

    }


    badges.appendChild(
      statusBadge
    );


    main.appendChild(
      badges
    );


    main.appendChild(
      createElement(
        "h3",
        "event-title",
        event.titulo ||
        "Actividad GamesAlone18"
      )
    );


    if (
      event.descripcion
    ) {

      main.appendChild(
        createElement(
          "p",
          "event-description",
          event.descripcion
        )
      );

    }


    const details =
      createElement(
        "div",
        "event-details"
      );


    if (
      event.hora
    ) {

      addDetail(
        details,
        `${event.hora} hrs`
      );

    }


    addDetail(
      details,
      event.lugar
    );


    addDetail(
      details,
      event.modalidad
    );


    if (
      details.children.length >
      0
    ) {

      main.appendChild(
        details
      );

    }


    article.appendChild(
      main
    );


    /* BOTÓN */

    const safeURL =
      getSafeURL(
        event.enlace
      );


    if (
      safeURL &&
      !status.finished
    ) {

      const action =
        createElement(
          "div",
          "event-action"
        );


      const link =
        createElement(
          "a",
          "event-button"
        );


      link.href =
        safeURL;


      link.textContent =
        event.textoBoton ||
        "Ver más";


      const arrow =
        createElement(
          "span",
          "",
          "→"
        );


      arrow.setAttribute(
        "aria-hidden",
        "true"
      );


      link.appendChild(
        arrow
      );


      if (
        new URL(
          safeURL
        ).origin !==
        window.location.origin
      ) {

        link.target =
          "_blank";

        link.rel =
          "noopener noreferrer";

      }


      action.appendChild(
        link
      );


      article.appendChild(
        action
      );

    }


    return article;

  }


  /* =========================================================
     RENDER MESES
  ========================================================= */

  function renderMonthNavigation() {

    if (
      !monthNavigation
    ) {

      return;

    }


    monthNavigation.replaceChildren();


    months.forEach(
      month => {

        const button =
          createElement(
            "button",
            "month-button",
            `${getShortMonthName(month.month)} ${month.year}`
          );


        button.type =
          "button";


        button.dataset.month =
          month.key;


        if (
          month.key ===
          activeMonth
        ) {

          button.classList.add(
            "is-active"
          );


          button.setAttribute(
            "aria-current",
            "true"
          );

        }


        button.addEventListener(
          "click",
          () => {

            activeMonth =
              month.key;


            renderMonthNavigation();

            renderActiveMonth();

          }
        );


        monthNavigation.appendChild(
          button
        );

      }
    );

  }


  /* =========================================================
     RENDER MES ACTIVO
  ========================================================= */

  function renderActiveMonth() {

    if (
      !agendaContent
    ) {

      return;

    }


    agendaContent.replaceChildren();


    const selected =
      months.find(
        month =>
          month.key ===
          activeMonth
      );


    if (
      !selected ||
      selected.events.length === 0
    ) {

      showEmpty();

      return;

    }


    hideEmpty();


    const section =
      createElement(
        "section",
        "agenda-month"
      );


    const heading =
      createElement(
        "div",
        "month-heading"
      );


    heading.appendChild(
      createElement(
        "h3",
        "",
        `${getMonthName(selected.month)} ${selected.year}`
      )
    );


    heading.appendChild(
      createElement(
        "span"
      )
    );


    section.appendChild(
      heading
    );


    selected.events.forEach(
      event => {

        section.appendChild(
          createEventCard(
            event
          )
        );

      }
    );


    agendaContent.appendChild(
      section
    );

  }


  /* =========================================================
     ESTADOS DE INTERFAZ
  ========================================================= */

  function showLoading() {

    if (agendaLoading) {

      agendaLoading.style.display =
        "flex";

    }


    if (agendaError) {

      agendaError.classList.add(
        "is-hidden"
      );

    }


    if (agendaEmpty) {

      agendaEmpty.classList.add(
        "is-hidden"
      );

    }

  }


  function hideLoading() {

    if (agendaLoading) {

      agendaLoading.style.display =
        "none";

    }

  }


  function showError() {

    hideLoading();


    if (agendaError) {

      agendaError.classList.remove(
        "is-hidden"
      );

    }


    if (agendaContent) {

      agendaContent.replaceChildren();

    }


    if (monthNavigation) {

      monthNavigation.replaceChildren();

    }

  }


  function showEmpty() {

    if (agendaEmpty) {

      agendaEmpty.classList.remove(
        "is-hidden"
      );

    }

  }


  function hideEmpty() {

    if (agendaEmpty) {

      agendaEmpty.classList.add(
        "is-hidden"
      );

    }

  }


  /* =========================================================
     CARGAR AGENDA
  ========================================================= */

  async function loadAgenda() {

    showLoading();


    try {

      const response =
        await fetch(
          API_URL,
          {
            method:
              "GET",

            cache:
              "no-store",

            redirect:
              "follow",

            headers:
              {
                "Accept":
                  "application/json"
              }
          }
        );


      if (
        !response.ok
      ) {

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
          data.eventos
        )
      ) {

        throw new Error(
          "Respuesta inválida de la agenda."
        );

      }


      allEvents =
        normalizeEvents(
          data.eventos
        );


      hideLoading();


      if (
        allEvents.length === 0
      ) {

        if (upcomingCount) {

          upcomingCount.textContent =
            "0";

        }


        buildMonths();

        renderMonthNavigation();

        showEmpty();

        return;

      }


      buildMonths();

      selectInitialMonth();

      updateSummary();

      renderMonthNavigation();

      renderActiveMonth();

    }

    catch (error) {

      console.error(
        "GamesAlone18 Agenda:",
        error
      );


      showError();

    }

  }


  /* =========================================================
     GOOGLE ANALYTICS
  ========================================================= */

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
      "GamesAlone18: localStorage no disponible."
    );

  }


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


  /* =========================================================
     COOKIES
  ========================================================= */

  if (
    cookieBanner &&
    acceptCookies &&
    rejectCookies
  ) {

    if (
      consent ===
      "accepted"
    ) {

      cookieBanner.classList.add(
        "cookie-hidden"
      );


      window.addEventListener(
        "load",
        () => {

          window.setTimeout(
            loadAnalytics,
            1200
          );

        },
        {
          once:
            true
        }
      );

    }

    else if (
      consent ===
      "rejected"
    ) {

      cookieBanner.classList.add(
        "cookie-hidden"
      );

    }

    else {

      cookieBanner.classList.remove(
        "cookie-hidden"
      );

    }


    /* ACEPTAR */

    acceptCookies.addEventListener(
      "click",
      () => {

        try {

          localStorage.setItem(
            "ga18_cookie_consent",
            "accepted"
          );

        }

        catch (error) {}


        cookieBanner.classList.add(
          "cookie-hidden"
        );


        loadAnalytics();

      }
    );


    /* RECHAZAR */

    rejectCookies.addEventListener(
      "click",
      () => {

        try {

          localStorage.setItem(
            "ga18_cookie_consent",
            "rejected"
          );

        }

        catch (error) {}


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


        cookieBanner.classList.add(
          "cookie-hidden"
        );

      }
    );

  }


  /* =========================================================
     PREFERENCIAS DE COOKIES
  ========================================================= */

  if (
    cookiePreferences &&
    cookieBanner
  ) {

    cookiePreferences.addEventListener(
      "click",
      () => {

        cookieBanner.classList.remove(
          "cookie-hidden"
        );


        if (
          acceptCookies
        ) {

          acceptCookies.focus();

        }

      }
    );

  }


  /* =========================================================
     INICIAR
  ========================================================= */

  loadAgenda();


})();
