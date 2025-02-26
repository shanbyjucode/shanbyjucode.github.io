    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spin');
    const refreshButton = document.getElementById('refresh');
    const successLeft = document.getElementById('success-left');
    const successRight = document.getElementById('success-right');
    const spinAudio = document.getElementById('spinAudio');
    let currentRotation = 0;
    const numSegments = 7;

    // Gifs initialized with none
    successLeft.style.display = "none";
    successRight.style.display = "none";

    // Defining the weights for the segments of wheel in series from 0 to 6
    const segmentWeights = [45, 45, 5, 3, 1, 1, 0]; 

    // Function to get a random segment based on weights
    function getWeightedRandomSegment(weights) {
      const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
      let randomNum = Math.random() * totalWeight;
      for (let i = 0; i < weights.length; i++) {
        if (randomNum < weights[i]) {
          return i;
        }
        randomNum -= weights[i];
      }
    }

    spinButton.addEventListener('click', () => {
      // gif disabled in the start of wheel
      successLeft.style.display = "none";
      successRight.style.display = "none";
      spinAudio.currentTime = 0;
      spinAudio.play();

      // random segment function call
      const selectedSegment = getWeightedRandomSegment(segmentWeights);
      const degreesPerSegment = 360 / numSegments;
      const segmentCenterAngle = selectedSegment * degreesPerSegment + degreesPerSegment / 2;
      const fullRotations = 5 * 360; // 5 full rotations
      const randomOffset = Math.random() * degreesPerSegment; // Small random offset for variability
      const totalRotation = fullRotations + segmentCenterAngle + randomOffset;
      wheel.style.transition = "transform 4s ease-out"; // Smooth spin
      wheel.style.transform = `rotate(${totalRotation}deg)`;
      currentRotation = totalRotation % 360; 
    });

    // celebration Gifs after spin completes
    wheel.addEventListener('transitionend', () => {
      successLeft.style.display = "block";
      successRight.style.display = "block";
    });

    // refresh button logic
    refreshButton.addEventListener('click', () => {
      location.reload();
    });