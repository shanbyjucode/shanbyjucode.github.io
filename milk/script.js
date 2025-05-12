const calendar = document.getElementById("calendar");
const totalDaysEl = document.getElementById("total-days");
const totalAmountEl = document.getElementById("total-amount");
const MILK_PRICE = 18;

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const currentDay = today.getDate();

const daysInMonth = new Date(year, month + 1, 0).getDate();
const firstDayIndex = new Date(year, month, 1).getDay();
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Load marked days from localStorage
let markedDays = new Set(JSON.parse(localStorage.getItem("markedDays") || "[]"));

function saveMarkedDays() {
  localStorage.setItem("markedDays", JSON.stringify(Array.from(markedDays)));
}

function updateSummary() {
  totalDaysEl.textContent = markedDays.size;
  totalAmountEl.textContent = markedDays.size * MILK_PRICE;
}

function renderCalendar() {
  calendar.innerHTML = "";

  // Render day labels
  for (let i = 0; i < 7; i++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.textContent = dayLabels[i];
    calendar.appendChild(dayEl);
  }

  // Offset for first day of the month
  for (let i = 0; i < firstDayIndex; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  // Render days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateEl = document.createElement("div");
    dateEl.className = "date";
    dateEl.textContent = d;

    if (d === currentDay) {
      dateEl.classList.add("today");
    }

    if (markedDays.has(d)) {
      dateEl.classList.add("marked");
    }

    dateEl.addEventListener("click", () => {
      if (markedDays.has(d)) {
        markedDays.delete(d);
        dateEl.classList.remove("marked");
      } else {
        markedDays.add(d);
        dateEl.classList.add("marked");
      }
      updateSummary();
      saveMarkedDays();
    });

    calendar.appendChild(dateEl);
  }
}

renderCalendar();
updateSummary();


