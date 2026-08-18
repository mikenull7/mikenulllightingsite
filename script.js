// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");

    if (targetId === "#" || targetId === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const target = document.querySelector(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    }
  });
});

// Force scroll to top on reload
window.onload = () => window.scrollTo(0, 0);

// Slideshow logic
const slideshowImages = [
  "assets/photos/miw_1.png",
  "assets/photos/miw_2.png",
  "assets/photos/ab_keys.png",
  "assets/photos/ab_rah.png",
  "assets/photos/itm_1.png",
  "assets/photos/Nomo_1.png",
  "assets/photos/ptv.png",
  "assets/photos/soty1.png",
  "assets/photos/itmss1.png",
  "assets/photos/itmss2.png",
  "assets/photos/itmss3.png",
  "assets/photos/nomoss1.png",
];

let currentIndex = 0;
const slideshowImageEl = document.getElementById("slideshow-image");

function nextSlide() {
  currentIndex = (currentIndex + 1) % slideshowImages.length;
  slideshowImageEl.style.opacity = 0;

  setTimeout(() => {
    slideshowImageEl.src = slideshowImages[currentIndex];
    slideshowImageEl.style.opacity = 1;
  }, 500);
}

setInterval(nextSlide, 3000);

// Lightbulb chain logic
// -------------------------------------------------------------
// LIGHTBULB CHAIN LOGIC
// -------------------------------------------------------------

gsap.registerPlugin(Draggable);

let unlocked = false;

const chainGroup = document.getElementById("chainGroup");
const pullHandle = document.getElementById("pullHandle");

// Get all 14 chain rings
const chainLinks = [...chainGroup.querySelectorAll("ellipse")];

// Remember their original positions
const originalLinks = chainLinks.map((link) => ({
  cx: parseFloat(link.getAttribute("cx")),
  cy: parseFloat(link.getAttribute("cy")),
}));

// -------------------------------------------------------------
// DEFORM THE CHAIN
// -------------------------------------------------------------

function updateChain(pull, sway = 0) {
  chainLinks.forEach((link, i) => {
    // 0 = top of chain
    // 1 = bottom of chain
    const progress = i / (chainLinks.length - 1);

    // Bottom gets progressively more movement.
    const weight = Math.pow(progress, 1.7);

    // Vertical movement
    const y = originalLinks[i].cy + pull * weight;

    // Horizontal movement
    const x = originalLinks[i].cx + sway * weight;

    link.setAttribute(
      "transform",
      `translate(
        ${x - originalLinks[i].cx}
        ${y - originalLinks[i].cy}
      )`,
    );
  });
}

// -------------------------------------------------------------
// RESET CHAIN
// -------------------------------------------------------------

function resetChain() {
  chainLinks.forEach((link) => {
    link.removeAttribute("transform");
  });
}

// -------------------------------------------------------------
// DRAGGING
// -------------------------------------------------------------

Draggable.create("#pullHandle", {
  type: "x,y",

  bounds: {
    minX: -30,
    maxX: 30,
    minY: 0,
    maxY: 100,
  },

  onDrag: function () {
    const pull = this.y;
    const sway = this.x;

    updateChain(pull, sway);
  },

  // -----------------------------------------------------------
  // RELEASE
  // -----------------------------------------------------------

  onDragEnd: function () {
    // User pulled far enough to turn the light on
    if (this.y > 80 && !unlocked) {
      unlocked = true;

      // Turn on bulb
      document.getElementById("bulb").classList.add("on");

      // Fade out blackout
      gsap.to("#blackout", {
        delay: 1,
        opacity: 0,
        duration: 1,

        onComplete: () => {
          document.getElementById("blackout").style.display = "none";
          document.querySelector(".content-overlay").style.display = "block";
        },
      });
    }

    // ---------------------------------------------------------
    // SPRING HANDLE BACK
    // ---------------------------------------------------------

    gsap.to(this.target, {
      x: 0,
      y: 0,

      duration: 2.0,

      ease: "elastic.out(5, 0.22)",

      onUpdate: () => {
        const pull = Number(gsap.getProperty(this.target, "y")) || 0;

        const sway = Number(gsap.getProperty(this.target, "x")) || 0;

        updateChain(pull, sway);
      },

      onComplete: () => {
        resetChain();
        updateChain(0, 0);
      },
    });
  },
});

// Lightbox resize control
document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("lightbox:change", () => {
    setTimeout(() => {
      const container = document.querySelector(".lb-outerContainer");
      const image = document.querySelector(".lb-image");
      if (container && image) {
        container.style.width = "90vw";
        container.style.height = "80vh";
        container.style.maxWidth = "90vw";
        container.style.maxHeight = "80vh";
        image.style.maxWidth = "100%";
        image.style.maxHeight = "100%";
        image.style.objectFit = "contain";
      }
    }, 50);
  });
});

// AOS scroll animation
AOS.init({
  duration: 800,
  once: false,
});

// -------------------------------------------------------------
//  TAP-TO-TURN-ON LOGIC FOR BULB + CHAIN
// -------------------------------------------------------------

function triggerPullAnimation() {
  if (unlocked) return; // avoid double triggers
  unlocked = true;

  // Animate pull down
  gsap.to("#pullHandle", {
    y: 80,
    duration: 0.2,
    ease: "power2.out",
    onComplete: () => {
      // Bounce back up
      gsap.to("#pullHandle", {
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });

      // Sway animation
      gsap.fromTo(
        "#chainGroup",
        { x: -10 },
        {
          x: 10,
          duration: 0.4,
          ease: "sine.inOut",
          repeat: 3,
          yoyo: true,
        },
      );
    },
  });

  // Turn on the bulb
  document.getElementById("bulb").classList.add("on");

  // Fade out blackout
  gsap.to("#blackout", {
    delay: 0.8,
    opacity: 0,
    duration: 1,
    onComplete: () => {
      document.getElementById("blackout").style.display = "none";
      document.querySelector(".content-overlay").style.display = "block";
    },
  });
}

// Tap on bulb → activate
document.getElementById("bulb").addEventListener("click", triggerPullAnimation);

// Tap on chain → activate (your chain SVG group)
document
  .getElementById("chain")
  .addEventListener("click", triggerPullAnimation);

// Lightbox resize control
document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("lightbox:change", () => {
    setTimeout(() => {
      const container = document.querySelector(".lb-outerContainer");
      const image = document.querySelector(".lb-image");
      if (container && image) {
        container.style.width = "90vw";
        container.style.height = "80vh";
        container.style.maxWidth = "90vw";
        container.style.maxHeight = "80vh";
        image.style.maxWidth = "100%";
        image.style.maxHeight = "100%";
        image.style.objectFit = "contain";
      }
    }, 50);
  });
});

// AOS scroll animation
AOS.init({
  duration: 800,
  once: false,
});
