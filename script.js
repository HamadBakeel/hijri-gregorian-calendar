let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [{"date":"8/16/2023","title":"عماد", "no":"123", "price":"10000",},{"date":"8/15/2023","title":"سالم", "no":"123", "price":"10000",},{"date":"8/30/2023","title":"ساره", "no":"123", "price":"10000",},{"date":"7/17/2023","title":"Hana", "no":"123", "price":"10000",}];
let unavailableDays = ['8/1/2023', '8/11/2023']
const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const unavailableDayModal = document.getElementById("unavailableDayModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const weekdays = [
  "السبت",
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];

function openModal(date) {
  clicked = date;

  const eventForDay = events.find((e) => e.date === clicked);
  const unavailableDay = unavailableDays.find((d) => d === clicked)

  if(unavailableDay){
    unavailableDayModal.style.display = "block"
    backDrop.style.display = "block";
  }
  else if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    document.getElementById("eventNo").innerText = eventForDay.no;
    document.getElementById("eventPrice").innerText = eventForDay.price;
    document.getElementById("eventDate").innerText = eventForDay.date;
    deleteEventModal.style.display = "block";
    backDrop.style.display = "block";
  } else {
    // newEventModal.style.display = "block";
  }

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

  const dateString = firstDayOfMonth.toLocaleDateString("ar-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const paddingDays = weekdays.indexOf(dateString.split("،")[0]);

  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "ar-us",
    { month: "long" }
  )} ${year}`;

  // Set the hijri month in the calendar top
  const currentHijriMonth = new Intl.DateTimeFormat("ar-TN-u-ca-islamic", {
    month: "long",
  }).format(dt);

  // Move to the next month
  dt.setMonth(dt.getMonth() + 1);
  const nextHijriMonth = new Intl.DateTimeFormat("ar-TN-u-ca-islamic", {
    month: "long",
  }).format(dt);

  dt.setMonth(dt.getMonth() + 1);
  const currentYear = new Intl.DateTimeFormat("ar-TN-u-ca-islamic", {
    year: "numeric",
  }).format(dt);

  document.getElementById(
    "hijriMonth"
  ).textContent = `${nextHijriMonth} - ${currentHijriMonth} ${currentYear} `;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const hijriDay = document.createElement("div");
      const iDay = new Intl.DateTimeFormat("ar-TN-u-ca-islamic", {
        day: "numeric",
      }).format(new Date(year, month, i - paddingDays));
      const iMonth = new Intl.DateTimeFormat("ar-TN-u-ca-islamic", {
        month: "long",
      }).format(new Date(year, month, i - paddingDays));
      const iWeekday = new Intl.DateTimeFormat("ar-TN-u-ca-islamic", {
        weekday: "long",
      }).format(new Date(year, month, i - paddingDays));
      const hijriDate = new Intl.DateTimeFormat("ar-TN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        weekday: "long",
        year: "numeric",
      }).format(new Date(year, month, i - paddingDays));
      hijriDay.textContent = iDay == 1 ? iMonth : convertToArabicNumerals(iDay);
      hijriDay.classList.add("hijriDay");
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

      const date = new Date(year, month, i - paddingDays).toLocaleDateString("en-us", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      const unavailableDay = unavailableDays.find((d) => d == date)
      if(unavailableDay){
        daySquare.classList.add('unavailable')
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
  unavailableDayModal.style.display = "none";
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
  // document
  //   .getElementById("deleteButton")
  //   .addEventListener("click", deleteEvent);
  document.querySelectorAll(".closeButton").forEach(button => button.addEventListener("click", closeModal));
}

function convertToArabicNumerals(text) {
  var numerals = {
    0: "٠",
    1: "١",
    2: "٢",
    3: "٣",
    4: "٤",
    5: "٥",
    6: "٦",
    7: "٧",
    8: "٨",
    9: "٩",
  };

  // Iterate over the text and replace Arabic numbers with Arabic numerals
  for (var numeral in numerals) {
    var regex = new RegExp(numeral, "g");
    text = text.replace(regex, numerals[numeral]);
  }

  return text;
}

initButtons();
load();
