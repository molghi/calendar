import { Logic, Visual, formHandler } from "../../Controller.js";

// ================================================================================================

// handle clicks in .calendar
function calendarClicksHandler(actionType, el) {
    const [myYear, myMonth] = Logic.getMonthToShow(); // fetches [year, month]

    if (actionType === "next") {
        // next month btn was clicked: render next month
        showNextMonth(myYear, myMonth);
    } else if (actionType === "prev") {
        // prev month btn was clicked: render prev month
        showPrevMonth(myYear, myMonth);
    } else if (actionType === "now") {
        // it was a click on 'Back to Now' btn: jump back to the now month
        backToNow();
    } else if ((actionType === "dayClick", el)) {
        // it was a click on some day: show a form to add new things
        Visual.removeEventsOccurrences();
        const clickedDate = el.dataset.date.split(",").reverse().join("/"); // el is the day element that was clicked
        Visual.setClickedDay(clickedDate); // setting the string of the date of the clicked day
        Visual.renderForm("event", true, clickedDate); // 'true' for 'with animation' (when rendering)
        Visual.handleFormSubmission(formHandler); // handling form submission
        Visual.setFormIsShown(); // setting that form is shown (boolean) and if true .calendar__days receives pointer-events none (no hovering)
    }
}

// ================================================================================================

// dependency of 'calendarClicksHandler'
function showNextMonth(myYear, myMonth) {
    let monthToShow = myMonth + 1; // incrementing logic
    let yearToShow = myYear;
    if (monthToShow > 12) {
        monthToShow = 1;
        yearToShow += 1;
    }
    // calc how many days are in this month and return other things as well, ready to be rendered:
    const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(yearToShow, monthToShow);
    Logic.setMonthToShow([yearToShow, monthToShow]); // updating the value that stands for 'what month is now shown on the screen'
    // 'getThisMonthEventfulDays' returns an array of 2 arrays: event days (only dates) and occurrence days:
    const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays();
    Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays); // rendering the month
    const userPreference = Logic.getSelectedEventsOrOccurences(); // returns either 'events' or 'occurrences' -- what the user clicked last
    let myData;
    userPreference === "events" ? (myData = Logic.getEventsByMonth()) : (myData = Logic.getOccurrencesByMonth()); // getting the data for the Events This Month block
    Visual.renderEventsOccurrences(userPreference, myData); // render the Events This Month block on the right

    const routinesData = Logic.filterOccsByCat();
    Visual.renderRoutinesBlock(routinesData);
}

// ================================================================================================

// dependency of 'calendarClicksHandler'
function showPrevMonth(myYear, myMonth) {
    let monthToShow = myMonth - 1; // decrementing logic
    let yearToShow = myYear;
    if (monthToShow < 1) {
        monthToShow = 12;
        yearToShow -= 1;
    }
    // calc how many days are in this month and return other things as well, ready to be rendered:
    const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth(yearToShow, monthToShow);
    Logic.setMonthToShow([yearToShow, monthToShow]); // updating the value that stands for 'what month is now shown on the screen'
    // 'getThisMonthEventfulDays' returns an array of 2 arrays: event days (only dates) and occurrence days:
    const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays();
    Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays); // rendering the month
    const userPreference = Logic.getSelectedEventsOrOccurences(); // returns either 'events' or 'occurrences' -- what the user clicked last
    let myData;
    userPreference === "events" ? (myData = Logic.getEventsByMonth()) : (myData = Logic.getOccurrencesByMonth()); // getting the data for the Events This Month block
    Visual.renderEventsOccurrences(userPreference, myData); // render the Events This Month block on the right

    const routinesData = Logic.filterOccsByCat();
    Visual.renderRoutinesBlock(routinesData);
}

// ================================================================================================

// dependency of 'calendarClicksHandler'
function backToNow() {
    // calc how many days are in this month and return other things as well, ready to be rendered:
    const [now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth();
    Logic.setMonthToShow([yr, mth]); // updating the value that stands for 'what month is now shown on the screen'
    // 'getThisMonthEventfulDays' returns an array of 2 arrays: event days (only dates) and occurrence days:
    const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays();
    Visual.renderMonth([now, yr, mth, date, weekday, hrs, min, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays); // rendering the month
    const userPreference = Logic.getSelectedEventsOrOccurences(); // returns either 'events' or 'occurrences' -- what the user clicked last
    let myData;
    userPreference === "events" ? (myData = Logic.getEventsByMonth()) : (myData = Logic.getOccurrencesByMonth()); // getting the data for the Events This Month block
    Visual.renderEventsOccurrences(userPreference, myData); // render the Events This Month block on the right

    const routinesData = Logic.filterOccsByCat();
    Visual.renderRoutinesBlock(routinesData);
}

// ================================================================================================

export default calendarClicksHandler;
