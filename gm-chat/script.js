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





document.querySelector('.send-btn').addEventListener('click', function() {
  // Hide greeting and suggestions
  document.querySelector('.greeting').style.display = 'none';
  document.querySelector('.suggestions').style.display = 'none';

  // Show loader
  const chatResult = document.querySelector('.chat-result');
  chatResult.style.display = 'block';

  // Simulate loading and then display result
  setTimeout(function() {
    chatResult.innerHTML = `
      <div class="chat-result-inner">
        <h3>Weekly Meeting Summary (Apr 14–20, 2025)</h3>
      <p>Over the past week, your team held a total of 12 meetings (8 by you, 4 by the team).</p>
      <table>
        <thead>
          <tr>
            <th>Recorded By</th>
            <th>Total No. of Meetings</th>
            <th>Total Meeting Duration (mins)</th>
            <th>Avg. Meeting Duration (mins)</th>
            <th>Avg. Talk To Listen (%)</th>
            <th>Avg. Longest Monologue (mins)</th>
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
      </div>
    `;
  }, 1000); // Simulate 2 seconds loading time
});
