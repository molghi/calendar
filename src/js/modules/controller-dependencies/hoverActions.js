import { Logic, Visual } from "../../Controller.js";

// ================================================================================================

// handle hover-ins over days in Calendar
function handleCalendarHoversIn(actionType, el) {
    if (actionType === `day-block`) {
        // when hovering over any day el, render a block on the right on top of what is shown there now
        Visual.makeDimmer(Visual.appFieldBlock.firstElementChild); // making what is shown on the right dimmer
        const elDate = el.dataset.date.split(",").reverse().join("/"); // getting the string of the date of 'el'
        const [eventsThisDay, occsThisDay, temporalDistance, weekday] = Logic.getDayData(elDate); // getting this day data
        Visual.renderDayBlock(elDate, eventsThisDay, occsThisDay, temporalDistance, weekday); // rendering hover-activated block on the right
        const dayBlockHeight = parseInt(window.getComputedStyle(document.querySelector(".day-block")).height);
        const dayBlockHeightPercent = (dayBlockHeight / window.innerHeight) * 100;
        if (dayBlockHeightPercent > 84) {
            document.querySelector(".day-block").classList.add("fadedOut");
        }
        Visual.appFieldBlock.classList.add("overflow-hidden"); // if there is a vertical scroll, hide it while hovering over a day
        setTimeout(() => {
            Visual.appFieldBlock.scrollTop = 0; // scrolling to the top of the scrollable container
        }, 300);
    } else {
        // it was a hover in Routines block -- need to get all dates that have this category (here 'el') and highlight them
        const allSuchDates = Logic.getDates(el); // all dates that have this category
        const today = `${new Date().getFullYear()},${new Date().getMonth() + 1},${new Date().getDate()}`; // getting the string of today
        Visual.toggleHighlightToday(today, false); // de-highlighting today
        Visual.toggleHighlightDates(allSuchDates, true); // highlighting all such dates
    }
}

// ================================================================================================

// handle hover-outs over days in Calendar
function handleCalendarHoversOut(actionType, el) {
    if (actionType === `day-block`) {
        Visual.makeDimmer(Visual.appFieldBlock.firstElementChild, "restore"); // removing the dimmer class on what is shown on the right
        Visual.removeDayBlock(); // removing hover-activated block on the right
        Visual.appFieldBlock.classList.remove("overflow-hidden"); // if there is a vertical scroll, hide it while hovering over a day
    } else {
        // it was a hover-out in Routines block -- get all dates that have this category ('el') and de-highlight them
        const allSuchDates = Logic.getDates(el); // all dates that have this category
        const today = `${new Date().getFullYear()},${new Date().getMonth() + 1},${new Date().getDate()}`; // getting the string of today
        Visual.toggleHighlightToday(today, true); // highlighting today
        Visual.toggleHighlightDates(allSuchDates, false); // de-highlighting all such dates
    }
}

// ================================================================================================

// handle hover-ins over days in .app__field
function handleAppfieldHoversIn(dateString) {
    // as i hover in i need to highlight this day in Calendar and make today dimmer
    const calendarEl = document.querySelector(`.calendar [data-date="${dateString}"]`);
    calendarEl.classList.add("highlighted"); // highlighting
    const today = `${new Date().getFullYear()},${new Date().getMonth() + 1},${new Date().getDate()}`;
    Visual.toggleHighlightToday(today, false); // de-highlighting
}

// ================================================================================================

// handle hover-outs over days in .app__field
function handleAppfieldHoversOut(dateString) {
    // as i hover out i need to de-highlight this day in Calendar and make today brighter
    const calendarEl = document.querySelector(`.calendar [data-date="${dateString}"]`);
    calendarEl.classList.remove("highlighted"); // de-highlighting
    const today = `${new Date().getFullYear()},${new Date().getMonth() + 1},${new Date().getDate()}`;
    Visual.toggleHighlightToday(today, true); // highlighting
}

// ================================================================================================

export { handleCalendarHoversIn, handleCalendarHoversOut, handleAppfieldHoversIn, handleAppfieldHoversOut };
