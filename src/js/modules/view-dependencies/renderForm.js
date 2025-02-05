import { Visual } from "../../Controller.js";
import { nextIcon, prevIcon, crossIcon, editIcon, deleteIcon } from "./icons.js";

// ================================================================================================

// general function -- rendering the form to add or edit an event or occurrence
function renderForm(type, animationFlag = true, clickedDate, formType) {
    Visual.removeForm(); // removing before re-rendering

    const div = document.createElement("div");
    div.classList.add("app__form-box", "invisible");

    if (type === "event") div.innerHTML = getEventHtml(clickedDate, formType); // it's either an event
    else div.innerHTML = getOccurrenceHtml(clickedDate, formType); // or occurrence

    Visual.appFieldBlock.appendChild(div);

    if (!animationFlag) return div.classList.remove("invisible"); // no animation

    setTimeout(() => {
        div.classList.remove("invisible"); // some animation
    }, 200);
}

// ================================================================================================

// dependency of 'renderForm' -- getting the html of some event
function getEventHtml(clickedDate, type = "add") {
    const btns =
        type === "add"
            ? `<div class="app__form-switch">
                    <button type="button" class="app__form-switch-btn app__form-switch-btn--event active">Event</button>
                    <button type="button" class="app__form-switch-btn app__form-switch-btn--occurrence">Occurrence</button>
                </div>`
            : "";

    const title = type === "add" ? "Add Event" : "Edit Event";
    const submitBtn = type === "add" ? "Add" : "Edit";
    const formClass = type === "add" ? `app__form--add` : `app__form--edit`;

    return `<form action="#" class="app__form ${formClass}">
            <button class="app__form-btn-close" type="button">${crossIcon}</button>
            <div class="app__form-header">
                <div class="app__form-title">${title}</div>
                <label>A scheduled and specific activity.</label>
                ${btns}
            </div>
            <div class="app__form-input-box">
                <input type="text" class="app__form-input app__form-input--title" placeholder="Title" required />
            </div>
            <div class="app__form-input-box">
                <input type="text" class="app__form-input app__form-input--date" placeholder="Date" required value="${clickedDate}" />
                <input type="text" class="app__form-input app__form-input--time" placeholder="Time (optional)" />
            </div>
            <div class="app__form-input-box">
                <textarea class="app__form-input app__form-input--description" placeholder="Description (optional)"></textarea>
            </div>
            <button class="app__form-btn" type="submit">${submitBtn}</button>
        </form>`;
}

// ================================================================================================

// dependency of 'renderForm' -- getting the html of some occurrence
function getOccurrenceHtml(clickedDate, type = "add") {
    const btns =
        type === "add"
            ? `<div class="app__form-switch">
                    <button type="button" class="app__form-switch-btn app__form-switch-btn--event">Event</button>
                    <button type="button" class="app__form-switch-btn app__form-switch-btn--occurrence active">Occurrence</button>
                </div>`
            : "";

    const title = type === "add" ? "Add Occurrence" : "Edit Occurrence";
    const submitBtn = type === "add" ? "Add" : "Edit";
    const formClass = type === "add" ? `app__form--add` : `app__form--edit`;

    return `<form action="#" class="app__form ${formClass}">
            <button class="app__form-btn-close" type="button">${crossIcon}</button>
            <div class="app__form-header">
                <div class="app__form-title">${title}</div>
                <label>A general thing that happened, an activity or note.</label>
                ${btns}
            </div>
            <div class="app__form-input-box">
                <input type="text" class="app__form-input app__form-input--title" placeholder="Title" required />
            </div>
            <div class="app__form-input-box">
                <input type="text" class="app__form-input app__form-input--date" placeholder="Date" required value="${clickedDate}" />
                <input type="text" class="app__form-input app__form-input--category" placeholder="Category (optional)" />
            </div>
            <div class="app__form-input-box">
                <textarea class="app__form-input app__form-input--description app__form-input--description-occ" placeholder="Description (optional)"></textarea>
            </div>
            <button class="app__form-btn" type="submit">${submitBtn}</button>
        </form>`;
}

// ================================================================================================

export default renderForm;
