(() => {
  'use strict';

  // DOM elements
  const bookElement = document.getElementById('branding-flipbook');
  const loadingElement = document.getElementById('branding-flipbook-loading');
  const prevButton = document.getElementById('branding-flipbook-prev');
  const nextButton = document.getElementById('branding-flipbook-next');
  const currentElement = document.getElementById('branding-flipbook-current');
  const totalElement = document.getElementById('branding-flipbook-total');

  if (!bookElement || !window.St?.PageFlip) {
    if (loadingElement) {
      loadingElement.textContent = '플립북을 불러오지 못했습니다. PDF 새 창 보기 버튼을 이용해 주세요.';
    }
    return;
  }

  // Magazine page images
  const pageCount = 14;
  const pageImages = Array.from(
    { length: pageCount },
    (_, index) => `../assets/branding-design/magazine-pages/page-${String(index + 1).padStart(2, '0')}.webp`
  );

  // StPageFlip settings
  const pageFlip = new St.PageFlip(bookElement, {
    width: 620,
    height: 827,
    size: 'stretch',
    minWidth: 280,
    maxWidth: 720,
    minHeight: 373,
    maxHeight: 960,
    maxShadowOpacity: 0.35,
    showCover: true,
    mobileScrollSupport: false,
    usePortrait: true,
    autoSize: false,
    drawShadow: true,
    flippingTime: 700,
    clickEventForward: true,
    useMouseEvents: true,
    swipeDistance: 24,
    showPageCorners: true,
    disableFlipByClick: false,
  });

  // Page counter and navigation state
  const updateControls = (pageIndex = 0) => {
    const displayPage = Math.min(pageCount, pageIndex + 1);
    currentElement.textContent = String(displayPage);
    totalElement.textContent = String(pageCount);
    prevButton.disabled = pageIndex <= 0;
    nextButton.disabled = pageIndex >= pageCount - 1;
  };

  // Flipbook events
  pageFlip.on('init', (event) => {
    loadingElement?.classList.add('is-hidden');
    updateControls(Number(event.data?.page ?? 0));
  });

  pageFlip.on('flip', (event) => {
    updateControls(Number(event.data));
  });

  pageFlip.on('changeOrientation', () => {
    updateControls(pageFlip.getCurrentPageIndex());
  });

  // Navigation buttons
  prevButton.addEventListener('click', () => pageFlip.flipPrev('top'));
  nextButton.addEventListener('click', () => pageFlip.flipNext('top'));

  pageFlip.loadFromImages(pageImages);
  updateControls(0);
})();
