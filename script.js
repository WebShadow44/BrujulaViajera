document.addEventListener('DOMContentLoaded', () => {
    // Desplazamiento suave para enlaces internos
    // Ahora incluye todos los enlaces 'a' dentro de 'nav' que empiezan con '#',
    // Y también cualquier elemento con la clase 'btn-cta' que empieza con '#'.
    document.querySelectorAll('nav a[href^="#"], .btn-cta[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const destino = document.querySelector(this.getAttribute('href'));
            if (destino) {
                e.preventDefault(); // Previene el comportamiento por defecto del enlace
                destino.scrollIntoView({
                    behavior: 'smooth', // Hace el desplazamiento suave
                    block: 'start'      // Alinea el destino al inicio del viewport
                });
            }
        });
    });

    // Efecto de aparición al hacer scroll
    const showOnScroll = () => {
        // Selecciona todas las secciones y los divs con clase 'destino' (en index.html, los cuadros de países)
        const sections = document.querySelectorAll('section, .destinos-principales .destino'); // Agregado .destinos-principales .destino para asegurar que los cuadros de países también tengan el efecto
        sections.forEach(section => {
            // getBoundingClientRect() devuelve el tamaño y la posición de un elemento respecto a la ventana del navegador (viewport).
            const sectionTop = section.getBoundingClientRect().top;
            // Si la parte superior de la sección está por encima de la parte inferior de la ventana
            // (menos un offset de 50px para que aparezca un poco antes de que la sección toque el fondo)
            if (sectionTop < window.innerHeight - 50) {
                section.classList.add('visible'); // Añade la clase 'visible' para activar la animación CSS
            } else {
                // Opcional: Si quieres que desaparezca al volver a subir el scroll, descomenta la siguiente línea
                // section.classList.remove('visible');
            }
        });
    };

    // Iniciar efecto de aparición inmediatamente en la carga inicial y luego al hacer scroll
    showOnScroll(); // Llama la función una vez al cargar para los elementos ya visibles
    window.addEventListener('scroll', showOnScroll); // Escucha el evento de scroll para futuras apariciones

    // Configuración de todos los sliders en la página
    document.querySelectorAll('.slider').forEach(slider => {
        const slidesContainer = slider.querySelector('.slides');
        const slides = slider.querySelectorAll('.slide');

        // Verificar si hay slides, si no, no inicializar el slider
        if (!slides.length || !slidesContainer) return;

        // Número de slides a mostrar simultáneamente por defecto
        let slidesToShow = 3;

        // Ajustar número de slides según el ancho de la pantalla (responsive)
        const adjustSlidesToShow = () => {
            if (window.innerWidth <= 480) {
                slidesToShow = 1;
            } else if (window.innerWidth <= 768) {
                slidesToShow = 2;
            } else {
                slidesToShow = 3;
            }
        };

        adjustSlidesToShow(); // Ajustar al cargar

        // Calcular el ancho de cada slide
        const updateSlideWidth = () => {
            const sliderWidth = slider.offsetWidth; // Ancho total del contenedor del slider
            // El "- 10" se basa en el 'gap' o 'margin' que pueda haber entre slides.
            // Si el CSS tiene `gap: 10px;` en `.slider .slides`, entonces esto es correcto.
            // O si cada slide tiene `margin-right: 10px;` (menos el último).
            // Si no hay un gap fijo de 10px, ajusta esta lógica.
            const slideWidth = (sliderWidth / slidesToShow); // Calcula el ancho base
            // Puedes ajustar el ancho de cada slide para contabilizar el 'gap' en el CSS.
            // Por ejemplo, si tienes un `gap: 20px` en `slidesContainer` (flexbox),
            // la fórmula podría ser `(sliderWidth - (gap * (slidesToShow - 1))) / slidesToShow`
            // Por ahora, asumimos que el `gap` se maneja visualmente o a través de este 10px
            slides.forEach(slide => {
                slide.style.width = `${slideWidth}px`;
                slide.style.flexShrink = '0'; // Asegura que los slides no se encojan
            });

            return slideWidth;
        };

        let slideWidth = updateSlideWidth(); // Inicializar el ancho de los slides

        // Máximo índice posible (considerando el número de slides visibles)
        // El último índice al que se puede mover el slider sin mostrar espacio vacío.
        const maxIndex = Math.max(0, slides.length - slidesToShow);
        let currentIndex = 0; // Índice del slide actual
        let autoplayInterval; // Variable para almacenar el ID del intervalo de autoplay

        // Crear indicadores (puntos) para el slider
        const createIndicators = () => {
            // Solo crear indicadores si hay más de un "grupo" de slides para ver
            if (maxIndex > 0) {
                const indicatorsContainer = document.createElement('div');
                indicatorsContainer.className = 'slider-indicators';

                for (let i = 0; i <= maxIndex; i++) {
                    const indicator = document.createElement('span');
                    indicator.className = 'indicator';
                    if (i === 0) indicator.classList.add('active'); // El primer indicador está activo por defecto

                    indicator.addEventListener('click', () => {
                        moveToSlide(i);     // Mover al slide correspondiente al indicador
                        resetAutoplay();    // Reiniciar el autoplay al interactuar
                    });

                    indicatorsContainer.appendChild(indicator);
                }

                // Agregar los indicadores después del slider en el DOM
                // `insertBefore` coloca el elemento antes del `nextSibling` (el siguiente hermano del slider)
                slider.parentNode.insertBefore(indicatorsContainer, slider.nextSibling);

                return indicatorsContainer.querySelectorAll('.indicator');
            }
            return null; // Retorna null si no se crearon indicadores
        };

        const indicators = createIndicators(); // Crear los indicadores al inicio

        // Actualizar el estado 'active' de los indicadores
        const updateIndicators = () => {
            if (indicators) {
                indicators.forEach((indicator, i) => {
                    if (i === currentIndex) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
            }
        };

        // Mover el slider a un índice específico
        const moveToSlide = (index) => {
            // Asegura que el índice esté dentro de los límites válidos
            if (index < 0) index = 0;
            if (index > maxIndex) index = maxIndex;

            currentIndex = index;
            // Calcula el desplazamiento horizontal. Se multiplica por `slideWidth + 10`
            // asumiendo 10px de espacio entre slides. Ajusta si tu CSS tiene un `gap` diferente.
            const offset = index * (slideWidth); // Asumiendo que slideWidth ya incluye el espacio o que el gap lo maneja flexbox.
            slidesContainer.style.transform = `translateX(-${offset}px)`; // Aplica la transformación CSS para el desplazamiento

            updateIndicators(); // Actualiza los indicadores
        };

        // Avanzar al siguiente slide
        const nextSlide = () => {
            const nextIndex = (currentIndex >= maxIndex) ? 0 : currentIndex + 1; // Vuelve al inicio si está en el último slide
            moveToSlide(nextIndex);
        };

        // Retroceder al slide anterior
        const prevSlide = () => {
            const prevIndex = (currentIndex <= 0) ? maxIndex : currentIndex - 1; // Va al final si está en el primer slide
            moveToSlide(prevIndex);
        };

        // Configurar autoplay
        const startAutoplay = () => {
            // Establece un intervalo para llamar a `nextSlide` cada 3000ms (3 segundos)
            return setInterval(nextSlide, 3000);
        };

        // Reiniciar autoplay (pausar y volver a iniciar)
        const resetAutoplay = () => {
            clearInterval(autoplayInterval); // Borra el intervalo actual
            autoplayInterval = startAutoplay(); // Inicia un nuevo intervalo
        };

        // Configurar eventos de los botones de navegación (flechas)
        const prevBtn = slider.querySelector('.flecha.izq');
        const nextBtn = slider.querySelector('.flecha.der');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoplay();
            });
        }

        // Pausar autoplay al pasar el mouse sobre el slider
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        // Reanudar autoplay al quitar el mouse del slider
        slider.addEventListener('mouseleave', () => {
            autoplayInterval = startAutoplay();
        });

        // Manejar el redimensionamiento de la ventana para hacer el slider responsive
        window.addEventListener('resize', () => {
            // Actualizar número de slides y ancho de slides según el nuevo ancho de la ventana
            adjustSlidesToShow(); // Re-ajustar slidesToShow
            slideWidth = updateSlideWidth(); // Re-calcular el ancho de los slides
            // Mover el slider al índice actual, pero asegurando que no se salga de los límites
            moveToSlide(Math.min(currentIndex, Math.max(0, slides.length - slidesToShow)));
            // Si los indicadores existen, también se podrían recrear o ajustar si la lógica de maxIndex cambia significativamente
            // (Aunque con tu lógica actual, simplemente se actualizarían).
        });

        // Iniciar el slider y el autoplay al cargar
        moveToSlide(0); // Asegurarse de que el slider comience en la primera posición
        autoplayInterval = startAutoplay(); // Iniciar el autoplay

        // Permitir desplazamiento táctil para dispositivos móviles (swipe)
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true }); // 'passive: true' mejora el rendimiento del scroll en móviles

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(); // Llama a la función para manejar el swipe
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 50; // Umbral de píxeles para considerar un movimiento como deslizamiento

            if (touchEndX < touchStartX - swipeThreshold) {
                // Deslizamiento hacia la izquierda (mover al siguiente slide)
                nextSlide();
                resetAutoplay();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Deslizamiento hacia la derecha (mover al slide anterior)
                prevSlide();
                resetAutoplay();
            }
        };
    });
});