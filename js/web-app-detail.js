(() => {
  const modal = document.getElementById("webDetailModal");
  if (!modal) return;

  const thumbnails = Array.from(document.querySelectorAll("[data-before-index]"));
  const image = modal.querySelector(".project-modal__image");
  const prevButton = modal.querySelector(".project-modal__nav--prev");
  const nextButton = modal.querySelector(".project-modal__nav--next");
  const closeButtons = modal.querySelectorAll("[data-close-before-modal]");

  const images = thumbnails.map((thumbnail) => {
    const thumbnailImage = thumbnail.querySelector("img");
    return {
      src: thumbnailImage?.currentSrc || thumbnailImage?.src || "",
      alt: thumbnailImage?.alt || "프로젝트 기존 화면"
    };
  });

  let activeIndex = 0;
  let lastFocusedElement = null;

  function updateModal() {
    const current = images[activeIndex];
    if (!current) return;
    image.src = current.src;
    image.alt = current.alt;
    prevButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === images.length - 1;
  }

  function openModal(index) {
    activeIndex = index;
    lastFocusedElement = document.activeElement;
    updateModal();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-modal-open");
    modal.querySelector(".project-modal__close")?.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-modal-open");
    image.removeAttribute("src");
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  }

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => openModal(index));
  });

  prevButton?.addEventListener("click", () => {
    if (activeIndex <= 0) return;
    activeIndex -= 1;
    updateModal();
  });

  nextButton?.addEventListener("click", () => {
    if (activeIndex >= images.length - 1) return;
    activeIndex += 1;
    updateModal();
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowLeft" && !prevButton?.disabled) prevButton?.click();
    if (event.key === "ArrowRight" && !nextButton?.disabled) nextButton?.click();
  });
})();
