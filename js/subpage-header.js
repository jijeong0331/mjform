(() => {
  const header = document.querySelector("[data-subpage-header]");
  if (!header) return;

  const title = header.dataset.title || "Portfolio";
  const base = header.dataset.base || "..";
  const homeHref = header.dataset.homeHref || `${base}/index.html`;
  const iconSrc = header.dataset.iconSrc || `${base}/assets/print-design/Home_icon.svg`;

  header.classList.add("subpage-header");
  header.innerHTML = `
    <h1 class="subpage-header__title">${title}</h1>

    <a class="home-button" href="${homeHref}" aria-label="메인 페이지로 이동">
      <span class="home-button__base" aria-hidden="true"></span>
      <span class="home-button__glass">
        <span class="home-button__content">
          <img src="${iconSrc}" alt="" aria-hidden="true">
          <span>Home</span>
        </span>
      </span>
    </a>
  `;
})();
