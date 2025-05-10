document.addEventListener('DOMContentLoaded', () => {
    // Desplazamiento suave para enlaces internos
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const destino = document.querySelector(this.getAttribute('href'));
            if (destino) {
                e.preventDefault();
                destino.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efecto de aparición al hacer scroll
    const showOnScroll = () => {
        const sections = document.querySelectorAll('section, .destino');
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 50) {
                section.classList.add('visible');
            }
        });
    };

    // Iniciar efecto de aparición
    showOnScroll();
    window.addEventListener('scroll', showOnScroll);

    // Configuración de todos los sliders en la página
    document.querySelectorAll('.slider').forEach(slider => {
        const slidesContainer = slider.querySelector('.slides');
        const slides = slider.querySelectorAll('.slide');
        
        // Verificar si hay slides
        if (!slides.length || !slidesContainer) return;
        
        // Número de slides a mostrar simultáneamente
        let slidesToShow = 3;
        
        // Ajustar número de slides según el ancho de la pantalla
        if (window.innerWidth <= 480) {
            slidesToShow = 1;
        } else if (window.innerWidth <= 768) {
            slidesToShow = 2;
        }
        
        // Calcular el ancho de cada slide
        const updateSlideWidth = () => {
            const sliderWidth = slider.offsetWidth;
            const slideWidth = (sliderWidth / slidesToShow) - 10;
            
            slides.forEach(slide => {
                slide.style.width = `${slideWidth}px`;
                slide.style.flexShrink = '0';
            });
            
            return slideWidth;
        };
        
        let slideWidth = updateSlideWidth();
        
        // Máximo índice posible (considerando el número de slides visibles)
        const maxIndex = Math.max(0, slides.length - slidesToShow);
        let currentIndex = 0;
        let autoplayInterval;
        
        // Crear indicadores (puntos)
        const createIndicators = () => {
            // Solo crear indicadores si hay más de un grupo de slides
            if (maxIndex > 0) {
                const indicatorsContainer = document.createElement('div');
                indicatorsContainer.className = 'slider-indicators';
                
                for (let i = 0; i <= maxIndex; i++) {
                    const indicator = document.createElement('span');
                    indicator.className = 'indicator';
                    if (i === 0) indicator.classList.add('active');
                    
                    indicator.addEventListener('click', () => {
                        moveToSlide(i);
                        resetAutoplay();
                    });
                    
                    indicatorsContainer.appendChild(indicator);
                }
                
                // Agregar indicadores después del slider
                slider.parentNode.insertBefore(indicatorsContainer, slider.nextSibling);
                
                return indicatorsContainer.querySelectorAll('.indicator');
            }
            return null;
        };
        
        const indicators = createIndicators();
        
        // Actualizar indicadores activos
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
            if (index < 0) index = 0;
            if (index > maxIndex) index = maxIndex;
            
            currentIndex = index;
            const offset = index * (slideWidth + 10); // 10px es el espacio entre slides
            slidesContainer.style.transform = `translateX(-${offset}px)`;
            
            updateIndicators();
        };
        
        // Avanzar al siguiente slide
        const nextSlide = () => {
            const nextIndex = (currentIndex >= maxIndex) ? 0 : currentIndex + 1;
            moveToSlide(nextIndex);
        };
        
        // Retroceder al slide anterior
        const prevSlide = () => {
            const prevIndex = (currentIndex <= 0) ? maxIndex : currentIndex - 1;
            moveToSlide(prevIndex);
        };
        
        // Configurar autoplay
        const startAutoplay = () => {
            return setInterval(nextSlide, 3000);
        };
        
        // Reiniciar autoplay
        const resetAutoplay = () => {
            clearInterval(autoplayInterval);
            autoplayInterval = startAutoplay();
        };
        
        // Configurar eventos de los botones de navegación
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
        
        // Manejar el redimensionamiento de la ventana
        window.addEventListener('resize', () => {
            // Actualizar número de slides según el nuevo ancho
            if (window.innerWidth <= 480) {
                slidesToShow = 1;
            } else if (window.innerWidth <= 768) {
                slidesToShow = 2;
            } else {
                slidesToShow = 3;
            }
            
            // Recalcular el ancho y reposicionar el slider
            slideWidth = updateSlideWidth();
            moveToSlide(Math.min(currentIndex, Math.max(0, slides.length - slidesToShow)));
        });
        
        // Iniciar el slider
        moveToSlide(0);
        autoplayInterval = startAutoplay();
        
        // Permitir desplazamiento táctil para dispositivos móviles
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeThreshold = 50; // Umbral para detectar un deslizamiento
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Deslizamiento hacia la izquierda -> avanzar
                nextSlide();
                resetAutoplay();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Deslizamiento hacia la derecha -> retroceder
                prevSlide();
                resetAutoplay();
            }
        };
    });
});