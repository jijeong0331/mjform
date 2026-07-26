(() => {
  const script = document.currentScript;
  const base = script?.dataset.base || ".";
  const pageCss = script?.dataset.pageCss;

  const appendMeta = (attributes) => {
    const meta = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => meta.setAttribute(key, value));
    document.head.appendChild(meta);
  };

  const appendStylesheet = (href) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  };

  appendMeta({ charset: "utf-8" });
  appendMeta({ name: "viewport", content: "width=device-width, initial-scale=1" });

  appendStylesheet("https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/static/woff2/SUIT.css");
  appendStylesheet(`${base}/styles/common.css`);
  appendStylesheet(`${base}/styles/subpage-header.css`);

  if (pageCss) {
    appendStylesheet(pageCss);
  }
})();
