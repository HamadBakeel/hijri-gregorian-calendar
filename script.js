let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function openModal(date) {
  clicked = date;

  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }

  backDrop.style.display = "block";
}
output(getHijriMonthInfo(new Date(Date.now()))); // today's date
output(getHijriMonthInfo("2022-04-22"));         // 22 April 2022
//==================
function output([gDate, iDay, iMonth, iYear, iMonthTotalDays, gStart, gEnd]) {

console.log(`
Gregorian Date            : ${gDate}
Hijri Day                 : ${iDay}
Hijri Month               : ${iMonth}
Hijri Year                : ${iYear}
Total Days in Hijri Month : ${iMonthTotalDays}
Hijri Month Starts on     : ${gStart}
Hijri Month Ends on       : ${gEnd}
`
);
}
function load() {
    const dt = new Date();
  
    if (nav !== 0) {
      dt.setMonth(new Date().getMonth() + nav);
    }
  
    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();
  
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);
  
    document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
      "en-us",
      { month: "long" }
    )} ${year}`;
  
    calendar.innerHTML = "";
  
    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = document.createElement("div");
      daySquare.classList.add("day");
  
      const dayString = `${month + 1}/${i - paddingDays}/${year}`;
  
      if (i > paddingDays) {
        daySquare.innerText = i - paddingDays;
        const hijriDay = document.createElement('div');
        const iDay = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {day: 'numeric'}).format(new Date(year, month, i - paddingDays));
        const iMonth = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', { month: 'long'}).format(new Date(year, month, i - paddingDays));
        const hijriDate = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {day: 'numeric', month: 'long', weekday: 'long', year: 'numeric'}).format(new Date(year, month, i - paddingDays));
        hijriDay.textContent = iDay == 1 ? iMonth : iDay;
        daySquare.appendChild(hijriDay);
  
        const eventForDay = events.find((e) => e.date === dayString);
  
        if (i - paddingDays === day && nav === 0) {
          daySquare.id = "currentDay";
        }
  
        if (eventForDay) {
          const eventDiv = document.createElement("div");
          eventDiv.classList.add("event");
          eventDiv.innerText = eventForDay.title;
          daySquare.appendChild(eventDiv);
        }
  
        daySquare.addEventListener("click", () => openModal(dayString));
      } else {
        daySquare.classList.add("padding");
      }
  
      calendar.appendChild(daySquare);
    }
  }

function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add("error");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
}

function getHijriMonthInfo(date) {
  let startDate = new Date(date),
    c = "ar-u-ca-islamic-umalqura-nu-latn", // use 'islamic-umalqura' calendar for the islamic date
    d = startDate,
    gDays = 0,
    iMonthTotalDays = 0,
    i_Day,
    n = "numeric",
    iDay = new Intl.DateTimeFormat(c, { day: n }).format(startDate),
    iMonth = new Intl.DateTimeFormat(c, { month: "long" }).format(startDate),
    iYear = new Intl.DateTimeFormat(c, { year: n })
      .format(startDate)
      .split(" ")[0];
  for (let i = 0; i < 32; i++) {
    i_Day = new Intl.DateTimeFormat(c, { day: n }).format(d); // Hijri day
    if (+i_Day > iMonthTotalDays) (iMonthTotalDays = i_Day), gDays++;
    else break;
    d = new Date(d.setDate(d.getDate() + 1)); // next Gregorian day
  }
  let gEndT = new Date(startDate.setDate(startDate.getDate() + gDays - 2)),
    gEnd = new Date(gEndT),
    gStart = new Date(gEndT.setDate(gEndT.getDate() - iMonthTotalDays + 1));
  return [
    new Date(date).toISOString().split("T")[0],
    +iDay,
    iMonth,
    +iYear,
    iMonthTotalDays,
    gStart,
    gEnd,
  ];
}

initButtons();
load();
