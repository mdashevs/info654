
document.addEventListener('DOMContentLoaded', function () {
  // Core setups
  const windows = Array.from(document.querySelectorAll('.window'));
  const desktopIcons = Array.from(document.querySelectorAll('.desktop-icon'));

  // zIndex counter to keep newly focused/opened windows on top
  let zIndexCounter = 1;

  // Drag state
  let draggedWindow = null;
  let dragOffset = { x: 0, y: 0 };

  // Delegated click handler for desktop icons (open/focus windows)
  document.addEventListener('click', function (e) {
    const icon = e.target.closest('.desktop-icon');
    if (!icon) return;

    const targetId = icon.dataset.window || icon.getAttribute('data-window');
    if (!targetId) return;

    const targetWindow = document.getElementById(targetId);
    if (!targetWindow) return;

    // Use computed style to check real display value (may be none in CSS)
    const computed = getComputedStyle(targetWindow).display;
    if (computed === 'none') {
      targetWindow.style.display = 'block';
    }

    // Bring to front
    zIndexCounter += 1;
    targetWindow.style.zIndex = zIndexCounter;
  });

  // Make each window draggable by its header
  windows.forEach(function (win) {
    const header = win.querySelector('.window-header');
    if (!header) return;

    header.addEventListener('mousedown', function (evt) {
      // Start dragging this window
      draggedWindow = win;

      // Ensure the window is positioned so left/top changes move it
      const cs = getComputedStyle(win).position;
      if (cs !== 'absolute' && cs !== 'fixed') {
        win.style.position = 'absolute';
      }

      // Bring to front when starting drag
      zIndexCounter += 1;
      win.style.zIndex = zIndexCounter;

      const rect = win.getBoundingClientRect();
      dragOffset.x = evt.clientX - rect.left;
      dragOffset.y = evt.clientY - rect.top;

      // Prevent text selection while dragging
      evt.preventDefault();
    });

    // Clicking anywhere in a window should also bring it to front
    win.addEventListener('mousedown', function () {
      zIndexCounter += 1;
      win.style.zIndex = zIndexCounter;
    });
  });

  // Global mouse move: update window position in real-time
  document.addEventListener('mousemove', function (e) {
    if (!draggedWindow) return;

    const newLeft = e.clientX - dragOffset.x;
    const newTop = e.clientY - dragOffset.y;

    // Keep the window inside the viewport (simple clamping)
    const maxLeft = window.innerWidth - draggedWindow.offsetWidth;
    const maxTop = window.innerHeight - draggedWindow.offsetHeight;

    draggedWindow.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
    draggedWindow.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
  });

  // On mouse up: stop dragging
  document.addEventListener('mouseup', function () {
    if (draggedWindow) {
      draggedWindow = null;
    }
  });
});
