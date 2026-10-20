const initMainPage = () => {
document.body.classList.add('js');

const typedText = document.querySelector('[data-typed]');
if (typedText) {
  const words = ['Tinh Gọn', 'Nhân Bản', 'Bền Vững'];
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    typedText.textContent = words.join(' · ');
  } else {
    let wordIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const typeNextFrame = () => {
      const word = words[wordIndex];
      const visibleText = word.slice(0, characterIndex);
      typedText.textContent = visibleText || '\u200B';
      let delay = 95;

      if (!deleting && characterIndex < word.length) {
        characterIndex += 1;
      } else if (!deleting) {
        deleting = true;
        delay = 1400;
      } else if (characterIndex > 0) {
        characterIndex -= 1;
        delay = 45;
      } else {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 450;
      }

      window.setTimeout(typeNextFrame, delay);
    };

    window.setTimeout(typeNextFrame, 450);
  }
}

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileNav = document.querySelector('[data-mobile-nav]');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  mobileNav?.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});

mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const navDropdowns = [...document.querySelectorAll('[data-dropdown]')];
navDropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector('[data-dropdown-toggle]');
  toggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const willOpen = !dropdown.classList.contains('open');
    navDropdowns.forEach((item) => {
      item.classList.remove('open');
      item.querySelector('[data-dropdown-toggle]')?.setAttribute('aria-expanded', 'false');
    });
    dropdown.classList.toggle('open', willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
  });
});

document.addEventListener('click', () => {
  navDropdowns.forEach((dropdown) => {
    dropdown.classList.remove('open');
    dropdown.querySelector('[data-dropdown-toggle]')?.setAttribute('aria-expanded', 'false');
  });
});

const mobileDropdowns = [...document.querySelectorAll('[data-mobile-dropdown]')];
mobileDropdowns.forEach((item) => {
  const toggle = item.querySelector('[data-mobile-dropdown-toggle]');
  toggle.addEventListener('click', () => {
    const willOpen = !item.classList.contains('open');
    mobileDropdowns.forEach((dropdown) => {
      dropdown.classList.remove('open');
      dropdown.querySelector('[data-mobile-dropdown-toggle]')?.setAttribute('aria-expanded', 'false');
    });
    item.classList.toggle('open', willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

function bindAccordion(selector) {
  document.querySelectorAll(`${selector} button`).forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest(selector);
      const willOpen = !item.classList.contains('open');
      document.querySelectorAll(selector).forEach((entry) => {
        entry.classList.remove('open');
        entry.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

bindAccordion('.journey-item');
bindAccordion('.faq-item');

const journeyShowcase = document.querySelector('[data-journey-showcase]');

if (journeyShowcase) {
  const showcaseTabs = [...journeyShowcase.querySelectorAll('[data-journey-showcase-tab]')];
  const showcasePanels = [...journeyShowcase.querySelectorAll('[data-journey-showcase-panel]')];
  const showcaseVisuals = [...journeyShowcase.querySelectorAll('[data-journey-showcase-visual]')];
  const showcaseRoute = journeyShowcase.querySelector('.journey-showcase-tabs');

  const activateJourneyShowcase = (activeIndex, moveFocus = false) => {
    const progress = showcaseTabs.length > 1 ? activeIndex / (showcaseTabs.length - 1) : 0;
    showcaseRoute?.style.setProperty('--journey-progress', String(progress));

    showcaseTabs.forEach((tab, index) => {
      const isActive = index === activeIndex;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    showcasePanels.forEach((panel, index) => {
      const isActive = index === activeIndex;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });

    showcaseVisuals.forEach((visual, index) => {
      const isActive = index === activeIndex;
      visual.classList.toggle('is-active', isActive);
      visual.hidden = !isActive;
    });

    if (moveFocus) showcaseTabs[activeIndex]?.focus();
  };

  showcaseTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateJourneyShowcase(index));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % showcaseTabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + showcaseTabs.length) % showcaseTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = showcaseTabs.length - 1;
      if (nextIndex === undefined) return;
      event.preventDefault();
      activateJourneyShowcase(nextIndex, true);
    });
  });
}

const flowTabs = [...document.querySelectorAll('[data-flow-tab]')];
const flowPanel = document.querySelector('#flow-panel');
const flowImage = document.querySelector('[data-flow-image]');
const flowLabel = document.querySelector('[data-flow-label]');

function activateFlowTab(tab, moveFocus = false) {
  if (!tab || !flowPanel || !flowImage || !flowLabel) return;

  flowTabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-selected', String(isActive));
    item.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  flowPanel.setAttribute('aria-labelledby', tab.id);
  flowLabel.textContent = tab.dataset.label;
  flowImage.classList.add('is-switching');

  window.setTimeout(() => {
    flowImage.src = tab.dataset.image;
    flowImage.alt = tab.dataset.alt;
    flowImage.classList.remove('is-switching');
  }, 140);

  if (moveFocus) tab.focus();
}

flowTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateFlowTab(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % flowTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + flowTabs.length) % flowTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = flowTabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    activateFlowTab(flowTabs[nextIndex], true);
  });
});

