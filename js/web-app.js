(() => {
  const thumbnails = document.querySelectorAll(".web-app-thumbnail");
  const cursorLabel = document.getElementById("webAppCursorLabel");

  if (!thumbnails.length || !cursorLabel) return;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!canHover.matches) return;

  const moveLabel = (event) => {
    cursorLabel.style.left = `${event.clientX + 22}px`;
    cursorLabel.style.top = `${event.clientY - 22}px`;
  };

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("pointerenter", (event) => {
      cursorLabel.textContent = thumbnail.dataset.cursorLabel || "View";
      moveLabel(event);
      cursorLabel.classList.add("is-visible");
    });

    thumbnail.addEventListener("pointermove", moveLabel);

    thumbnail.addEventListener("pointerleave", () => {
      cursorLabel.classList.remove("is-visible");
    });

    thumbnail.addEventListener("click", () => {
      cursorLabel.classList.remove("is-visible");
    });
  });
})();
