const coin = document.getElementById("coin");
const sound = document.getElementById("tossSound");

let isFlipping = false;

coin.addEventListener("click", () => {
  if (isFlipping) return;
  isFlipping = true;

  sound.currentTime = 0;
  sound.play();

  // Randomize result
  const isHeads = Math.random() < 0.5;
  const rotationX = isHeads ? 1800 : 1980; // 10 or 11 flips

  // Apply animation
  coin.style.transition = "transform 2s ease-in-out";
  coin.style.transform = `rotateX(${rotationX}deg)`;

  // Reset after animation
  setTimeout(() => {
    isFlipping = false;
    // Reset transform to prevent overflow
    coin.style.transition = "none";
    coin.style.transform = `rotateX(${isHeads ? 0 : 180}deg)`;
  }, 2000);
});
