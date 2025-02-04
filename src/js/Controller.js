// Controller is the grand orchestrator of the entire project: it initialises Model, View, and uses all methods defined there to perform all actions.

"use strict";

import "../styles/main.scss";

// instantiating main classes
import Model from "./modules/Model.js";
import View from "./modules/View.js";
const Logic = new Model();
const Visual = new View();

// importing dependencies
import calendarClicksHandler from "./modules/controller-dependencies/calendarClicksHandler.js";
import otherClicksHandler from "./modules/controller-dependencies/otherClicksHandler.js";
import processInput from "./modules/controller-dependencies/import.js";

// ================================================================================================

// runs on app start
function init() {
    // calc how many days are in this month and return other things as well, ready to be rendered:
    const [now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth();
    Logic.setNowDate([year, month, date]);
    Logic.setMonthToShow([year, month]);

    renderThings(); // render all main things on the screen

    const accentColor = Logic.getAccentColor();
    if (accentColor) Visual.changeAccentColor(accentColor);

    runEventListeners();

    Logic.everyHourTimer(() => {
        // refresh the page (without literally refreshing the page) every hour
        renderThings(); // render all main things on the screen
    });
}
init();

// ================================================================================================

// render all main things on the screen
function renderThings() {
    const [myYear, myMonth] = Logic.getMonthToShow(); // fetch [year, month]
    const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(myYear, myMonth); // calc how many days are in this month and return other things as well, ready to be rendered
    const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays(); // 'getThisMonthEventfulDays' returns an array of 2 arrays: event days (only dates) and occurrence days
    Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays); // rendering the month element

    const userPreference = Logic.getSelectedEventsOrOccurences(); // returns either 'events' or 'occurrences' -- what the user clicked last
    let myData;
    userPreference === "events" ? (myData = Logic.getEventsByMonth()) : (myData = Logic.getOccurrencesByMonth()); // getting the data for the Events This Month block
    Visual.renderEventsOccurrences(userPreference, myData); // render the Events This Month block on the right

    const routinesData = Logic.filterOccsByCat(); // getting the data for Routines This Month
    Visual.renderRoutinesBlock(routinesData); // rendering Routines This Month

    const todayData = Logic.getTodayData(); // getting events and occ's today (and date)
    Visual.updateDocTitle(todayData); // updating document title
}

// ================================================================================================

// running event listeners
function runEventListeners() {
    Visual.handleCalendarClicks(calendarClicksHandler); // handle clicks in .calendar
    Visual.handleNonCalendarClicks(otherClicksHandler); // handle clicks in .app__field which is where the form is
    Visual.handleCalendarHoversIn(handleCalendarHoversIn); // handle hover-ins over days in Calendar
    Visual.handleCalendarHoversOut(handleCalendarHoversOut); // handle hover-outs over days in Calendar
    Visual.handleAppfieldHoversIn(handleAppfieldHoversIn); // handle hover-ins in .app__field
    Visual.handleAppfieldHoversOut(handleAppfieldHoversOut); // handle hover-outs in .app__field
    Visual.listenKeys(keysListener); // listen to key presses
    Visual.handleActionClicks(actionsHandler); // handle clicks in .actions: change color, import or export
    Visual.reactToFileInput(processInput); // reacting to file input/import

    Logic.everyMinuteTimer(() => {
        // refreshing the interface if it is a new day
        const [myYear, myMonth] = Logic.getMonthToShow(); // fetch [year, month]
        const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(myYear, myMonth);
        const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays();
        Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays);
        const userPreference = Logic.getSelectedEventsOrOccurences(); // returns either 'events' or 'occurrences' -- what the user clicked last
        let myData;
        userPreference === "events" ? (myData = Logic.getEventsByMonth()) : (myData = Logic.getOccurrencesByMonth()); // getting the data for the Events This Month block
        Visual.renderEventsOccurrences(userPreference, myData); // render the Events This Month block on the right

        const routinesData = Logic.filterOccsByCat();
        Visual.renderRoutinesBlock(routinesData);
    });
}

// ================================================================================================

