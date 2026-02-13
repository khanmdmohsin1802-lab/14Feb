// --- Neon Preloader Logic ---
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  // Increased to 8.5 seconds to let the full animation cycle complete
  setTimeout(() => {
    preloader.classList.add("fade-out");

    // Remove from DOM after fade completes
    setTimeout(() => {
      preloader.style.display = "none";
    }, 1500); // 1.5s transition time
  }, 8500); // 8500ms = 8.5 seconds
});

// --- Music Toggle & Spin Effect ---
const musicBtn = document.getElementById("music-toggle");
const music = document.getElementById("bg-music");
let isPlaying = false;

musicBtn.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    musicBtn.textContent = "🎵 Play Music";
    musicBtn.classList.remove("playing");
  } else {
    music.play();
    musicBtn.textContent = "💿 Playing...";
    musicBtn.classList.add("playing");
  }
  isPlaying = !isPlaying;
});

// --- Relationship Timer ---
// CHANGE THIS DATE TO YOUR OWN! Format: "YYYY-MM-DD"
const startDate = new Date("2025-12-25");

function updateTimer() {
  const now = new Date();
  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("timer-display").innerText =
    `${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs`;
}
setInterval(updateTimer, 1000);

// ==========================================
// --- NEW SCRATCH CARD LOGIC ---
// ==========================================
const scratchContainers = document.querySelectorAll(".scratch-container");

scratchContainers.forEach((container) => {
  const canvas = container.querySelector(".scratch-canvas");
  const ctx = canvas.getContext("2d");
  let isDrawing = false;

  // Initialize Canvas with "Foil" look
  ctx.fillStyle = "#C0C0C0"; // Silver color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add some texture to the foil (optional)
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 5,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "#A9A9A9";
    ctx.fill();
  }

  // The scratching function
  function scratch(x, y) {
    ctx.globalCompositeOperation = "destination-out"; // This makes drawing transparent
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2); // 20 is brush size
    ctx.fill();
  }

  // Event Listeners for Mouse and Touch
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    scratch(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) scratch(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    checkReveal();
  });
  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
  });

  // Touch support for mobile devices
  canvas.addEventListener("touchstart", (e) => {
    isDrawing = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
  });
  canvas.addEventListener("touchmove", (e) => {
    if (isDrawing) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    }
    e.preventDefault(); // Prevent scrolling while scratching
  });
  canvas.addEventListener("touchend", () => {
    isDrawing = false;
    checkReveal();
  });

  // Check if enough has been scratched to reveal automatically
  function checkReveal() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;

    // If more than 40% is scratched, reveal the whole thing
    if (percentage > 40) {
      container.classList.add("revealed");
    }
  }
});
// ==========================================

// --- Modal Logic (Gallery) ---
function openModal(element) {
  const modal = document.getElementById("img-modal");
  const modalImg = document.getElementById("modal-img");
  const caption = document.getElementById("modal-caption");
  const img = element.querySelector("img");
  const text = element.querySelector(".caption").innerText;

  modal.style.display = "block";
  modalImg.src = img.src;
  caption.innerText = text;
}

