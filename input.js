const navbar = document.querySelector('header nav');
const splashContainer = document.getElementById('splash_logo_shape');
const rollingCounterElements = document.querySelectorAll("[data-carousel-counter]");
const rollingPortraitElements = document.querySelectorAll("[data-portrait-counter]");
const portraitFilters = document.querySelectorAll(".portrait-filter");
var rollingPortraitCount = 0;
// 🎞️ CAROUSEL ENGINE STATE VARIABLES
let currentSlideIndex = 0;
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
// 🎛️ DRAG & TRACK POSITION STORAGE
let isDragging = false;
let startX = 0;
let currentX = 0;
const swipeThreshold = 50;
//Exhibitions
const exhibitionContent = document.getElementById("exhibition_content");
const exhibitionViewButtons = document.querySelectorAll("[data-exhibition-view]");
const toggleCaption = document.getElementById('toggle_caption');
const template = document.getElementById('caption_template');
let activeTooltip = null;
const portraitSearch = document.querySelector("input[name='portrait_query']");
const menuToggle = document.getElementById('menu_toggle');
const menuClose = document.getElementById('menu_close');
const mobileMenu = document.getElementById('mobile_menu');
const menuOverlay = document.getElementById('menu_overlay');
const mobileDropdowns = mobileMenu.querySelectorAll('.mobile-dropdown');
const desktopDropdowns = document.querySelectorAll('header .group\\/has-dropdown');
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
    window.addEventListener('scroll', () => {
        navbar.parentElement.classList.toggle('pinned', window.scrollY > 50);
    }, {
        passive: true
    });
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
            const isOpen = button.getAttribute('aria-expanded') === 'true';
            closeDesktopDropdowns(dropdown);
            button.setAttribute('aria-expanded', String(!isOpen));
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
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
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
        if (menuToggle.getAttribute('aria-expanded') === 'true') {
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
        if (event.target === menuOverlay && menuOverlay.classList.contains('invisible')) {
            menuOverlay.hidden = true;
        }
    });
    portraitFilters?.forEach((btn) => {
        btn.addEventListener('click', () => {
            const wall = btn.dataset.portraitWall;
            if (wall && !btn.classList.contains("active")) {
                // 2. Reset all buttons to inactive
                portraitFilters.forEach((b) => {
                    b.classList.remove('active', 'bg-paper', 'text-primary');
                    b.setAttribute('aria-pressed', 'false');
                });
                // 3. Set the clicked button to active
                btn.classList.add('active', 'bg-paper', 'text-primary');
                btn.setAttribute('aria-pressed', 'true');
                fetchPortraits(wall);
            }
        });
    });
    //Exhibitions
    if (toggleCaption) {
        toggleCaption.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeTooltip) {
                removeTooltip();
                return;
            }
            // 1. Clone the template content
            const clone = template.content.cloneNode(true);
            activeTooltip = clone.querySelector('.exhibition__image__caption');
            // 2. Append to body
            document.body.appendChild(activeTooltip);
            toggleCaption.setAttribute('aria-expanded', 'true');
            // 3. Wire up the close button inside the cloned node
            const closeBtn = activeTooltip.querySelector('#exhibition__image__caption--close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeTooltip();
                });
            }
            // 4. Calculate fixed position for the current screen size
            positionTooltip();
        });
    }
    // Reposition dynamically on resize or scroll
    window.addEventListener('resize', positionTooltip);
    window.addEventListener('scroll', positionTooltip, {
        passive: true
    });
    // Close when clicking outside or pressing Escape
    document.addEventListener('click', (e) => {
        if (activeTooltip && !activeTooltip.contains(e.target)) {
            removeTooltip();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            removeTooltip();
        }
    });
    if (exhibitionContent) {
        exhibitionViewButtons.forEach(button => {
            button.addEventListener("click", () => {
                const view = button.dataset.exhibitionView;
                if (exhibitionContent.dataset.edenLayout === view) return;
                const updateLayout = () => {
                    exhibitionContent.dataset.edenLayout = view;
                    exhibitionContent.classList.toggle("split", view === "split");
                    exhibitionViewButtons.forEach(item => {
                        const active = item === button;
                        item.classList.toggle("bg-black", active);
                        item.classList.toggle("text-white", active);
                        item.classList.toggle("bg-white", !active);
                        item.classList.toggle("text-black", !active);
                        item.setAttribute("aria-pressed", String(active));
                    });
                };
                if (document.startViewTransition) {
                    document.startViewTransition(updateLayout);
                } else {
                    updateLayout();
                }
            });
        });
    }

    if (rollingPortraitElements && portraitSearch) {
        fetchPortraits();
    }
});

function positionTooltip() {
    if (!activeTooltip) return;
    const btnRect = toggleCaption.getBoundingClientRect();
    const tooltipRect = activeTooltip.getBoundingClientRect();
    const gap = 12;
    const screenPadding = 16;
    // Place above button by default, or flip below if near the top edge
    let top = btnRect.top - tooltipRect.height - gap;
    if (top < screenPadding) {
        top = btnRect.bottom + gap;
    }
    // Align right edge with button, keeping within viewport margins
    let left = btnRect.right - tooltipRect.width;
    if (left < screenPadding) {
        left = screenPadding;
    }
    if (left + tooltipRect.width > window.innerWidth - screenPadding) {
        left = window.innerWidth - tooltipRect.width - screenPadding;
    }
    activeTooltip.style.top = `${top}px`;
    activeTooltip.style.left = `${left}px`;
}

