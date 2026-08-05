(() => {
  const slider = document.querySelector(".web-app04-slider");
  if (!slider) return;

  const hero = slider.closest(".web-detail-hero--app04");
  const sidebar = hero?.querySelector(".web-detail-sidebar");
  const track = slider.querySelector(".web-app04-slider__track");
  const slides = Array.from(slider.querySelectorAll(".web-app04-slider__slide"));
  const prevButton = slider.querySelector(".web-app04-slider__nav--prev");
  const nextButton = slider.querySelector(".web-app04-slider__nav--next");

  let index = 0;
  let renderedIndex = 0;
  let isAnimating = false;

  const getPerView = () =>
    window.matchMedia("(max-width: 900px)").matches ? 1 : 2;

  function syncDesktopHeight() {
    if (!sidebar) return;

    if (window.matchMedia("(min-width: 1201px)").matches) {
      slider.style.height = `${Math.ceil(sidebar.getBoundingClientRect().height)}px`;
    } else {
      slider.style.removeProperty("height");
    }
  }

  function getVisibleIndexes(startIndex, perView) {
    const indexes = [];
    for (let i = 0; i < perView; i += 1) {
      const slideIndex = startIndex + i;
      if (slideIndex >= 0 && slideIndex < slides.length) indexes.push(slideIndex);
    }
    return indexes;
  }

  function setSlideState(visibleIndexes, enteringIndexes = []) {
    const visible = new Set(visibleIndexes);
    const entering = new Set(enteringIndexes);

    slides.forEach((slide, slideIndex) => {
      const isVisible = visible.has(slideIndex);
      const isEntering = entering.has(slideIndex) && !isVisible;

      slide.classList.toggle("is-visible", isVisible);
      slide.classList.toggle("is-entering", isEntering);
      slide.setAttribute("aria-hidden", isVisible || isEntering ? "false" : "true");
    });
  }

  function updateButtons(perView) {
    const maxIndex = Math.max(0, slides.length - perView);
    prevButton.disabled = index === 0;
    nextButton.disabled = index >= maxIndex;
  }

  function applyPosition(targetIndex, perView, animate) {
    if (!animate) track.style.transition = "none";
    track.style.transform = `translateX(-${targetIndex * (100 / perView)}%)`;

    if (!animate) {
      track.getBoundingClientRect();
      track.style.removeProperty("transition");
    }
  }

  function renderImmediately() {
    const perView = getPerView();
    const maxIndex = Math.max(0, slides.length - perView);
    index = Math.min(index, maxIndex);
    renderedIndex = index;

    slider.classList.remove("is-animating");
    setSlideState(getVisibleIndexes(index, perView));
    applyPosition(index, perView, false);
    updateButtons(perView);
    syncDesktopHeight();
  }

  function moveTo(nextIndex) {
    if (isAnimating) return;

    const perView = getPerView();
    const maxIndex = Math.max(0, slides.length - perView);
    const targetIndex = Math.max(0, Math.min(nextIndex, maxIndex));
    if (targetIndex === index) return;

    const currentIndexes = getVisibleIndexes(renderedIndex, perView);
    const targetIndexes = getVisibleIndexes(targetIndex, perView);
    const enteringIndexes = targetIndexes.filter(
      (slideIndex) => !currentIndexes.includes(slideIndex)
    );

    index = targetIndex;
    isAnimating = true;

    setSlideState(currentIndexes, enteringIndexes);
    updateButtons(perView);

    /* entering 슬라이드를 opacity:0 상태로 먼저 렌더링 */
    slider.getBoundingClientRect();

    requestAnimationFrame(() => {
      slider.classList.add("is-animating");
      applyPosition(targetIndex, perView, true);
    });
  }

  track.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform" || !isAnimating) return;

    renderedIndex = index;
    isAnimating = false;
    slider.classList.remove("is-animating");
    setSlideState(getVisibleIndexes(index, getPerView()));
  });

  prevButton.addEventListener("click", () => moveTo(index - 1));
  nextButton.addEventListener("click", () => moveTo(index + 1));

  const resizeObserver = new ResizeObserver(syncDesktopHeight);
  if (sidebar) resizeObserver.observe(sidebar);

  window.addEventListener("resize", renderImmediately);
  window.addEventListener("load", renderImmediately);
  renderImmediately();
})();
