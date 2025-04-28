const phrases = [
  "Ask anything about your meetings...",
  "What were the team mostly concentrating on last quarter",
  "What were my main action items from last month’s meetings",
  "Which clients were discussed most frequently in the past 30 days",
  "Summarize all sales-related conversations from this week",
  "Show me decisions made in team syncs this quarter",
  "Download a report of product feedback mentioned last month"
];

const textarea = document.querySelector('.chat-input');
let phraseIndex = 0;
let charIndex = 0;
let typing = true;
let typingAnimationActive = true;

function typePlaceholder() {
  if (typing && typingAnimationActive) {
    if (charIndex < phrases[phraseIndex].length) {
      textarea.placeholder = phrases[phraseIndex].substring(0, charIndex + 1);
      charIndex++;
      setTimeout(typePlaceholder, 20); // speed of typing
    } else {
      typing = false;
      setTimeout(typePlaceholder, 500); // wait before starting deleting
    }
  } else if (!typing && typingAnimationActive) {
    if (charIndex > 0) {
      textarea.placeholder = phrases[phraseIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(typePlaceholder, 40); // speed of deleting
    } else {
      typing = true;
      phraseIndex = (phraseIndex + 1) % phrases.length; // move to next phrase
      setTimeout(typePlaceholder, 500); // small pause before typing next
    }
  }
}

// Start the typing animation
typePlaceholder();

// Stop typing animation on send button click and reset placeholder
document.querySelector('.send-btn').addEventListener('click', function() {
  typingAnimationActive = false; // Stop the typing animation
  textarea.placeholder = "Ask anything about your meetings..."; // Set the final placeholder text
});





// Array of result objects
const results = [
  {
    type: "text-list",
    title: "Here are the key action items and insights:",
    list: [
      "Summarize key decisions made in this week's meetings.",
      "List all open follow-ups assigned to Anjali.",
      "What were the main blockers discussed in product syncs?",
      "Give me all action items from last month’s leadership reviews.",
      "What next steps were discussed in our sales pipeline review?",
      "Highlight customer concerns raised in the last 5 support calls.",
      "Pull all feedback points shared by clients in Q1 meetings.",
      "What were the hiring updates discussed in the HR weekly?"
    ]
  },
  {
    type: "table",
    title: "Weekly Meeting Summary (Apr 14–20, 2025)",
    description: "Over the past week, your team held a total of 12 meetings (8 by you, 4 by the team).",
    table: `
      <table>
        <thead>
          <tr>
            <th>Recorded By</th>
            <th>Total Meetings</th>
            <th>Total Duration (mins)</th>
            <th>Avg. Meeting Duration</th>
            <th>Avg. Talk/Listen (%)</th>
            <th>Longest Monologue (mins)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>You</td>
            <td>8</td>
            <td>480</td>
            <td>60</td>
            <td>70%</td>
            <td>15</td>
          </tr>
          <tr>
            <td>Team</td>
            <td>4</td>
            <td>240</td>
            <td>60</td>
            <td>65%</td>
            <td>12</td>
          </tr>
        </tbody>
      </table>
    `
  },
  {
    type: "list-graph",
    title: "Anoop's Quarterly Performance Overview",
    list: [
      "January: Initiated 5 meetings with a 70% participation rate and contributed to 8 action items.",
      "February: Increased engagement by 15%, leading 6 meetings and driving strategic discussions.",
      "March: Demonstrated strong leadership, topping the team in talk-to-listen ratio and owning 10+ follow-ups."
    ],
    graph: "./performance-graph.png" // Ensure this image exists
  },
  {
    type: "video",
    title: "Monthly Team Highlights Video",
    description: "Watch the highlights from this month's team meetings and key moments.",
    videoUrl: "https://www.youtube.com/embed/Uls_jXy9RuU?si=zIuPfvRxgnrJ3QtA" // Replace with your actual video URL
  }
];

// Function to shuffle the results array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Initialize shuffled results and index
let shuffledResults = shuffleArray([...results]);
let currentIndex = 0;

// Event listener for the send button
document.querySelector('.send-btn').addEventListener('click', function() {
  // Hide greeting and suggestions
  document.querySelector('.greeting').style.display = 'none';
  document.querySelector('.suggestions').style.display = 'none';
  window.speechSynthesis.cancel();

  const chatResult = document.querySelector('.chat-result');
  const resultActions = document.querySelector('.result-actions');

  // Show loader
  chatResult.style.display = 'block';
  chatResult.innerHTML = `
    <div class="loader">
      <img src="./gm-animated-loading.gif" alt="Loading...">
    </div>
  `;

  // Hide result actions during loading
  resultActions.style.display = 'none';

  // Simulate loading and then display result
  setTimeout(function() {
    const result = shuffledResults[currentIndex];
    let html = `<div class="chat-result-inner">`;

    if (result.type === "text-list") {
      html += `<h3>${result.title}</h3><ol>`;
      result.list.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += `</ol>`;
    } else if (result.type === "table") {
      html += `<h3>${result.title}</h3><p>${result.description}</p>${result.table}`;
    } else if (result.type === "list-graph") {
      html += `<h3>${result.title}</h3><ul>`;
      result.list.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += `</ul><img src="${result.graph}" alt="Performance Graph" style="margin-top:20px; max-width:100%;">`;
    } else if (result.type === "video") {
      html += `<h3>${result.title}</h3><p>${result.description}</p>
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
        <iframe src="${result.videoUrl}" frameborder="0" allowfullscreen 
        style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
      </div>`;
    }

    html += `</div>`;

    chatResult.innerHTML = html;

    // Show result actions after displaying the result
    resultActions.style.display = 'flex';

    // Update index and reshuffle if at the end
    currentIndex++;
    if (currentIndex >= shuffledResults.length) {
      shuffledResults = shuffleArray([...results]);
      currentIndex = 0;
    }

    // Decrease credit balance by 100 with animation and play sound
    const coinSound = new Audio('coin.mp3');
    coinSound.loop = true; // Optional: Loop sound while animating
    coinSound.play();

    let currentCredits = parseInt(document.getElementById('credit-balance').textContent);
    let newCredits = currentCredits - 100;
    let duration = 500; // Duration of the animation in milliseconds
    let stepTime = 10; // Time between each step in milliseconds
    let steps = duration / stepTime;
    let stepValue = (currentCredits - newCredits) / steps;

    let interval = setInterval(function() {
      currentCredits -= stepValue;
      document.getElementById('credit-balance').textContent = Math.round(currentCredits);
      if (currentCredits <= newCredits) {
        clearInterval(interval);
        document.getElementById('credit-balance').textContent = newCredits;
        // Stop and reset sound after animation completes
        coinSound.pause();
        coinSound.currentTime = 0;
      }
    }, stepTime);

  }, 1000); // Simulate 1 second loading time
});



function getUSEnglishFemaleVoice() {
  const voices = window.speechSynthesis.getVoices();
  // Filter voices for US English
  const usVoices = voices.filter(voice => voice.lang === 'en-US');
  // Attempt to find a female voice by common female voice names
  const femaleVoiceNames = ['Google US English', 'Samantha', 'Karen', 'Moira', 'Tessa', 'Victoria'];
  for (let name of femaleVoiceNames) {
    const voice = usVoices.find(voice => voice.name === name);
    if (voice) return voice;
  }
  // Fallback to the first US English voice if no match is found
  return usVoices[0];
}

document.querySelector('img[alt="Voice"]').addEventListener('click', function () {
  const textElement = document.querySelector('.chat-result-inner');
  if (!textElement) return;

  const text = textElement.innerText.trim();
  if (!text) return;

  // Stop any ongoing speech synthesis
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.voice = getUSEnglishFemaleVoice();
  utterance.rate = 1; // Adjust speaking rate (0.1 to 10)
  utterance.pitch = 1; // Adjust pitch (0 to 2)

  window.speechSynthesis.speak(utterance);
});



document.querySelector('.copy-icon').addEventListener('click', function () {
  const textElement = document.querySelector('.chat-result-inner');
  if (!textElement) return;

  const text = textElement.innerText.trim();
  if (!text) return;

  // Use the Clipboard API to copy text
  navigator.clipboard.writeText(text).then(() => {
    alert('Text copied to clipboard')
    console.log('Text copied to clipboard');
    // Optionally, provide user feedback here
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
});

document.querySelector('.download-icon').addEventListener('click', function () {
  const textElement = document.querySelector('.chat-result-inner');
  if (!textElement) return;

  const text = textElement.innerText.trim();
  if (!text) return;

  // Create a Blob with the text content
  const blob = new Blob([text], { type: 'text/plain' });

  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'chat-result.txt';

  // Append the anchor to the body
  document.body.appendChild(link);

  // Programmatically click the anchor to trigger the download
  link.click();

  // Clean up by removing the anchor and revoking the object URL
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
});
