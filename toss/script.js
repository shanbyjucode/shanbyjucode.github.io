const coin = document.getElementById("coin");
const sound = document.getElementById("tossSound");

let isFlipping = false;

coin.addEventListener("click", () => {
  if (isFlipping) return;
  isFlipping = true;

  sound.currentTime = 0;
  sound.play();

  // Random result
  const isHeads = Math.random() < 0.5;
  const endRotation = isHeads ? 0 : 180;

  // Remove any previous inline transform or animation class
  coin.classList.remove("animate");
  coin.style.transform = `rotateX(${endRotation}deg) scale(1)`;

  // Force reflow to restart animation
  void coin.offsetWidth;

  // Add animation class
  coin.classList.add("animate");

  setTimeout(() => {
    // Set final transform based on result
    coin.classList.remove("animate");
    coin.style.transform = `rotateX(${endRotation}deg) scale(1)`;
    isFlipping = false;
  }, 2000);
});
