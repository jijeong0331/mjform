(() => {
  const modal = document.getElementById("webDetailModal");
  if (!modal) return;

  const thumbnails = Array.from(document.querySelectorAll("[data-before-index]"));
  const image = modal.querySelector(".project-modal__image");
  const prevButton = modal.querySelector(".project-modal__nav--prev");
  const nextButton = modal.querySelector(".project-modal__nav--next");
  const closeButtons = modal.querySelectorAll("[data-close-before-modal]");

  // BEFORE 영역: 끊김 없이 이어지는 무한 슬라이드
  const beforeGrid = document.querySelector(".web-detail-before-grid");
  const beforeSection = document.querySelector(".web-detail-before");

  if (beforeGrid && beforeSection) {
    const originalItems = Array.from(
      beforeGrid.querySelectorAll(".web-detail-before-item")
    );

    if (originalItems.length > 1) {
      const nav = document.createElement("div");
      nav.className = "web-detail-before-nav";
      nav.setAttribute("aria-label", "Before 이미지 슬라이드");
      nav.innerHTML = `
        <button type="button" class="web-detail-before-prev" aria-label="이전 Before 이미지">
          <img src="../assets/print-design/Arrow_left_icon.svg" alt="" aria-hidden="true">
        </button>
        <button type="button" class="web-detail-before-next" aria-label="다음 Before 이미지">
          <img src="../assets/print-design/Arrow_right_icon.svg" alt="" aria-hidden="true">
        </button>`;
      beforeSection.appendChild(nav);

      const beforePrev = nav.querySelector(".web-detail-before-prev");
      const beforeNext = nav.querySelector(".web-detail-before-next");
      const itemCount = originalItems.length;

      /*
        [복제 세트] + [원본 세트] + [복제 세트]
        세 묶음을 만들어 가운데 원본 세트에서 시작합니다.

        예: 1 2 3 | 1 2 3 | 1 2 3
                       ↑ 시작

        오른쪽으로 마지막 복제 1까지 슬라이드한 뒤,
        화면이 동일한 원본 1 위치로 즉시 이동하므로
        사용자는 되돌아가는 움직임을 보지 않습니다.
      */
      const cloneItem = (item) => {
        const clone = item.cloneNode(true);
        clone.classList.add("is-before-clone");
        clone.removeAttribute("data-before-index");
        clone.setAttribute("aria-hidden", "true");
        clone.tabIndex = -1;
        return clone;
      };

      const beforeClones = originalItems.map(cloneItem);
      const afterClones = originalItems.map(cloneItem);

      beforeClones.forEach((clone) => {
        beforeGrid.insertBefore(clone, beforeGrid.firstChild);
      });
      afterClones.forEach((clone) => beforeGrid.appendChild(clone));

      const getAllItems = () =>
        Array.from(beforeGrid.querySelectorAll(".web-detail-before-item"));

      let physicalIndex = itemCount; // 가운데 원본 세트의 첫 번째
      let isMoving = false;
      let finishTimer = null;

      const scrollToPhysicalIndex = (index, behavior = "smooth") => {
        const items = getAllItems();
        const target = items[index];
        if (!target) return;

        beforeGrid.scrollTo({
          left: target.offsetLeft,
          behavior
        });
      };

      const resetIfNeeded = () => {
        /*
          오른쪽 복제 세트의 첫 이미지에 도달했다면
          동일하게 보이는 가운데 원본 첫 이미지로 즉시 위치만 변경.
        */
        if (physicalIndex >= itemCount * 2) {
          physicalIndex = itemCount;
          scrollToPhysicalIndex(physicalIndex, "auto");
        }

        /*
          왼쪽 복제 세트의 마지막 이미지에 도달했다면
          동일하게 보이는 가운데 원본 마지막 이미지로 즉시 위치만 변경.
        */
        if (physicalIndex < itemCount) {
          physicalIndex = itemCount * 2 - 1;
          scrollToPhysicalIndex(physicalIndex, "auto");
        }

        isMoving = false;
      };

      const moveBefore = (direction) => {
        if (isMoving) return;

        isMoving = true;
        physicalIndex += direction;
        scrollToPhysicalIndex(physicalIndex, "smooth");

        /*
          smooth scroll 완료 시점을 넉넉하게 잡은 뒤
          복제 구간이면 동일한 원본 위치로 보이지 않게 리셋합니다.
        */
        window.clearTimeout(finishTimer);
        finishTimer = window.setTimeout(resetIfNeeded, 520);
      };

      beforePrev.addEventListener("click", () => moveBefore(-1));
      beforeNext.addEventListener("click", () => moveBefore(1));

      /*
        이미지 크기가 확정된 뒤 가운데 원본 첫 이미지에서 시작.
        초기 위치 이동은 애니메이션 없이 처리합니다.
      */
      const setInitialPosition = () => {
        physicalIndex = itemCount;
        scrollToPhysicalIndex(physicalIndex, "auto");
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(setInitialPosition);
      });

      window.addEventListener("load", setInitialPosition, { once: true });

      window.addEventListener("resize", () => {
        scrollToPhysicalIndex(physicalIndex, "auto");
      });
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
