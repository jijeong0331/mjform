(() => {
  const header = document.querySelector("[data-subpage-header]");
  if (!header) return;

  const title = header.dataset.title || "Portfolio";
  const base = header.dataset.base || "..";
  const homeHref = header.dataset.homeHref || `${base}/index.html`;
  const iconSrc = header.dataset.iconSrc || `${base}/assets/print-design/Home_icon.svg`;

  const menuItems = [
    { key: "book", label: "Book", href: `${base}/pages/book.html` },
    { key: "print", label: "Print", href: `${base}/pages/print-design.html` },
    { key: "web", label: "Web/App", href: `${base}/index.html#web` },
    { key: "banner", label: "Banner", href: `${base}/pages/banner.html` },
    { key: "cassette", label: "Cassette", href: `${base}/index.html#cassette` },
    { key: "ai-storybook", label: "AI Storybook", href: `${base}/pages/ai-storybook.html` },
    { key: "leaflet", label: "Leaflet", href: `${base}/pages/leaflet.html` },
    { key: "branding", label: "Branding", href: `${base}/pages/branding.html` }
  ];

  const titleToKey = {
    "Book Design": "book",
    "Print Design": "print",
    "Web/App": "web",
    "Banner Design": "banner",
    "Cassette": "cassette",
    "AI Storybook": "ai-storybook",
    "Leaflet": "leaflet",
    "Branding Design": "branding"
  };

  const currentKey = header.dataset.menuKey || titleToKey[title] || "";

  header.classList.add("subpage-header");
  header.innerHTML = `
    <h1 class="subpage-header__title">${title}</h1>

    <div class="subpage-header__actions">
      <a class="home-button" href="${homeHref}" aria-label="메인 페이지로 이동">
        <span class="home-button__base" aria-hidden="true"></span>
        <span class="home-button__glass">
          <span class="home-button__content">
            <img src="${iconSrc}" alt="" aria-hidden="true">
            <span>Home</span>
          </span>
        </span>
      </a>

      <button class="project-menu-button" type="button" aria-label="프로젝트 메뉴 열기" aria-expanded="false" aria-controls="project-menu-panel">
        <span class="project-menu-button__base" aria-hidden="true"></span>
        <span class="project-menu-button__glass" aria-hidden="true">
          <span class="project-menu-button__dot"></span>
        </span>
      </button>
    </div>

    <nav class="project-menu-panel" id="project-menu-panel" aria-label="프로젝트 메뉴" aria-hidden="true">
      ${menuItems.map(item => `
        <a class="project-menu-panel__link${item.key === currentKey ? " is-current" : ""}"
           href="${item.href}"
           ${item.key === currentKey ? 'aria-current="page"' : ""}>
          ${item.key === currentKey ? '<span class="project-menu-panel__current-dot" aria-hidden="true"></span>' : ""}
          <span>${item.label}</span>
        </a>
      `).join("")}
    </nav>
  `;

  const menuButton = header.querySelector(".project-menu-button");
  const menuPanel = header.querySelector(".project-menu-panel");

  const setMenuOpen = (open) => {
    header.classList.toggle("is-menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "프로젝트 메뉴 닫기" : "프로젝트 메뉴 열기");
    menuPanel.setAttribute("aria-hidden", String(!open));
  };

  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenuOpen(!header.classList.contains("is-menu-open"));
  });

  menuPanel.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", () => setMenuOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
})();
