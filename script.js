(() => {
  const zone = document.querySelector("#physics-zone");
  const pills = [...document.querySelectorAll(".project-pill")];

  if (!zone || !pills.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 모바일에서 짧은 터치는 링크 클릭, 일정 거리 이상 이동은 드래그로 구분합니다.
  const pointerState = new WeakMap();
  const dragThreshold = 10;

  pills.forEach((pill) => {
    pointerState.set(pill, {
      pointerId: null,
      startX: 0,
      startY: 0,
      dragged: false
    });

    pill.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary) return;

      const state = pointerState.get(pill);
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.dragged = false;
    });

    pill.addEventListener("pointermove", (event) => {
      const state = pointerState.get(pill);
      if (!state || state.pointerId !== event.pointerId) return;

      const distance = Math.hypot(
        event.clientX - state.startX,
        event.clientY - state.startY
      );

      if (distance > dragThreshold) {
        state.dragged = true;
      }
    });

    pill.addEventListener("pointerup", (event) => {
      const state = pointerState.get(pill);
      if (!state || state.pointerId !== event.pointerId) return;

      const wasDragged = state.dragged;
      state.pointerId = null;

      // Matter.js가 모바일의 기본 click 이벤트를 막는 경우가 있어
      // 짧은 터치라면 링크 주소로 직접 이동시킵니다.
      if (!wasDragged && event.pointerType !== "mouse") {
        const href = pill.getAttribute("href");

        if (href) {
          event.preventDefault();
          window.location.assign(href);
        }
      }
    });

    pill.addEventListener("pointercancel", (event) => {
      const state = pointerState.get(pill);
      if (!state || state.pointerId !== event.pointerId) return;

      state.pointerId = null;
      state.dragged = true;
    });

    pill.addEventListener("click", (event) => {
      const state = pointerState.get(pill);

      // 드래그를 마친 뒤 발생하는 의도치 않은 링크 이동을 막습니다.
      if (state?.dragged) {
        event.preventDefault();
        state.dragged = false;
      }
    });
  });

  let engine;
  let runner;
  let mouseConstraint;
  let animationFrame;
  let resizeTimer;

  function stopPhysics() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (runner && engine) Matter.Runner.stop(runner);
    if (engine) Matter.Engine.clear(engine);

    engine = null;
    runner = null;
    mouseConstraint = null;

    pills.forEach((pill) => {
      pill.style.transform = "";
      pill.style.opacity = "1";
    });
  }

  function initPhysics() {
    stopPhysics();


    const {
      Engine,
      Runner,
      Bodies,
      Body,
      Composite,
      Mouse,
      MouseConstraint,
      Events
    } = Matter;

    engine = Engine.create({
      enableSleeping: true,
      positionIterations: 8,
      velocityIterations: 6,
      constraintIterations: 3,
      gravity: { x: 0, y: 0 }
    });

    const world = engine.world;
    const width = zone.clientWidth;
    const height = zone.clientHeight;

    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth <= 600;
    const isTablet = viewportWidth > 600 && viewportWidth <= 1100;

    const profile = isMobile
      ? {
          gravity: 0.62,
          spawnGap: 72,
          spawnTop: -90,
          collisionPadding: 12,
          floorOffset: 8
        }
      : isTablet
        ? {
            gravity: 0.66,
            spawnGap: 84,
            spawnTop: -110,
            collisionPadding: 15,
            floorOffset: 8
          }
        : {
            gravity: 0.72,
            spawnGap: 100,
            spawnTop: -120,
            collisionPadding: 18,
            floorOffset: 8
          };

    engine.gravity.y = reducedMotion.matches ? 0 : profile.gravity;

    const wallThickness = 100;
    const floor = Bodies.rectangle(
      width / 2,
      height + wallThickness / 2 - profile.floorOffset,
      width + wallThickness * 2,
      wallThickness,
      { isStatic: true, restitution: 0.34, friction: 0.78 }
    );

    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true }
    );

    const rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true }
    );

    Composite.add(world, [floor, leftWall, rightWall]);

    const items = pills.map((pill, index) => {
      const rect = pill.getBoundingClientRect();
      const pillWidth = rect.width;
      const pillHeight = rect.height;
      const xRatio = Number(pill.dataset.x || 0.5);
      const preferredAngle = Number(pill.dataset.angle || 0);

      const startX = Math.max(
        pillWidth / 2,
        Math.min(width - pillWidth / 2, width * xRatio)
      );

      const finalY = reducedMotion.matches
        ? Math.min(height - pillHeight, height * (0.42 + index * 0.055))
        : profile.spawnTop - index * profile.spawnGap;

      const collisionPadding = profile.collisionPadding;

      const body = Bodies.rectangle(
        startX,
        finalY,
        pillWidth + collisionPadding,
        pillHeight + collisionPadding,
        {
          chamfer: { radius: pillHeight / 2 },
          restitution: 0.80,
          friction: 0.42,
          frictionAir: 0.007,
          density: 0.00085,
          sleepThreshold: 35
        }
      );

      Body.setAngle(body, preferredAngle);

      if (!reducedMotion.matches) {
        Body.setAngularVelocity(body, (index % 2 ? 1 : -1) * (0.008 + index * 0.001));
      }

      Composite.add(world, body);
      pill.style.opacity = "1";

      return {
        pill,
        body,
        width: pillWidth,
        height: pillHeight,
        settleFrames: 0
      };
    });

    const mouse = Mouse.create(zone);
    mouse.pixelRatio = window.devicePixelRatio || 1;

    mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.16,
        damping: 0.12,
        render: { visible: false }
      }
    });

    Composite.add(world, mouseConstraint);

    Events.on(mouseConstraint, "mousedown", () => {
      zone.style.zIndex = "30";

      if (mouseConstraint.body) {
        Matter.Sleeping.set(mouseConstraint.body, false);
      }
    });

    Events.on(mouseConstraint, "mouseup", () => {
      zone.style.zIndex = "10";
    });

    runner = Runner.create();
    Runner.run(runner, engine);

    // 버튼이 충분히 느려진 뒤 생기는 미세 진동을 제거합니다.
    Events.on(engine, "afterUpdate", () => {
      items.forEach((item) => {
        const { body } = item;

        if (body.isSleeping || mouseConstraint.body === body) {
          item.settleFrames = 0;
          return;
        }

        const speed = body.speed;
        const angularSpeed = Math.abs(body.angularSpeed);

        if (speed < 0.11 && angularSpeed < 0.018) {
          item.settleFrames += 1;
        } else {
          item.settleFrames = 0;
        }

        // 약 0.4초 이상 거의 움직이지 않으면 완전히 정지시킵니다.
        if (item.settleFrames > 24) {
          Body.setVelocity(body, { x: 0, y: 0 });
          Body.setAngularVelocity(body, 0);
          Matter.Sleeping.set(body, true);
          item.settleFrames = 0;
        }
      });
    });

    function render() {
      items.forEach(({ pill, body, width: itemWidth, height: itemHeight }) => {
        pill.style.transform =
          `translate3d(${body.position.x - itemWidth / 2}px, ` +
          `${body.position.y - itemHeight / 2}px, 0) ` +
          `rotate(${body.angle}rad)`;
      });

      animationFrame = requestAnimationFrame(render);
    }

    render();

    if (!reducedMotion.matches) {
      setTimeout(() => {
        if (!engine) return;
        engine.gravity.y = Math.max(0.52, profile.gravity - 0.10);
      }, 2500);
    }
  }

  document.fonts.ready.then(initPhysics);

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initPhysics, 180);
  });

  reducedMotion.addEventListener?.("change", initPhysics);
})();

