/**
 * QRift — Main Application Logic
 *
 * Initializes the app and sets up all interactions.
 * Uses IIFE pattern to avoid global variable redeclaration conflicts.
 */

// Wrap entire module in IIFE to scope aliases locally
(function () {
  "use strict";

  // Ensure global namespace exists
  window.QRift = window.QRift || {};
  window.QRift.App = window.QRift.App || {};

  // Local aliases (scoped to this IIFE - no conflicts!)
  const App = window.QRift.App;
  const Utils = window.QRift.Utils;
  const QRGen = window.QRift.QRGen;

  /* ─────────────────────────────────────────────────────────────
     Built-in Logo Definitions
     ─────────────────────────────────────────────────────────────
  */
  App.builtinLogos = {
    none: null,
    github: Utils.makeSVGDataURL(
      '<path fill="white" d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"/>',
    ),
    heart: Utils.makeEmojiDataURL("❤️"),
    star: Utils.makeEmojiDataURL("⭐"),
    wifi: Utils.makeSVGDataURL(
      '<path fill="none" stroke="white" stroke-width="2" d="M5 12.55a11 11 0 0 1 14.08 0"/><path fill="none" stroke="white" stroke-width="2" d="M1.42 9a16 16 0 0 1 21.16 0"/><path fill="none" stroke="white" stroke-width="2" d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle fill="white" cx="12" cy="20" r="1"/>',
    ),
    link: Utils.makeEmojiDataURL("🔗"),
  };

  /* ─────────────────────────────────────────────────────────────
     Preset Templates
     ─────────────────────────────────────────────────────────────
  */
  App.presetTemplates = {
    url: "",
    wifi: "WIFI:T:WPA;S:YourNetwork;P:YourPassword;;",
    phone: "tel:+1234567890",
    email: "mailto:hello@example.com?subject=Hello",
    vcard:
      "BEGIN:VCARD\nVERSION:3.0\nFN:Your Name\nTEL:+1234567890\nEMAIL:you@example.com\nEND:VCARD",
    text: "",
  };

  /* ─────────────────────────────────────────────────────────────
     Surprise Presets
     ─────────────────────────────────────────────────────────────
  */
  App.surprisePresets = [
    {
      dot: "dots",
      corner: "dot",
      cornerDot: "dot",
      fg: "#f06292",
      bg: "#1a0a12",
      grad: true,
      g2: "#ff8a65",
      gt: "radial",
    },
    {
      dot: "rounded",
      corner: "extra-rounded",
      cornerDot: "dot",
      fg: "#3ecfcf",
      bg: "#051818",
      grad: true,
      g2: "#00e5ff",
      gt: "linear",
    },
    {
      dot: "classy-rounded",
      corner: "square",
      cornerDot: "square",
      fg: "#ffd54f",
      bg: "#0f0e00",
      grad: false,
      g2: "#fff",
      gt: "linear",
    },
    {
      dot: "extra-rounded",
      corner: "extra-rounded",
      cornerDot: "dot",
      fg: "#b39ddb",
      bg: "#0d0a1a",
      grad: true,
      g2: "#ce93d8",
      gt: "linear",
    },
    {
      dot: "classy",
      corner: "square",
      cornerDot: "square",
      fg: "#80cbc4",
      bg: "#041a18",
      grad: false,
      g2: "#fff",
      gt: "linear",
    },
    {
      dot: "dots",
      corner: "dot",
      cornerDot: "dot",
      fg: "#ff7043",
      bg: "#150800",
      grad: true,
      g2: "#ffd740",
      gt: "radial",
    },
  ];

  /* ─────────────────────────────────────────────────────────────
     Initialize Application
     ─────────────────────────────────────────────────────────────
  */
  App.init = function () {
    Utils.initParticles();
    App.setupThemeToggle();
    App.setupInputHandler();
    App.setupPresetButtons();
    App.setupStyleSelectors();
    App.setupColorPickers();
    App.setupGradientToggle();
    App.setupLogoSelector();
    App.setupSizeSlider();
    App.setupActionButtons();
    App.setupSurpriseButton();
    App.loadAndRenderHistory();
    App.applySavedTheme();
  };

  /* ─────────────────────────────────────────────────────────────
     Theme Toggle
     ─────────────────────────────────────────────────────────────
  */
  App.setupThemeToggle = function () {
    const htmlEl = document.documentElement;
    const themeBtn = document.getElementById("theme-toggle");
    const moonIcon = document.getElementById("moon-icon");
    const sunIcon = document.getElementById("sun-icon");

    themeBtn?.addEventListener("click", () => {
      const isLight = htmlEl.getAttribute("data-theme") === "light";
      const newTheme = isLight ? "dark" : "light";

      htmlEl.setAttribute("data-theme", newTheme);
      moonIcon.style.display = isLight ? "" : "none";
      sunIcon.style.display = isLight ? "none" : "";

      const bgColorPicker = document.getElementById("bg-color");
      if (bgColorPicker) {
        bgColorPicker.value = newTheme === "dark" ? "#0a0a0f" : "#ffffff";
      }

      localStorage.setItem("qrift-theme", newTheme);
      QRGen.regenerate();
    });
  };

  /* ─────────────────────────────────────────────────────────────
     Apply Saved Theme
     ─────────────────────────────────────────────────────────────
  */
  App.applySavedTheme = function () {
    const savedTheme = localStorage.getItem("qrift-theme");
    const htmlEl = document.documentElement;
    const moonIcon = document.getElementById("moon-icon");
    const sunIcon = document.getElementById("sun-icon");

    if (savedTheme === "light") {
      htmlEl.setAttribute("data-theme", "light");
      moonIcon.style.display = "none";
      sunIcon.style.display = "";
    }
  };

  /* ─────────────────────────────────────────────────────────────
     Input Handler
     ─────────────────────────────────────────────────────────────
  */
  App.setupInputHandler = function () {
    const input = document.getElementById("qr-input");
    const debouncedRegen = Utils.debounce(QRGen.regenerate, 180);

    input?.addEventListener("input", (e) => {
      QRGen.state.data = e.target.value;
      debouncedRegen();
    });
  };

  /* ─────────────────────────────────────────────────────────────
     Preset Buttons
     ─────────────────────────────────────────────────────────────
  */
  App.setupPresetButtons = function () {
    const presetsContainer = document.getElementById("presets");

    presetsContainer?.addEventListener("click", (e) => {
      const btn = e.target.closest(".preset-btn");
      if (!btn) return;

      document
        .querySelectorAll(".preset-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const preset = btn.dataset.preset;
      const template = App.presetTemplates[preset];
      const input = document.getElementById("qr-input");

      if (template !== undefined) {
        input.value = template;
        QRGen.state.data = template;
        QRGen.regenerate();
      } else {
        input?.focus();
      }
    });
  };

  /* ─────────────────────────────────────────────────────────────
     Style Selectors
     ─────────────────────────────────────────────────────────────
  */
  App.setupStyleSelectors = function () {
    const dotStyles = document.getElementById("dot-styles");
    dotStyles?.addEventListener("click", (e) => {
      const chip = e.target.closest(".style-chip");
      if (!chip) return;

      document
        .querySelectorAll("#dot-styles .style-chip")
        .forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      QRGen.state.dotStyle = chip.dataset.dot;
      QRGen.regenerate();
    });

    const cornerSq = document.getElementById("corner-sq-style");
    cornerSq?.addEventListener("change", (e) => {
      QRGen.state.cornerSqStyle = e.target.value;
      QRGen.regenerate();
    });

    const cornerDot = document.getElementById("corner-dot-style");
    cornerDot?.addEventListener("change", (e) => {
      QRGen.state.cornerDotStyle = e.target.value;
      QRGen.regenerate();
    });
  };

  /* ─────────────────────────────────────────────────────────────
     Color Pickers
     ─────────────────────────────────────────────────────────────
  */
  App.setupColorPickers = function () {
    const fgColor = document.getElementById("fg-color");
    const bgColor = document.getElementById("bg-color");
    const gradColor2 = document.getElementById("grad-color2");
    const gradType = document.getElementById("grad-type");

    const debouncedRegen = Utils.debounce(QRGen.regenerate, 180);

    fgColor?.addEventListener("input", (e) => {
      QRGen.state.fgColor = e.target.value;
      debouncedRegen();
    });

    bgColor?.addEventListener("input", (e) => {
      QRGen.state.bgColor = e.target.value;
      debouncedRegen();
    });

    gradColor2?.addEventListener("input", (e) => {
      QRGen.state.gradColor2 = e.target.value;
      debouncedRegen();
    });

    gradType?.addEventListener("change", (e) => {
      QRGen.state.gradType = e.target.value;
      QRGen.regenerate();
    });
  };

  /* ─────────────────────────────────────────────────────────────
     Gradient Toggle
     ─────────────────────────────────────────────────────────────
  */
  App.setupGradientToggle = function () {
    const toggle = document.getElementById("gradient-toggle");
    const options = document.getElementById("gradient-options");

    toggle?.addEventListener("click", () => {
      QRGen.state.gradientOn = !QRGen.state.gradientOn;
      toggle.classList.toggle("on", QRGen.state.gradientOn);
      toggle.setAttribute("aria-checked", QRGen.state.gradientOn);
      options.style.display = QRGen.state.gradientOn ? "flex" : "none";
      QRGen.regenerate();
    });

    toggle?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle.click();
      }
    });
  };

  /* ─────────────────────────────────────────────────────────────
     Logo Selector
     ─────────────────────────────────────────────────────────────
  */
  App.setupLogoSelector = function () {
    const logoGrid = document.getElementById("logo-grid");
    const fileInput = document.getElementById("logo-file");

    logoGrid?.addEventListener("click", (e) => {
      const chip = e.target.closest(".logo-chip");
      if (!chip) return;

      const key = chip.dataset.logo;

      if (key === "upload") {
        fileInput?.click();
        return;
      }

      document
        .querySelectorAll(".logo-chip")
        .forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      QRGen.state.currentLogo = key;
      QRGen.state.logo = App.builtinLogos[key];
      QRGen.regenerate();
    });

    fileInput?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        QRGen.state.logo = ev.target?.result;
        QRGen.state.currentLogo = "upload";

        document
          .querySelectorAll(".logo-chip")
          .forEach((c) => c.classList.remove("active"));
        document.getElementById("logo-upload-chip")?.classList.add("active");

        QRGen.regenerate();
      };
      reader.readAsDataURL(file);
    });

    const opacitySlider = document.getElementById("logo-opacity");
    const opacityVal = document.getElementById("opacity-val");

    opacitySlider?.addEventListener("input", (e) => {
      QRGen.state.logoOpacity = parseFloat(e.target.value);
      if (opacityVal) {
        opacityVal.textContent = QRGen.state.logoOpacity.toFixed(2);
      }
      Utils.debounce(QRGen.regenerate, 180)();
    });
  };

  /* ─────────────────────────────────────────────────────────────
     Size Slider
     ─────────────────────────────────────────────────────────────
  */
  App.setupSizeSlider = function () {
    const slider = document.getElementById("qr-size");
    const value = document.getElementById("size-val");

    slider?.addEventListener("input", (e) => {
      QRGen.state.size = parseInt(e.target.value);
      if (value) {
        value.textContent = QRGen.state.size + "px";
      }
      Utils.debounce(QRGen.regenerate, 180)();
    });
  };

  /* ─────────────────────────────────────────────────────────────
     Action Buttons
     ─────────────────────────────────────────────────────────────
  */
  App.setupActionButtons = function () {
    // PNG Download
    document.getElementById("btn-png")?.addEventListener("click", async () => {
      if (!QRGen.qrCodeInstance || !QRGen.state.data.trim()) {
        Utils.showToast("Nothing to download yet!");
        return;
      }
      await QRGen.qrCodeInstance.download({
        name: "qrift-qr",
        extension: "png",
      });
      Utils.showToast("✓ PNG Downloaded!");
    });

    // SVG Download
    document.getElementById("btn-svg")?.addEventListener("click", async () => {
      if (!QRGen.qrCodeInstance || !QRGen.state.data.trim()) {
        Utils.showToast("Nothing to download yet!");
        return;
      }
      await QRGen.qrCodeInstance.download({
        name: "qrift-qr",
        extension: "svg",
      });
      Utils.showToast("✓ SVG Downloaded!");
    });

    // Copy to Clipboard
    document.getElementById("btn-copy")?.addEventListener("click", async () => {
      if (!QRGen.qrCodeInstance || !QRGen.state.data.trim()) {
        Utils.showToast("Generate a QR first!");
        return;
      }

      try {
        const canvas = document.querySelector("#qr-render canvas");
        if (!canvas) {
          Utils.showToast("Canvas not ready");
          return;
        }

        canvas.toBlob(async (blob) => {
          if (blob && navigator.clipboard?.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            Utils.showToast("✓ Copied to clipboard!");
          } else {
            Utils.showToast("Copy not supported in this browser");
          }
        });
      } catch (err) {
        console.error("Copy failed:", err);
        Utils.showToast("Copy not supported in this browser");
      }
    });

    // Share Card
    document
      .getElementById("btn-share")
      ?.addEventListener("click", async () => {
        if (!QRGen.qrCodeInstance || !QRGen.state.data.trim()) {
          Utils.showToast("Generate a QR first!");
          return;
        }

        const canvas = document.querySelector("#qr-render canvas");
        if (!canvas) {
          Utils.showToast("Canvas not ready");
          return;
        }

        const card = document.createElement("canvas");
        const padding = 40;
        const footerHeight = 80;
        card.width = canvas.width + padding * 2;
        card.height = canvas.height + padding * 2 + footerHeight;
        const ctx = card.getContext("2d");

        const gradient = ctx.createLinearGradient(
          0,
          0,
          card.width,
          card.height,
        );
        gradient.addColorStop(0, "#13131c");
        gradient.addColorStop(1, "#0a0a0f");
        ctx.fillStyle = gradient;

        // Use roundRect with fallback for older browsers
        if (typeof ctx.roundRect === "function") {
          ctx.beginPath();
          ctx.roundRect(0, 0, card.width, card.height, 20);
          ctx.fill();

          ctx.strokeStyle = "rgba(124,92,252,0.3)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(1, 1, card.width - 2, card.height - 2, 20);
          ctx.stroke();
        } else {
          // Fallback for browsers without roundRect
          ctx.fillRect(0, 0, card.width, card.height);
        }

        ctx.drawImage(canvas, padding, padding);

        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "bold 18px Syne, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          "QRift",
          card.width / 2,
          canvas.height + padding + footerHeight / 2,
        );

        ctx.font = "13px DM Sans, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fillText(
          "qrift.app",
          card.width / 2,
          canvas.height + padding + footerHeight / 2 + 20,
        );

        card.toBlob(async (blob) => {
          if (blob && navigator.share) {
            const file = new File([blob], "qrift-share.png", {
              type: "image/png",
            });
            try {
              await navigator.share({
                files: [file],
                title: "My QRift QR Code",
                text: "Check out this artistic QR code I made with QRift!",
              });
            } catch (err) {
              if (err.name !== "AbortError") {
                console.error("Share failed:", err);
              }
            }
          } else if (blob) {
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            Utils.showToast("Share card opened in new tab!");
          }
        });
      });

    // Ripple effects
    document.querySelectorAll(".action-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => Utils.addRipple(btn, e));
    });
  };

  /* ─────────────────────────────────────────────────────────────
     Surprise Button
     ─────────────────────────────────────────────────────────────
  */
  App.setupSurpriseButton = function () {
    document.getElementById("surprise-btn")?.addEventListener("click", () => {
      const preset =
        App.surprisePresets[
          Math.floor(Math.random() * App.surprisePresets.length)
        ];

      QRGen.state.dotStyle = preset.dot;
      QRGen.state.cornerSqStyle = preset.corner;
      QRGen.state.cornerDotStyle = preset.cornerDot;
      QRGen.state.fgColor = preset.fg;
      QRGen.state.bgColor = preset.bg;
      QRGen.state.gradientOn = preset.grad;
      QRGen.state.gradColor2 = preset.g2;
      QRGen.state.gradType = preset.gt;

      document.querySelectorAll("#dot-styles .style-chip").forEach((chip) => {
        chip.classList.toggle("active", chip.dataset.dot === preset.dot);
      });

      const cornerSq = document.getElementById("corner-sq-style");
      const cornerDot = document.getElementById("corner-dot-style");
      const fgColor = document.getElementById("fg-color");
      const bgColor = document.getElementById("bg-color");
      const gradColor2 = document.getElementById("grad-color2");
      const gradType = document.getElementById("grad-type");
      const gradOptions = document.getElementById("gradient-options");
      const gradToggle = document.getElementById("gradient-toggle");

      if (cornerSq) cornerSq.value = preset.corner;
      if (cornerDot) cornerDot.value = preset.cornerDot;
      if (fgColor) fgColor.value = preset.fg;
      if (bgColor) bgColor.value = preset.bg;
      if (gradColor2) gradColor2.value = preset.g2;
      if (gradType) gradType.value = preset.gt;
      if (gradOptions)
        gradOptions.style.display = preset.grad ? "flex" : "none";
      if (gradToggle) {
        gradToggle.classList.toggle("on", preset.grad);
        gradToggle.setAttribute("aria-checked", preset.grad);
      }

      QRGen.regenerate();
      Utils.showToast("✦ Surprise applied!");
    });
  };

  /* ─────────────────────────────────────────────────────────────
     History Rendering (exported for qr-generator.js to call)
     ─────────────────────────────────────────────────────────────
  */
  App.renderHistory = function (items) {
    const section = document.getElementById("history-section");
    const list = document.getElementById("history-list");

    if (!section || !list) return;

    if (!items || items.length === 0) {
      section.style.display = "none";
      return;
    }

    section.style.display = "";
    list.innerHTML = "";

    items.forEach((item) => {
      const el = document.createElement("div");
      el.className = "history-item";
      el.title = item.data;
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");

      const img = document.createElement("img");
      img.src = item.thumbnail;
      img.alt = "QR code thumbnail";
      img.loading = "lazy";

      el.appendChild(img);

      const restoreQR = () => {
        const input = document.getElementById("qr-input");
        if (input) {
          input.value = item.data;
          QRGen.state.data = item.data;
          QRGen.regenerate();
        }
      };

      el.addEventListener("click", restoreQR);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          restoreQR();
        }
      });

      list.appendChild(el);
    });
  };

  /* ─────────────────────────────────────────────────────────────
     Load and Render History
     ─────────────────────────────────────────────────────────────
  */
  App.loadAndRenderHistory = function () {
    const history = QRGen.loadHistory();
    App.renderHistory(history);

    if (history.length > 0) {
      const last = history[0];
      const input = document.getElementById("qr-input");
      if (input) {
        input.value = last.data;
        QRGen.state.data = last.data;
        setTimeout(QRGen.regenerate, 200);
      }
    }
  };

  /* ─────────────────────────────────────────────────────────────
     Start the app when DOM is ready
     ─────────────────────────────────────────────────────────────
  */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", App.init);
  } else {
    App.init();
  }
})(); // ← End of IIFE - this prevents variable redeclaration conflicts!
