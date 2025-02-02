// import { render } from "sass";
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

// dependency of 'renderMonth'
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

    const html = thisMonth
        .map((x) => {
            const emptyClass = x === "x" ? " calendar__day--empty" : ""; // a class for an empty day
            let todayClass = x === date ? " calendar__day--today" : ""; // a class to visually distinguish today
            let passedClass = x < date ? " calendar__day--passed" : ""; // a class to visually distinguish passed days
            if (!showingCurrentPeriod) (todayClass = ""), (passedClass = ""); // if the month to show is not the current one, no today-highlighting and no assigning the passed-day class
            const classes = `calendar__day${emptyClass}${passedClass}${todayClass}`.trim(); // getting a string of all classes
            const content = typeof x === "number" ? x : ""; // 'content' is the date num
            const dateAttr = typeof x === "number" ? `data-date="${year},${month},${x}"` : "";

            let eventContent = ""; // starter content for a day with an event
            let occurenceContent = ""; // starter content for a day with an occurrence
            let timesItOccursInEvents = 0; // to figure our how many events this day has
            let timesItOccursInOccs = 0; // to figure our how many occurrences this day has
            eventDaysArr.forEach((eventNum) => eventNum === x && timesItOccursInEvents++); // eventDaysArr has duplicates, by design
            occDaysArr.forEach((occNum) => occNum === x && timesItOccursInOccs++);
            if (eventDaysArr && eventDaysArr.length > 0)
                eventContent = eventDaysArr.includes(x) ? `<span class="calendar__day--eventful">${timesItOccursInEvents}</span>` : ""; // determining the value, the content
            if (occDaysArr && occDaysArr.length > 0)
                occurenceContent = occDaysArr.includes(x) ? `<span class="calendar__day--occurence">${timesItOccursInOccs}</span>` : ""; // determining the value, the content

            return `<div class="${classes}" ${dateAttr}>
            ${eventContent}${occurenceContent}
                <span>${content}</span>
            </div>`;
        })
        .join("");
    div.innerHTML = html;
    Visual.calendarBlock.appendChild(div);
}

// ================================================================================================

// dependency of 'renderMonth'
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
// ================================================================================================
// ================================================================================================

// general function -- rendering the form to add an event or occurrence
function renderForm(type, animationFlag = true, clickedDate) {
    Visual.removeForm(); // removing before re-rendering
    const div = document.createElement("div");
    div.classList.add("app__form-box", "invisible");
    if (type === "event") {
        div.innerHTML = getEventHtml(clickedDate);
    } else {
        div.innerHTML = getOccurrenceHtml(clickedDate);
    }
    Visual.appFieldBlock.appendChild(div);

    if (!animationFlag) return div.classList.remove("invisible");

    setTimeout(() => {
        div.classList.remove("invisible"); // little animation
    }, 200);
}

// ================================================================================================

// dependency of 'renderForm'
function getEventHtml(clickedDate) {
    return `<form action="#" class="app__form">
            <button class="app__form-btn-close" type="button">${crossIcon}</button>
            <div class="app__form-header">
                <div class="app__form-title">Add Event</div>
                <label>A scheduled and specific activity.</label>
                <div class="app__form-switch">
                    <button type="button" class="app__form-switch-btn app__form-switch-btn--event active">Event</button>
                    <button type="button" class="app__form-switch-btn app__form-switch-btn--occurrence">Occurrence</button>
                </div>
            </div>
            <div class="app__form-input-box">
                <input type="text" class="app__form-input app__form-input--title" placeholder="Title" required />
            </div>
            <div class="app__form-input-box">
                <input type="text" class="app__form-input app__form-input--date" placeholder="Date" required value="${clickedDate}" />
                <input type="text" class="app__form-input app__form-input--time" placeholder="Time (optional)" />
            </div>
            <div class="app__form-input-box">
                <textarea class="app__form-input app__form-input--description" placeholder="Description (optional)"></textarea>
            </div>
            <button class="app__form-btn" type="submit">Add</button>
        </form>`;
}

// ================================================================================================

// dependency of 'renderForm'
function getOccurrenceHtml(clickedDate) {
    return `<form action="#" class="app__form">
            <button class="app__form-btn-close" type="button">${crossIcon}</button>
            <div class="app__form-header">
                <div class="app__form-title">Add Occurrence</div>
                <label>A general thing that happened, an activity or note.</label>
                <div class="app__form-switch">
                    <button type="button" class="app__form-switch-btn app__form-switch-btn--event">Event</button>
                    <button type="button" class="app__form-switch-btn app__form-switch-btn--occurrence active">Occurrence</button>
                </div>
            </div>
            <div class="app__form-input-box">
                <input type="text" class="app__form-input app__form-input--title" placeholder="Title" required />
            </div>
            <div class="app__form-input-box">
                <input type="text" class="app__form-input app__form-input--date" placeholder="Date" required value="${clickedDate}" />
                <input type="text" class="app__form-input app__form-input--title" placeholder="Category (optional)" />
            </div>
            <div class="app__form-input-box">
                <textarea class="app__form-input app__form-input--description app__form-input--description-occ" placeholder="Description (optional)"></textarea>
            </div>
            <button class="app__form-btn" type="submit">Add</button>
        </form>`;
}

