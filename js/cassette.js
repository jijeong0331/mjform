(() => {
  const modal = document.getElementById("projectModal");
  if (!modal) return;

  const thumbnails = Array.from(document.querySelectorAll(".cassette-thumbnail"));
  const image = modal.querySelector(".project-modal__image");
  const prevButton = modal.querySelector(".project-modal__nav--prev");
  const nextButton = modal.querySelector(".project-modal__nav--next");
  const closeButtons = modal.querySelectorAll("[data-close-modal]");
  const cursorTag = document.getElementById("thumbnailCursorTag");

  const projects = [
    { title: "Cassette 01", images: ["../assets/cassette/view_cassette_01.webp"] },
    { title: "Cassette 02", images: ["../assets/cassette/view_cassette_02.webp"] },
    { title: "Cassette 03", images: ["../assets/cassette/view_cassette_03.webp"] },
    { title: "Cassette 04", images: ["../assets/cassette/view_cassette_04.webp"] },
    {
      title: "Cassette 05",
      images: [
        "../assets/cassette/view_cassette_05-1.webp",
        "../assets/cassette/view_cassette_05-2.webp"
      ]
    },
    { title: "Cassette 06", images: ["../assets/cassette/view_cassette_06.webp"] }
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

    if (lastFocusedElement) lastFocusedElement.focus();
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

  closeButtons.forEach((button) => button.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;

    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowLeft" && !prevButton.hidden && !prevButton.disabled) prevButton.click();
    if (event.key === "ArrowRight" && !nextButton.hidden && !nextButton.disabled) nextButton.click();
  });
})();
