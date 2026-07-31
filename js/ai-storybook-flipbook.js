(() => {
  'use strict';

  const video = document.getElementById('storybook-video');
  const playButton = document.getElementById('storybook-video-play');
  const videoWrapper = video?.closest('.storybook-video');

  if (video && playButton) {
    playButton.addEventListener('click', () => video.play().catch(() => {}));
    video.addEventListener('play', () => videoWrapper?.classList.add('is-playing'));
    video.addEventListener('pause', () => videoWrapper?.classList.remove('is-playing'));
    video.addEventListener('ended', () => videoWrapper?.classList.remove('is-playing'));
  }

  const bookElement = document.getElementById('storybook-flipbook');
  const loadingElement = document.getElementById('storybook-flipbook-loading');
  const prevButton = document.getElementById('storybook-flipbook-prev');
  const nextButton = document.getElementById('storybook-flipbook-next');
  const currentElement = document.getElementById('storybook-flipbook-current');
  const totalElement = document.getElementById('storybook-flipbook-total');

  if (!bookElement || !window.St?.PageFlip) {
    if (loadingElement) {
      loadingElement.textContent = '플립북을 불러오지 못했습니다. PDF 새 창 보기 버튼을 이용해 주세요.';
    }
    return;
  }

  const pageCount = 54;
  const pageImages = Array.from(
    { length: pageCount },
    (_, index) => `../assets/ai-storybook/book-pages/page-${String(index + 1).padStart(2, '0')}.webp`
  );

  const pageFlip = new St.PageFlip(bookElement, {
    width: 1024,
    height: 768,
    size: 'stretch',
    minWidth: 240,
    maxWidth: 1120,
    minHeight: 180,
    maxHeight: 840,
    autoSize: true,
    usePortrait: true,
    showCover: true,
    drawShadow: true,
    maxShadowOpacity: 0.32,
    flippingTime: 700,
    mobileScrollSupport: false,
    swipeDistance: 24
  });

  const updateControls = (pageIndex = 0) => {
    currentElement.textContent = String(Math.min(pageCount, pageIndex + 1));
    totalElement.textContent = String(pageCount);
    prevButton.disabled = pageIndex <= 0;
    nextButton.disabled = pageIndex >= pageCount - 1;
  };

  pageFlip.on('init', event => {
    loadingElement?.classList.add('is-hidden');
    updateControls(Number(event.data?.page ?? 0));
  });

  pageFlip.on('flip', event => updateControls(Number(event.data)));
  pageFlip.on('changeOrientation', () => updateControls(pageFlip.getCurrentPageIndex()));

  prevButton.addEventListener('click', () => pageFlip.flipPrev('top'));
  nextButton.addEventListener('click', () => pageFlip.flipNext('top'));

  pageFlip.loadFromImages(pageImages);
  updateControls();
})();
