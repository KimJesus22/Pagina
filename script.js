// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
  // --- Lógica del Menú Móvil ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  // --- Lógica de "Atrapar Foco" para el menú ---
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let firstFocusableElement;
  let focusableContent;
  let lastFocusableElement;

  if (menuToggle && navLinks) {
    const openMenu = () => {
      navLinks.classList.add('show');
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      
      // Lógica para atrapar el foco
      focusableContent = Array.from(navLinks.querySelectorAll(focusableElements));
      firstFocusableElement = focusableContent[0];
      lastFocusableElement = focusableContent[focusableContent.length - 1];
      firstFocusableElement.focus();
    };

    const closeMenu = () => {
      navLinks.classList.remove('show');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus(); // Devolver el foco al botón que abrió el menú
    };

    menuToggle.addEventListener('click', () => {
      if (navLinks.classList.contains('show')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('show')) {
          closeMenu();
        }
      });
    });
  }

  // --- Inicialización de la librería Animate On Scroll (AOS) ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50
    });
  }

  // --- Lógica para el cambio de tema (Claro/Oscuro) ---
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  if (themeToggle && htmlElement) {
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

    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });

    applyStoredTheme();
  }

  // --- Carga dinámica de proyectos desde la API de GitHub ---
  const fetchGitHubProjects = async () => {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    const username = 'KimJesus22';
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`;

    // Crear y añadir un mensaje de carga temporal
    const loadingMessage = document.createElement('p');
    loadingMessage.id = 'loading-projects';
    loadingMessage.textContent = 'Cargando más proyectos desde GitHub...';
    projectsGrid.insertAdjacentElement('afterend', loadingMessage);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error al conectar con la API de GitHub: ${response.status}`);
      }
      const repos = await response.json();

      const excludedRepos = ['KimJesus22', 'Pagina'];

      repos
        .filter(repo => !repo.fork && !excludedRepos.includes(repo.name))
        .forEach(repo => {
          const projectCard = document.createElement('article');
          projectCard.className = 'card project';
          projectCard.setAttribute('data-aos', 'fade-up');

          let tagsHTML = '';
          if (repo.language) {
            tagsHTML += `<span class="tag">${repo.language}</span>`;
          }
          if (repo.topics && repo.topics.length > 0) {
            tagsHTML += repo.topics.map(topic => `<span class="tag">${topic}</span>`).join('');
          }

          let buttonsHTML = `<a href="${repo.html_url}" class="btn" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Ver Repositorio</a>`;
          if (repo.homepage) {
            buttonsHTML += `<a href="${repo.homepage}" class="btn" target="_blank" rel="noopener noreferrer"><i class="fas fa-globe"></i> Ver Página</a>`;
          }

          projectCard.innerHTML = `
            <h3>${repo.name.replace(/[-_]/g, ' ')}</h3>
            <p>${repo.description || 'No hay descripción disponible.'}</p>
            <div class="project-tags">
              ${tagsHTML || '<span class="tag">general</span>'}
            </div>
            <div class="card-footer">
              ${buttonsHTML}
            </div>
          `;
          // Añadir la nueva tarjeta a la grilla existente
          projectsGrid.appendChild(projectCard);
        });

    } catch (error) {
      console.error('Error al cargar los proyectos:', error);
      loadingMessage.textContent = 'No se pudieron cargar los proyectos de GitHub.';
    } finally {
      // Quitar el mensaje de carga, tanto si tuvo éxito como si falló
      const loader = document.getElementById('loading-projects');
      if(loader) {
          // Se le da un pequeño delay para que no desaparezca tan bruscamente
          setTimeout(() => loader.remove(), 500);
      }
    }
  };

  fetchGitHubProjects();
});
