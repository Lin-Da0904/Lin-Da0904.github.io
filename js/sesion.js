// Candado decorativo: no es seguridad real, solo hace la página un poquito más nuestra.
// Uso: <script src="js/sesion.js" data-raiz=""></script> en el <head>
//      (en las páginas de citas/ usa src="../js/sesion.js" data-raiz="../").
(function () {
  var raiz = document.currentScript.getAttribute("data-raiz") || "";
  var sesion = null;

  try { sesion = JSON.parse(localStorage.getItem("citas-sesion")); } catch (e) {}

  if (!sesion) {
    try { sessionStorage.setItem("citas-volver", location.href); } catch (e) {}
    document.documentElement.style.visibility = "hidden";
    location.replace(raiz + "login.html");
    return;
  }

  window.cerrarSesion = function () {
    try { localStorage.removeItem("citas-sesion"); } catch (e) {}
    location.href = raiz + "login.html";
  };

  // Pone el nombre de quien entró en cualquier elemento con data-nombre
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-nombre]").forEach(function (el) {
      el.textContent = sesion.nombre;
    });
  });
})();
