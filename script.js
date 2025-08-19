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

  // --- LÓGICA PARA EL CAMBIO DE TEMA (CLARO/OSCURO) ---
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  if (themeToggle && htmlElement) {
    // Función para aplicar el tema guardado en localStorage o el preferido por el sistema
    const applyStoredTheme = () => {
      const storedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (storedTheme) {
        htmlElement.setAttribute('data-theme', storedTheme);
      } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
      } else {
        htmlElement.setAttribute('data-theme', 'light');
      }
    };

    // Event listener para el botón de cambio de tema
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme); // Guardar la preferencia
    });

    applyStoredTheme(); // Aplicar el tema al cargar la página
  }
});
