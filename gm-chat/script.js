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

function typePlaceholder() {
  if (typing) {
    if (charIndex < phrases[phraseIndex].length) {
      textarea.placeholder = phrases[phraseIndex].substring(0, charIndex + 1);
      charIndex++;
      setTimeout(typePlaceholder, 20); // speed of typing
    } else {
      typing = false;
      setTimeout(typePlaceholder, 500); // wait before starting deleting
    }
  } else {
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

typePlaceholder();