function closeModal() {
  document.getElementById("img-modal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("img-modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// --- Letter Logic ---
// --- Vintage Letter Logic ---

// Updated content for the "Royal" feel
const letters = {
  miss: "My Love,\n\nWhen you are not around, time feels off. The hours get longer, and everything goes a little quiet. Even the moon looks dimmer somehow. Distance might exist on maps, but my heart still beats the same when I think of you. And on quiet nights, I just look up and wonder if you are under the same sky, thinking of me too..",
  sad: "My baby,\n\nHey… do not carry all of this by yourself. You are stronger than you think — even on the days you doubt it. It is okay to feel sad. It is okay to be tired. You do not always have to be the strong one. When it feels heavy, lean on me. Let me hold some of it. I’m here — for the good days and the hard ones. And I’m not going anywhere..",
  happy:
    "My Queen,\n\nWhen you smile, the whole world feels lighter. Your happiness does something to me like sunlight after a long night. Stay like this. Shine the way you do. Seeing you happy is more than enough for me.",
};

function openLetter(type) {
  // 1. Get Elements
  const title = document.getElementById("letters-title");
  const grid = document.getElementById("envelope-grid");
  const letterView = document.getElementById("vintage-letter-view");
  const contentText = document.getElementById("letter-content");

  // 2. Animate Layout
  title.classList.add("title-up"); // Move Title Up
  grid.classList.add("envelopes-hidden"); // Fade out envelopes
  letterView.classList.remove("hidden"); // Show container

  // 3. Trigger Unfurl Animation (after tiny delay to allow display:block to apply)
  setTimeout(() => {
    letterView.classList.add("open");
  }, 50);

  // 4. Typewriter Effect (Starts after scroll opens - 1.2s delay)
  contentText.innerText = ""; // Clear previous text
  setTimeout(() => {
    let i = 0;
    const text = letters[type];

    function typeWriter() {
      if (i < text.length) {
        // Handle new lines properly
        if (text.charAt(i) === "\n") {
          contentText.innerHTML += "<br>";
        } else {
          contentText.innerHTML += text.charAt(i);
        }
        i++;
        setTimeout(typeWriter, 50); // Typing speed
      }
    }
    typeWriter();
  }, 1500); // Wait for the scroll to finish opening
}

function closeLetter() {
  const title = document.getElementById("letters-title");
  const grid = document.getElementById("envelope-grid");
  const letterView = document.getElementById("vintage-letter-view");

  // Reverse animations
  letterView.classList.remove("open"); // Roll up scroll

  // Wait for roll up to finish, then reset layout
  setTimeout(() => {
    letterView.classList.add("hidden");
    title.classList.remove("title-up");
    grid.classList.remove("envelopes-hidden");
  }, 1000); // 1s matches the CSS transition time
}

// --- Floating Hearts ---
function createHeart() {
  const heart = document.createElement("div");
  heart.innerText = "❤️";
  heart.style.position = "fixed";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.bottom = "-20px";
  heart.style.fontSize = Math.random() * 20 + 10 + "px";
  heart.style.animation = `floatUp ${Math.random() * 3 + 4}s linear`;
  heart.style.opacity = Math.random() * 0.5 + 0.2;
  heart.style.zIndex = "-1";

  document.querySelector(".hearts-container").appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 7000);
}

// --- 3D Flipbook Logic ---
let currentLocation = 1;
let numOfPages = 3; // Update this if you add more pages in HTML
let maxLocation = numOfPages + 1;

function goNextPage() {
  if (currentLocation < maxLocation) {
    switch (currentLocation) {
      case 1:
        openBook();
        document.querySelector(".page:nth-child(1)").classList.add("flipped");
        document.querySelector(".page:nth-child(1)").style.zIndex = 1;
        break;
      case 2:
        document.querySelector(".page:nth-child(2)").classList.add("flipped");
        document.querySelector(".page:nth-child(2)").style.zIndex = 2;
        break;
      case 3:
        document.querySelector(".page:nth-child(3)").classList.add("flipped");
        document.querySelector(".page:nth-child(3)").style.zIndex = 3;
        closeBook(false);
        break;
      default:
        throw new Error("unknown state");
    }
    currentLocation++;
  }
}

function goPrevPage() {
  if (currentLocation > 1) {
    switch (currentLocation) {
      case 2:
        closeBook(true);
        document
          .querySelector(".page:nth-child(1)")
          .classList.remove("flipped");
        document.querySelector(".page:nth-child(1)").style.zIndex = 3;
        break;
      case 3:
        document
          .querySelector(".page:nth-child(2)")
          .classList.remove("flipped");
        document.querySelector(".page:nth-child(2)").style.zIndex = 2;
        break;
      case 4:
        openBook();
        document
          .querySelector(".page:nth-child(3)")
          .classList.remove("flipped");
        document.querySelector(".page:nth-child(3)").style.zIndex = 1;
        break;
      default:
        throw new Error("unknown state");
    }
    currentLocation--;
  }
}

function openBook() {
  document.getElementById("book").style.transform = "translateX(50%)";
  document.querySelector(".prev-btn").style.transform = "translateX(-150px)";
  document.querySelector(".next-btn").style.transform = "translateX(150px)";
}

function closeBook(isAtBeginning) {
  if (isAtBeginning) {
    document.getElementById("book").style.transform = "translateX(0%)";
  } else {
    document.getElementById("book").style.transform = "translateX(100%)";
  }
  document.querySelector(".prev-btn").style.transform = "translateX(0px)";
  document.querySelector(".next-btn").style.transform = "translateX(0px)";
}

const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes floatUp {
    to { transform: translateY(-100vh); opacity: 0; }
}
`;
document.head.appendChild(styleSheet);

setInterval(createHeart, 800);
