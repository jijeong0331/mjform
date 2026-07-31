(() => {
  const video = document.getElementById('storybook-video');
  const playButton = document.getElementById('storybook-video-play');
  const videoWrap = video?.closest('.storybook-video');

  if (!video || !playButton || !videoWrap) return;

  const syncState = () => {
    const isPlaying = !video.paused && !video.ended;
    videoWrap.classList.toggle('is-playing', isPlaying);
    playButton.setAttribute('aria-label', isPlaying ? '북트레일러 일시정지' : '북트레일러 재생');
  };

  playButton.addEventListener('click', async () => {
    try {
      if (video.paused || video.ended) {
        if (video.ended) video.currentTime = 0;
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error('북트레일러 재생에 실패했습니다.', error);
    }
  });

  video.addEventListener('play', syncState);
  video.addEventListener('pause', syncState);
  video.addEventListener('ended', syncState);
  video.addEventListener('loadedmetadata', syncState);

  syncState();
})();
