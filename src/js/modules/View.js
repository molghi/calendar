// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

import { renderMonth } from "./view-dependencies/renderMethods.js";
import { handleCalendarClicks } from "./view-dependencies/eventHandlers.js";

class View {
    constructor() {
        this.calendarBlock = document.querySelector(".calendar");
    }

    // ================================================================================================

    // show an element
    show = (el) => el.classList.remove("hidden");

    // hide an element
    hide = (el) => el.classList.add("hidden");

    // ================================================================================================

    // render the month element in .calendar
    renderMonth(arr) {
        renderMonth(arr);
    }

    // ================================================================================================

    // handle clicks in .calendar
    handleCalendarClicks(handler) {
        handleCalendarClicks(handler);
    }
}

export default View;