function normalizePartnerLogo(image) {
  if (!image.naturalWidth || image.dataset.normalized) return;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return;

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const cornerOffsets = [
    0,
    (canvas.width - 1) * 4,
    (canvas.height - 1) * canvas.width * 4,
    (canvas.width * canvas.height - 1) * 4,
  ];
  const hasOpaqueWhiteCanvas = cornerOffsets.filter((offset) => (
    pixels.data[offset] > 240
    && pixels.data[offset + 1] > 240
    && pixels.data[offset + 2] > 240
    && pixels.data[offset + 3] > 240
  )).length >= 3;

  image.dataset.normalized = 'true';
  if (!hasOpaqueWhiteCanvas) return;

  for (let offset = 0; offset < pixels.data.length; offset += 4) {
    const red = pixels.data[offset];
    const green = pixels.data[offset + 1];
    const blue = pixels.data[offset + 2];
    const lightest = Math.max(red, green, blue);
    const darkest = Math.min(red, green, blue);

    if (darkest > 225 && lightest - darkest < 20) {
      const opacity = Math.max(0, Math.min(1, (255 - darkest) / 30));
      pixels.data[offset + 3] = Math.round(pixels.data[offset + 3] * opacity);
    }
  }

  context.putImageData(pixels, 0, 0);
  image.src = canvas.toDataURL('image/png');
}

document.querySelectorAll('.customer-track').forEach((partnerLogoTrack) => {
const partnerLogoSet = partnerLogoTrack.querySelector('.customer-set');
if (partnerLogoSet) {
  const duplicateSet = partnerLogoSet.cloneNode(true);
  duplicateSet.setAttribute('aria-hidden', 'true');
  duplicateSet.querySelectorAll('img').forEach((image) => image.setAttribute('alt', ''));
  partnerLogoTrack.appendChild(duplicateSet);
}
});

document.querySelectorAll('.customer-track img').forEach((image) => {
  if (image.complete) normalizePartnerLogo(image);
  else image.addEventListener('load', () => normalizePartnerLogo(image), { once: true });
});

const toolkit = document.querySelector('[data-toolkit]');

if (toolkit) {
  const solutionCards = [...toolkit.querySelectorAll('[data-solution-card]')];
  const toolCards = [...toolkit.querySelectorAll('[data-tool]')];
  let selectedSolution = null;

  const showSolutionConnections = (solution) => {
    const relatedTools = new Set((solution?.dataset.relates || '').split(',').filter(Boolean));
    toolkit.classList.toggle('is-connecting', Boolean(solution));
    toolCards.forEach((tool) => tool.classList.toggle('is-related', relatedTools.has(tool.dataset.tool)));
  };

  solutionCards.forEach((card) => {
    card.addEventListener('pointerenter', () => showSolutionConnections(card));
    card.addEventListener('pointerleave', () => showSolutionConnections(selectedSolution));
    card.addEventListener('focus', () => showSolutionConnections(card));
    card.addEventListener('blur', () => showSolutionConnections(selectedSolution));
    card.addEventListener('click', () => {
      selectedSolution = selectedSolution === card ? null : card;
      solutionCards.forEach((item) => {
        const isSelected = item === selectedSolution;
        item.classList.toggle('is-active', isSelected);
        item.setAttribute('aria-pressed', String(isSelected));
      });
      showSolutionConnections(selectedSolution);
    });
  });

  toolCards.forEach((card) => card.addEventListener('click', () => {
    const isSelected = card.getAttribute('aria-pressed') !== 'true';
    card.setAttribute('aria-pressed', String(isSelected));
    card.classList.toggle('is-active', isSelected);
  }));
}

