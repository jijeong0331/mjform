(() => {
  const modal = document.getElementById("projectModal");
  if (!modal) return;

  const thumbnails = Array.from(document.querySelectorAll(".print-thumbnail"));
  const image = modal.querySelector(".project-modal__image");
  const prevButton = modal.querySelector(".project-modal__nav--prev");
  const nextButton = modal.querySelector(".project-modal__nav--next");
  const closeButtons = modal.querySelectorAll("[data-close-modal]");
  const cursorTag = document.getElementById("thumbnailCursorTag");

  /*
   * 각 썸네일의 상세 이미지를 이 배열에 추가하면 됩니다.
   * 한 장이면 화살표가 자동으로 숨고, 두 장 이상이면 슬라이드 버튼이 표시됩니다.
   */
  const projects = [
    {
      title: "안산그린컴퓨터 아카데미 프로모션 X배너",
      images: [
        "../assets/print-design/view_00_01.webp"
      ]
    },
    {
      title: "Landmark Poster",
      images: [
        "../assets/print-design/view_01_01.webp"
      ]
    },
    {
      title: "거북이는 의외로 빨리 헤엄친다",
      images: [
        "../assets/print-design/view_02_01.webp"
      ]
    },
    {
      title: "대한민국 헌혈 공모전",
      images: [
        "../assets/print-design/view_03_01.webp"
      ]
    },
    {
      title: "스마트공장 구축 지원",
      images: [
        "../assets/print-design/view_04_01.webp"
      ]
    },
    {
      title: "Microgen Path-Check Protein",
      images: [
        "../assets/print-design/view_05_01.webp",
        "../assets/print-design/view_05_02.webp"
      ]
    },
    {
      title: "NEOGEN Petrifilm Count Plate",
      images: [
        "../assets/print-design/view_06_01.webp",
        "../assets/print-design/view_06_02.webp"
      ]
    },
    {
      title: "HAPS HM-2 자동시료균질기",
      images: [
        "../assets/print-design/view_07_01.webp"
      ]
    }
  ];

  let activeProjectIndex = 0;
  let activeImageIndex = 0;
  let lastFocusedElement = null;

  function updateModal() {
    const project = projects[activeProjectIndex];
    const images = project.images;
    const hasMultiple = images.length > 1;

    image.src = images[activeImageIndex];
    image.alt = `${project.title} 작업물 ${activeImageIndex + 1}`;
    modal.querySelector("#projectModalTitle").textContent = `${project.title} 상세 보기`;

    prevButton.hidden = !hasMultiple;
    nextButton.hidden = !hasMultiple;

    if (hasMultiple) {
      prevButton.disabled = activeImageIndex === 0;
      nextButton.disabled = activeImageIndex === images.length - 1;
    }
  }

  function openModal(projectIndex) {
    activeProjectIndex = projectIndex;
    activeImageIndex = 0;
    lastFocusedElement = document.activeElement;

    updateModal();
    if (cursorTag) cursorTag.classList.remove("is-visible");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-modal-open");
    modal.querySelector(".project-modal__close").focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-modal-open");
    image.removeAttribute("src");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => openModal(index));

    if (cursorTag) {
      thumbnail.addEventListener("pointerenter", (event) => {
        cursorTag.textContent = thumbnail.dataset.tag || "View";
        cursorTag.classList.add("is-visible");
        cursorTag.style.left = `${event.clientX + 22}px`;
        cursorTag.style.top = `${event.clientY - 22}px`;
      });

      thumbnail.addEventListener("pointermove", (event) => {
        cursorTag.style.left = `${event.clientX + 22}px`;
        cursorTag.style.top = `${event.clientY - 22}px`;
      });

      thumbnail.addEventListener("pointerleave", () => {
        cursorTag.classList.remove("is-visible");
      });
    }
  });

  prevButton.addEventListener("click", () => {
    if (activeImageIndex <= 0) return;
    activeImageIndex -= 1;
    updateModal();
  });

  nextButton.addEventListener("click", () => {
    const images = projects[activeProjectIndex].images;
    if (activeImageIndex >= images.length - 1) return;
    activeImageIndex += 1;
    updateModal();
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeModal();
    }

    if (event.key === "ArrowLeft" && !prevButton.hidden && !prevButton.disabled) {
      prevButton.click();
    }

    if (event.key === "ArrowRight" && !nextButton.hidden && !nextButton.disabled) {
      nextButton.click();
    }
  });
})();
