// script.js (global overlays version)

const dragbar = document.getElementById("dragbar");
const leftPanel = document.getElementById("left-panel");
const container = document.querySelector(".container");

let isDragging = false;

dragbar.addEventListener("mousedown", (e) => {
    isDragging = true;
    document.body.style.cursor = "ew-resize";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.cursor = "default";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const containerRect = container.getBoundingClientRect();
    let newLeftWidth = e.clientX - containerRect.left;

    // Restrict drag to minimum 200px and maximum 23% of container width
    const minWidth = containerRect.width * 0.25;
    const maxWidth = containerRect.width * 0.25;

    newLeftWidth = Math.max(minWidth, Math.min(maxWidth, newLeftWidth));

    leftPanel.style.width = `${newLeftWidth}px`;
});

// --- IMAGE DATA ---
const images = [
    { src: "images/shengchang_zoom.jpg", translation: "images/translations/txt_shengchang_zoom.png", location: "Huangpu, Shanghai" },
    { src: "images/hk_car_zoom.jpg", translation: "images/translations/txt_hk_car_zoom.png", location: "Kowloon, Hong Kong" },
    { src: "images/menu_zoom.jpg", translation: "images/translations/txt_menu_zoom.png", location: "Nanluoguxiang, Beijing" },
    { src: "images/taipei_store_zoom.jpg", translation: "images/translations/txt_taipei_store_zoom.png", location: "Datong, Taipei" },
    { src: "images/formular_1_zoom.jpg", translation: "images/translations/txt_formular_1_zoom.png", location: "Wangjing, Beijing" },
    { src: "images/hk_door_zoom.jpg", translation: "images/translations/txt_hk_door_zoom.png", location: "Kowloon, Hong Kong" },
    { src: "images/diplomatic_zoom.jpg", translation: "images/translations/txt_diplomatic_zoom.png", location: "Dongsi, Beijing" },
    { src: "images/vending_zoom.jpg", translation: "images/translations/txt_vending_zoom.png", location: "A metro station, Beijing" },
    { src: "images/hk_poster_zoom.jpg", translation: "images/translations/txt_hk_poster_zoom.png", location: "Kowloon, Hong Kong" },
    { src: "images/taipei_old_man_zoom.jpg", translation: "images/translations/txt_taipei_old_man_zoom.png", location: "Wanhua, Taipei" },
    { src: "images/iphone_zoom.jpg", translation: "images/translations/txt_iphone_zoom.png", location: "Sanlitun, Beijing" },
    { src: "images/gaeste_zoom.jpg", translation: "images/translations/txt_gaeste_zoom.png", location: "Xuhui, Shanghai" },
    { src: "images/paradies_zoom.jpg", translation: "images/translations/txt_paradies_zoom.png", location: "Hongqiao, Shanghai" },
    { src: "images/sanierung_zoom.jpg", translation: "images/translations/txt_sanierung_zoom.png", location: "Huangpu, Shanghai" },
    { src: "images/mentin_zoom.jpg", translation: "images/translations/txt_mentin_zoom.png", location: "Nanluoguxiang, Beijing" },
    { src: "images/taube_zoom.jpg", translation: "images/translations/txt_taube_zoom.png", location: "Niujie, Beijing" },
    { src: "images/grillen_zoom.jpg", translation: "images/translations/txt_grillen_zoom.png", location: "Dongcheng, Beijing" },
    { src: "images/panyuan_zoom.jpg", translation: "images/translations/txt_panyuan_zoom.png", location: "Shilihe, Beijing" },
];

// --- ELEMENTS ---
const showcaseImage = document.getElementById("showcase-image");
const overlayContainer = document.querySelector(".translation-overlay");
const leftBtn = document.querySelector(".nav.left");
const rightBtn = document.querySelector(".nav.right");
const superimposeBtn = document.getElementById("superimpose-btn");
const resetBtn = document.getElementById("reset-btn");
const locationLabel = document.getElementById("location-label");

const imageWrapper = document.querySelector('.image-wrapper');
const rightPanel = document.querySelector('.rightp');
const overlay = document.querySelector('.translation-overlay');

