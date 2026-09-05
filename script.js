/* ==========================================================================
   ELEGANT DEBUT INVITATION - SCRIPT (KYLIE'S 18TH)
   ========================================================================== */

// 1. Floating Gold Particles / Sparkles Canvas
const canvas = document.getElementById('sparkles');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.opacity = Math.random() * 0.8 + 0.2;
  }
  update() {
    this.y -= this.speedY;
    if (this.y < 0) {
      this.y = canvas.height;
      this.x = Math.random() * canvas.width;
    }
  }
  draw() {
    ctx.fillStyle = `rgba(245, 208, 97, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 40; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();


// 2. Spotify-Style Music Player Logic
const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('main-play-btn');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');

function toggleAudio() {
  if (audio.paused) {
    audio.play();
    playIcon.innerHTML = '<path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  } else {
    audio.pause();
    playIcon.innerHTML = '<path fill="currentColor" d="M8 5v14l11-7z"/>';
  }
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

if (audio) {
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progressPercent;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationTimeEl.textContent = formatTime(audio.duration);
    }
  });
}

if (progressBar) {
  progressBar.addEventListener('input', () => {
    if (audio && audio.duration) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
  });
}

function toggleLike(btn) {
  btn.classList.toggle('liked');
}


// 3. Countdown Calculation (October 17, 2026 at 4:00 PM)
const targetDate = new Date("October 17, 2026 16:00:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff > 0) {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (hoursEl) hoursEl.innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (minutesEl) minutesEl.innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (secondsEl) secondsEl.innerText = Math.floor((diff % (1000 * 60)) / 1000);
  } else {
    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.innerHTML = "<p style='color:var(--gold-primary);'>The Event Has Begun!</p>";
  }
}, 1000);


// 4. Scroll Reveal Animations
if (typeof ScrollReveal !== 'undefined') {
  ScrollReveal().reveal('.reveal', {
    delay: 200,
    distance: '30px',
    duration: 800,
    easing: 'ease-in-out',
    origin: 'bottom',
    interval: 100
  });
}


// 5. RSVP Submission via EmailJS & Dynamic Guest Inputs
(function() {
  emailjs.init("KDWQBAW5plO1qYZjo"); // EmailJS Public Key
})();

document.addEventListener('DOMContentLoaded', () => {
  // Sparkle generator initialization
  createSparkles();

  const countInput = document.getElementById("guest-count");
  const guestNamesContainer = document.getElementById("guest-names-container");

  // Dynamically render guest name input boxes when guest count changes
  function updateGuestFields() {
    if (!countInput || !guestNamesContainer) return;
    
    const count = parseInt(countInput.value) || 1;
    guestNamesContainer.innerHTML = ''; // Clear existing fields

    // If guest count > 1, generate additional input fields
    if (count > 1) {
      for (let i = 2; i <= count; i++) {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'form-group guest-input-group';
        
        fieldGroup.innerHTML = `
          <label for="guest-name-${i}">GUEST ${i} FULL NAME</label>
          <input 
            type="text" 
            id="guest-name-${i}" 
            class="additional-guest-name" 
            placeholder="Enter full name for Guest ${i}" 
            required 
          />
        `;
        guestNamesContainer.appendChild(fieldGroup);
      }
    }
  }

  if (countInput) {
    countInput.addEventListener('input', updateGuestFields);
    countInput.addEventListener('change', updateGuestFields);
    updateGuestFields(); // Initial run on DOM ready
  }
});

function submitRSVP(event) {
  event.preventDefault();

  // Primary Guest Name Retrieval
  const primaryNameInput = document.getElementById("full-name") || document.getElementById("guest-name");
  const nameInput = primaryNameInput ? primaryNameInput.value : "";
  const attendanceInput = document.getElementById("attendance").value;
  const countInput = document.getElementById("guest-count").value;

  // Aggregate primary and additional guest names
  const additionalInputs = document.querySelectorAll(".additional-guest-name");
  let guestListArray = [`Primary: ${nameInput}`];

  additionalInputs.forEach((input, index) => {
    if (input.value.trim() !== '') {
      guestListArray.push(`Guest ${index + 2}: ${input.value.trim()}`);
    }
  });

  const allGuestNamesFormatted = guestListArray.join('\n');

  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.innerText = "SENDING...";
  submitBtn.disabled = true;

  const templateParams = {
    guest_name: nameInput,
    attendance: attendanceInput,
    guest_count: countInput,
    all_guest_names: allGuestNamesFormatted
  };

  emailjs.send("service_a5vx5r5", "template_dbeaoyb", templateParams)
    .then(function(response) {
      document.getElementById("rsvp-form").style.display = "none";
      const responseMessage = document.getElementById("rsvp-message");
      responseMessage.style.display = "block";
      responseMessage.innerHTML = `Thank you, <strong>${nameInput}</strong>!<br>Your RSVP (${attendanceInput}) has been sent directly to our email.`;
    }, function(error) {
      alert("Oops! Something went wrong sending your RSVP. Please try again.");
      submitBtn.innerText = "SUBMIT RSVP";
      submitBtn.disabled = false;
    });
}


// 6. Tab Switching Function for 18 Specials
function switchTab(event, categoryId) {
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));

  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(categoryId).classList.add('active');
  event.currentTarget.classList.add('active');
}


// 7. High-End Luxury Gold Sparkle Particles Generator
function createSparkles() {
  const sparkleCount = 30;
  const body = document.body;

  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-particle';
    
    const size = Math.random() * 3 + 1;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${Math.random() * 100}vw`;
    sparkle.style.top = `${Math.random() * 100}vh`;
    sparkle.style.animationDuration = `${Math.random() * 4 + 3}s`;
    sparkle.style.animationDelay = `${Math.random() * 2}s`;

    body.appendChild(sparkle);
  }
}