let highestZ = 100;

const icons = document.querySelectorAll(".icon");
const windows = document.querySelectorAll(".window");

const openSound = document.getElementById("sound-open");
const closeSound = document.getElementById("sound-close");
const clickSound = document.getElementById("sound-click");

const muteBtn = document.getElementById("mute-btn");
const themeBtn = document.getElementById("theme-btn");

let muted = false;

/* -- SOUND -- */
function play(sound) {
  if (!muted && sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

muteBtn.onclick = () => {
  muted = !muted;
  muteBtn.textContent = muted ? "🔇" : "🔊";
};

/* ---DARK MODE -- */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}
themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  themeBtn.textContent = dark ? "☀️" : "🌙";
  play(clickSound);
};

/* ---------- OPEN WINDOWS ---------- */
icons.forEach(icon => {
  icon.onclick = () => {
    const win = document.getElementById(icon.dataset.window);
    if (!win) return;
    win.style.display = "block";
    win.style.zIndex = ++highestZ;
    play(clickSound);
    play(openSound);
  };
});

/* --- CLOSE WINDOWS  - */
windows.forEach(win => {
  const closeBtn = win.querySelector(".close");
  closeBtn.onclick = () => {
    win.style.display = "none";
    play(closeSound);
  };
});

/* - DRAGGING WINDOW AROUN -*/
let activeWindow = null;
let offsetX = 0;
let offsetY = 0;
windows.forEach(win => {
  const bar = win.querySelector(".title-bar");

  bar.addEventListener("mousedown", e => {
    activeWindow = win;
    const rect = win.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    win.style.zIndex = ++highestZ;
    e.preventDefault();
  });
});

document.addEventListener("mousemove", e => {
  if (!activeWindow) return;

  activeWindow.style.left = e.clientX - offsetX + "px";
  activeWindow.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
  activeWindow = null;
});

/* -- FAQ -- */
document.querySelectorAll(".faq-item").forEach(item => {
  item.onclick = () => {
    const ans = item.nextElementSibling;
    ans.style.display =
      ans.style.display === "block" ? "none" : "block";
    play(clickSound);
  };
});

/* -- GRID -- */
const grid = document.querySelector(".bg-grid");
let gx = 0, gy = 0, tx = 0, ty = 0;

document.addEventListener("mousemove", e => {
  tx = ((e.clientX / innerWidth) - 0.5) * 1.2;
  ty = ((e.clientY / innerHeight) - 0.5) * 1.2;
});

function animateGrid() {
  gx += (tx - gx) * 0.05;
  gy += (ty - gy) * 0.05;

  grid.style.backgroundPosition =
    `${gx}px ${gy}px, ${gx}px ${gy}px`;

  requestAnimationFrame(animateGrid);
}
animateGrid();
