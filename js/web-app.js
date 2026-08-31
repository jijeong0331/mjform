(() => {
  const thumbnails = document.querySelectorAll(".web-app-thumbnail");
  const cursorLabel = document.getElementById("webAppCursorLabel");

  if (!thumbnails.length || !cursorLabel) return;
const moveLabel = (event) => {
    cursorLabel.style.left = `${event.clientX + 22}px`;
    cursorLabel.style.top = `${event.clientY - 22}px`;
  };

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("mouseenter", (event) => {
      cursorLabel.textContent = thumbnail.dataset.cursorLabel || "View";
      moveLabel(event);
      cursorLabel.classList.add("is-visible");
    });

    thumbnail.addEventListener("mousemove", moveLabel);

    thumbnail.addEventListener("mouseleave", () => {
      cursorLabel.classList.remove("is-visible");
    });

    thumbnail.addEventListener("click", () => {
      cursorLabel.classList.remove("is-visible");
    });
  });
})();
