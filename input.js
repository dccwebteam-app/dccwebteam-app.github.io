const navbar = document.querySelector('header nav');
const splashContainer = document.getElementById('splash_logo_shape');
const rollingCounterElements = document.querySelectorAll("[data-carousel-counter]");

// 🎞️ CAROUSEL ENGINE STATE VARIABLES
let currentSlideIndex = 0;
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');

// 🎛️ DRAG & TRACK POSITION STORAGE
let isDragging = false;
let startX = 0;
let currentX = 0;
const swipeThreshold = 50;



document.addEventListener("DOMContentLoaded", () => {


    if (rollingCounterElements && rollingCounterElements.length) {
        createRollingCounter("[data-carousel-counter]", 1, "dcc-rolling-digit", "dcc-rolling-digit-track", 20);
    }

    if (splashContainer) {
        // Start logo animation
        setTimeout(() => {
            splashContainer.classList.add('active');
        }, 300);


        setTimeout(() => {
            splashContainer.parentElement.classList.add("remove");
            document.body.classList.remove("splash-loading");
        }, 3000);

    }

    //   navbar.parentElement.classList.add('pinned', window.scrollY > 50);
    console.log(window.scrollY)
    window.addEventListener('scroll', () => {
        navbar.parentElement.classList.toggle('pinned', window.scrollY > 50);
    }, { passive: true });


    // Close other dropdowns when one is opened
    document.querySelectorAll('aside details').forEach((detail) => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                // Find all other dropdowns and close them
                document.querySelectorAll('aside details').forEach((other) => {
                    if (other !== detail) {
                        other.open = false;
                    }
                });
            }
        });
    });


    // ==========================================
    // DESKTOP DROPDOWNS
    // ==========================================

    const desktopDropdowns = document.querySelectorAll(
        'header .group\\/has-dropdown'
    );

    // Close all desktop dropdowns
    const closeDesktopDropdowns = (except = null) => {

        desktopDropdowns.forEach((dropdown) => {

            if (dropdown === except) return;

            const button = dropdown.querySelector(':scope > button');

            button?.setAttribute('aria-expanded', 'false');

        });

    };

    // Toggle desktop dropdowns
    desktopDropdowns.forEach((dropdown) => {

        const button = dropdown.querySelector(':scope > button');

        if (!button) return;

        button.addEventListener('click', () => {

            const isOpen =
                button.getAttribute('aria-expanded') === 'true';

            closeDesktopDropdowns(dropdown);

            button.setAttribute(
                'aria-expanded',
                String(!isOpen)
            );

        });

    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {

        if (!event.target.closest('header .group\\/has-dropdown')) {
            closeDesktopDropdowns();
        }

    });


    // ==========================================
    // MOBILE MENU ELEMENTS
    // ==========================================

    const menuToggle = document.getElementById('menu_toggle');
    const menuClose = document.getElementById('menu_close');
    const mobileMenu = document.getElementById('mobile_menu');
    const menuOverlay = document.getElementById('menu_overlay');

    if (!menuToggle || !mobileMenu || !menuOverlay) return;


    // ==========================================
    // OPEN MOBILE MENU
    // ==========================================

    const openMobileMenu = () => {

        mobileMenu.classList.remove('translate-x-full');

        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileMenu.inert = false;

        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close navigation menu');

        menuOverlay.hidden = false;

        requestAnimationFrame(() => {

            menuOverlay.classList.remove('opacity-0', 'invisible');
            menuOverlay.classList.add('opacity-100', 'visible');

        });

        document.body.classList.add('overflow-hidden');

        // Move keyboard focus into the menu
        menuClose?.focus();

    };


    // ==========================================
    // CLOSE MOBILE MENU
    // ==========================================

    const closeMobileMenu = () => {

        mobileMenu.classList.add('translate-x-full');

        menuOverlay.classList.remove('opacity-100', 'visible');
        menuOverlay.classList.add('opacity-0', 'invisible');

        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.inert = true;

        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');

        document.body.classList.remove('overflow-hidden');

        // Close all expanded mobile accordions
        mobileMenu.querySelectorAll('details[open]').forEach((detail) => {
            detail.open = false;
        });

        // Return focus to the menu toggle
        menuToggle.focus();

    };


    // ==========================================
    // MOBILE MENU EVENTS
    // ==========================================

    menuToggle.addEventListener('click', () => {

        const isOpen =
            menuToggle.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }

    });

    // Close button
    menuClose?.addEventListener('click', closeMobileMenu);

    // Backdrop click
    menuOverlay.addEventListener('click', closeMobileMenu);


    // ==========================================
    // MOBILE ACCORDIONS
    // Only one submenu can be open at a time
    // ==========================================

    const mobileDropdowns = mobileMenu.querySelectorAll(
        '.mobile-dropdown'
    );

    mobileDropdowns.forEach((detail) => {

        detail.addEventListener('toggle', () => {

            if (!detail.open) return;

            mobileDropdowns.forEach((other) => {

                if (other !== detail && other.open) {
                    other.open = false;
                }

            });

        });

    });


    // ==========================================
    // CLOSE MENU AFTER NAVIGATION
    // ==========================================

    mobileMenu.querySelectorAll('nav a').forEach((link) => {

        link.addEventListener('click', () => {

            closeMobileMenu();

        });

    });


    // ==========================================
    // KEYBOARD ACCESSIBILITY
    // Escape closes the active menu
    // ==========================================

    document.addEventListener('keydown', (event) => {

        if (event.key !== 'Escape') return;

        // Close mobile menu
        if (
            menuToggle.getAttribute('aria-expanded') === 'true'
        ) {

            closeMobileMenu();
            return;

        }

        // Close desktop dropdowns
        const openDropdown = [...desktopDropdowns].find((dropdown) => {

            const button = dropdown.querySelector(':scope > button');

            return button?.getAttribute('aria-expanded') === 'true';

        });

        if (openDropdown) {

            const button = openDropdown.querySelector(':scope > button');

            closeDesktopDropdowns();

            button?.focus();

        }

    });


    // ==========================================
    // HIDE OVERLAY AFTER TRANSITION
    // ==========================================

    menuOverlay.addEventListener('transitionend', (event) => {

        if (
            event.target === menuOverlay &&
            menuOverlay.classList.contains('invisible')
        ) {

            menuOverlay.hidden = true;

        }

    });



});


function changeSlide(direction) {
    currentSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;
    updateCarouselLayout();
}

function updateCarouselLayout() {
    // Execute your custom rolling calculation algorithm layer
    if (typeof createRollingCounter === "function") {
        createRollingCounter("[data-carousel-counter]", (currentSlideIndex + 1), "dcc-rolling-digit", "dcc-rolling-digit-track", 20);
    }
    if (slides && slides.length) {
        slides.forEach((slide, index) => {
            if (index === currentSlideIndex) {
                slide.classList.replace('opacity-0', 'opacity-100');
                slide.classList.replace('z-0', 'z-10');
            } else {
                slide.classList.replace('opacity-100', 'opacity-0');
                slide.classList.replace('z-10', 'z-0');
            }
        });
    }
}

function goToSlide(slideIndex) {
    currentSlideIndex = slideIndex;
    updateCarouselLayout();
}
