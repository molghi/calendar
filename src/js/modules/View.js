// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

import { renderDayBlock, renderMonth, renderForm, renderEvoccBlock, renderMessage, renderRoutinesBlock } from "./view-dependencies/renderMethods.js";
import {
    handleCalendarClicks,
    handleNonCalendarClicks,
    handleFormSubmission,
    handleCalendarHoversIn,
    handleCalendarHoversOut,
    handleAppfieldHoversIn,
    handleAppfieldHoversOut,
    handleActionClicks,
    reactToFileInput,
} from "./view-dependencies/eventHandlers.js";

// import KeyCommands from './view-dependencies/keyCommands.js'
import listenKeys from "./view-dependencies/keyCommands.js";

class View {
    constructor() {
        this.calendarBlock = document.querySelector(".calendar");
        this.appFieldBlock = document.querySelector(".app__field");
        this.containerEl = document.querySelector(".container");
        this.actionsBlock = document.querySelector(".actions");
        this.inputFileEl = document.querySelector(".importer");
        this.clickedDay = "";
        this.formIsShown = false;
        this.colors = ["green", "orange", "yellow", "red", "purple", "brown", "blue", "pink", "lightgreen", "peachpuff"];
        this.colorCounter = 0;
    }

    // ================================================================================================

    setClickedDay = (value) => (this.clickedDay = value);
    getClickedDay = () => this.clickedDay;

    getColors = () => this.colors;

    // ================================================================================================

    // show an element
    show = (el) => el.classList.remove("hidden");

    // hide an element
    hide = (el) => el.classList.add("hidden");

    // ================================================================================================

    // render the month element in .calendar
    renderMonth(arr, arrEventfulDays, eventDaysArr, occDaysArr) {
        renderMonth(arr, arrEventfulDays, eventDaysArr, occDaysArr);
    }

    // ================================================================================================

    // handle clicks in .calendar
    handleCalendarClicks(handler) {
        handleCalendarClicks(handler);
    }

    // ================================================================================================

    // handle clicks in .app__field
    handleNonCalendarClicks(handler) {
        handleNonCalendarClicks(handler);
    }

    // ================================================================================================

    renderForm(type, animationFlag, clickedDate, formType) {
        renderForm(type, animationFlag, clickedDate, formType);
        setTimeout(() => {
            document.querySelector(".app__form-input--title").focus();
        }, 250);
    }

    // ================================================================================================

    handleFormSubmission(handler) {
        handleFormSubmission(handler);
    }

    // ================================================================================================

    readInputs() {
        const allInputs = [...document.querySelectorAll("form .app__form-input")];
        const values = allInputs.map((el) => el.value);
        const type = document.querySelector(".app__form-title").textContent.toLowerCase().trim().split(" ")[1];
        return [values, type];
    }

    // ================================================================================================

    removeForm() {
        if (document.querySelector(".app__form-box")) document.querySelector(".app__form-box").remove();
    }

    // ================================================================================================

    renderEventsOccurrences(type, data) {
        renderEvoccBlock(type, data);
    }

    // ================================================================================================

    removeEventsOccurrences() {
        if (document.querySelector(".ev-occ")) document.querySelector(".ev-occ").remove();
    }

    // ================================================================================================

    // when editing: putting the data of the clicked ev/occ in the fields of that Edit form
    populateForm(obj) {
        document.querySelector(".app__form-input--title").value = obj.title;
        document.querySelector(".app__form-input--date").value = obj.date;
        if (obj.time) document.querySelector(".app__form-input--time").value = obj.time;
        if (obj.category) document.querySelector(".app__form-input--category").value = obj.category;
        if (obj.description) document.querySelector(".app__form-input--description").value = obj.description;
    }

    // ================================================================================================

    showMessage(type, text) {
        renderMessage(type, text);
    }

    // ================================================================================================

    removeMessages() {
        if (document.querySelector(".message")) document.querySelector(".message").remove();
    }

    // ================================================================================================

    handleCalendarHoversIn(handler) {
        handleCalendarHoversIn(handler);
    }

    // ================================================================================================

    handleCalendarHoversOut(handler) {
        handleCalendarHoversOut(handler);
    }

    // ================================================================================================

    makeDimmer(el, flag = "dimmer") {
        if (flag === "dimmer") {
            // making the 'el' dimmer
            // el.classList.add("dimmer");
            el.classList.add("invisible");
        } else {
            // restoring the state
            // el.classList.remove("dimmer");
            el.classList.remove("invisible");
        }
    }

    // ================================================================================================

    renderDayBlock(date, eventsThisDay, occsThisDay, tempDist, weekday) {
        renderDayBlock(date, eventsThisDay, occsThisDay, tempDist, weekday);
    }

    // ================================================================================================

    removeDayBlock() {
        if (document.querySelector(".day-block__box")) document.querySelector(".day-block__box").remove();
    }

    // ================================================================================================

    setFormIsShown() {
        this.formIsShown = !this.formIsShown;
        if (this.formIsShown) {
            document.querySelector(".calendar__days").classList.add("no-hover");
        } else {
            document.querySelector(".calendar__days").classList.remove("no-hover");
        }
    }

    // ================================================================================================

    renderRoutinesBlock(data) {
        renderRoutinesBlock(data);
    }

    // ================================================================================================

    toggleHighlightToday(todayString, toggleBooleanFlag) {
        const todayEl = document.querySelector(`.calendar [data-date="${todayString}"]`);
        if (!toggleBooleanFlag) {
            // de-highlight
            // todayEl.classList.remove("calendar__day--today");
            todayEl.classList.add("dimmer");
        } else {
            // highlight
            // todayEl.classList.add("calendar__day--today");
            todayEl.classList.remove("dimmer");
        }
    }

    // ================================================================================================

    toggleHighlightDates(dataArr, toggleBooleanFlag) {
        const allDayEls = [...document.querySelectorAll(".calendar__day")];
        const neededEls = allDayEls.filter((el) => dataArr.includes(el.dataset.date));
        if (toggleBooleanFlag) {
            // highlight
            neededEls.forEach((el) => el.classList.add("highlighted"));
        } else {
            // de-highlight
            neededEls.forEach((el) => el.classList.remove("highlighted"));
        }
    }

    // ================================================================================================

    handleAppfieldHoversIn(handler) {
        handleAppfieldHoversIn(handler);
    }

    handleAppfieldHoversOut(handler) {
        handleAppfieldHoversOut(handler);
    }
    // ================================================================================================

    listenKeys(handler) {
        listenKeys(handler);
    }

    // ================================================================================================

    updateDocTitle(value) {
        let [dateString, eventsNum, occsNum] = value;
        // const events = eventsNum === 0 ? "" : `, E: ${eventsNum}`;
        // const occs = occsNum === 0 ? "" : `, O: ${occsNum}`;
        // document.title = `Calendar — ${dateString}${events}${occs}`;

        if (eventsNum > 0 || occsNum > 0) {
            document.title = `Calendar - ${dateString} - Today: 1${eventsNum + occsNum}`;
        } else document.title = `Calendar — ${dateString}`;
    }

    // ================================================================================================

    handleActionClicks(handler) {
        handleActionClicks(handler);
    }

    // ================================================================================================

    // changing the accent colour
    changeAccentColor(color) {
        document.documentElement.style.setProperty("--accent", color);
    }

    // ================================================================================================

    reactToFileInput(handler) {
        reactToFileInput(handler);
    }

    // ================================================================================================
}

export default View;
