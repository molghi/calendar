// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

// importing dependencies:
import { renderMessage, renderRoutinesBlock } from "./view-dependencies/renderMethods.js";
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
import listenKeys from "./view-dependencies/keyCommands.js";
import renderMonth from "./view-dependencies/renderMonth.js";
import renderForm from "./view-dependencies/renderForm.js";
import renderEvoccBlock from "./view-dependencies/renderEvoccBlock.js";
import renderDayBlock from "./view-dependencies/renderDayBlock.js";

// ================================================================================================

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

    // getting and setting the clicked day
    setClickedDay = (value) => (this.clickedDay = value);
    getClickedDay = () => this.clickedDay;

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

    // rendering the form to add an event or occurrence
    renderForm(type, animationFlag, clickedDate, formType) {
        renderForm(type, animationFlag, clickedDate, formType);

        setTimeout(() => {
            document.querySelector(".app__form-input--title").focus();
        }, 250);
    }

    // ================================================================================================

    // handle form submission (when adding events)
    handleFormSubmission(handler) {
        handleFormSubmission(handler);
    }

    // ================================================================================================

    // reading the current values of the inputs in the shown form
    readInputs() {
        const allInputs = [...document.querySelectorAll("form .app__form-input")];
        const values = allInputs.map((el) => el.value);
        const type = document.querySelector(".app__form-title").textContent.toLowerCase().trim().split(" ")[1]; // defining the type: event or occurrence
        return [values, type];
    }

    // ================================================================================================

    // removing form
    removeForm() {
        if (document.querySelector(".app__form-box")) document.querySelector(".app__form-box").remove();
    }

    // ================================================================================================

    // rendering Events/Occurrences block on the right
    renderEventsOccurrences(type, data) {
        renderEvoccBlock(type, data);
    }

    // ================================================================================================

    // removing Events/Occurrences block on the right
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

    // showing UI msg: success or error
    showMessage(type, text) {
        renderMessage(type, text);
    }

    // ================================================================================================

    // removing UI msg
    removeMessages() {
        if (document.querySelector(".message")) document.querySelector(".message").remove();
    }

    // ================================================================================================

    // handling hover-ins in Calendar
    handleCalendarHoversIn(handler) {
        handleCalendarHoversIn(handler);
    }

    // ================================================================================================

    // handling hover-outs in Calendar
    handleCalendarHoversOut(handler) {
        handleCalendarHoversOut(handler);
    }

    // ================================================================================================

    // making an element dimmer
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

    // rendering hover-activated day-block
    renderDayBlock(date, eventsThisDay, occsThisDay, tempDist, weekday) {
        renderDayBlock(date, eventsThisDay, occsThisDay, tempDist, weekday);
    }

    // ================================================================================================

    // removing hover-activated day-block
    removeDayBlock() {
        if (document.querySelector(".day-block__box")) document.querySelector(".day-block__box").remove();
    }

    // ================================================================================================

    // setting boolean for 'is a form shown?'
    setFormIsShown() {
        this.formIsShown = !this.formIsShown;
        // if a form is shown, Calendar receives the no-hover class and no hover-activated block will be rendered
        if (this.formIsShown) document.querySelector(".calendar__days").classList.add("no-hover");
        else document.querySelector(".calendar__days").classList.remove("no-hover");
    }

    // ================================================================================================

    // rendering Routines block
    renderRoutinesBlock(data) {
        renderRoutinesBlock(data);
    }

    // ================================================================================================

    // highlighting or de-highlighting today day in Calendar
    toggleHighlightToday(todayString, toggleBooleanFlag) {
        const todayEl = document.querySelector(`.calendar [data-date="${todayString}"]`);
        if (!toggleBooleanFlag) {
            // de-highlight or make dimmer
            // todayEl.classList.remove("calendar__day--today");
            todayEl.classList.add("dimmer");
        } else {
            // highlight or remove dimmer
            // todayEl.classList.add("calendar__day--today");
            todayEl.classList.remove("dimmer");
        }
    }

    // ================================================================================================

    // highlighting or de-highlighting specific days in Calendar
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

    // handling hover-ins in .app__field
    handleAppfieldHoversIn(handler) {
        handleAppfieldHoversIn(handler);
    }

    // handling hover-outs in .app__field
    handleAppfieldHoversOut(handler) {
        handleAppfieldHoversOut(handler);
    }
    // ================================================================================================

    // listening to specific key presses (hotkeys)
    listenKeys(handler) {
        listenKeys(handler);
    }

    // ================================================================================================

    // updating document title
    updateDocTitle(value) {
        let [dateString, eventsNum, occsNum] = value;
        if (eventsNum > 0 || occsNum > 0) {
            document.title = `Calendar - ${dateString} - Today: 1${eventsNum + occsNum}`;
        } else document.title = `Calendar — ${dateString}`;
    }

    // ================================================================================================

    // handling clicks in .actions
    handleActionClicks(handler) {
        handleActionClicks(handler);
    }

    // ================================================================================================

    // changing the accent colour
    changeAccentColor(color) {
        document.documentElement.style.setProperty("--accent", color);
    }

    // ================================================================================================

    // reacting to file input/import -- calling the callback then
    reactToFileInput(handler) {
        reactToFileInput(handler);
    }
}

export default View;
