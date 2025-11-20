  // Lógica de Audio (Usando HTML Audio API para MP3)
        let audioPlayer;
        let isPlaying = false; 
        
        // La fecha de destino es el 19 de noviembre de 2026 a las 00:00:00 (ajustada para que el contador sea funcional)
        const countdownDate = new Date("November 19, 2026 00:00:00").getTime();
        let countdownInterval;

        /**
         * Inicializa el reproductor de audio.
         */
        function initializeAudio() {
            audioPlayer = document.getElementById('backgroundMusic');
            audioPlayer.loop = true; 
        }

        /**
         * Calcula y actualiza el contador regresivo.
         */
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownDate - now;
            const countdownEl = document.getElementById('countdown');

            // Cálculos de tiempo para Días, Horas, Minutos y Segundos
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                // Si el contador ha terminado
                clearInterval(countdownInterval);
                countdownEl.innerHTML = "¡DISPONIBLE AHORA!";
                // Opcional: Redireccionar o mostrar la pantalla de inicio si se desea
                // showScreen('homeScreen');
            } else {
                // Muestra el tiempo restante
                countdownEl.innerHTML = `
                    ${days} D ${hours.toString().padStart(2, '0')} H ${minutes.toString().padStart(2, '0')} M ${seconds.toString().padStart(2, '0')} S
                `;
            }
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
                const playPromise = audioPlayer.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {}).catch(error => {
                        console.error("La reproducción de audio falló:", error);
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
            if (isPlaying) {
                icon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; 
            } else {
                icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
            }
        }

        /**
         * Muestra la pantalla solicitada y oculta las demás.
         * @param {string} screenId - El ID de la pantalla a mostrar (e.g., 'homeScreen', 'questionScreen').
         */
        function showScreen(screenId) {
            const screens = document.querySelectorAll('.screen');
            screens.forEach(screen => {
                screen.style.opacity = 0;
            });

            setTimeout(() => {
                screens.forEach(screen => {
                    if (screen.id === screenId) {
                        screen.style.display = 'flex';
                        requestAnimationFrame(() => {
                            screen.style.opacity = 1;
                        });
                    } else {
                        screen.style.display = 'none';
                    }
                });
            }, 300);
        }

        /**
         * Inicializa la aplicación después de que todos los recursos han cargado.
         */
        window.onload = function() {
            const loader = document.getElementById('loader');
            const mainContent = document.getElementById('mainContent');
            const musicButton = document.getElementById('musicButton');
            
            // 1. Iniciar la lógica de la aplicación (audio)
            initializeAudio(); 
            
            // 2. Iniciar el contador regresivo
            updateCountdown();
            countdownInterval = setInterval(updateCountdown, 1000);
            
            // 3. Mostrar la pantalla de no disponible
            showScreen('unavailableScreen'); 

            // 4. Ocultar el loader con desvanecimiento
            loader.style.opacity = 0;
            
            // 5. Mostrar la aplicación principal después de que el loader se desvanezca (0.5s en CSS)
            setTimeout(() => {
                loader.style.display = 'none';
                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = 1;

                // 6. INTENTO DE INICIO AUTOMÁTICO DE LA MÚSICA
                const playPromise = audioPlayer.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        isPlaying = true;
                        updateMusicButton(musicButton);
                    }).catch(error => {
                        console.log("La reproducción automática de audio fue bloqueada. El usuario debe hacer clic en el botón de música.");
                        isPlaying = false;
                        updateMusicButton(musicButton);
                    });
                } else {
                    isPlaying = true;
                    updateMusicButton(musicButton);
                }

            }, 500);
        };