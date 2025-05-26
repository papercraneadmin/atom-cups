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

  // Per # of items, set the size, radius, and degOffset
  const multipliers = {
    3: { size: 1.8, radius: 1.8, degOffset: 30 },
    4: { size: 1.6, radius: 1.8, degOffset: 0 },
    5: { size: 1.6, radius: 1.8, degOffset: 55 },
    6: { size: 1.8, radius: 1.8, degOffset: 30 },
    7: { size: 1.8, radius: 2.0, degOffset: 10 },
    8: { size: 2.5, radius: 2.1, degOffset: 0 }
  };
  
  // modify the radius and size on small screens
  const smallScreenMultipliers = {
    radiusMultiplier: 0.6,
    sizeMultiplier: 0.7
  };
  
  const isSmallScreen = window.innerWidth >= 767 && window.innerWidth <= 1150;
  
  let sizeMultiplier = 1.8;
  let radiusMultiplier = 1.8;
  let degOffset = 0;
  
  if (multipliers[count]) {
    sizeMultiplier = multipliers[count].size;
    radiusMultiplier = multipliers[count].radius;
    degOffset = multipliers[count].degOffset;
  }
  
  if (isSmallScreen) {
    sizeMultiplier *= smallScreenMultipliers.sizeMultiplier;
    radiusMultiplier *= smallScreenMultipliers.radiusMultiplier;
  }

  const minCount = 3, maxCount = 8, minEm = 20, maxEm = 8;
  const clamped = Math.min(Math.max(count, minCount), maxCount);
  const sizeEm = ((minEm + (clamped - minCount) * (maxEm - minEm) / (maxCount - minCount)) * sizeMultiplier).toFixed(2);
  items.forEach(item => {
    item.style.width = `${sizeEm}rem`;
    item.style.height = `${sizeEm}rem`;
  });

  const offset = -Math.PI / 2 + (degOffset * Math.PI / 180); 
  let rot = 0;  
  let step = 360 / count;
  
  const baseRadius = 16;
  const fullRadius = baseRadius * radiusMultiplier;
  const inwardRadius = fullRadius * 0.85;
  
  const rotationDuration = 4000;
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

  container.style.transform = `rotate(0deg)`;
  positionItems(fullRadius, rot);
  
  let lastUpdateTime = Date.now();
  const updateInterval = 6400;
  
  function scheduleNextUpdate() {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime;
    
    if (timeSinceLastUpdate >= updateInterval - 100) {
      lastUpdateTime = now;
      update();
    }

    setTimeout(scheduleNextUpdate, 100);
  }
  setTimeout(() => {
    lastUpdateTime = Date.now();
    update();
    scheduleNextUpdate();
  }, 3000);
} 