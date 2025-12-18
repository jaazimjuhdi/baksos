document.addEventListener('DOMContentLoaded', () => {
  // Find gallery images and mark them loaded when finished
  const imgs = document.querySelectorAll('.gallery-item img');
  imgs.forEach(img => {
    const markLoaded = () => {
      img.classList.add('loaded');
      if (img.parentElement) {
        img.parentElement.classList.add('loaded');
        img.parentElement.classList.remove('failed');
      }
    };

    // If already loaded from cache
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
      return;
    }

    img.addEventListener('load', markLoaded);
    img.addEventListener('error', () => {
      // Try to recover by switching to the full source if available
      const full = img.dataset.full;
      if (full && img.src !== full) {
        img.src = full;
        // Attempt to load full image once; if it fails again the next error will mark failed
        return;
      }
      // If recovery not possible, mark failed and stop skeleton
      if (img.parentElement) img.parentElement.classList.add('failed');
      img.classList.add('loaded');
      if (img.parentElement) img.parentElement.classList.add('loaded');
    });
  });
});