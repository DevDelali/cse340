// public/js/nav.js
// Handles the mobile hamburger nav toggle.

const initNavToggle = () => {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (!toggle || !menu) return;

    const closeMenu = () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
        const isOpen = menu.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
    };

    toggle.addEventListener('click', toggleMenu);

    // Close the menu after a link is tapped
    menu.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') closeMenu();
    });

    // Close the menu if focus/click moves outside the nav entirely
    document.addEventListener('click', (event) => {
        const isInsideNav = toggle.contains(event.target) || menu.contains(event.target);
        if (!isInsideNav) closeMenu();
    });

    // Allow Escape to close the menu for keyboard users
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });
};

document.addEventListener('DOMContentLoaded', initNavToggle);

export { initNavToggle };
