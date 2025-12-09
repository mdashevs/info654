// Y2K Draggable Windows - Make all windows draggable by their header
document.addEventListener('DOMContentLoaded', function() {
  const windows = document.querySelectorAll('.window');
  const desktopIcons = document.querySelectorAll('.desktop-icon');
  // Start above the desktop icons z-index (which is 1000 in CSS) so opened windows can be raised above icons
  let zIndex = 1001;
  let draggedWindow = null;
  let dragOffset = { x: 0, y: 0 };

    // Handle desktop folder clicks to open/show windows
  desktopIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      const windowId = icon.getAttribute('data-window');
      console.log('desktop icon clicked:', windowId);
      const targetWindow = document.getElementById(windowId);
      
      if (!targetWindow) {
        console.warn('No target window found for id:', windowId);
      }

      if (targetWindow) {
        // Toggle or show window
          const computed = getComputedStyle(targetWindow).display;
          if (computed === 'none') {
          targetWindow.style.display = 'block';
          targetWindow.style.zIndex = ++zIndex;
          
          // Randomize position slightly when opening
          const randomX = Math.random() * (window.innerWidth - 300) + 50;
          const randomY = Math.random() * (window.innerHeight - 200) + 50;
          targetWindow.style.left = randomX + 'px';
          targetWindow.style.top = randomY + 'px';
        } else {
          targetWindow.style.zIndex = ++zIndex;
        }
      }
    });
  });

  windows.forEach(windowEl => {
    const header = windowEl.querySelector('.window-header');

    // Make header draggable
    header.addEventListener('mousedown', (e) => {
      draggedWindow = windowEl;
      windowEl.classList.add('dragging');
      windowEl.style.zIndex = ++zIndex;

      const rect = windowEl.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
    });

    // Close button
    const closeBtn = windowEl.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        windowEl.style.display = 'none';
      });
    }

    // Minimize button
    const minimizeBtn = windowEl.querySelector('.btn-minimize');
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        const body = windowEl.querySelector('.window-body');
        if (body.style.display === 'none') {
          body.style.display = 'block';
        } else {
          body.style.display = 'none';
        }
      });
    }

    // Maximize button (restore to random position)
    const maximizeBtn = windowEl.querySelector('.btn-maximize');
    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', () => {
        const body = windowEl.querySelector('.window-body');
        if (body.style.display === 'none') {
          body.style.display = 'block';
        }
        // Randomize position slightly
        windowEl.style.left = (Math.random() * 100 + 50) + 'px';
        windowEl.style.top = (Math.random() * 100 + 50) + 'px';
      });
    }
  });

  // Global mouse move/up for dragging
  document.addEventListener('mousemove', (e) => {
    if (draggedWindow) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      draggedWindow.style.left = Math.max(0, Math.min(newX, window.innerWidth - 100)) + 'px';
      draggedWindow.style.top = Math.max(0, Math.min(newY, window.innerHeight - 20)) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    if (draggedWindow) {
      draggedWindow.classList.remove('dragging');
      draggedWindow = null;
    }
  });

  // Randomly scatter windows on page load for dreamy effect
  windows.forEach((windowEl, index) => {
    // Show first window by default
    if (index === 0) {
      windowEl.style.display = 'block';
    }
    
    const randomX = Math.random() * (window.innerWidth - 300) + 50;
    const randomY = Math.random() * (window.innerHeight - 200) + 50;
    
    // Use a slight offset from the inline styles for visual variety
    windowEl.style.left = (randomX + (Math.random() * 40 - 20)) + 'px';
    windowEl.style.top = (randomY + (Math.random() * 40 - 20)) + 'px';
  });

  
  

  function updateTime() {
    if (isPlaying) {
      currentTime += 1;
      const minutes = Math.floor(currentTime / 60);
      const seconds = currentTime % 60;
      timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }

  
});
