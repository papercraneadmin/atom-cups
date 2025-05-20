document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('video').forEach(v => {
    v.muted = true;
    v.play().catch(() => {});
  });

  const isMobile = window.innerWidth <= 767;

  if (isMobile) {
    initMobileSlider();
  } else {
    initDesktopOrbit();
  }

  window.addEventListener('resize', function() {
    const currentIsMobile = window.innerWidth <= 767;
    if (currentIsMobile !== isMobile) {
      location.reload();
    }
  });
});

function initMobileSlider() {
  const sliderItems = document.querySelectorAll('.hero-slider .slider-item');
  const count = sliderItems.length;
  
  if (count === 0) return;

  let currentIndex = 0;
  let previousIndex = count - 1;
  
  function nextSlide() {
    sliderItems[currentIndex].classList.remove('active');
    sliderItems[currentIndex].classList.add('prev');
    
    previousIndex = currentIndex;
    currentIndex = (currentIndex + 1) % count;
    
    sliderItems.forEach((item, i) => {
      if (i !== previousIndex) {
        item.classList.remove('prev');
      }
      
      if (i === currentIndex) {
        void item.offsetWidth;
        item.classList.add('active');
      }
    });
    
    const activeVideo = sliderItems[currentIndex].querySelector('video');
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(() => {});
    }
  }

  sliderItems[0].classList.add('active');
  
  setInterval(nextSlide, 8000);
}

function initDesktopOrbit() {
  const container = document.querySelector('.orbit-container');
  const items = container.querySelectorAll('.orbit-item');
  const count = items.length;
  
  if (count === 0) return;

  // Easily changeable multiplier to scale the size of orbit items
  const sizeMultiplier = 1.2;

  const minCount = 3, maxCount = 8, minEm = 20, maxEm = 8;
  const clamped = Math.min(Math.max(count, minCount), maxCount);
  const sizeEm = ((minEm + (clamped - minCount) * (maxEm - minEm) / (maxCount - minCount)) * sizeMultiplier).toFixed(2);
  items.forEach(item => {
    item.style.width = `${sizeEm}em`;
    item.style.height = `${sizeEm}em`;
  });

  const offset = -Math.PI / 2;
  let rot = 0, step = 360 / count;
  
  const baseRadius = 16; 
  const fullRadius = baseRadius;
  const inwardRadius = fullRadius * 0.85;
  
  const rotationDuration = 4000; // 5s * 0.8 = 4s
  const transitionDuration = rotationDuration;
  const halfTransitionDuration = transitionDuration / 2;
  const easingFunction = 'cubic-bezier(0.45, 0, 0.55, 1)';

  function positionItems(r, rotation) {
    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      const angle = offset + (2 * Math.PI * i / count);
      const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const radiusPx = r * remToPx;
      
      const x = radiusPx * Math.cos(angle);
      const y = radiusPx * Math.sin(angle);
      item.style.left = `${x - w / 2}px`;
      item.style.top = `${y - h / 2}px`;
      item.style.transform = `rotate(${-rotation}deg)`;
    });
  }
  container.style.transition = `transform ${rotationDuration}ms ${easingFunction}`;
  items.forEach(item => {
    item.style.transition = `transform ${rotationDuration}ms ${easingFunction}, 
                             left ${halfTransitionDuration}ms ${easingFunction}, 
                             top ${halfTransitionDuration}ms ${easingFunction}`;
  });

  function animateInOut(callback) {
    positionItems(inwardRadius, rot);
    setTimeout(() => {
      callback();
      setTimeout(() => {
        positionItems(fullRadius, rot);
      }, 0);
    }, halfTransitionDuration);
  }

  function update() {
    rot += step;
    container.style.transform = `rotate(${rot}deg)`;
    animateInOut(() => {
      positionItems(fullRadius, rot);
    });
  }

  positionItems(fullRadius, rot);
  setTimeout(() => { update(); setInterval(update, 6400); }, 3000); 
} 