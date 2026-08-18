// =============================================================
// SMOOTH SCROLLING
// =============================================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");

    if (targetId === "#" || targetId === "#top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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

// =============================================================
// FORCE SCROLL TO TOP ON RELOAD
// =============================================================

window.onload = () => {
  window.scrollTo(0, 0);
};

// =============================================================
// SLIDESHOW
// =============================================================

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
  if (!slideshowImageEl) return;

  currentIndex = (currentIndex + 1) % slideshowImages.length;

  slideshowImageEl.style.opacity = 0;

  setTimeout(() => {
    slideshowImageEl.src = slideshowImages[currentIndex];

    slideshowImageEl.style.opacity = 1;
  }, 500);
}

setInterval(nextSlide, 3000);

// =============================================================
// LIGHTBULB + PULL CHAIN
// =============================================================

gsap.registerPlugin(Draggable);

let unlocked = false;

const chainGroup = document.getElementById("chainGroup");

const chain = document.getElementById("chain");

const bulb = document.getElementById("bulb");

const blackout = document.getElementById("blackout");

const contentOverlay = document.querySelector(".content-overlay");

// =============================================================
// GET ALL CHAIN LINKS
// =============================================================

const chainLinks = [...chainGroup.querySelectorAll("ellipse")];

// =============================================================
// REMEMBER ORIGINAL LINK POSITIONS
// =============================================================

const originalLinks = chainLinks.map((link) => ({
  cx: parseFloat(link.getAttribute("cx")),
  cy: parseFloat(link.getAttribute("cy")),
}));

// =============================================================
// CURRENT DRAG VALUES
// =============================================================
//
// We keep these separate from the SVG.
//
// The SVG itself NEVER gets translated.
//

let currentPull = 0;
let currentSway = 0;

// =============================================================
// DEFORM CHAIN
// =============================================================
//
// TOP LINK = COMPLETELY ANCHORED
//
// Bottom links progressively move farther.
//
// This creates the effect of a real hanging chain.
//

function updateChain(pull, sway = 0) {
  if (!chainLinks.length) return;

  chainLinks.forEach((link, i) => {
    // ---------------------------------------------------------
    // POSITION ALONG CHAIN
    // ---------------------------------------------------------

    const progress = i / (chainLinks.length - 1);

    // ---------------------------------------------------------
    // WEIGHT / FLEX
    // ---------------------------------------------------------
    //
    // Top barely moves.
    // Bottom moves the most.
    //

    const weight = Math.pow(progress, 1.7);

    // ---------------------------------------------------------
    // VERTICAL POSITION
    // ---------------------------------------------------------

    const y = originalLinks[i].cy + pull * weight;

    // ---------------------------------------------------------
    // HORIZONTAL POSITION
    // ---------------------------------------------------------

    const x = originalLinks[i].cx + sway * weight;

    // ---------------------------------------------------------
    // APPLY ONLY TO THIS LINK
    // ---------------------------------------------------------

    link.setAttribute(
      "transform",
      `translate(
        ${x - originalLinks[i].cx}
        ${y - originalLinks[i].cy}
      )`,
    );
  });
}

// =============================================================
// RESET CHAIN
// =============================================================

function resetChain() {
  chainLinks.forEach((link) => {
    link.removeAttribute("transform");
  });

  currentPull = 0;
  currentSway = 0;
}

// =============================================================
// TURN LIGHT ON
// =============================================================

function turnLightOn() {
  if (unlocked) {
    return;
  }

  unlocked = true;

  // -----------------------------------------------------------
  // BULB ON
  // -----------------------------------------------------------

  bulb.classList.add("on");

  // -----------------------------------------------------------
  // FADE BLACKOUT
  // -----------------------------------------------------------

  gsap.to(blackout, {
    delay: 1,
    opacity: 0,
    duration: 1,

    onComplete: () => {
      blackout.style.display = "none";

      if (contentOverlay) {
        contentOverlay.style.display = "block";
      }
    },
  });
}

// =============================================================
// CHAIN DRAGGING
// =============================================================
//
// IMPORTANT:
//
// The SVG is ONLY the hitbox.
//
// GSAP is NOT allowed to visually move the SVG.
//
// We measure the drag and deform the individual chain links.
//

Draggable.create(chain, {
  type: "x,y",

  bounds: {
    minX: -30,
    maxX: 30,
    minY: 0,
    maxY: 100,
  },

  // -----------------------------------------------------------
  // PRESS
  // -----------------------------------------------------------

  onPress: function () {
    // Stop any previous spring animation.

    gsap.killTweensOf(this.target);

    currentPull = 0;
    currentSway = 0;
  },

  // -----------------------------------------------------------
  // DRAG
  // -----------------------------------------------------------

  onDrag: function () {
    // Read the user's drag.

    currentPull = this.y;
    currentSway = this.x;

    // Deform the actual links.

    updateChain(currentPull, currentSway);

    // ---------------------------------------------------------
    // CRITICAL
    // ---------------------------------------------------------
    //
    // Immediately return the SVG hitbox to its
    // original position.
    //
    // This prevents the entire chain from moving.
    //

    gsap.set(this.target, {
      x: 0,
      y: 0,
    });
  },

  // -----------------------------------------------------------
  // RELEASE
  // -----------------------------------------------------------

  onDragEnd: function () {
    // Save the last drag values.
    //
    // Do NOT use this.y here because the SVG is
    // immediately returned to zero.

    const releaseY = currentPull;
    const releaseX = currentSway;

    // ---------------------------------------------------------
    // TURN LIGHT ON
    // ---------------------------------------------------------

    if (releaseY > 80 && !unlocked) {
      turnLightOn();
    }

    // ---------------------------------------------------------
    // SPRING BACK
    // ---------------------------------------------------------
    //
    // Dummy object.
    //
    // The SVG itself does NOT move.
    //
    // Only the individual links deform.

    const spring = {
      pull: releaseY,
      sway: releaseX,
    };

    gsap.to(spring, {
      pull: 0,
      sway: 0,

      // Long enough to see the chain fly back.

      duration: 4,

      // Strong physical-looking overshoot.

      ease: "elastic.out(10, .2)",

      // -------------------------------------------------------
      // UPDATE CHAIN DURING SPRING
      // -------------------------------------------------------

      onUpdate: () => {
        updateChain(spring.pull, spring.sway);
      },

      // -------------------------------------------------------
      // COMPLETE
      // -------------------------------------------------------

      onComplete: () => {
        resetChain();

        updateChain(0, 0);
      },
    });
  },
});

// =============================================================
// BULB TAP / CLICK
// =============================================================
//
// The bulb can still be clicked or tapped.
//

if (bulb) {
  bulb.addEventListener("click", () => {
    turnLightOn();
  });
}

// =============================================================
// LIGHTBOX RESIZE
// =============================================================

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

// =============================================================
// MA NOTEBOOK DOWNLOAD TRACKING
// =============================================================

const pluginDownload = document.getElementById("plugin-download");

if (pluginDownload) {
  pluginDownload.addEventListener("click", () => {
    if (typeof gtag === "function") {
      gtag("event", "plugin_download", {
        plugin_name: "MA Notebook",
        plugin_version: "1.0",
        file_name: "MANoteBook.xml",
      });
    }
  });
}

// =============================================================
// AOS SCROLL ANIMATION
// =============================================================

AOS.init({
  duration: 800,
  once: false,
});

// =============================================================
// END
// =============================================================
