/* =========================================================
   CHOCOLATE ARTÍSTICO SARITA
   CATÁLOGO → FORMULARIO
   2026
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(".catalogo-request[data-product]");
    const modal = document.getElementById("cotizacionModal");
    const tipoPedido = document.getElementById("tipoPedido");
    const productoProyecto = document.getElementById("productoProyecto");
    const cantidad = document.getElementById("cantidad");
    const formResponse = document.getElementById("formResponse");

    if (!buttons.length || !modal || !tipoPedido || !productoProyecto) {
        return;
    }

    function abrirPedidoCatalogo(producto) {

        tipoPedido.checked = true;
        tipoPedido.dispatchEvent(
            new Event("change", { bubbles: true })
        );

        productoProyecto.value = producto;
        productoProyecto.dispatchEvent(
            new Event("input", { bubbles: true })
        );

        if (formResponse) {
            formResponse.textContent = "";
            formResponse.classList.remove(
                "success",
                "error"
            );
        }

        modal.classList.add("active");
        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

        window.setTimeout(() => {

            if (cantidad) {
                cantidad.focus();
            } else {
                productoProyecto.focus();
            }

        }, 100);
    }

    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const producto = String(
                    button.dataset.product || ""
                ).trim();

                if (!producto) {
                    return;
                }

                abrirPedidoCatalogo(producto);
            }
        );

    });

});