/* About Me full-screen sliding panel */
(() => {
  const aboutLink = document.querySelector('.about[href="./about.html"]');
  if (!aboutLink) return;

  const shell = document.createElement('div');
  shell.className = 'about-panel-shell';
  shell.setAttribute('aria-hidden', 'true');

  const panel = document.createElement('iframe');
  panel.className = 'about-panel';
  panel.title = 'About Me';
  panel.src = './about.html';
  panel.setAttribute('loading', 'eager');

  shell.appendChild(panel);
  document.body.appendChild(shell);

  let closeTimer = null;

  const openPanel = () => {
    window.clearTimeout(closeTimer);
    shell.classList.add('is-visible');
    shell.setAttribute('aria-hidden', 'false');
    document.body.classList.add('about-panel-open');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => shell.classList.add('is-open'));
    });
  };

  const closePanel = () => {
    shell.classList.remove('is-open');
    shell.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('about-panel-open');

    closeTimer = window.setTimeout(() => {
      shell.classList.remove('is-visible');
      aboutLink.focus({ preventScroll: true });
    }, 1100);
  };

  aboutLink.addEventListener('click', (event) => {
    event.preventDefault();
    openPanel();
  });

  window.addEventListener('message', (event) => {
    if (event.source === panel.contentWindow && event.data === 'close-about-panel') {
      closePanel();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && shell.classList.contains('is-open')) {
      closePanel();
    }
  });

  window.addEventListener('pageshow', () => {
    shell.classList.remove('is-open', 'is-visible');
    shell.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('about-panel-open');
  });
})();
