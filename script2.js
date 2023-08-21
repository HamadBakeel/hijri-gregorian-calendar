let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];
let hijri = true;
const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const weekdays = [
    "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
const dateSwitch = document.getElementById('dateSwitch')
dateSwitch.textContent = hijri ? 'ميلادي'  : 'هجري'
dateSwitch.addEventListener('click', ()=>{
    hijri = !hijri;
    console.log(hijri);
    dateSwitch.textContent = hijri ? 'ميلادي'  : 'هجري'

    load();
    initButtons();
})

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

const load = ()=>{
    const dt = new Date();
  
    if (nav !== 0) {
      dt.setMonth(new Date().getMonth() + nav);
    }
    const [hijriDate, iDay, iMonth, iYear, iMonthTotalDays, gStart, gEnd] = getHijriMonthInfo(dt);
    const day = hijri? iDay : dt.getDate();
    const month = hijri ? iMonth : dt.getMonth();
    const year = hijri ? iYear : dt.getFullYear();
    
    
    const firstDayOfMonth = hijri ? gStart : new Date(year, month, 1);
    const daysInMonth = hijri ? iMonthTotalDays : new Date(year, month + 1, 0).getDate();
    
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
  
    document.getElementById('monthDisplay').innerText =
    `${hijri ? iMonth : dt.toLocaleDateString('en-us', { month: 'long' })} ${hijri ? iYear : year}`;
    
    calendar.innerHTML = '';
    
    console.log();
    for (let i = 1; i <= parseInt(paddingDays) + parseInt(daysInMonth); i++) {
      const daySquare = document.createElement('div');
      daySquare.classList.add('day');
  
      const dayString = `${hijri ? iMonth : month+1}/${i - paddingDays}/${hijri ? iYear : year}`;
  
      if (i > paddingDays) {
        daySquare.innerText = i - paddingDays;
        const eventForDay = events.find(e => e.date === dayString);
  
        if (i - paddingDays === iDay && nav === 0) {
          daySquare.id = 'currentDay';
        }
  
        if (eventForDay) {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = eventForDay.title;
          daySquare.appendChild(eventDiv);
        }
  
        daySquare.addEventListener('click', () => openModal(dayString));
      } else {
        daySquare.classList.add('padding');
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
    c = "en-u-ca-islamic-umalqura-nu-latn", // use 'islamic-umalqura' calendar for the islamic date
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
