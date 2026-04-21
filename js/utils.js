/**
 * QRift — Utility Functions
 *
 * Provides helper functions for the application using a global namespace
 * pattern for compatibility with direct file:// loading (no build tools).
 */

// Global namespace for QRift utilities
window.QRift = window.QRift || {};
const Utils = (window.QRift.Utils = {});

/* ─────────────────────────────────────────────────────────────
   Debounce Utility
   ─────────────────────────────────────────────────────────────
   Delays function execution until after `ms` milliseconds have
   elapsed since the last time it was invoked.
*/
Utils.debounce = function (fn, ms) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

/* ─────────────────────────────────────────────────────────────
   Particle Canvas Animation
   ─────────────────────────────────────────────────────────────
   Creates subtle floating particles for background visual depth.
*/
Utils.initParticles = function () {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.4,
      velocityX: (Math.random() - 0.5) * 0.3,
      velocityY: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark =
      document.documentElement.getAttribute("data-theme") !== "light";
    const color = isDark ? "200,200,255" : "100,80,180";

    particles.forEach((p) => {
      p.x += p.velocityX;
      p.y += p.velocityY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
};

/* ─────────────────────────────────────────────────────────────
   Toast Notification
   ─────────────────────────────────────────────────────────────
*/
Utils.showToast = function (message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
};

/* ─────────────────────────────────────────────────────────────
   Ripple Button Effect
   ─────────────────────────────────────────────────────────────
*/
Utils.addRipple = function (button, event) {
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple";

  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `
    width:${size}px;
    height:${size}px;
    left:${event.clientX - rect.left - size / 2}px;
    top:${event.clientY - rect.top - size / 2}px;
  `;

  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
};

/* ─────────────────────────────────────────────────────────────
   Emoji to Data URL Helper
   ─────────────────────────────────────────────────────────────
   Note: canvas.toDataURL() already returns a complete data URL
   with the "data:" prefix, so no modification needed.
*/
Utils.makeEmojiDataURL = function (emoji, size = 128) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.font = `${size * 0.7}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, size / 2, size / 2);

  // toDataURL() returns complete data URL: "data:image/png;base64,..."
  return canvas.toDataURL("image/png");
};

/* ─────────────────────────────────────────────────────────────
   SVG to Data URL Helper
   ─────────────────────────────────────────────────────────────
   FIXED: Added "data:" prefix to create valid data URL
*/
Utils.makeSVGDataURL = function (svgContent, size = 128) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">${svgContent}</svg>`;
  // ✅ FIXED: Added "data:" prefix - this was causing 404 errors!
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
};
