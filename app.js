
const emojis = [
    "🐶", "🐱", "🐰", "🐼",
    "🦊", "🐸", "🐵", "🐻"
];

let tarjetas = [...emojis, ...emojis];

let primeraTarjeta = null;
let segundaTarjeta = null;
let bloqueo = false;

let tiempo = 0;
let intervalo = null;
let juegoIniciado = false;

const tablero = document.getElementById("gameBoard");
const timer = document.getElementById("timer");
const mejorTiempo = document.getElementById("bestTime");

function mezclar(array) {
    return array.sort(() => Math.random() - 0.5);
}

function formatoTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return String(minutos).padStart(2, "0") +
        ":" +
        String(segundosRestantes).padStart(2, "0");
}

function iniciarTiempo() {
    if (juegoIniciado) {
        return;
    }

    juegoIniciado = true;

    intervalo = setInterval(() => {
        tiempo++;

        timer.textContent = formatoTiempo(tiempo);
    }, 1000);
}

function detenerTiempo() {
    clearInterval(intervalo);
}

function mostrarMejorTiempo() {
    const guardado = localStorage.getItem("mejorTiempo");

    if (guardado !== null) {
        mejorTiempo.textContent = formatoTiempo(Number(guardado));
    }
}

function guardarMejorTiempo() {
    const guardado = localStorage.getItem("mejorTiempo");

    if (guardado === null || tiempo < Number(guardado)) {
        localStorage.setItem("mejorTiempo", tiempo);

        mejorTiempo.textContent = formatoTiempo(tiempo);
    }
}

function crearTablero() {
    tablero.innerHTML = "";

    primeraTarjeta = null;
    segundaTarjeta = null;
    bloqueo = false;

    const tarjetasMezcladas = mezclar([...tarjetas]);

    tarjetasMezcladas.forEach((emoji) => {
        const tarjeta = document.createElement("div");

        tarjeta.classList.add("card");
        tarjeta.textContent = "?";
        tarjeta.dataset.emoji = emoji;

        tarjeta.addEventListener("click", voltearTarjeta);

        tablero.appendChild(tarjeta);
    });
}

function voltearTarjeta(evento) {
    const tarjeta = evento.currentTarget;

    if (bloqueo) {
        return;
    }

    if (tarjeta.classList.contains("encontrada")) {
        return;
    }

    if (tarjeta === primeraTarjeta) {
        return;
    }

    iniciarTiempo();

    tarjeta.textContent = tarjeta.dataset.emoji;
    tarjeta.classList.add("volteada");

    if (primeraTarjeta === null) {
        primeraTarjeta = tarjeta;
        return;
    }

    segundaTarjeta = tarjeta;
    bloqueo = true;

    comprobarPareja();
}

function comprobarPareja() {
    const iguales =
        primeraTarjeta.dataset.emoji ===
        segundaTarjeta.dataset.emoji;

    if (iguales) {
        primeraTarjeta.classList.add("encontrada");
        segundaTarjeta.classList.add("encontrada");

        primeraTarjeta = null;
        segundaTarjeta = null;
        bloqueo = false;

        comprobarVictoria();

    } else {
        setTimeout(() => {
            primeraTarjeta.textContent = "?";
            segundaTarjeta.textContent = "?";

            primeraTarjeta.classList.remove("volteada");
            segundaTarjeta.classList.remove("volteada");

            primeraTarjeta = null;
            segundaTarjeta = null;
            bloqueo = false;
        }, 1000);
    }
}

function comprobarVictoria() {
    const parejasEncontradas =
        document.querySelectorAll(".encontrada").length;

    if (parejasEncontradas === tarjetas.length) {
        detenerTiempo();
        guardarMejorTiempo();

        setTimeout(() => {
            alert("¡Felicidades! Encontraste todas las parejas.");
        }, 300);
    }
}

function reiniciarJuego() {
    detenerTiempo();

    tiempo = 0;
    juegoIniciado = false;

    timer.textContent = "00:00";

    crearTablero();
}

document.getElementById("btnReset")
    .addEventListener("click", reiniciarJuego);

mostrarMejorTiempo();
crearTablero();

// registro del Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => {
                console.log("Service Worker registrado");
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    });
}

// instalacion de la aplicacion
let eventoInstalacion = null;

window.addEventListener("beforeinstallprompt", (evento) => {
    evento.preventDefault();

    eventoInstalacion = evento;

    const boton = document.getElementById("btnInstall");

    boton.hidden = false;
});

document.getElementById("btnInstall")
    .addEventListener("click", async () => {

        if (eventoInstalacion === null) {
            return;
        }

        eventoInstalacion.prompt();

        await eventoInstalacion.userChoice;

        eventoInstalacion = null;

        document.getElementById("btnInstall").hidden = true;
    });
