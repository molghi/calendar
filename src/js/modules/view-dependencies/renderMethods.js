// import { render } from "sass";
import { Visual } from "../../Controller.js";
import { nextIcon, prevIcon } from "./icons.js";

// ================================================================================================

function renderMonth([now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime]) {
    const showingCurrentYear = new Date(now).getFullYear() === year;
    const showingCurrentMonth = new Date(now).getMonth() + 1 === month;
    const showingCurrentPeriod = showingCurrentYear & showingCurrentMonth; // if showingCurrentMonth and showingCurrentYear are true, then the Back to Now btn must be hidden

    renderCalendarHeader(year, month, monthWord, yearTime);
    renderMonthDays(year, month, weekday, daysInThisMonth, date, Boolean(showingCurrentPeriod)); // render a rectangle filled with day boxes
    renderNowBtn(showingCurrentPeriod);
}

// ================================================================================================

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

// render a rectangle filled with day boxes
function renderMonthDays(year, month, weekday, daysInThisMonth, date, showingCurrentPeriod) {
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

    const html = thisMonth
        .map((x) => {
            const emptyClass = x === "x" ? "calendar__day--empty" : "";
            let todayClass = x === date ? "calendar__day--today" : "";
            let passedClass = x < date ? "calendar__day--passed" : "";
            if (!showingCurrentPeriod) (todayClass = ""), (passedClass = ""); // if the month to show is not the current one, no today-highlighting and no assigning the passed-day class
            const classes = `calendar__day ${emptyClass} ${passedClass} ${todayClass}`.trim();
            const content = typeof x === "number" ? x : "";
            const dateAttr = typeof x === "number" ? `data-date="${year},${month},${x}"` : "";
            return `<div class="${classes}" ${dateAttr}>
                <span>${content}</span>
            </div>`;
        })
        .join("");
    div.innerHTML = html;
    Visual.calendarBlock.appendChild(div);
}

// ================================================================================================

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

export { renderMonth };