// ================================================================================================
// ================================================================================================
// ================================================================================================

// evocc - EVents-OCCurrences; in .app__field  -- rendering all events or all occurences for the showing month
function renderEvoccBlock(type = "events", data) {
    Visual.removeEventsOccurrences(); // removing before re-rendering

    const div = document.createElement("div");
    div.classList.add("ev-occ");
    let html;

    if (type === "events") {
        html = returnEventsBlock(data);
    } else {
        html = returnOccurencesBlock(data);
    }
    div.innerHTML = html;
    Visual.appFieldBlock.appendChild(div);
}

// ================================================================================================

// dependency of 'renderEvoccBlock' -- returning the html of all events
function returnEventsBlock(data) {
    let toRender;
    if (data.length === 0) {
        toRender = `<div class="ev-occ__msg">No entries yet...</div><div class="ev-occ__hint">Click on a day to add one</div>`;
    } else {
        toRender = data
            .map((eventObj) => {
                const desc = !eventObj.description
                    ? ""
                    : `<div class="ev-occ__item-row">
                            <span class="ev-occ__item-minor-title">Note: </span>
                            <span class="ev-occ__item-description" title="${eventObj.description}">${eventObj.description}</span>
                        </div>`;
                const time = !eventObj.time ? "" : `<span class="ev-occ__item-time"> at ${eventObj.time}</span>`;

                return `<div data-date="${eventObj.date.split("/").reverse().join(",")}" class="ev-occ__item">
                        <div class="ev-occ__item-btns">
                            <button title="Edit" class="ev-occ__item-btn ev-occ__item-btn--edit">${editIcon}</button>
                            <button title="Delete" class="ev-occ__item-btn ev-occ__item-btn--delete">${deleteIcon}</button>
                        </div>
                        <div class="ev-occ__item-row">
                            <span class="ev-occ__item-title" title="${eventObj.title}">${eventObj.title}</span>
                        </div>
                        <div class="ev-occ__item-row">
                        <div>
                            <span class="ev-occ__item-minor-title">Date: </span>
                            <span class="ev-occ__item-date">${eventObj.date}</span>
                            ${time}
                            </div>
                        </div>
                        ${desc}
                    </div>`;
            })
            .join("");
    }

    return `<div class="ev-occ__box">
            <div class="ev-occ__title">Events This Month<span title="${data.length} events this month">${data.length}</span></div>
                <div class="ev-occ__switch">
                    <button title="Scheduled and specific activities" class="ev-occ__switch-btn ev-occ__switch-btn--ev active">Events</button>
                    <button title="General things that happened, activities or notes" class="ev-occ__switch-btn ev-occ__switch-btn--occ">Occurrences</button>
                </div>
            </div>
                <div class="ev-occ__items">
                    ${toRender}
                </div>`;
}

// ================================================================================================

// dependency of 'renderEvoccBlock' -- returning the html of all occurrences
function returnOccurencesBlock(data) {
    let toRender;
    if (data.length === 0) {
        toRender = `<div class="ev-occ__msg">No entries yet...</div><div class="ev-occ__hint">Click on a day to add one</div>`;
    } else {
        toRender = data
            .map((occObj) => {
                const desc = !occObj.description
                    ? ""
                    : `<div class="ev-occ__item-row">
                            <span class="ev-occ__item-minor-title">Note: </span>
                            <span class="ev-occ__item-description" title="${occObj.description}">${occObj.description}</span>
                        </div>`;
                const category = !occObj.category
                    ? ""
                    : `<span class="ev-occ__item-minor-title">Category: </span><span title="${occObj.category}">${occObj.category}</span>`;

                return `<div data-date="${occObj.date.split("/").reverse().join(",")}" class="ev-occ__item">
                        <div class="ev-occ__item-btns">
                            <button title="Edit" class="ev-occ__item-btn ev-occ__item-btn--edit">${editIcon}</button>
                            <button title="Delete" class="ev-occ__item-btn ev-occ__item-btn--delete">${deleteIcon}</button>
                        </div>
                        <div class="ev-occ__item-row">
                            <span class="ev-occ__item-title" title="${occObj.title}">${occObj.title}</span>
                        </div>
                        <div class="ev-occ__item-row">
                            <div>
                                <span class="ev-occ__item-minor-title">Date: </span>
                                <span class="ev-occ__item-date">${occObj.date}</span>
                            </div>
                            <div>
                                ${category}
                            </div>
                            ${desc}
                        </div>`;
            })
            .join("");
    }

    return `<div class="ev-occ__box">
            <div class="ev-occ__title">Occurrences This Month<span title="${data.length} occurrences this month">${data.length}</span></div>
                <div class="ev-occ__switch">
                    <button title="Scheduled and specific activities" class="ev-occ__switch-btn ev-occ__switch-btn--ev">Events</button>
                    <button title="General things that happened, activities or notes" class="ev-occ__switch-btn ev-occ__switch-btn--occ active">Occurrences</button>
                </div>
            </div>
                <div class="ev-occ__items">
                ${toRender}
                </div>`;
}

// ================================================================================================

export { renderMonth, renderForm, renderEvoccBlock };
