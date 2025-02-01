// Controller is the grand orchestrator of the entire project: it initialises Model, View, and uses all methods defined there to perform all actions.

"use strict";

import "../styles/main.scss";

// instantiating main classes
import Model from "./modules/Model.js";
import View from "./modules/View.js";
const Logic = new Model();
const Visual = new View();

// ================================================================================================

// runs on app start
function init() {
    const [now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(); // calc how many days are in this month and return other things as well, ready to be rendered
    Logic.setNowDate([year, month, date]);
    Logic.setMonthToShow([year, month]);
    Visual.renderMonth([now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime]); // render the now month

    runEventListeners();

    Logic.everyHourTimer(() => {
        // refresh the page (without literally refreshing the page) every hour
        const [myYear, myMonth] = Logic.getMonthToShow(); // fetch [year, month]
        const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(myYear, myMonth);
        Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime]);
        // console.log("hourly timer just ran");
    });
}
init();

// ================================================================================================

// running event listeners
function runEventListeners() {
    Visual.handleCalendarClicks(calendarClicksHandler); // handle clicks in .calendar
    Visual.handleNonCalendarClicks(otherClicksHandler); // handle clicks in .app__field
}

// ================================================================================================

// handle clicks in .calendar
function calendarClicksHandler(actionType, el) {
    const [myYear, myMonth] = Logic.getMonthToShow(); // fetch [year, month]

    if (actionType === "next") {
        // next month btn was clicked, render next month
        let monthToShow = myMonth + 1;
        let yearToShow = myYear;
        if (monthToShow > 12) {
            monthToShow = 1;
            yearToShow += 1;
        }
        const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(
            yearToShow,
            monthToShow
        ); // calc how many days are in this month and return other things as well, ready to be rendered
        Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime]); // rendering the month
        Logic.setMonthToShow([yearToShow, monthToShow]);
    } else if (actionType === "prev") {
        // prev month btn was clicked, render prev month
        let monthToShow = myMonth - 1;
        let yearToShow = myYear;
        if (monthToShow < 1) {
            monthToShow = 12;
            yearToShow -= 1;
        }
        const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(
            yearToShow,
            monthToShow
        ); // calc how many days are in this month and return other things as well, ready to be rendered
        Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime]); // rendering the month
        Logic.setMonthToShow([yearToShow, monthToShow]);
    } else if (actionType === "now") {
        // it was a click on 'Back to Now' btn
        const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(); // calc how many days are in this month and return other things as well, ready to be rendered
        Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime]); // rendering the month
        Logic.setMonthToShow([yr, mth]);
    } else if ((actionType === "dayClick", el)) {
        // it was a click on some day
        const clickedDate = el.dataset.date.split(",").reverse().join("/");
        Visual.setClickedDay(clickedDate);
        Visual.renderForm("event", true, clickedDate); // 'true' for 'with animation' (when rendering)
        Visual.handleFormSubmission(formHandler);
    }
}

// ================================================================================================

function otherClicksHandler(type) {
    if (type === "occurrence") {
        // render occurrence form
        const clickedDate = Visual.getClickedDay();
        Visual.renderForm("occurrence", false, clickedDate); // 'false' for 'no animation' (when rendering)
        Visual.handleFormSubmission(formHandler);
    } else if (type === "event") {
        // render event form
        const clickedDate = Visual.getClickedDay();
        Visual.renderForm("event", false, clickedDate);
        Visual.handleFormSubmission(formHandler);
    }
}

// ================================================================================================

function formHandler(values, type) {
    // values is array, type is string
    const [isValidated, safeValues, message] = Logic.validateInput(values, type); // validating input
    // console.log(isValidated, safeValues, message);
    if (!isValidated) return console.error(message); // showing console error if validation failed
    Logic.addEventOccurrence(safeValues); // adding this submitted thing to state
    Visual.removeForm(); // removing form
    // re-rendering based on this new state
    const thisMonthEventfulDays = Logic.getThisMonthEventfulDays(); // 'getThisMonthEventfulDays' returns a flat array of numbers

    const [yearToShow, monthToShow] = Logic.getMonthToShow();
    const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(
        yearToShow,
        monthToShow
    ); // calc how many days are in this month and return other things as well, ready to be rendered
    Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime], thisMonthEventfulDays); // rendering the month

    // and show some notification
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners };
