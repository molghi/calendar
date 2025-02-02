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

// ================================================================================================

// runs on app start
function init() {
    // calc how many days are in this month and return other things as well, ready to be rendered:
    const [now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth();
    Logic.setNowDate([year, month, date]);
    Logic.setMonthToShow([year, month]);
    // 'getThisMonthEventfulDays' returns an array of 2 arrays: event days (only dates) and occurrence days:
    const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays();
    Visual.renderMonth([now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays); // render the now month

    runEventListeners();

    Logic.everyHourTimer(() => {
        // refresh the page (without literally refreshing the page) every hour
        const [myYear, myMonth] = Logic.getMonthToShow(); // fetch [year, month]
        const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(myYear, myMonth);
        const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays();
        Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays);
    });
}
init();

// ================================================================================================

// running event listeners
function runEventListeners() {
    Visual.handleCalendarClicks(calendarClicksHandler); // handle clicks in .calendar
    Visual.handleNonCalendarClicks(otherClicksHandler); // handle clicks in .app__field which is where the form is
}

// ================================================================================================

// handle clicks in .app__field which is where the form is
function otherClicksHandler(type) {
    if (type === "occurrence") {
        // render occurrence form
        const clickedDate = Visual.getClickedDay(); // getting the string of the date of the clicked day el
        Visual.renderForm("occurrence", false, clickedDate); // 'false' for 'no animation' (when rendering)
        Visual.handleFormSubmission(formHandler); // handling form submission: on submit formHandler runs
    } else if (type === "event") {
        // render event form
        const clickedDate = Visual.getClickedDay(); // getting the string of the date of the clicked day el
        Visual.renderForm("event", false, clickedDate); // 'false' for 'no animation' (when rendering)
        Visual.handleFormSubmission(formHandler); // handling form submission: on submit formHandler runs
    } else if (type === "close") {
        // close/remove the form
        Visual.removeForm();
    }
}

// ================================================================================================

// runs as a callback for 'Visual.handleFormSubmission'
function formHandler(values, type) {
    // 'values' is array, 'type' is string
    const [isValidated, safeValues, message] = Logic.validateInput(values, type); // validating input
    if (!isValidated) return console.error(message); // showing console error if validation failed
    Logic.addEventOccurrence(safeValues); // adding this submitted thing to state
    Visual.removeForm(); // removing form
    // re-rendering based on this new state:
    // 'getThisMonthEventfulDays' returns an array of 2 arrays: event days (only dates) and occurrence days:
    const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays();

    const [yearToShow, monthToShow] = Logic.getMonthToShow(); // getting the month that is now rendered
    // calc how many days are in this month and return other things as well, ready to be rendered:
    const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(yearToShow, monthToShow);
    Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays); // rendering the month

    // and show some notification
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners, formHandler };
