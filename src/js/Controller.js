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
}

// ================================================================================================

// handle clicks in .calendar
function calendarClicksHandler(actionType) {
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
        ); // calc how many days are in this month and return other
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
        ); // calc how many days are in this month and return other
        Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime]); // rendering the month
        Logic.setMonthToShow([yearToShow, monthToShow]);
    } else if (actionType === "now") {
        // it was a click on 'Back to Now' btn
        const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(); // calc how many days are in this month and return other
        Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime]); // rendering the month
        Logic.setMonthToShow([yr, mth]);
    }
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners };
