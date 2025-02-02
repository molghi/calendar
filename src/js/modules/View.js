// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

import { renderMonth, renderForm } from "./view-dependencies/renderMethods.js";
import { handleCalendarClicks, handleNonCalendarClicks, handleFormSubmission } from "./view-dependencies/eventHandlers.js";

class View {
    constructor() {
        this.calendarBlock = document.querySelector(".calendar");
        this.appFieldBlock = document.querySelector(".app__field");
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

    renderForm(type, animationFlag, clickedDate) {
        renderForm(type, animationFlag, clickedDate);
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
}

export default View;
