import { Visual } from "../../Controller.js";

// ================================================================================================

// rendering a success/error/notification msg
function renderMessage(type, text) {
    Visual.removeMessages(); // removing before re-rendering

    const div = document.createElement("div");
    const typeClass = type === "success" ? "success" : type === "notification" ? "notification" : "error"; // determining the type
    div.classList.add("message", "invisible", "moved-down", typeClass);
    div.innerHTML = `<div>${text}</div>`;
    Visual.containerEl.appendChild(div);

    setTimeout(() => {
        div.classList.remove("invisible", "moved-down"); // some animation
    }, 300);

    if (type === "error") {
        setTimeout(() => {
            Visual.removeMessages(); // if it's an error msg, it stays longer before getting removed
        }, 10000);
    } else {
        setTimeout(() => {
            Visual.removeMessages();
        }, 3000);
    }
}

// ================================================================================================

// rendering the Routines block
function renderRoutinesBlock(data) {
    const [map, daysInThisMonth] = data;
    if (document.querySelector(".routines")) document.querySelector(".routines").remove(); // removing before re-rendering
    const div = document.createElement("div");
    div.classList.add("routines");

    // getting the needed html:
    const activitiesHtml = Object.keys(map).map((key) => {
        const title = key[0].toUpperCase() + key.slice(1).toLowerCase(); // capitalising
        const times = map[key];
        const percent = (times / daysInThisMonth) * 100; // calc-ing percentage
        return `<li class="routines__list-item">
                    <span class="routines__list-item-title">${title}</span> — <span>${times} out of ${daysInThisMonth} days (${percent.toFixed()}%)</span>
                </li>`;
    });

    // content can be two things depending on 'map'
    const content =
        Object.keys(map).length === 0
            ? `<div class="routines__msg">Repeated activities (occurrences with set categories) will appear here</div>`
            : `<ol class="routines__list">
                ${activitiesHtml.join("")}
              </ol>`;

    div.innerHTML = `<div class="routines__title">Routines This Month:</div>${content}`;

    Visual.calendarBlock.appendChild(div);
}

// ================================================================================================

export { renderMessage, renderRoutinesBlock };
