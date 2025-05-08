document.addEventListener('DOMContentLoaded', () => {
    // Desplazamiento suave solo para enlaces internos dentro del nav
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const destino = document.querySelector(this.getAttribute('href'));
            if (destino) {
                e.preventDefault(); // Solo prevenir si el destino existe en la misma página
                destino.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mostrar secciones con un efecto suave al hacer scroll
    const showOnScroll = () => {
        const sections = document.querySelectorAll('section, .destino');

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 50) { // Aseguramos que la sección sea visible antes de la parte superior de la pantalla
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }
        });
    };

    // Ejecutamos el efecto al cargar y cada vez que el usuario haga scroll
    showOnScroll(); // Llamamos una vez al principio para mostrar las secciones ya visibles en la carga inicial
    document.addEventListener('scroll', showOnScroll);
});