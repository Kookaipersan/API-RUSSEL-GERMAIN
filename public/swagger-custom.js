// public/swagger-custom.js
window.addEventListener('DOMContentLoaded', () => {
  const interval = setInterval(() => {
    const topbar = document.querySelector('.topbar-wrapper');
    if (topbar) {
      topbar.addEventListener('click', () => {
        window.location.href = "/";
      });
      clearInterval(interval);
    }
  }, 500);
});
