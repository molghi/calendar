import { Visual } from "../../Controller.js";

// ================================================================================================

// handle clicks in .calendar
function handleCalendarClicks(handler) {
    Visual.calendarBlock.addEventListener("click", function (e) {
        // console.log(e.target);

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

        if (e.target.closest(".calendar__day")) {
            // it was a click on some day
            const btnType = "dayClick";
            const el = e.target.closest(".calendar__day");
            handler(btnType, el);
        }
    });
}

// ================================================================================================

// handle clicks in .app__field which is where the form is
function handleNonCalendarClicks(handler) {
    Visual.appFieldBlock.addEventListener("click", function (e) {
        if (e.target.closest(".app__form-switch-btn")) {
            // it was a click on form switch btns: show Event or Occurrence form
            const clickedBtnType = e.target.textContent.trim().toLowerCase();
            handler(clickedBtnType);
        }
        if (e.target.closest(".app__form-btn-close")) {
            // it was a click to close the form
            handler(`close`);
        }
    });
}

// ================================================================================================

// handle form submission (when adding events)
function handleFormSubmission(handler) {
    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        const [values, type] = Visual.readInputs();
        handler(values, type);
    });
}

// ================================================================================================

export { handleCalendarClicks, handleNonCalendarClicks, handleFormSubmission };
