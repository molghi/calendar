import { Visual } from "../../Controller.js";

// ================================================================================================

// handle clicks in .calendar
function handleCalendarClicks(handler) {
    Visual.calendarBlock.addEventListener("click", function (e) {
        if (e.target.closest(".calendar__header-btn")) {
            // it was a click in calendar-header: on the prev or next btn to show next/prev month
            // const btns = [...document.querySelectorAll(".calendar__header-btn")];
            if (document.querySelector("form")) return; // btns.forEach((btn) => btn.classList.add("no-hover")); // if there is a form, you cannot view any other month
            // btns.forEach((btn) => btn.classList.remove("no-hover"));
            const btn = e.target.closest(".calendar__header-btn");
            const btnType = btn.classList.contains("calendar__header-btn--next") ? "next" : "prev";
            handler(btnType);
        }

        if (e.target.closest(".calendar__now-btn")) {
            // it was a click on 'Back to Now' btn
            // const btn = document.querySelector(".calendar__now-btn");
            if (document.querySelector("form")) return; // btn.classList.add("no-hover"); // if there is a form, you cannot jump back to now
            // btn.classList.remove("no-hover");
            const btnType = "now";
            handler(btnType);
        }

        if (e.target.closest(".calendar__day")) {
            // it was a click on some day element
            const btnType = "dayClick";
            const el = e.target.closest(".calendar__day");
            handler(btnType, el);
        }
    });
}

// ================================================================================================

// handle hover-ins over days in Calendar
function handleCalendarHoversIn(handler) {
    Visual.calendarBlock.addEventListener("mouseover", function (e) {
        if (e.target.closest(".routines__list-item-title")) {
            // it was a hover in Routines block
            const text = e.target.closest(".routines__list-item-title").textContent.trim().toLowerCase();
            handler("habits", text);
            return;
        }

        if (!e.target.closest(".calendar__day")) return;
        if (e.target.closest(".calendar__day").classList.contains("calendar__day--empty")) return; // do nothing if it's an empty day
        // it was a hover over some day in Calendar
        const hoveredDayEl = e.target.closest(".calendar__day");
        handler("day-block", hoveredDayEl);
    });
}

// ================================================================================================

// handle hover-outs over days in Calendar
function handleCalendarHoversOut(handler) {
    Visual.calendarBlock.addEventListener("mouseout", function (e) {
        if (e.target.closest(".routines__list-item-title")) {
            // it was a hover-out in Routines block
            const text = e.target.closest(".routines__list-item-title").textContent.trim().toLowerCase();
            handler("habits", text);
            return;
        }

        if (!e.target.closest(".calendar__day")) return;
        if (e.target.closest(".calendar__day").classList.contains("calendar__day--empty")) return; // do nothing if it's an empty day
        // it was a hover-out over some day in Calendar
        const hoveredDayEl = e.target.closest(".calendar__day");
        handler("day-block", hoveredDayEl);
    });
}

// ================================================================================================

// handle clicks in .app__field which is where the form or the Events This Month block is
function handleNonCalendarClicks(handler) {
    Visual.appFieldBlock.addEventListener("click", function (e) {
        if (e.target.closest(".app__form-switch-btn")) {
            // it was a click on form switch btns: show Event or Occurrence form (adding)
            const clickedBtnType = e.target.textContent.trim().toLowerCase();
            handler(clickedBtnType);
        }

        if (e.target.closest(".app__form-btn-close")) {
            // it was a click to close the form
            handler(`close`);
        }

        if (e.target.closest(".ev-occ__switch-btn")) {
            // it was a click on Events/Occurences btns, in the block to the right from Calendar, to show all Events/Occs This Month
            const clickedBtnType = e.target.textContent.trim().toLowerCase();
            handler(clickedBtnType);
        }

        if (e.target.closest(".ev-occ__item-btn--delete")) {
            // it was a click to delete one entry: event or occurence
            const entryEl = e.target.closest(".ev-occ__item");
            handler(`delete`, entryEl);
        }

        if (e.target.closest(".ev-occ__item-btn--edit")) {
            // it was a click to edit one entry: event or occurence
            const entryEl = e.target.closest(".ev-occ__item");
            handler(`edit`, entryEl);
        }
    });
}

// ================================================================================================

// handle form submission (when adding or editing things)
function handleFormSubmission(handler) {
    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        const formType = this.classList.contains("app__form--edit") ? "editForm" : "addForm"; // determining if it was the edit form or the add form
        const [values, type] = Visual.readInputs(); // reading the current input values
        handler(values, type, formType);
    });
}

// ================================================================================================

// handle hover-ins in .app__field
function handleAppfieldHoversIn(handler) {
    Visual.appFieldBlock.addEventListener("mouseover", function (e) {
        if (e.target.closest(".ev-occ__item")) {
            const item = e.target.closest(".ev-occ__item"); // what item/element was hovered over
            handler(item.dataset.date);
        }
    });
}

// ================================================================================================

// handle hover-outs in .app__field
function handleAppfieldHoversOut(handler) {
    Visual.appFieldBlock.addEventListener("mouseout", function (e) {
        if (e.target.closest(".ev-occ__item")) {
            const item = e.target.closest(".ev-occ__item"); // what item/element was hovered out
            handler(item.dataset.date);
        }
    });
}

// ================================================================================================

// handling clicks in .actions
function handleActionClicks(handler) {
    Visual.actionsBlock.addEventListener("click", function (e) {
        if (e.target.closest(".actions__action")) {
            const type = e.target.closest(".actions__action").textContent.trim().toLowerCase(); // what button was clicked
            handler(type);
        }
    });
}

// ================================================================================================

// reacting to file import
function reactToFileInput(handler) {
    Visual.inputFileEl.addEventListener("change", handler);
}

// ================================================================================================

export {
    handleCalendarClicks,
    handleNonCalendarClicks,
    handleFormSubmission,
    handleCalendarHoversIn,
    handleCalendarHoversOut,
    handleAppfieldHoversIn,
    handleAppfieldHoversOut,
    handleActionClicks,
    reactToFileInput,
};