rightPanel.addEventListener('mouseenter', () => {
    overlay.classList.remove('hidden');
    imageWrapper.classList.add('overlay-active');
});
rightPanel.addEventListener('mouseleave', () => {
    overlay.classList.add('hidden');
    imageWrapper.classList.remove('overlay-active');
});

// --- STATE ---
let currentIndex = 0;
let isHovered = false;

// global overlays stack (all images)
let globalOverlays = [];

// --- FUNCTIONS ---
function wrapIndex(i) {
    return (i + images.length) % images.length;
}

function renderGlobalOverlays() {
    // remove old fixed overlays
    overlayContainer.querySelectorAll(".fixed-overlay").forEach(n => n.remove());

    globalOverlays.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "fixed-overlay";
        overlayContainer.appendChild(img);
    });

    if (globalOverlays.length > 0) {
        overlayContainer.classList.remove("hidden");
    } else if (!isHovered) {
        overlayContainer.classList.add("hidden");
    }
}

function showImage(index) {
    currentIndex = wrapIndex(index);
    const { src, location } = images[currentIndex];
    showcaseImage.src = src; // <-- This line updates the image!

    if (locationLabel) locationLabel.textContent = location || "";

    // rebuild overlays for this image (hover removed temporarily)
    const hoverWas = isHovered;
    if (hoverWas) {
        overlayContainer.querySelectorAll(".hover-img").forEach(n => n.remove());
    }

    renderGlobalOverlays();

    if (hoverWas) showHoverOverlay();
}


function showHoverOverlay() {
    isHovered = true;
    overlayContainer.querySelectorAll(".hover-img").forEach(n => n.remove());

    const { translation } = images[currentIndex];
    // If overlay is already locked, don't show hover overlay
    if (!translation || globalOverlays.includes(translation)) return;

    const img = document.createElement("img");
    img.src = translation;
    img.className = "hover-img";
    overlayContainer.appendChild(img);

    overlayContainer.classList.remove("hidden");
}

function hideHoverOverlay() {
    isHovered = false;
    overlayContainer.querySelectorAll(".hover-img").forEach(n => n.remove());

    // Only hide the overlay if there are NO fixed overlays
    if (globalOverlays.length === 0) {
        overlayContainer.classList.add("hidden");
        imageWrapper.classList.remove("overlay-active");
    } else {
        overlayContainer.classList.remove("hidden");
        imageWrapper.classList.add("overlay-active"); // <-- keep blur/brightness if fixed overlays exist
    }
}

function superimposeOverlay() {
    const { translation } = images[currentIndex];
    if (!translation) return;

    // Only add if not already present
    if (!globalOverlays.includes(translation)) {
        globalOverlays.push(translation);
    }

    const hoverWas = isHovered;
    overlayContainer.querySelectorAll(".hover-img").forEach(n => n.remove());
    renderGlobalOverlays();
    if (hoverWas) showHoverOverlay();
}

function resetOverlays() {
    globalOverlays = [];
    overlayContainer.querySelectorAll(".fixed-overlay").forEach(n => n.remove());
    if (!isHovered) {
        overlayContainer.classList.add("hidden");
        imageWrapper.classList.remove("overlay-active"); // <-- remove blur/brightness if not hovered
    }
}

// --- EVENT LISTENERS ---
rightPanel.addEventListener('mouseenter', showHoverOverlay);
rightPanel.addEventListener('mouseleave', hideHoverOverlay);

leftBtn.addEventListener("click", () => showImage(currentIndex - 1));
rightBtn.addEventListener("click", () => showImage(currentIndex + 1));
superimposeBtn.addEventListener("click", superimposeOverlay);
resetBtn.addEventListener("click", resetOverlays);

// --- INIT ---
showImage(currentIndex);

const tooltip = document.getElementById('tooltip');

document.querySelectorAll('.hover-translate').forEach(el => {
  el.addEventListener('mouseenter', () => {
    tooltip.textContent = el.dataset.translation;
    const rect = el.getBoundingClientRect();
    // position the tooltip so its left edge = word's left edge
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top  = `${rect.top-4}px`; // little above the baseline
    tooltip.style.opacity = '1';
  });
  el.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });
});

