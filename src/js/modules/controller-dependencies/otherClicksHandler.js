import { Logic, Visual, formHandler } from "../../Controller.js";
import View from "../View.js";

// ================================================================================================

// handles clicks in .app__field which is where the form or Events This Month is
// general router function
function otherClicksHandler(type, el) {
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
        // and show Events This Month
        const eventsData = Logic.getEventsByMonth();
        Visual.renderEventsOccurrences("events", eventsData);
        Visual.setFormIsShown(); // setting that form is shown (boolean, false here) and if false, .calendar__days loses the no-hover class
    } else if (type === "events") {
        // show Events This Month
        const eventsData = Logic.getEventsByMonth();
        Visual.renderEventsOccurrences("events", eventsData);
    } else if (type === "occurrences") {
        // show Occurences This Month
        const occsData = Logic.getOccurrencesByMonth();
        Visual.renderEventsOccurrences("occurrences", occsData);
    } else if (type === "delete") {
        // delete one entry: event or occurrence
        deleteOneEntry(el);
    } else if (type === "edit") {
        // editing one entry: event or occurence
        editOneEntry(el);
        Visual.setFormIsShown(); // setting that form is shown (boolean) and if true .calendar__days receives pointer-events none (no hovering)
    }
}

// ================================================================================================

// dependency of 'otherClicksHandler'
function deleteOneEntry(el) {
    const itemTitle = el.querySelector(".ev-occ__item-title").textContent.trim(); // getting the title of this entry
    const answer = confirm(`Are you sure you want to delete this entry?\n\n${itemTitle}`); // prompting first
    if (!answer) return;
    const itemDate = el.querySelector(".ev-occ__item-date").textContent.trim(); // getting its date
    const blockShown = [...document.querySelectorAll(".ev-occ__switch-btn")].find((el) => el.classList.contains("active")).textContent.toLowerCase(); // getting what block is shown there now: events or occurences
    Logic.deleteEntry(blockShown, itemTitle, itemDate); // deleting from the state and pushing it to LS

    // re-rendering the entire Events/Occurrences block and the calendar element as well:
    // calc how many days are in this month and return other things as well, ready to be rendered:
    const [now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime] = Logic.calcMonth();
    // 'getThisMonthEventfulDays' returns an array of 2 arrays: event days (only dates/numbers) and occurrence days (same):
    const [eventDays, occurrenceDays] = Logic.getThisMonthEventfulDays();
    Visual.renderMonth([now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime], eventDays, occurrenceDays); // rendering the now month
    const eventsData = Logic.getEventsByMonth(); // getting the data for the Events This Month block
    Visual.renderEventsOccurrences("events", eventsData); // rendering the Events This Month block on the right
}

// ================================================================================================

// dependency of 'otherClicksHandler'
function editOneEntry(el) {
    const itemTitle = el.querySelector(".ev-occ__item-title").textContent.toLowerCase().trim(); // getting the event title
    const itemDate = el.querySelector(".ev-occ__item-date").textContent.toLowerCase().trim(); // and its date
    const itemType = [...document.querySelectorAll(".ev-occ__switch-btn")]
        .find((x) => x.classList.contains("active"))
        .textContent.toLowerCase()
        .trim(); // determining if it was an event or occurrence
    const itemData = Logic.getEntryData(itemTitle, itemDate, itemType); // getting all the data of 'el' from the state: 4 of its props
    Logic.setEditingItem(itemTitle, itemDate, itemType); // setting what item I am editing now in case if I modify all of its fields: to be able to find it then in state
    Visual.removeEventsOccurrences(); // removing the Evs/Occs block
    Visual.renderForm("event", true, itemData.date, "edit"); // showing the form and making it the Edit form ('edit' param) -- 'true' for 'with animation' (when rendering)
    Visual.populateForm(itemData); // putting the data of the clicked ev/occ in the fields of that Edit form
    Visual.handleFormSubmission(formHandler); // handling that form submission
}

// ================================================================================================

export default otherClicksHandler;
