document.addEventListener('DOMContentLoaded', () => {
  // --- Lógica del Menú Móvil ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      // Alterna las clases para mostrar/ocultar el menú y animar el botón
      navLinks.classList.toggle('show');
      menuToggle.classList.toggle('active');

      // MEJORA: Actualiza el atributo ARIA para accesibilidad
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // MEJORA: Cierra el menú al hacer clic en un enlace (mejora la UX en móviles)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('show')) {
          navLinks.classList.remove('show');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --- Inicialización de la librería Animate On Scroll (AOS) ---
  // MEJORA: Centralizamos el script que antes estaba en los archivos HTML.
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000, // Duración de la animación
      once: true,     // La animación solo ocurre una vez
      offset: 50      // Activa la animación un poco antes de que el elemento sea visible
    });
  }
});
