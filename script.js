
gsap.registerPlugin(Draggable);

let unlocked = false;

Draggable.create("#pullstring", {
  type: "y",
  bounds: { minY: 0, maxY: 100 },
  onDragEnd: function () {
    if (this.y > 80 && !unlocked) {
      unlocked = true;
      gsap.to("#blackout", { opacity: 0, duration: 1, onComplete: () => {
        document.getElementById("blackout").style.display = "none";
        document.querySelector("main").style.display = "block";
      }});
    } else {
      gsap.to(this.target, { y: 0, duration: 0.5 });
    }
  }
});