const caseSlider = document.querySelector('[data-case-slider]');
if (caseSlider) {
  const viewport = caseSlider.querySelector('[data-case-viewport]');
  const slides = [...caseSlider.querySelectorAll('[data-case-slide]')];
  const track = caseSlider.querySelector('.case-slider-track');
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let animationFrameId;
  let lastFrameTime = 0;
  let showcasePosition = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScrollLeft = 0;
  let isSliderVisible = false;

  const clones = slides.map((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('data-case-slide');
    clone.querySelector('img')?.setAttribute('alt', '');
    track?.appendChild(clone);
    return clone;
  });

  const getLoopWidth = () => clones[0]?.offsetLeft - slides[0]?.offsetLeft || track?.scrollWidth / 2 || 0;

  const setActiveIndex = (index) => {
    activeIndex = Math.max(0, Math.min(slides.length - 1, index));
  };

  const goToSlide = (index) => {
    const nextIndex = (index + slides.length) % slides.length;
    const loopWidth = getLoopWidth();
    const cycleStart = Math.floor(viewport.scrollLeft / loopWidth) * loopWidth;
    const slideOffset = slides[nextIndex].offsetLeft - slides[0].offsetLeft;
    viewport?.scrollTo({ left: cycleStart + slideOffset, behavior: reducedMotion ? 'auto' : 'smooth' });
    setActiveIndex(nextIndex);
  };

  const stopAutoplay = () => window.cancelAnimationFrame(animationFrameId);
  const animateShowcase = (timestamp) => {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const elapsed = Math.min(timestamp - lastFrameTime, 40);
    const loopWidth = getLoopWidth();
    showcasePosition += elapsed * .025;
    if (loopWidth && showcasePosition >= loopWidth) showcasePosition -= loopWidth;
    viewport.scrollLeft = showcasePosition;
    lastFrameTime = timestamp;
    animationFrameId = window.requestAnimationFrame(animateShowcase);
  };
  const startAutoplay = () => {
    stopAutoplay();
    lastFrameTime = 0;
    if (!reducedMotion && isSliderVisible && !document.hidden) {
      animationFrameId = window.requestAnimationFrame(animateShowcase);
    }
  };

  viewport?.addEventListener('scroll', () => {
    window.requestAnimationFrame(() => {
      const loopWidth = getLoopWidth();
      const localScroll = loopWidth ? viewport.scrollLeft % loopWidth : viewport.scrollLeft;
      const firstOffset = slides[0].offsetLeft;
      const nearestIndex = slides.reduce((nearest, slide, index) => (
        Math.abs((slide.offsetLeft - firstOffset) - localScroll) < Math.abs((slides[nearest].offsetLeft - firstOffset) - localScroll) ? index : nearest
      ), 0);
      setActiveIndex(nearestIndex);
    });
  }, { passive: true });
  viewport?.addEventListener('dragstart', (event) => event.preventDefault());
  viewport?.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    isDragging = true;
    dragStartX = event.clientX;
    dragStartScrollLeft = viewport.scrollLeft;
    showcasePosition = viewport.scrollLeft;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(event.pointerId);
    stopAutoplay();
  });
  viewport?.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    viewport.scrollLeft = dragStartScrollLeft - (event.clientX - dragStartX);
    showcasePosition = viewport.scrollLeft;
  });
  const finishDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('is-dragging');
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    showcasePosition = viewport.scrollLeft;
    startAutoplay();
  };
  viewport?.addEventListener('pointerup', finishDrag);
  viewport?.addEventListener('pointercancel', finishDrag);
  viewport?.addEventListener('touchstart', stopAutoplay, { passive: true });
  viewport?.addEventListener('touchend', () => { showcasePosition = viewport.scrollLeft; startAutoplay(); }, { passive: true });
  viewport?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToSlide(activeIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); goToSlide(activeIndex + 1); }
  });

  setActiveIndex(0);
  const updateShowcaseActivity = (visible) => {
    isSliderVisible = visible;
    if (visible) startAutoplay();
    else stopAutoplay();
  };

  if ('IntersectionObserver' in window) {
    const showcaseObserver = new IntersectionObserver((entries) => {
      updateShowcaseActivity(entries.some((entry) => entry.isIntersecting));
    }, { rootMargin: '160px 0px', threshold: 0.01 });
    showcaseObserver.observe(caseSlider);
  } else {
    updateShowcaseActivity(true);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else if (isSliderVisible) startAutoplay();
  });

  window.requestAnimationFrame(() => {
    showcasePosition = 0;
    viewport.scrollLeft = showcasePosition;
  });
}

};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMainPage, { once: true });
} else {
  initMainPage();
}
