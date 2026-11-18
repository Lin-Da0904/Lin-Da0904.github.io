// Dibuja una galaxia en espiral progresivamente en cualquier <canvas id="...">
(function () {
    var animacionesGalaxia = {};

    window.dibujarGalaxia = function (canvasId) {
        var canvas = document.getElementById(canvasId);
        if (!canvas) return;

        if (animacionesGalaxia[canvasId]) {
            cancelAnimationFrame(animacionesGalaxia[canvasId]);
        }

        var ctx = canvas.getContext("2d");
        var width = (canvas.width = 780);
        var height = (canvas.height = 480);
        var TILT = 0.45;

        canvas.style.width = "100%";
        canvas.style.maxWidth = "780px";
        canvas.style.height = "auto";
        canvas.style.display = "block";
        canvas.style.margin = "0 auto";
        canvas.style.borderRadius = "16px";

        var seed = 7;
        function random() {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        }

        function uniform(min, max) {
            return min + random() * (max - min);
        }

        function randint(min, max) {
            return Math.floor(random() * (max - min + 1)) + min;
        }

        function gauss(mean, std) {
            var u = 0, v = 0;
            while (u === 0) u = random();
            while (v === 0) v = random();
            var num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            return num * std + mean;
        }

        function glow(h, v) {
            if (v === undefined) v = 1.0;
            h = ((h % 1) + 1) % 1;
            var s = 0.7;
            var i = Math.floor(h * 6);
            var f = h * 6 - i;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);

            var r, g, b;
            switch (i % 6) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                case 5: r = v; g = p; b = q; break;
            }
            return "rgb(" + Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255) + ")";
        }

        function dot(x, y, size, color) {
            ctx.beginPath();
            ctx.arc(width / 2 + x, height / 2 - y, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }

        var particulas = [];

        function guardarPunto(x, y, size, color) {
            y *= 0.55;
            var c = Math.cos(TILT);
            var s = Math.sin(TILT);
            particulas.push({
                x: x * c - y * s,
                y: x * s + y * c,
                size: size,
                color: color
            });
        }

        // Fondo
        ctx.fillStyle = "#03030b";
        ctx.fillRect(0, 0, width, height);

        // Estrellas fijas
        for (var i = 0; i < 140; i++) {
            dot(randint(-385, 385), randint(-235, 235), randint(1, 3), "white");
        }

        // 1. Polvo estelar
        for (var j = 0; j < 700; j++) {
            var r = gauss(0, 120);
            var a = uniform(0, 6.283);
            guardarPunto(r * Math.cos(a), r * Math.sin(a), randint(2, 4), glow(0.7, 0.3));
        }

        // 2. Núcleo (nace primero desde el centro)
        for (var n = 0; n < 260; n++) {
            var rc = gauss(0, 26);
            var ac = uniform(0, 6.283);
            guardarPunto(rc * Math.cos(ac), rc * Math.sin(ac), randint(2, 5), glow(0.12));
        }
        particulas.push({ x: 0, y: 0, size: 26, color: "#fff3c4" });

        // 3. Brazos en espiral (se van desplegando hacia afuera)
        var count = 900;
        for (var m = 0; m < count; m++) {
            for (var k = 0; k < 4; k++) {
                var d = m / count;
                var ang = (k * Math.PI) / 2 + d * 5.5;
                var rad = 10 + d * 290;
                var spread = 4 + d * 26;
                var x = rad * Math.cos(ang) + gauss(0, spread);
                var y = rad * Math.sin(ang) + gauss(0, spread);
                var hue = 0.13 - d * 0.55;
                var val = uniform(0.6, 1);
                var size = randint(2, 4);
                guardarPunto(x, y, size, glow(hue, val));
            }
        }

        // 4. Destellos finales
        for (var p = 0; p < 40; p++) {
            var rs = gauss(0, 150);
            var as = uniform(0, 6.283);
            guardarPunto(rs * Math.cos(as), rs * Math.sin(as), randint(5, 8), "white");
        }

        var indice = 0;
        var porFrame = 34;

        function animar() {
            var limite = Math.min(indice + porFrame, particulas.length);
            for (; indice < limite; indice++) {
                var pt = particulas[indice];
                dot(pt.x, pt.y, pt.size, pt.color);
            }
            if (indice < particulas.length) {
                animacionesGalaxia[canvasId] = requestAnimationFrame(animar);
            }
        }

        animacionesGalaxia[canvasId] = requestAnimationFrame(animar);
    };

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("canvas[data-galaxia]").forEach(function (el, idx) {
            if (!el.id) el.id = "galaxia-auto-" + idx;
            window.dibujarGalaxia(el.id);
        });
    });
})();