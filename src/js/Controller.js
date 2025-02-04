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
    const userPreference = Logic.getSelectedEventsOrOccurences(); // returns either 'events' or 'occurrences' -- what the user clicked last
    let myData;
    userPreference === "events" ? (myData = Logic.getEventsByMonth()) : (myData = Logic.getOccurrencesByMonth()); // getting the data for the Events This Month block
    Visual.renderEventsOccurrences(userPreference, myData); // render the Events This Month block on the right

    const routinesData = Logic.filterOccsByCat();
    Visual.renderRoutinesBlock(routinesData);

    runEventListeners();

    Logic.everyHourTimer(() => {
        // refresh the page (without literally refreshing the page) every hour
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
init();

// ================================================================================================

// running event listeners
function runEventListeners() {
    Visual.handleCalendarClicks(calendarClicksHandler); // handle clicks in .calendar
    Visual.handleNonCalendarClicks(otherClicksHandler); // handle clicks in .app__field which is where the form is
    Visual.handleCalendarHoversIn(handleCalendarHoversIn); // handle hover-ins over days in Calendar
    Visual.handleCalendarHoversOut(handleCalendarHoversOut); // handle hover-outs over days in Calendar

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

    const routinesData = Logic.filterOccsByCat();
    Visual.renderRoutinesBlock(routinesData);

    // re-rendering Calendar based on this new state:
    // 'getThisMonthEventfulDays' returns an array of 2 arrays: event days (only dates) and occurrence days:
    const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays();

    const [yearToShow, monthToShow] = Logic.getMonthToShow(); // getting the month that is now rendered
    // calc how many days are in this month and return other things as well, ready to be rendered:
    const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(yearToShow, monthToShow);
    Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays); // rendering the month

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
        // console.log(`out`, el);
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

// exporting for some dependencies
export { Logic, Visual, runEventListeners, formHandler };
