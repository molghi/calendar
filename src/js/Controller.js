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
import formHandler from "./modules/controller-dependencies/formHandler.js";
import actionsHandler from "./modules/controller-dependencies/actionsHandler.js";
import {
    handleCalendarHoversIn,
    handleCalendarHoversOut,
    handleAppfieldHoversIn,
    handleAppfieldHoversOut,
} from "./modules/controller-dependencies/hoverActions.js";

// ================================================================================================

// runs on app start
function init() {
    // calc how many days are in this month and return other things too:
    const [now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth();
    Logic.setNowDate([year, month, date]); // setting the current date
    Logic.setMonthToShow([year, month]); // setting the month now shown on the screen

    renderThings(); // render all main things on the screen

    const accentColor = Logic.getAccentColor();
    if (accentColor) Visual.changeAccentColor(accentColor); // changing the accent color to the saved one

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
    const [myYear, myMonth] = Logic.getMonthToShow(); // fetch [year, month] -- what month and year are shown now on the screen
    const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(myYear, myMonth); // calc how many days are in this month and return other things as well, ready to be rendered
    const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays(); // 'getThisMonthEventfulDays' returns an array of 2 arrays: event days (only dates) and occurrence days
    Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays); // rendering the month element (Calendar)

    const userPreference = Logic.getSelectedEventsOrOccurences(); // returns either 'events' or 'occurrences' -- what the user clicked last in the block on the right
    let myData;
    userPreference === "events" ? (myData = Logic.getEventsByMonth()) : (myData = Logic.getOccurrencesByMonth()); // getting the data for the Events/Occs This Month block
    Visual.renderEventsOccurrences(userPreference, myData); // render the Events/Occs This Month block on the right

    const routinesData = Logic.filterOccsByCat(); // getting the data for Routines This Month block
    Visual.renderRoutinesBlock(routinesData); // rendering Routines This Month block

    const todayData = Logic.getTodayData(); // getting events and occ's today (and date) to update doc title
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
    Visual.listenKeys(keysListener); // listen to key presses: arrow left and arrow right
    Visual.handleActionClicks(actionsHandler); // handle clicks in .actions: change color, import or export
    Visual.reactToFileInput(processInput); // reacting to file input/import

    // Logic.everyMinuteTimer(() => {
    //     renderThings(); // refreshing the interface every hour
    // });
}

// ================================================================================================

// listen to key presses: arrow left and arrow right
function keysListener(keyPressed) {
    if (keyPressed === "prev") {
        calendarClicksHandler("prev"); // render prev month
    } else if (keyPressed === "next") {
        calendarClicksHandler("next"); // render next month
    }
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners, formHandler, renderThings };
