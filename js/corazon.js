// Dibuja un corazón morado de partículas progresivamente en cualquier <canvas id="...">
(function () {
    var animacionesCorazon = {};

    window.dibujarCorazonMorado = function (canvasId) {
        var canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Si ya había una animación corriendo en este canvas, la reiniciamos
        if (animacionesCorazon[canvasId]) {
            cancelAnimationFrame(animacionesCorazon[canvasId]);
        }

        var ctx = canvas.getContext("2d");
        var width = (canvas.width = 780);
        var height = (canvas.height = 480);

        canvas.style.width = "100%";
        canvas.style.maxWidth = "780px";
        canvas.style.height = "auto";
        canvas.style.display = "block";
        canvas.style.margin = "0 auto";
        canvas.style.borderRadius = "16px";

        var seed = 14;
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

        function glow(h, s, v) {
            if (s === undefined) s = 0.78;
            if (v === undefined) v = 1.0;
            h = ((h % 1) + 1) % 1;
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

        function heartCoords(t, scale) {
            var x = 16 * Math.pow(Math.sin(t), 3);
            var y =
                13 * Math.cos(t) -
                5 * Math.cos(2 * t) -
                2 * Math.cos(3 * t) -
                Math.cos(4 * t);
            return { x: x * scale, y: (y + 1.8) * scale };
        }

        // Fondo espacial con matiz violeta
        ctx.fillStyle = "#06030e";
        ctx.fillRect(0, 0, width, height);

        // Estrellas de fondo (aparecen desde el inicio)
        for (var i = 0; i < 150; i++) {
            dot(randint(-385, 385), randint(-235, 235), randint(1, 3), "white");
        }

        // Guardamos todas las partículas en orden para irlas dibujando poco a poco
        var particulas = [];

        // 1. Nebulosa morada difusa
        for (var j = 0; j < 800; j++) {
            var tn = uniform(0, Math.PI * 2);
            var sn = gauss(9, 2.8);
            var posN = heartCoords(tn, sn);
            particulas.push({
                x: posN.x + gauss(0, 22),
                y: posN.y + gauss(0, 22),
                size: randint(2, 5),
                color: glow(uniform(0.74, 0.82), 0.75, 0.32)
            });
        }

        // 2. Cuerpo del corazón
        var totalParticles = 3400;
        for (var k = 0; k < totalParticles; k++) {
            var t = uniform(0, Math.PI * 2);
            var factor = Math.pow(random(), 0.35);
            var scale = factor * 11.2;
            var spread = 2 + factor * 7;

            var pos = heartCoords(t, scale);
            var hue = 0.75 + factor * 0.09 + uniform(-0.02, 0.02);
            var sat = 0.65 + (1 - factor) * 0.25;
            var val = uniform(0.65, 1.0);

            particulas.push({
                x: pos.x + gauss(0, spread),
                y: pos.y + gauss(0, spread),
                size: randint(2, 4),
                color: glow(hue, sat, val)
            });
        }

        // 3. Núcleo brillante
        for (var m = 0; m < 250; m++) {
            var tc = uniform(0, Math.PI * 2);
            var sc = uniform(0, 3.2);
            var posC = heartCoords(tc, sc);
            particulas.push({
                x: posC.x + gauss(0, 8),
                y: posC.y + gauss(0, 8),
                size: randint(2, 4),
                color: glow(0.81, 0.45, 1.0)
            });
        }

        // 4. Destellos lavanda
        for (var n = 0; n < 45; n++) {
            var ts = uniform(0, Math.PI * 2);
            var ss = uniform(3, 11.5);
            var posS = heartCoords(ts, ss);
            particulas.push({
                x: posS.x + gauss(0, 10),
                y: posS.y + gauss(0, 10),
                size: randint(4, 7),
                color: "#f3e8ff"
            });
        }

        // Animación frame a frame (~2.5 segundos en completarse)
        var indice = 0;
        var porFrame = 32;

        function animar() {
            var limite = Math.min(indice + porFrame, particulas.length);
            for (; indice < limite; indice++) {
                var p = particulas[indice];
                dot(p.x, p.y, p.size, p.color);
            }
            if (indice < particulas.length) {
                animacionesCorazon[canvasId] = requestAnimationFrame(animar);
            }
        }

        animacionesCorazon[canvasId] = requestAnimationFrame(animar);
    };

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("canvas[data-corazon]").forEach(function (el, idx) {
            if (!el.id) el.id = "corazon-auto-" + idx;
            window.dibujarCorazonMorado(el.id);
        });
    });
})();