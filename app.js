// app.js

document.addEventListener('DOMContentLoaded', () => {

    // --- CÓDIGO PARA LOS CARRUSELES DE IMÁGENES (Sin cambios) ---
    const productSliders = document.querySelectorAll('.productos-destacados');
    productSliders.forEach(container => {
        const slider = container.querySelector('.slider');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        if (!slider || !prevBtn || !nextBtn) return;
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 320, behavior: 'smooth' });
        });
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -320, behavior: 'smooth' });
        });
    });

    // --- CÓDIGO FINAL PARA EL CARRUSEL DE VIDEOS PRECISO E INFINITO ---
    const videoSliderContainer = document.querySelector('.shop-feed');
    if (videoSliderContainer) {
        const videoSlider = document.querySelector('#video-slider');
        const prevBtn = videoSliderContainer.querySelector('.prev-video');
        const nextBtn = videoSliderContainer.querySelector('.next-video');

        // Clonamos los slides para el efecto infinito
        const slides = Array.from(videoSlider.children);
        const slideWidth = slides[0].offsetWidth + 20; // 250px + 20px de margen

        slides.slice(0, 5).forEach(slide => { // Clonar los primeros 5
            videoSlider.appendChild(slide.cloneNode(true));
        });
        slides.slice(-5).reverse().forEach(slide => { // Clonar los últimos 5
            videoSlider.prepend(slide.cloneNode(true));
        });

        // Función para actualizar SOLO el slide del centro
        const updateActiveSlide = () => {
            const sliderCenter = videoSlider.scrollLeft + (videoSlider.offsetWidth / 2);
            let closestSlide = null;
            let minDistance = Infinity;

            const allSlides = videoSlider.querySelectorAll('.video-slide');

            allSlides.forEach(slide => {
                const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
                const distance = Math.abs(sliderCenter - slideCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestSlide = slide;
                }
            });

            // Actualizar clases y reproducción de video
            allSlides.forEach(slide => {
                const video = slide.querySelector('video');
                if (slide === closestSlide) {
                    slide.classList.add('active');
                    if (video && video.paused) {
                        video.play().catch(e => console.error("Error al reproducir:", e));
                    }
                } else {
                    slide.classList.remove('active');
                    if (video && !video.paused) {
                        video.pause();
                    }
                }
            });
        };

        // Escuchar el final del scroll para un rendimiento óptimo
        videoSlider.addEventListener('scrollend', () => {
            updateActiveSlide(); // Actualiza el slide activo

            // Lógica para el bucle infinito sin saltos
            const maxScroll = videoSlider.scrollWidth - videoSlider.clientWidth;
            if (videoSlider.scrollLeft <= slideWidth * 2) {
                videoSlider.scrollBy({ left: slides.length * slideWidth, behavior: 'instant' });
            } else if (videoSlider.scrollLeft >= maxScroll - (slideWidth * 2)) {
                videoSlider.scrollBy({ left: -(slides.length * slideWidth), behavior: 'instant' });
            }
        });

        // Acciones de los botones
        prevBtn.addEventListener('click', () => {
            videoSlider.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            videoSlider.scrollBy({ left: slideWidth, behavior: 'smooth' });
        });

        // Configuración inicial
        const setInitialPosition = () => {
            const initialScroll = (slides.length * slideWidth) / 2;
            videoSlider.scrollTo({ left: initialScroll, behavior: 'instant' });
            // Esperar un momento para que el DOM se asiente antes de activar el slide
            setTimeout(updateActiveSlide, 50);
        };
        
        setInitialPosition();
    }
});// app.js