function removeTooltip() {
    if (activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
        toggleCaption.setAttribute('aria-expanded', 'false');
    }
}

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
async function getUrlData(url = 'https://example.com') {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch failed:', error);
        return error;
    }
}
async function fetchPortraits(category = undefined) {
    const wallWrapper = document.querySelector(".group\\/wall-wrapper");
    try {

        if (portraitSearch.value.length && portraitSearch.value.length < 3) {
            return;
        }
        if (rollingPortraitElements && rollingPortraitElements.length) {
            createRollingCounter("[data-portrait-counter]", rollingPortraitCount, "dcc-rolling-digit", "dcc-rolling-digit-track", 21);
        }
        wallWrapper?.classList.add("is-loading");
        portraitFilters.forEach((b) => {
            b.setAttribute("disabled", true)
        });
        if (category) {
            portraitSearch.setAttribute("disabled", true);
        }
        // Pause execution for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        const initialSearchUrl = "https://dcc-web.matrix.squiz.cloud/toitu/_designs/design-nesters/portrait-search?search_page_1326319_submit_button=Submit&current_result_page=1&mode=results";
        let cleanUrl = initialSearchUrl;
        if (portraitSearch.value.length > 2) {
            cleanUrl += `&queries_keyword_query=${encodeURIComponent(portraitSearch.value)}`;
        }

        if (!category) {
            category = document.querySelector("button.active")?.dataset?.portraitWall;
        }
        cleanUrl += `&category_wall=${category}`;
        const res = await getUrlData(cleanUrl);
        if (!res.assets) {
            throw new Error("Error in getting data, please try again");
        }
        // Render signature events 
        const wraapperElement = document.getElementById("wall_portraits");
        if (wraapperElement) {
            wraapperElement.innerHTML = "";
            if (res?.assets?.length) {
                res.assets.forEach((portrait) => {
                    const imgSrc = portrait?.thumbnail?.url ? `${portrait.thumbnail.url}?v=${portrait?.version}` : "https://lipsum.app/random/64x72";
                    const imgAlt = portrait?.thumbnail?.alt || "Image from Toitu website";
                    // Removed 'is-loading' from the item root so content is visible
                    const html = `<div class="relative group/wall-item">
                    <div
                        class="absolute inset-0 z-50 items-center justify-center gap-4 py-5 px-2 group-[:not(.is-loading)]/wall-wrapper:hidden group-[.is-loading]/wall-wrapper:flex">
                        <span
                            class="w-[64px] max-w-[64px] h-[72px] max-h-[72px] basis-[64px] shrink-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-md"
                            aria-hidden="true"></span>

                        <div class="w-full max-w-md max-h-[72px] space-y-2">
                            <span
                                class="block w-full h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-md"></span>
                            <span
                                class="block w-3/5 h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-md"></span>
                        </div>
                    </div>
                    <a href="${portrait?.url ?? '#'}"
                        class="w-full relative flex items-center gap-4 justify-start py-5 hover:bg-paper px-3 group-[.is-loading]/wall-wrapper:opacity-0">

                        <figure
                            class="w-[64px] max-w-[64px] h-[72px] max-h-[72px] basis-[64px] text-xl bg-paper font-bold text-blue text-center relative">
                            <div
                                class="absolute inset-0 flex animate-pulse items-center justify-center bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] z-10">
                                <i class="uil uil-image text-xl text-gray-400" aria-hidden="true"></i>
                            </div>

                            <img src="${imgSrc}"
                                alt="S${imgAlt}" loading="lazy" decoding="async"
                                class="aspect-[64/72] h-[inherit] w-[imherit] max-w-[64px] object-cover object-center opacity-0 transition-opacity duration-500 ease-out"
                                onload="this.classList.remove('opacity-0'); this.previousElementSibling?.remove();">


                        </figure>
                        <p class="mb-0 max-w-xs">${portrait?.name ?? '&nbsp;'}</p>
                        <span class="link--new-window ml-auto text-primary font-bold">&nbsp;</span>
                    </a>
                </div>`;
                    wraapperElement.insertAdjacentHTML('beforeend', html);
                });

                rollingPortraitCount = res?.assets.length;

            } else {
                const emptyHtml = `
                <div class="col-span-full w-full flex flex-col items-start justify-start text-left py-6">
                    <p class="text-base font-medium text-primary m-0">
                        There are no portrait available for your search.
                    </p>
                    <p class="text-sm text-neutral-500 mt-1 mb-0">
                        Please try with different keyword.
                    </p>
                </div>`;
                wraapperElement.insertAdjacentHTML('beforeend', emptyHtml);

                rollingPortraitCount = 0;
            }

        }
    } catch (e) {
        console.error(e);
    } finally {

        if (rollingPortraitElements && rollingPortraitElements.length) {

            if (rollingPortraitCount < 10) {
                rollingPortraitElements[0].classList.remove("w-[19.6px]")
                rollingPortraitElements[0].classList.add("w-[9.8px]")
            }
            else {
                rollingPortraitElements[0].classList.add("w-[19.6px]")
                rollingPortraitElements[0].classList.remove("w-[9.8px]")
            }
            createRollingCounter("[data-portrait-counter]", rollingPortraitCount, "dcc-rolling-digit", "dcc-rolling-digit-track", 21);
        }

        setTimeout(() => {
            wallWrapper?.classList.remove("is-loading");
            portraitFilters.forEach((b) => {
                b.removeAttribute("disabled")
            });
            portraitSearch.removeAttribute("disabled")
        }, 1000);
    }
}