import { Visual } from "../../Controller.js";

// ================================================================================================

// handle clicks in .calendar
function handleCalendarClicks(handler) {
    Visual.calendarBlock.addEventListener("click", function (e) {
        if (e.target.closest(".calendar__header-btn")) {
            // it was a click in calendar-header: on the prev or next btn
            const btn = e.target.closest(".calendar__header-btn");
            const btnType = btn.classList.contains("calendar__header-btn--next") ? "next" : "prev";
            handler(btnType);
        }

        if (e.target.closest(".calendar__now-btn")) {
            // it was a click on 'Back to Now' btn
            const btnType = "now";
            handler(btnType);
        }
    });
}

// ================================================================================================

export { handleCalendarClicks };
