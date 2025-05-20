document.addEventListener("DOMContentLoaded", function() {
  // Initialize all videos
  document.querySelectorAll('video').forEach(v => {
    v.muted = true;
    v.play().catch(() => {});
  });

  const isMobile = window.innerWidth <= 767;

  // Handle mobile hero slider
  if (isMobile) {
    initMobileSlider();
  } else {
    // Handle desktop orbit
    initDesktopOrbit();
  }

  // Listen for window resize to handle responsive behavior
  window.addEventListener('resize', function() {
    const currentIsMobile = window.innerWidth <= 767;
    // Only reload if we crossed the mobile/desktop threshold
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
  
  // Function to handle slide transition
  function nextSlide() {
    // Mark the current active slide as previous
    sliderItems[currentIndex].classList.remove('active');
    sliderItems[currentIndex].classList.add('prev');
    
    // Calculate next index
    previousIndex = currentIndex;
    currentIndex = (currentIndex + 1) % count;
    
    // Remove prev class from all other slides
    sliderItems.forEach((item, i) => {
      if (i !== previousIndex) {
        item.classList.remove('prev');
      }
      
      // Reset transform for the incoming slide
      if (i === currentIndex) {
        // Force browser to acknowledge the change
        void item.offsetWidth;
        item.classList.add('active');
      }
    });
    
    // Make sure videos play on the active slide
    const activeVideo = sliderItems[currentIndex].querySelector('video');
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(() => {});
    }
  }

  // Initial setup
  sliderItems[0].classList.add('active');
  
  // Auto-advance slides
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
  const fullRadius = (50 / 3) * (window.innerWidth / 100);
  const inwardRadius = fullRadius * 0.85;

  function positionItems(r, rotation) {
    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      const angle = offset + (2 * Math.PI * i / count);
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      item.style.left = `${x - w / 2}px`;
      item.style.top = `${y - h / 2}px`;
      item.style.transform = `rotate(${-rotation}deg)`;
    });
  }

  container.style.transition = "transform 5s ease";
  items.forEach(item => item.style.transition = "transform 5s ease, left 2.5s ease-in-out, top 2.5s ease-in-out");

  function animateInOut(callback) {
    positionItems(inwardRadius, rot);
    setTimeout(() => {
      callback();
      setTimeout(() => {
        positionItems(fullRadius, rot);
      }, 2500);
    }, 2500);
  }

  function update() {
    rot += step;
    container.style.transform = `rotate(${rot}deg)`;
    animateInOut(() => {
      positionItems(fullRadius, rot);
    });
  }

  positionItems(fullRadius, rot);
  setTimeout(() => { update(); setInterval(update, 8000); }, 3000);
} 