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
  type: "y",
  bounds: { minY: 0, maxY: 100 },
  onDrag: function () {
    const stretch = 1 + this.y / 100;
    document
      .getElementById("chainGroup")
      .setAttribute("transform", `scale(1, ${stretch})`);
  },
  onDragEnd: function () {
    if (this.y > 80 && !unlocked) {
      unlocked = true;
      document.getElementById("bulb").classList.add("on");

      gsap.to("#blackout", {
        delay: 2,
        opacity: 0,
        duration: 1,
        onComplete: () => {
          document.getElementById("blackout").style.display = "none";
          document.querySelector(".content-overlay").style.display = "block";
        },
      });
    }

    gsap.to("#chainGroup", {
      duration: 0.5,
      transform: "scale(1,1)",
      ease: "elastic.out(1, 0.5)",
    });

    gsap.to(this.target, { y: 0, duration: 0.5 });
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