document.addEventListener('DOMContentLoaded', () => {

    // --- CÓDIGO PARA LOS CARRUSELES DE IMÁGENES (Sin cambios) ---
    // ... (El código de los carruseles de imágenes de la respuesta anterior va aquí, no lo borres)
    const productSliders = document.querySelectorAll('.productos-destacados');
    productSliders.forEach(container => {
        const slider = container.querySelector('.slider');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        if (!slider || !prevBtn || !nextBtn) return;
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 320, behavior: 'smooth' });
        });
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -320, behavior: 'smooth' });
        });
    });

    // --- CÓDIGO FINAL PARA EL CARRUSEL DE VIDEOS (Sin cambios) ---
    // ... (El código del carrusel de videos de la respuesta anterior va aquí, no lo borres)
    const videoSliderContainer = document.querySelector('.shop-feed');
    if (videoSliderContainer) {
        // ... (el resto del código del carrusel de videos)
    }

    //=============== LÓGICA DEL MODAL DE RULETA (CON PREMIO DE IMAGEN) ===============//
    const modalOverlay = document.getElementById('modal-ruleta-overlay');
    const botonGirar = document.getElementById('boton-girar');
    const ruletaImg = document.getElementById('ruleta-img');
    const resultadoP = document.getElementById('resultado-ruleta');
    const cerrarModalBtn = document.getElementById('cerrar-modal');

    // NUEVOS ELEMENTOS PARA EL MODAL DE IMAGEN
    const modalImagenOverlay = document.getElementById('modal-imagen-overlay');
    const imagenPremio = document.getElementById('imagen-premio');
    const cerrarModalImagenBtn = document.getElementById('cerrar-modal-imagen');

    let estaGirando = false;
    let rotacionActual = 0;

    // MODIFICAMOS EL ARRAY DE PREMIOS PARA INCLUIR TIPOS
    const premios = [
        { tipo: 'texto', valor: '¡10% de Descuento!', min: 0, max: 10 },
        { tipo: 'imagen', valor: 'img/gatito.jpg', min: 11, max: 300 },
        { tipo: 'texto', valor: '¡25% de Descuento!', min: 301, max: 302},
        { tipo: 'imagen', valor: 'img/ORIGINAL 2.png', min: 303, max: 304},
        { tipo: 'texto', valor: '¡ENVÍO GRATIS!', min: 305, max: 306 },
        { tipo: 'texto', valor: '¡Vuelve a Intentar!', min: 307, max: 308 },
        { tipo: 'texto', valor: '¡50% de Descuento!', min: 309, max: 310 },
        { tipo: 'texto', valor: '¡Vuelve a Intentar!', min: 311, max: 360 }
    ];

    // --- Funciones para los modales ---
    const mostrarModalRuleta = () => modalOverlay.classList.remove('hidden');
    const ocultarModalRuleta = () => modalOverlay.classList.add('hidden');
    const mostrarModalImagen = () => modalImagenOverlay.classList.remove('hidden');
    const ocultarModalImagen = () => modalImagenOverlay.classList.add('hidden');

    // Función para girar la ruleta (ACTUALIZADA)
    const girarRuleta = () => {
        if (estaGirando) return;

        estaGirando = true;
        botonGirar.disabled = true;
        resultadoP.textContent = 'Girando...';

        const vueltasCompletas = 5 * 360;
        const anguloAleatorio = Math.floor(Math.random() * 360);
        const anguloFinal = rotacionActual + vueltasCompletas + anguloAleatorio;
        
        rotacionActual = anguloFinal;

        ruletaImg.style.transform = `rotate(${anguloFinal}deg)`;

        setTimeout(() => {
            const anguloReal = anguloFinal % 360;
            const premioGanado = premios.find(p => anguloReal >= p.min && anguloReal <= p.max);
            
            // LÓGICA PARA DECIDIR QUÉ MOSTRAR
            if (premioGanado.tipo === 'texto') {
                resultadoP.textContent = premioGanado.valor;
                botonGirar.disabled = false;
                estaGirando = false;
            } else if (premioGanado.tipo === 'imagen') {
                resultadoP.textContent = '¡Ganaste un wuajaja especial!';
                imagenPremio.src = premioGanado.valor; // Asigna la imagen al modal
                setTimeout(() => {
                    mostrarModalImagen(); // Muestra el modal de la imagen
                }, 500); // Pequeña espera para que el usuario lea el mensaje
                
                // No reactivamos el giro hasta que se cierre el modal de la imagen
            }
        }, 4000);
    };

   

    setTimeout(mostrarModalRuleta, 1000);

   
    botonGirar.addEventListener('click', girarRuleta);

 
    cerrarModalBtn.addEventListener('click', ocultarModalRuleta);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) ocultarModalRuleta();
    });

    // Cerrar modal de la imagen (NUEVO)
    const cerrarPremioImagen = () => {
        ocultarModalImagen();
        // Reactivamos el botón de girar cuando se cierra la imagen
        botonGirar.disabled = false; 
        estaGirando = false;
    };
    
    cerrarModalImagenBtn.addEventListener('click', cerrarPremioImagen);
    modalImagenOverlay.addEventListener('click', (e) => {
        if (e.target === modalImagenOverlay) cerrarPremioImagen();
    });


    
});


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value.trim();
  
        if (user === 'admin' && pass === 'admin') { /// si quieres cambiarle la contraseña ya sabes como
          window.location.href = 'adminpagina.html'; 
        } else {
          document.getElementById('loginError').textContent =
            'Usuario o contraseña incorrectos';
        }
      });
    }
  });
  