const headTooltip = document.getElementById('head-tooltip');
document.querySelectorAll('.head.head-hover-translate').forEach(el => {
  el.addEventListener('mouseenter', () => {
    headTooltip.textContent = el.dataset.translation;
    const rect = el.getBoundingClientRect();
    headTooltip.style.left = `${rect.left}px`;
    headTooltip.style.top  = `${rect.top+3}px`; // below the head title
    headTooltip.style.opacity = '1';
  });
  el.addEventListener('mouseleave', () => {
    headTooltip.style.opacity = '0';
  });
});

// Prevent zooming with Ctrl + scroll
  window.addEventListener("wheel", function (e) {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  }, { passive: false });

  // Prevent zooming with Ctrl + plus/minus or 0
  window.addEventListener("keydown", function (e) {
    if (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")) {
      e.preventDefault();
    }
  });

  // Mapping: grid index -> images[] indices
const gridToImagesMap = [
    [0],
    [1],
    [2],      // Grid 1 maps to images 0, 1, 5, 9 (all Hong Kong)
    [3],               // Grid 2 maps to image 2 (menu)
    [4],               // Grid 3 maps to image 3 (Taipei store)
    [5],            // Grid 4 maps to images 4, 7 (formulars)
    [6],               // Grid 5 maps to image 5 (HK door)
    [7],               // Grid 6 maps to image 6 (diplomatic)
    [8],               // Grid 7 maps to image 8 (vending)
    [9],               // Grid 8 maps to image 9 (HK poster)
    [10],              // Grid 9 maps to image 10 (Taipei old man)
    [11],              // Grid 10 maps to image 11 (iPhone)
    [12],
    [13],
    [14],
    [15],
    [16],
    [17],
];

// Track which image to show for each grid cell (for cycling)
let gridImageCycle = Array(gridToImagesMap.length).fill(0);

document.querySelectorAll('.image-grid img').forEach((img, gridIdx) => {
    img.addEventListener('click', () => {
        const mapped = gridToImagesMap[gridIdx];
        if (!mapped || mapped.length === 0) return;

        // Show the first mapped image (or cycle through them)
        let cycleIdx = gridImageCycle[gridIdx] % mapped.length;
        showImage(mapped[cycleIdx]);
        gridImageCycle[gridIdx] = cycleIdx + 1; // Next click cycles to next image
    });
});

// ...existing code...

const buttonTooltip = document.getElementById('button-tooltip');

document.querySelectorAll('.controls button').forEach(btn => {
    btn.addEventListener('mouseenter', (e) => {
        const text = btn.getAttribute('data-tooltip');
        if (!text) return;
        buttonTooltip.textContent = text;
        buttonTooltip.style.opacity = '1';
        // Position tooltip under cursor
        buttonTooltip.style.left = (e.clientX + 12) + 'px';
        buttonTooltip.style.top = (e.clientY + 18) + 'px';
    });
    btn.addEventListener('mousemove', (e) => {
        // Move tooltip with cursor
        buttonTooltip.style.left = (e.clientX + 12) + 'px';
        buttonTooltip.style.top = (e.clientY + 18) + 'px';
    });
    btn.addEventListener('mouseleave', () => {
        buttonTooltip.style.opacity = '0';
    });
});

function superimposeOverlay() {
    const { translation } = images[currentIndex];
    if (!translation) return;

    // Only add if not already present
    if (!globalOverlays.includes(translation)) {
        globalOverlays.push(translation);
        renderGlobalOverlays();

        // Animate the just-added overlay
        // Find the last .fixed-overlay (the one just added)
        const overlays = overlayContainer.querySelectorAll('.fixed-overlay');
        const lastOverlay = overlays[overlays.length - 1];
        if (lastOverlay) {
            lastOverlay.classList.add('animate-lock');
            // Remove the class after animation so it can be triggered again
            lastOverlay.addEventListener('animationend', function handler() {
                lastOverlay.classList.remove('animate-lock');
                lastOverlay.removeEventListener('animationend', handler);
            });
        }
    }

    const hoverWas = isHovered;
    overlayContainer.querySelectorAll(".hover-img").forEach(n => n.remove());
    if (!globalOverlays.includes(translation)) renderGlobalOverlays();
    if (hoverWas) showHoverOverlay();
}






