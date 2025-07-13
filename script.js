document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('nav a');

    menuToggle.addEventListener('click', () => {
        navLinks.forEach(link => {
            link.classList.toggle('show');
        });
    });
});