// runs as a callback for 'Visual.handleFormSubmission'
function formHandler(values, type, formType) {
    // NOTE: 'values' is array, 'type' is string, 'formType' is either 'editForm' or 'addForm'
    const [isValidated, safeValues, message] = Logic.validateInput(values, type); // validating input
    if (!isValidated) {
        // console.error(message); // showing message if validation failed
        Visual.showMessage("error", message); // showing some notification in the UI
        return;
    }
    if (formType === "addForm") {
        Logic.addEventOccurrence(safeValues); // adding this submitted thing to state and pushing to LS
    } else {
        Logic.editEventOccurrence(safeValues); // editing in state and pushing to LS
    }
    Visual.removeForm(); // removing form

    const userPreference = Logic.getSelectedEventsOrOccurences(); // returns either 'events' or 'occurrences' -- what the user clicked last
    let myData;
    userPreference === "events" ? (myData = Logic.getEventsByMonth()) : (myData = Logic.getOccurrencesByMonth()); // getting the data for the Events This Month block
    Visual.renderEventsOccurrences(userPreference, myData); // render the Events This Month block on the right

    // re-rendering Calendar based on this new state:
    // 'getThisMonthEventfulDays' returns an array of 2 arrays: event days (only dates) and occurrence days:
    const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays();

    const [yearToShow, monthToShow] = Logic.getMonthToShow(); // getting the month that is now rendered
    // calc how many days are in this month and return other things as well, ready to be rendered:
    const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(yearToShow, monthToShow);
    Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays); // rendering the month

    const routinesData = Logic.filterOccsByCat();
    Visual.renderRoutinesBlock(routinesData);

    const messageToShow = formType === "addForm" ? "Added successfully!" : "Edited successfully!";
    Visual.showMessage("success", messageToShow); // showing some notification in the UI

    Visual.setFormIsShown(); // setting that form is shown (boolean, false here) and if false, .calendar__days loses the no-hover class
}

// ================================================================================================

// handle hover-ins over days in Calendar
function handleCalendarHoversIn(actionType, el) {
    if (actionType === `day-block`) {
        Visual.makeDimmer(Visual.appFieldBlock.firstElementChild); // making what is shown on the right dimmer
        // when hovering over any day el, render a block on the right on top of what is shown there now
        const elDate = el.dataset.date.split(",").reverse().join("/");
        const [eventsThisDay, occsThisDay, temporalDistance, weekday] = Logic.getDayData(elDate);
        Visual.renderDayBlock(elDate, eventsThisDay, occsThisDay, temporalDistance, weekday);
    } else {
        // get all dates that have this category ('el') and highlight them
        const allSuchDates = Logic.getDates(el);
        const today = `${new Date().getFullYear()},${new Date().getMonth() + 1},${new Date().getDate()}`;
        Visual.toggleHighlightToday(today, false);
        Visual.toggleHighlightDates(allSuchDates, true);
    }
}

// ================================================================================================

function handleCalendarHoversOut(actionType, el) {
    if (actionType === `day-block`) {
        Visual.makeDimmer(Visual.appFieldBlock.firstElementChild, "restore"); // removing the dimmer class on what is shown on the right
        Visual.removeDayBlock();
    } else {
        // get all dates that have this category ('el') and de-highlight them
        const allSuchDates = Logic.getDates(el);
        const today = `${new Date().getFullYear()},${new Date().getMonth() + 1},${new Date().getDate()}`;
        Visual.toggleHighlightToday(today, true);
        Visual.toggleHighlightDates(allSuchDates, false);
    }
}

// ================================================================================================

function handleAppfieldHoversIn(dateString) {
    const calendarEl = document.querySelector(`.calendar [data-date="${dateString}"]`);
    calendarEl.classList.add("highlighted");
    const today = `${new Date().getFullYear()},${new Date().getMonth() + 1},${new Date().getDate()}`;
    Visual.toggleHighlightToday(today, false);
}

// ================================================================================================

function handleAppfieldHoversOut(dateString) {
    const calendarEl = document.querySelector(`.calendar [data-date="${dateString}"]`);
    calendarEl.classList.remove("highlighted");
    const today = `${new Date().getFullYear()},${new Date().getMonth() + 1},${new Date().getDate()}`;
    Visual.toggleHighlightToday(today, true);
}

// ================================================================================================

function keysListener(keyPressed) {
    if (keyPressed === "prev") {
        // render prev month
        calendarClicksHandler("prev");
    } else if (keyPressed === "next") {
        // render next month
        calendarClicksHandler("next");
    }
}

// ================================================================================================

function actionsHandler(actionType) {
    if (actionType === "change color") {
        const newColor = prompt("Enter a new UI colour:");
        if (newColor === null) return;
        if (newColor === "") return;
        if (newColor.trim().length < 3) return;
        const safeColor = Logic.checkNewColor(newColor.trim().toLowerCase()); // checking the input
        Visual.changeAccentColor(safeColor); // changing in the UI
        Logic.changeAccentColor(safeColor); // changing in state/LS
    } else if (actionType === "import notes") {
        alert(`NOTE:\nYou can import only JSON and it must be formatted exactly the same as the one you can export.`);
        Visual.inputFileEl.click(); // clicking the file import btn automatically, everything after that happens in the 'change' event listener
    } else if (actionType === "export notes") {
        Logic.exportAsJson();
    }
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners, formHandler, renderThings };
