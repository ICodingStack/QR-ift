/**
 * QRift — QR Code Generation Module
 *
 * Handles QR code creation using qr-code-styling library.
 * Uses global namespace for file:// compatibility.
 */

// Ensure global namespace exists
window.QRift = window.QRift || {};
const QRGen = (window.QRift.QRGen = {});

/* ─────────────────────────────────────────────────────────────
   Application State
   ─────────────────────────────────────────────────────────────
*/
QRGen.state = {
  data: "",
  dotStyle: "rounded",
  cornerSqStyle: "square",
  cornerDotStyle: "square",
  fgColor: "#7c5cfc",
  bgColor: "#0a0a0f",
  gradientOn: false,
  gradColor2: "#3ecfcf",
  gradType: "linear",
  logo: null,
  logoOpacity: 1,
  size: 320,
  currentLogo: "none",
};

/* ─────────────────────────────────────────────────────────────
   QR Code Instance
   ─────────────────────────────────────────────────────────────
*/
QRGen.qrCodeInstance = null;

/* ─────────────────────────────────────────────────────────────
   Build QR Options
   ─────────────────────────────────────────────────────────────
*/
QRGen.buildQROptions = function () {
  const state = QRGen.state;
  const options = {
    width: state.size,
    height: state.size,
    data: state.data || "https://qrift.app",
    margin: 0,
    qrOptions: { errorCorrectionLevel: "H" },
    dotsOptions: { type: state.dotStyle },
    cornersSquareOptions: { type: state.cornerSqStyle },
    cornersDotOptions: { type: state.cornerDotStyle },
    backgroundOptions: { color: state.bgColor },
  };

  if (state.gradientOn) {
    options.dotsOptions.gradient = {
      type: state.gradType,
      rotation: 45,
      colorStops: [
        { offset: 0, color: state.fgColor },
        { offset: 1, color: state.gradColor2 },
      ],
    };
    options.dotsOptions.color = state.fgColor;
  } else {
    options.dotsOptions.color = state.fgColor;
  }

  if (state.logo) {
    options.image = state.logo;
    options.imageOptions = {
      crossOrigin: "anonymous",
      margin: 8,
      imageSize: 0.3,
      hideBackgroundDots: true,
    };
  }

  return options;
};

/* ─────────────────────────────────────────────────────────────
   Regenerate QR Code
   ─────────────────────────────────────────────────────────────
*/
QRGen.regenerate = function () {
  const state = QRGen.state;
  const container = document.getElementById("qr-render");
  const emptyState = document.getElementById("empty-state");
  const actionRow = document.getElementById("action-row");
  const previewCard = document.getElementById("preview-card");

  if (!state.data.trim()) {
    container.style.display = "none";
    emptyState.style.display = "";
    actionRow.style.display = "none";
    previewCard.classList.remove("glowing");
    return;
  }

  emptyState.style.display = "none";
  container.style.display = "";
  actionRow.style.display = "";

  const options = QRGen.buildQROptions();

  if (!QRGen.qrCodeInstance) {
    QRGen.qrCodeInstance = new QRCodeStyling(options);
    QRGen.qrCodeInstance.append(container);
  } else {
    QRGen.qrCodeInstance.update(options);
  }

  // Pop-in animation
  const qrContainer = document.getElementById("qr-container");
  qrContainer.classList.remove("pop-in");
  void qrContainer.offsetWidth;
  qrContainer.classList.add("pop-in");

  previewCard.classList.add("glowing");
  QRGen.saveToHistory();
};

/* ─────────────────────────────────────────────────────────────
   Save to History
   ─────────────────────────────────────────────────────────────
*/
QRGen.saveToHistory = function () {
  const state = QRGen.state;
  if (!state.data.trim() || !QRGen.qrCodeInstance) return;

  const canvas = document.querySelector("#qr-render canvas");
  if (!canvas) return;

  const thumbnail = canvas.toDataURL("image/png", 0.5);
  const history = JSON.parse(localStorage.getItem("qrift-history") || "[]");

  const entry = {
    data: state.data,
    thumbnail: thumbnail,
    timestamp: Date.now(),
  };

  const filtered = history.filter((item) => item.data !== state.data);
  filtered.unshift(entry);
  const trimmed = filtered.slice(0, 5);

  localStorage.setItem("qrift-history", JSON.stringify(trimmed));

  // Call renderHistory if available (defined in main.js)
  if (typeof window.QRift.App?.renderHistory === "function") {
    window.QRift.App.renderHistory(trimmed);
  }
};

/* ─────────────────────────────────────────────────────────────
   Load History
   ─────────────────────────────────────────────────────────────
*/
QRGen.loadHistory = function () {
  try {
    return JSON.parse(localStorage.getItem("qrift-history") || "[]");
  } catch (e) {
    console.warn("Failed to load history:", e);
    return [];
  }
};

/* ─────────────────────────────────────────────────────────────
   Clear History
   ─────────────────────────────────────────────────────────────
*/
QRGen.clearHistory = function () {
  localStorage.removeItem("qrift-history");
};
