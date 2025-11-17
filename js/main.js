// Lógica de Audio (Usando HTML Audio API para MP3)
let audioPlayer;
let isPlaying = false; 

/**
 * Inicializa el reproductor de audio.
 */
function initializeAudio() {
    audioPlayer = document.getElementById('backgroundMusic');
    // Nota: Aunque el loop está en el HTML, lo reafirmamos en JS
    audioPlayer.loop = true; 
}

/**
 * Alterna entre reproducir y pausar la música usando el API de HTML Audio.
 * @param {HTMLElement} button - El elemento del botón que fue presionado.
 */
function toggleMusic(button) {
    if (!audioPlayer) {
        console.error("El reproductor de audio no está inicializado.");
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        // audioPlayer.play() debe ser llamado después de una interacción del usuario.
        const playPromise = audioPlayer.play();

        // Manejar la promesa para evitar errores de auto-reproducción bloqueada
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // La reproducción comenzó correctamente
            }).catch(error => {
                // La reproducción falló (ej. el navegador bloqueó la reproducción automática)
                console.error("La reproducción de audio falló:", error);
                // Se podría mostrar un mensaje de error al usuario aquí
            });
        }
    }
    isPlaying = !isPlaying;
    updateMusicButton(button);
}

/**
 * Actualiza el ícono del botón (Play o Pause).
 * @param {HTMLElement} button - El elemento del botón.
 */
function updateMusicButton(button) {
    const icon = button.querySelector('#musicIcon');
    // Icono de Pausa (dos barras verticales)
    if (isPlaying) {
        icon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; 
    } else {
        // Icono de Play (triángulo)
        icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
}

/**
 * Muestra la pantalla solicitada y oculta las demás.
 * @param {string} screenId - El ID de la pantalla a mostrar (e.g., 'homeScreen', 'questionScreen').
 */
function showScreen(screenId) {
    // Oculta todas las pantallas con un efecto de desvanecimiento
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.opacity = 0;
    });

    // Espera un momento para el desvanecimiento y luego actualiza la visibilidad
    setTimeout(() => {
        screens.forEach(screen => {
            if (screen.id === screenId) {
                // Muestra la pantalla y la hace visible
                screen.style.display = 'flex';
                // Usa un pequeño retraso o requestAnimationFrame para garantizar que la transición de opacidad se aplique correctamente
                requestAnimationFrame(() => {
                    screen.style.opacity = 1;
                });
            } else {
                // Oculta las demás
                screen.style.display = 'none';
            }
        });
    }, 300); // 300ms, matching the CSS transition duration
}

/**
 * Inicializa la aplicación después de que todos los recursos han cargado.
 */
window.onload = function() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('mainContent');
    const musicButton = document.getElementById('musicButton');
    
    initializeAudio(); 
    showScreen('homeScreen'); 

    setTimeout(() => {
        loader.style.opacity = 0;
        loader.style.display = 'none';
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = 1;

        audioPlayer.play().then(() => {
            isPlaying = true;
            updateMusicButton(musicButton);
        }).catch(error => {
            console.log("La reproducción automática fue bloqueada. El usuario debe interactuar.");
            isPlaying = false;
            updateMusicButton(musicButton);
        });
    }, 500);
};
