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
gsap.registerPlugin(Draggable);

let unlocked = false;

Draggable.create("#pullHandle", {
  type: "x,y",
  bounds: { minX: -30, maxX: 30, minY: 0, maxY: 100 },
  onDrag: function () {
    const stretch = 1 + this.y / 100;
    const rotateAmount = -this.x * 0.5; // Negate here
    document
      .getElementById("chainGroup")
      .setAttribute(
        "transform",
        `scale(1, ${stretch}) rotate(${rotateAmount}, 10, 0)`
      );
  },
  onDragEnd: function () {
    if (this.y > 80 && !unlocked) {
      unlocked = true;

      // Turn on the bulb
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

    // Bounce back vertically with elastic ease
    gsap.to(this.target, {
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });

    // Bounce the chain scale back
    gsap.to("#chainGroup", {
      duration: 0.6,
      transform: "scale(1,1)",
      ease: "elastic.out(1, 0.5)",
    });

    // Add sway: slight horizontal shake
    gsap.fromTo(
      "#chainGroup",
      { x: -10 },
      {
        x: 10,
        duration: 0.4,
        ease: "sine.inOut",
        repeat: 3,
        yoyo: true,
      }
    );
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
        }
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
