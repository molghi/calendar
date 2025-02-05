import { Visual } from "../../Controller.js";
import { nextIcon, prevIcon, crossIcon, editIcon, deleteIcon } from "./icons.js";

// ================================================================================================

// general function -- rendering a month
function renderMonth([now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime], eventDaysArr, occDaysArr) {
    const showingCurrentYear = new Date(now).getFullYear() === year;
    const showingCurrentMonth = new Date(now).getMonth() + 1 === month;
    const showingCurrentPeriod = showingCurrentYear & showingCurrentMonth; // if showingCurrentMonth and showingCurrentYear are true, then the Back to Now btn must be hidden

    renderCalendarHeader(year, month, monthWord, yearTime);
    renderMonthDays(year, month, weekday, daysInThisMonth, date, Boolean(showingCurrentPeriod), eventDaysArr, occDaysArr); // render a rectangle filled with day boxes
    renderNowBtn(showingCurrentPeriod);
}

// ================================================================================================

// dependency of 'renderMonth' -- renders calendar header
function renderCalendarHeader(year, month, monthWord, yearTime) {
    if (document.querySelector(".calendar__header-box")) document.querySelector(".calendar__header-box").remove(); // removing before rendering

    const html = `<div class="calendar__header-box">
    <button class="calendar__header-btn calendar__header-btn--prev">${prevIcon}</button>
    <div class="calendar__header">
        <span>${year}</span>,
        <span>${yearTime}</span> — 
        <span>Month ${month}</span>,
        <span>${monthWord}</span>
    </div>
    <button class="calendar__header-btn calendar__header-btn--next">${nextIcon}</button>
    </div>`;

    Visual.calendarBlock.insertAdjacentHTML("afterbegin", html);
}

// ================================================================================================

// dependency of 'renderMonth' -- render a rectangle filled with day boxes
function renderMonthDays(year, month, weekday, daysInThisMonth, date, showingCurrentPeriod, eventDaysArr, occDaysArr) {
    /* NOTE ABOUT PARAMETERS:
    year, month, weekday, daysInThisMonth, date are all number types
        weekday and date never change... they're always the same
    showingCurrentPeriod is a boolean that says if the month (and year) currently showing is actually the current month (and year)
    eventDaysArr and occDaysArr are both flat arrays of only numbers representing dates with events or occurrences, they have duplicates by design
    */
    if (document.querySelector(".calendar__days")) document.querySelector(".calendar__days").remove(); // removing before rendering

    const div = document.createElement("div");
    div.classList.add("calendar__days");

    const arr = new Array(daysInThisMonth).fill(0); // creating a dummy array, length = days in this month
    const thisMonth = arr.map((x, i) => i + 1); // an array of days (day nums)
    const thisMonthBeginningWeekday = new Date(year, month - 1, 1).getDay(); // what's the weekday number of the beginning of this month
    const thisMonthEndWeekday = new Date(year, month - 1, daysInThisMonth).getDay(); // what's the weekday number of the end of this month
    const daysToPrepend = thisMonthBeginningWeekday; // amount of empty days
    const daysToAppend = 6 - thisMonthEndWeekday; // amount of empty days
    new Array(daysToPrepend).fill("x").forEach((x) => thisMonth.unshift(x)); // pushing empty days at the front
    new Array(daysToAppend).fill("x").forEach((x) => thisMonth.push(x)); // pushing empty days at the back

    let html = returnMonthHtml(thisMonth, showingCurrentPeriod, eventDaysArr, occDaysArr, date, month, year); // returns an array

    const weekdayEl = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
        (x) => `<div class="calendar__day calendar__day--name">${x.slice(0, 3)}</div>`
    ); // adding the weekday names row

    html = [...weekdayEl, ...html];

    div.innerHTML = html.join("");
    Visual.calendarBlock.appendChild(div);
}

// ================================================================================================

// another dependency -- of 'renderMonthDays'
function returnMonthHtml(thisMonth, showingCurrentPeriod, eventDaysArr, occDaysArr, date, month, year) {
    return thisMonth.map((x) => {
        const emptyClass = x === "x" ? " calendar__day--empty" : ""; // a class for an empty day
        let todayClass = x === date ? " calendar__day--today" : ""; // a class to visually distinguish today
        let passedClass = x < date ? " calendar__day--passed" : ""; // a class to visually distinguish passed days
        if (!showingCurrentPeriod) (todayClass = ""), (passedClass = ""); // if the month to show is not the current one, no today-highlighting and no assigning the passed-day class
        const classes = `calendar__day${emptyClass}${passedClass}${todayClass}`.trim(); // getting a string of all classes
        const content = typeof x === "number" ? x : ""; // 'content' is the date number
        const dateAttr = typeof x === "number" ? `data-date="${year},${month},${x}"` : ""; // setting the date attribute

        let eventContent = ""; // starter content for a day with an event
        let occurenceContent = ""; // starter content for a day with an occurrence
        let timesItOccursInEvents = 0; // to figure our how many events this day has
        let timesItOccursInOccs = 0; // to figure our how many occurrences this day has
        eventDaysArr.forEach((eventNum) => eventNum === x && timesItOccursInEvents++); // eventDaysArr has duplicates, by design
        occDaysArr.forEach((occNum) => occNum === x && timesItOccursInOccs++);
        if (eventDaysArr && eventDaysArr.length > 0)
            eventContent = eventDaysArr.includes(x) ? `<span class="calendar__day--eventful">${timesItOccursInEvents}</span>` : ""; // determining the content: if 'eventDaysArr' contains this 'x' (which is a date, number), it means that this day has some event, and this element must have the special 'eventful' class and show how many events it has
        if (occDaysArr && occDaysArr.length > 0)
            occurenceContent = occDaysArr.includes(x) ? `<span class="calendar__day--occurence">${timesItOccursInOccs}</span>` : ""; // same logic with occurrences

        return `<div class="${classes}" ${dateAttr}>
            ${eventContent}${occurenceContent}
                <span>${content}</span>
            </div>`;
    });
}

// ================================================================================================

// dependency of 'renderMonth' -- renders the Back To Now btn
function renderNowBtn(showingCurrentPeriod) {
    // if showingCurrentPeriod is true, then this btn must be hidden
    if (document.querySelector(".calendar__now-btn-box")) document.querySelector(".calendar__now-btn-box").remove(); // removing before rendering

    const div = document.createElement("div");
    div.classList.add("calendar__now-btn-box");

    const classes = `calendar__now-btn ${showingCurrentPeriod ? "hidden" : ""}`.trim();
    const html = `<button class="${classes}">Back to Now</button>`;

    div.innerHTML = html;
    Visual.calendarBlock.appendChild(div);
}

// ================================================================================================

export default renderMonth;
