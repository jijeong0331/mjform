(() => {
  const modal = document.getElementById("webDetailModal");
  if (!modal) return;

  const thumbnails = Array.from(document.querySelectorAll("[data-before-index]"));
  const image = modal.querySelector(".project-modal__image");
  const prevButton = modal.querySelector(".project-modal__nav--prev");
  const nextButton = modal.querySelector(".project-modal__nav--next");
  const closeButtons = modal.querySelectorAll("[data-close-before-modal]");

  // BEFORE 영역: 잘린 다음/이전 부분을 확인하는 유한 슬라이드
  const beforeGrid = document.querySelector(".web-detail-before-grid");
  const beforeSection = document.querySelector(".web-detail-before");

  if (beforeGrid && beforeSection) {
    const beforeItems = Array.from(
      beforeGrid.querySelectorAll(".web-detail-before-item:not(.is-before-clone)")
    );

    // 이전 무한 슬라이드에서 생성된 복제 아이템이 있다면 제거
    beforeGrid.querySelectorAll(".is-before-clone").forEach((clone) => clone.remove());

    if (beforeItems.length > 1) {
      const nav = document.createElement("div");
      nav.className = "web-detail-before-nav";
      nav.setAttribute("aria-label", "Before 이미지 슬라이드");
      nav.innerHTML = `
        <button type="button" class="web-detail-before-prev" aria-label="이전 Before 영역">
          <img src="../assets/print-design/Arrow_left_icon.svg" alt="" aria-hidden="true">
        </button>
        <button type="button" class="web-detail-before-next" aria-label="다음 Before 영역">
          <img src="../assets/print-design/Arrow_right_icon.svg" alt="" aria-hidden="true">
        </button>`;
      beforeSection.appendChild(nav);

      const beforePrev = nav.querySelector(".web-detail-before-prev");
      const beforeNext = nav.querySelector(".web-detail-before-next");

      const getMaxScroll = () =>
        Math.max(0, beforeGrid.scrollWidth - beforeGrid.clientWidth);

      /*
        이미지 한 장 단위가 아니라,
        현재 화면에서 잘려 보이는 다음 영역까지 자연스럽게 이동하도록
        뷰포트 폭의 약 80%만큼 이동합니다.
      */
      const getStep = () =>
        Math.max(180, beforeGrid.clientWidth * 0.8);

      const updateNavState = () => {
        const maxScroll = getMaxScroll();
        beforePrev.disabled = beforeGrid.scrollLeft <= 2;
        beforeNext.disabled =
          maxScroll <= 2 || beforeGrid.scrollLeft >= maxScroll - 2;
      };

      const moveBefore = (direction) => {
        const maxScroll = getMaxScroll();
        const target = Math.max(
          0,
          Math.min(
            beforeGrid.scrollLeft + direction * getStep(),
            maxScroll
          )
        );

        beforeGrid.scrollTo({
          left: target,
          behavior: "smooth"
        });
      };

      beforePrev.addEventListener("click", () => moveBefore(-1));
      beforeNext.addEventListener("click", () => moveBefore(1));

      beforeGrid.addEventListener(
        "scroll",
        updateNavState,
        { passive: true }
      );

      window.addEventListener("resize", updateNavState);

      requestAnimationFrame(updateNavState);
    }
  }

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
