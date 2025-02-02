// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

import { renderMonth, renderForm, renderEvoccBlock, renderMessage } from "./view-dependencies/renderMethods.js";
import { handleCalendarClicks, handleNonCalendarClicks, handleFormSubmission } from "./view-dependencies/eventHandlers.js";

class View {
    constructor() {
        this.calendarBlock = document.querySelector(".calendar");
        this.appFieldBlock = document.querySelector(".app__field");
        this.containerEl = document.querySelector(".container");
        this.clickedDay = "";
    }

    // ================================================================================================

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
}

export default View;
