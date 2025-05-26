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
  const sliderItems = document.querySelectorAll('.hero-slider .slider .slider-item');
  const count = sliderItems.length;
  
  if (count === 0) return;

  let currentIndex = 0;
  let intervalId = null;
  let hiddenTime = null;
  
  const crossfadeDuration = 1000;
  const easingFunction = 'cubic-bezier(0.45, 0, 0.55, 1)';
  
  sliderItems.forEach((item, i) => {
    item.classList.remove('prev');
    item.style.position = 'absolute';
    item.style.top = '0';
    item.style.left = '0';
    item.style.width = '100%';
    item.style.height = '100%';
    item.style.transform = 'translateX(0)';
    item.style.transition = `opacity ${crossfadeDuration}ms ${easingFunction}`;
    
    if (i === 0) {
      item.classList.add('active');
      item.style.opacity = '1';
    } else {
      item.classList.remove('active');
      item.style.opacity = '0';
    }
  });
  
  function nextSlide() {
    const previousIndex = currentIndex;
    currentIndex = (currentIndex + 1) % count;
    
    sliderItems[previousIndex].classList.remove('active');
    sliderItems[currentIndex].classList.add('active');
    
    sliderItems[previousIndex].style.opacity = '0';
    sliderItems[currentIndex].style.opacity = '1';
    
    const activeVideo = sliderItems[currentIndex].querySelector('video');
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(() => {});
    }
  }

  function startSlider() {

    sliderItems.forEach((item, i) => {
      item.classList.remove('prev');
      if (i === 0) {
        item.classList.add('active');
        item.style.opacity = '1';
      } else {
        item.classList.remove('active');
        item.style.opacity = '0';
      }
    });
    currentIndex = 0;
    
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 8000);
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      hiddenTime = Date.now();
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    } else {
      if (hiddenTime && Date.now() - hiddenTime > 5000) {
        startSlider();
      } else if (!intervalId) {
        intervalId = setInterval(nextSlide, 8000);
      }
      hiddenTime = null;
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  startSlider();
}

function initDesktopOrbit() {
  const container = document.querySelector('.orbit-container');
  const items = container.querySelectorAll('.orbit-item');
  const count = items.length;
  
  if (count === 0) return;

  const multipliers = {
    3: { size: 1.8, radius: 1.8, degOffset: 30 },
    4: { size: 1.6, radius: 1.8, degOffset: 0 },
    5: { size: 1.6, radius: 1.8, degOffset: 55 },
    6: { size: 1.8, radius: 1.8, degOffset: 30 },
    7: { size: 1.8, radius: 2.0, degOffset: 10 },
    8: { size: 2.5, radius: 2.1, degOffset: 0 }
  };
  
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

  let intervalId = null;
  let hiddenTime = null;

  function updateActiveItem(rotation) {
    let leftmostIndex = 0;
    let leftmostX = Infinity;
    
    items.forEach((item, i) => {
      const angle = offset + (2 * Math.PI * i / count);
      const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const radiusPx = fullRadius * remToPx;
      
      const totalAngle = angle + (rotation * Math.PI / 180);
      const x = radiusPx * Math.cos(totalAngle);
      
      if (x < leftmostX) {
        leftmostX = x;
        leftmostIndex = i;
      }
    });
    items.forEach((item, i) => {
      if (i === leftmostIndex) {
        item.style.transform = `rotate(${-rotation}deg) scale(1.35)`;
      } else {
        item.style.transform = `rotate(${-rotation}deg) scale(1)`;
      }
    });
  }

  function positionItems(r, rotation) {
    items.forEach((item, i) => {
      const angle = offset + (2 * Math.PI * i / count);
      const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const radiusPx = r * remToPx;
      

      const baseSizePx = parseFloat(sizeEm) * remToPx;
      
      const x = radiusPx * Math.cos(angle);
      const y = radiusPx * Math.sin(angle);
      item.style.left = `${x - baseSizePx / 2}px`;
      item.style.top = `${y - baseSizePx / 2}px`;
    });
    
    updateActiveItem(rotation);
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

  function startOrbit() {
    rot = 0;
    
    container.style.transition = 'none';
    items.forEach(item => {
      item.style.transition = 'none';
    });
    
    container.style.transform = `rotate(0deg)`;
    positionItems(fullRadius, rot);
    
    setTimeout(() => {
      container.style.transition = `transform ${rotationDuration}ms ${easingFunction}`;
      items.forEach(item => {
        item.style.transition = `transform ${rotationDuration}ms ${easingFunction}, 
                                 left ${halfTransitionDuration}ms ${easingFunction}, 
                                 top ${halfTransitionDuration}ms ${easingFunction}`;
      });
    }, 50);
    
    if (intervalId) clearInterval(intervalId);
    
    setTimeout(() => {
      update();
      intervalId = setInterval(update, 6400);
    }, 3000);
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      hiddenTime = Date.now();
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    } else {
      if (hiddenTime && Date.now() - hiddenTime > 5000) {
        startOrbit();
      } else if (!intervalId) {
        setTimeout(() => {
          update();
          intervalId = setInterval(update, 6400);
        }, 3000);
      }
      hiddenTime = null;
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  startOrbit();
} 