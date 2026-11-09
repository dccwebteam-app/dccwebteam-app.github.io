document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".mobile-menu-button");
  const menu = document.getElementById("mobile-menu");
  const closeButton = document.querySelector(".mobile-menu-close");
  const overlay = document.querySelector(".menu-overlay");
  const desktopItems = document.querySelectorAll(".nav-item.has-dropdown");
  const mobileToggles = document.querySelectorAll(".mobile-submenu-toggle");

  function setHeaderState() {
    const isScrolled = window.scrollY > 60;
    if (header) header.classList.toggle("scrolled", isScrolled);
    document.body.classList.toggle("hero-logo-scrolled", isScrolled);
  }

  function closeDesktopDropdowns(except) {
    desktopItems.forEach(function (item) {
      if (item !== except) {
        item.classList.remove("open");
        item.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
      }
    });
  }

  desktopItems.forEach(function (item) {
    const toggle = item.querySelector(".dropdown-toggle");
    toggle?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      const opening = !item.classList.contains("open");
      closeDesktopDropdowns(item);
      item.classList.toggle("open", opening);
      toggle.setAttribute("aria-expanded", String(opening));
    });
  });

  document.addEventListener("click", function () {
    closeDesktopDropdowns();
  });

  function openMenu() {
    if (!menuButton || !menu || !overlay) return;
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton?.focus();
  }

  function closeMenu() {
    if (!menuButton || !menu || !overlay) return;
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    overlay.hidden = true;
    document.body.style.overflow = "";
    mobileToggles.forEach(function(toggle){
      toggle.setAttribute("aria-expanded","false");
      toggle.closest(".mobile-nav-item")?.classList.remove("open");
    });
  }

  menuButton?.addEventListener("click", function (event) {
    event.preventDefault();
    menu?.classList.contains("open") ? closeMenu() : openMenu();
  });

  closeButton?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  mobileToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      const item = toggle.closest(".mobile-nav-item");
      const opening = !item?.classList.contains("open");

      document.querySelectorAll(".mobile-nav-item.open").forEach(function(other){
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".mobile-submenu-toggle")?.setAttribute("aria-expanded","false");
        }
      });

      item?.classList.toggle("open", opening);
      toggle.setAttribute("aria-expanded", String(opening));
    });
  });

  menu?.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeDesktopDropdowns();
      closeMenu();
      closeSearch();
    }
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1024) closeMenu();
    else closeDesktopDropdowns();
  });


  /* Site search */
  const searchOverlay = document.getElementById("site-search");
  const searchInput = document.getElementById("site-search-input");
  const searchClose = document.querySelector(".search-close");
  const searchForm = document.querySelector(".site-search-form");
  const searchResults = document.getElementById("search-results");
  const searchButtons = document.querySelectorAll(".search-button, .mobile-search-button");

  const searchIndex = [
    { title:"What's On", type:"Section", url:"whats-on.html", keywords:"what's on exhibitions events watch programme" },
    { title:"Exhibitions", type:"What's On", url:"exhibitions.html", keywords:"exhibitions displays museum current upcoming" },
    { title:"Events", type:"What's On", url:"events.html", keywords:"events talks workshops activities programme" },
    { title:"Watch", type:"What's On", url:"watch.html", keywords:"watch video stories films digital" },
    { title:"Plan Your Visit", type:"Visit", url:"home.html#visit", keywords:"visit hours opening admission location map access parking" },
    { title:"Collections", type:"Collections", url:"home.html#collections", keywords:"collections objects archives photographs research" },
    { title:"About Toitū", type:"About Us", url:"home.html#about", keywords:"about museum history toitu otago settlers" },
    { title:"Research", type:"Learn", url:"home.html#learn", keywords:"research learn archives information" },
    { title:"Education Experiences", type:"Learn", url:"home.html#learn", keywords:"education schools learning experiences teachers students" },
    { title:"Venue Hire", type:"Visit", url:"home.html#venue", keywords:"venue hire functions weddings events spaces" },
    { title:"Otago Settlers Association", type:"About Us", url:"home.html#association", keywords:"osa association settlers membership" },
    { title:"Museum Shop", type:"Shop", url:"https://shop.toituosm.com/", keywords:"shop gifts books souvenirs store" }
  ];

  function openSearch() {
    if (!searchOverlay) return;
    closeMenu();
    searchOverlay.classList.add("open");
    searchOverlay.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    window.setTimeout(() => searchInput?.focus(), 120);
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("open");
    searchOverlay.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  function renderSearch(query) {
    if (!searchResults) return;
    const q = query.trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = "";
      return;
    }
    const matches = searchIndex.filter(item =>
      (item.title + " " + item.type + " " + item.keywords).toLowerCase().includes(q)
    );
    searchResults.innerHTML = matches.length
      ? matches.map(item => `
          <div class="search-result">
            <span class="search-result-type">${item.type}</span>
            <a href="${item.url}">${item.title}</a>
            <span class="search-result-arrow" aria-hidden="true">→</span>
          </div>`).join("")
      : `<div class="search-empty">No results found for “${query.replace(/[<>]/g,"")}”. Try another search term.</div>`;
  }

  searchButtons.forEach(button => button.addEventListener("click", openSearch));
  searchClose?.addEventListener("click", closeSearch);
  searchOverlay?.addEventListener("click", event => {
    if (event.target === searchOverlay) closeSearch();
  });
  searchInput?.addEventListener("input", event => renderSearch(event.target.value));
  searchForm?.addEventListener("submit", event => {
    event.preventDefault();
    renderSearch(searchInput?.value || "");
  });

  const portraitFilter = document.getElementById("portrait-filter");
  portraitFilter?.addEventListener("input", function () {
    const q = this.value.trim().toLowerCase();
    document.querySelectorAll(".portrait-card").forEach(function(card){
      card.hidden = q && !card.textContent.toLowerCase().includes(q);
    });
  });


  /* Eden in Dunedin layout switcher */
  const edenStory = document.querySelector(".eden-story");
  const edenViewButtons = document.querySelectorAll("[data-eden-view]");
  edenViewButtons.forEach(button => {
    button.addEventListener("click", () => {
      const view = button.dataset.edenView;
      if (!edenStory) return;
      edenStory.dataset.edenLayout = view;
      edenViewButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });

  setHeaderState();
});
document.addEventListener('DOMContentLoaded',()=>{const input=document.getElementById('portrait-filter'),items=[...document.querySelectorAll('.sg-person')],count=document.getElementById('portrait-count'),empty=document.getElementById('sg-no-results');if(!input)return;input.addEventListener('input',()=>{let visible=0;const q=input.value.trim().toLocaleLowerCase();items.forEach(item=>{const match=item.textContent.toLocaleLowerCase().includes(q);item.hidden=!match;if(match)visible++});count.textContent=visible+' portraits and portrait groups';empty.hidden=visible!==0})});
