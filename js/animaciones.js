// Animaciones suaves: las tarjetas aparecen al hacer scroll
// y al tocar un sticker salen corazoncitos.
// Uso: <script src="js/animaciones.js"></script> en el <head>
//      (en las páginas de citas/ usa src="../js/animaciones.js").
(function () {
  var reducir = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animar = !reducir && "IntersectionObserver" in window;

  // Se marca antes de pintar la página para que nada parpadee
  if (animar) document.documentElement.classList.add("js-anim");

  function corazoncitos(e) {
    for (var i = 0; i < 6; i++) {
      var c = document.createElement("span");
      c.className = "corazoncito";
      c.textContent = i % 2 ? "💜" : "🖤";
      c.style.left = e.clientX + "px";
      c.style.top = e.clientY + "px";
      c.style.setProperty("--x", Math.round(Math.random() * 90 - 45) + "px");
      c.style.animationDelay = i * 0.06 + "s";
      c.addEventListener("animationend", function () { this.remove(); });
      document.body.appendChild(c);
      // Respaldo por si el navegador no avisa que terminó la animación
      setTimeout(c.remove.bind(c), 1600);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (animar) {
      var piezas = document.querySelectorAll(
        ".cita-card, .lugares li, .panel, .frase, .polaroid, .titulo-seccion"
      );
      var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observador.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

      piezas.forEach(function (el) {
        // Los hermanos entran uno tras otro, como en cascada
        var i = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.setProperty("--retraso", (i % 6) * 0.08 + "s");
        el.classList.add("revelar");
        observador.observe(el);
      });

      // Seguro: si el navegador nunca avisa, se muestra todo para que nada quede escondido
      setTimeout(function () {
        if (!document.querySelector(".revelar.visible")) {
          piezas.forEach(function (el) { el.classList.add("visible"); });
        }
      }, 2500);

      document.querySelectorAll(".sticker, .sticker-esquina, .despedida-sticker, .pie-stickers img")
        .forEach(function (el) { el.addEventListener("click", corazoncitos); });
    }
  });
})();
