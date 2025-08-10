import { notificarConfirmacion } from './notificaciones.js';

const confirmarBtn = document.getElementById('confirmarBtn');
const ubicacionBtn = document.getElementById('ubicacionBtn');
const titulo = document.querySelector('h1');
const musicaNinjago = document.getElementById('musicaNinjago');
const gifFiesta = document.getElementById('gifFiesta');
const contenedorMapa = document.getElementById('contenedorMapa');

// --- Función para generar o leer un ID único por invitado ---
const getInvitadoID = () => {
    let id = localStorage.getItem('invitadoID');
    if (!id) {
        id = 'id-' + Math.random().toString(36).substr(2, 9); // Ejemplo: "id-a1b2c3d4e"
        localStorage.setItem('invitadoID', id);
    }
    return id;
};

// --- Verificar si ya confirmó asistencia ---
const yaConfirmo = () => {
    return localStorage.getItem('confirmacionEnviada') === 'true';
};

// --- Lógica del botón de confirmación ---
confirmarBtn.addEventListener('click', async () => {
    const idInvitado = getInvitadoID(); // Obtener ID único
    confirmarBtn.style.display = "none";
    
    if (!yaConfirmo()) {
        try {
            // Notificar al servidor en Render y obtener el contador global
            await notificarConfirmacion(idInvitado);
            
            // Actualizar estado local
            localStorage.setItem('confirmacionEnviada', 'true');
            titulo.textContent = '¡Gracias por confirmar!';
            confirmarBtn.disabled = true;

            // Efectos de fiesta
            confetti({
                particleCount: 300,
                spread: 100,
                origin: { y: 0.6 }
            });
            reproducirFragmentoConFade(musicaNinjago, 126, 152, 2000);
            
        } catch (error) {
            console.error('Error al confirmar:', error);
            titulo.textContent = 'Hubo un error. Por favor, inténtalo de nuevo.';
            confirmarBtn.style.display = "block";
        }
    } else {
        titulo.textContent = 'Ya confirmaste tu asistencia. ¡Nos vemos!';
        confetti({
            particleCount: 300,
            spread: 100,
            origin: { y: 0.6 }
        });
        reproducirFragmentoConFade(musicaNinjago, 126, 152, 2000);
    }
});

// --- Resto del código existente (música, mapa, etc.) ---
function fadeOutAudio(audio, duration) {
    const step = 0.05;
    const interval = duration / (audio.volume / step);
    const fade = setInterval(() => {
        if (audio.volume > step) {
            audio.volume -= step;
        } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(fade);
        }
    }, interval);
    ocultarGifProgresivo();
}

function fadeInAudio(audio, duration) {
    audio.volume = 0.05;
    gifFiesta.style.display = 'flex';
    audio.play();
    const step = 0.05;
    const interval = duration / (1 / step);
    const fade = setInterval(() => {
        if (audio.volume < 0.85 - step) {
            audio.volume += step;
        } else {
            audio.volume = 0.85;
            clearInterval(fade);
        }
    }, interval);
}

function reproducirFragmentoConFade(audio, inicio, fin, fadeDuration = 2000) {
    audio.currentTime = inicio;
    fadeInAudio(audio, fadeDuration);
    const duracionFragmento = (fin - inicio) * 1000;
    const tiempoAntesDeFadeOut = duracionFragmento - fadeDuration;
    setTimeout(() => {
        fadeOutAudio(audio, fadeDuration);
    }, tiempoAntesDeFadeOut);
}

// --- Mapa (código existente) ---
if (!contenedorMapa.querySelector('iframe')) {
    const iframe = document.createElement('iframe');
    iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3349.964253963073!2d-60.65000068481992!3d-32.95000008092409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c318fa45ed9e5a5:0x22c609525108ec07!2sCirculo+militar!5e0!3m2!1ses!2sar!4v1690000000000!5m2!1ses!2sar";
    iframe.width = "80%";
    iframe.height = "300";
    iframe.style.border = "0";
    iframe.style.borderRadius = "15px";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    contenedorMapa.appendChild(iframe);
    iframe.style.cursor = "pointer";
    iframe.addEventListener('click', () => {
        window.open(
            "https://www.google.com/maps/place/X5VX%2BJC9+Circulo+militar,+C.+Luisa+Cáceres,+Pampatar+6316,+Nueva+Esparta/data=!4m2!3m1!1s0x8c318fa45ed9e5a5:0x22c609525108ec07?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI1LjMyLjAYACCIJyqiASw5NDI1OTU1MCw5NDI2NzcyNyw5NDI4NDQ3OCw5NDIyMzI5OSw5NDIxNjQxMyw5NDI4MDU3Niw5NDIxMjQ5Niw5NDIwNzM5NCw5NDIwNzUwNiw5NDIwODUwNiw5NDIxNzUyMyw5NDIxODY1Myw5NDIyOTgzOSw5NDI3OTYxNSw5NDI2MjczMyw0NzA4NDM5Myw5NDIxMzIwMCw5NDI1ODMyNUICVkU%3D&skid=06e5b3ae-9b0a-475e-ad20-a03028ad0f6e",
            "_blank"
        );
    });
}

ubicacionBtn.addEventListener('click', () => {
    if (contenedorMapa.style.display === 'none') {
        contenedorMapa.style.display = 'block';
        ubicacionBtn.textContent = 'Cerrar Ubicación';
        ubicacionBtn.style.backgroundColor = '#FF5722';
    } else {
        contenedorMapa.style.display = 'none';
        ubicacionBtn.textContent = 'Ver Ubicación';
        ubicacionBtn.style.backgroundColor = "#4CAF50";
    }
});

function ocultarGifProgresivo() {
    gifFiesta.classList.add('fade-out');
    setTimeout(() => {
        gifFiesta.style.display = 'none';
        gifFiesta.classList.remove('fade-out');
    }, 1500);
}

// Contador regresivo
function actualizarContador() {
    const fechaFiesta = new Date('August 30, 2025 14:30:00').getTime();
    const ahora = new Date().getTime();
    const diferencia = fechaFiesta - ahora;

    // Cálculos de tiempo
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    // Actualizar el DOM
    document.getElementById('dias').textContent = dias.toString().padStart(2, '0');
    document.getElementById('horas').textContent = horas.toString().padStart(2, '0');
    document.getElementById('minutos').textContent = minutos.toString().padStart(2, '0');
    document.getElementById('segundos').textContent = segundos.toString().padStart(2, '0');

    // Si la fecha ya pasó
    if (diferencia < 0) {
        clearInterval(intervalo);
        document.getElementById('contador-regresivo').innerHTML = '<h2>¡La fiesta está en marcha!</h2>';
    }
}

// Actualizar cada segundo
const intervalo = setInterval(actualizarContador, 1000);
actualizarContador(); // Ejecutar inmediatamente
