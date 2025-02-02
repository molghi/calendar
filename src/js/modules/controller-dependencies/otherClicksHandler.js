import { Logic, Visual, formHandler } from "../../Controller.js";

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
    console.log(`edit`, el);
}

// ================================================================================================

export default otherClicksHandler;
