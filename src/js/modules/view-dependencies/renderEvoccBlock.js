import { Visual } from "../../Controller.js";
import { nextIcon, prevIcon, crossIcon, editIcon, deleteIcon } from "./icons.js";

// ================================================================================================

// evocc - EVents-OCCurrences; in .app__field  -- rendering all events or all occurences for the showing month
function renderEvoccBlock(type = "events", data) {
    Visual.removeEventsOccurrences(); // removing before re-rendering

    const div = document.createElement("div");
    div.classList.add("ev-occ");
    let html;

    if (type === "events") html = returnEventsBlock(data); // either events
    else html = returnOccurencesBlock(data); // or occurrences

    div.innerHTML = html;
    Visual.appFieldBlock.appendChild(div);
}

// ================================================================================================

// dependency of 'renderEvoccBlock' -- returning the html of all events
function returnEventsBlock(data) {
    let toRender;

    if (data.length === 0) {
        toRender = `<div class="ev-occ__msg">No entries yet...</div><div class="ev-occ__hint">Click on a day to add one</div>`;
    } else {
        toRender = data
            .map((eventObj) => {
                const desc = !eventObj.description
                    ? ""
                    : `<div class="ev-occ__item-row">
                        <div>
                            <span class="ev-occ__item-description" title="${eventObj.description}"><span class="ev-occ__item-minor-title">Note: </span>${eventObj.description}</span>
                            </div>
                        </div>`;
                const time = !eventObj.time ? "" : `<span class="ev-occ__item-time"> at ${eventObj.time}</span>`;

                return `<div data-date="${eventObj.date.split("/").reverse().join(",")}" class="ev-occ__item">
                        <div class="ev-occ__item-btns">
                            <button title="Edit" class="ev-occ__item-btn ev-occ__item-btn--edit">${editIcon}</button>
                            <button title="Delete" class="ev-occ__item-btn ev-occ__item-btn--delete">${deleteIcon}</button>
                        </div>
                        <div class="ev-occ__item-row">
                            <span class="ev-occ__item-title" title="${eventObj.title}">${eventObj.title}</span>
                        </div>
                        <div class="ev-occ__item-row">
                        <div>
                            <span class="ev-occ__item-minor-title">Date: </span>
                            <span class="ev-occ__item-date">${eventObj.date}</span>
                            ${time}
                            </div>
                        </div>
                        ${desc}
                    </div>`;
            })
            .join("");
    }

    return `<div class="ev-occ__box">
            <div class="ev-occ__title">Events This Month<span title="${data.length} events this month">${data.length}</span></div>
                <div class="ev-occ__switch">
                    <button title="Scheduled and specific activities" class="ev-occ__switch-btn ev-occ__switch-btn--ev active">Events</button>
                    <button title="General things that happened, activities or notes" class="ev-occ__switch-btn ev-occ__switch-btn--occ">Occurrences</button>
                </div>
            </div>
                <div class="ev-occ__items">
                    ${toRender}
                </div>`;
}

// ================================================================================================

// dependency of 'renderEvoccBlock' -- returning the html of all occurrences
function returnOccurencesBlock(data) {
    let toRender;

    if (data.length === 0) {
        toRender = `<div class="ev-occ__msg">No entries yet...</div><div class="ev-occ__hint">Click on a day to add one</div>`;
    } else {
        toRender = data
            .map((occObj) => {
                const desc = !occObj.description
                    ? ""
                    : `<div class="ev-occ__item-row">
                        <div>
                            <span class="ev-occ__item-description" title="${occObj.description}"><span class="ev-occ__item-minor-title">Note: </span>${occObj.description}</span>
                            </div>
                        </div>`;
                const category = !occObj.category
                    ? ""
                    : `<span class="ev-occ__item-minor-title">Category: </span><span title="${occObj.category}">${occObj.category}</span>`;

                return `<div data-date="${occObj.date.split("/").reverse().join(",")}" class="ev-occ__item">
                            <div class="ev-occ__item-btns">
                                <button title="Edit" class="ev-occ__item-btn ev-occ__item-btn--edit">${editIcon}</button>
                                <button title="Delete" class="ev-occ__item-btn ev-occ__item-btn--delete">${deleteIcon}</button>
                            </div>
                            <div class="ev-occ__item-row">
                                <span class="ev-occ__item-title" title="${occObj.title}">${occObj.title}</span>
                            </div>
                            <div class="ev-occ__item-row">
                                <div>
                                    <span class="ev-occ__item-minor-title">Date: </span>
                                    <span class="ev-occ__item-date">${occObj.date}</span>
                                </div>
                                <div>
                                    ${category}
                                </div>
                            </div>
                                ${desc}
                        </div>`;
            })
            .join("");
    }

    return `<div class="ev-occ__box">
                <div class="ev-occ__title">Occurrences This Month<span title="${data.length} occurrences this month">${data.length}</span></div>
                    <div class="ev-occ__switch">
                        <button title="Scheduled and specific activities" class="ev-occ__switch-btn ev-occ__switch-btn--ev">Events</button>
                        <button title="General things that happened, activities or notes" class="ev-occ__switch-btn ev-occ__switch-btn--occ active">Occurrences</button>
                    </div>
                </div>
                    <div class="ev-occ__items">
                    ${toRender}
                    </div>`;
}

// ================================================================================================

export default renderEvoccBlock;
