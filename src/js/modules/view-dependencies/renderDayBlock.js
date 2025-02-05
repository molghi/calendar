import { Visual } from "../../Controller.js";

// ================================================================================================

// rendering hover-activated day block
function renderDayBlock(date, eventsThisDay, occsThisDay, tempDist, weekday) {
    Visual.removeDayBlock(); // removing before re-rendering

    const div = document.createElement("div");
    div.classList.add("day-block__box", "invisible");

    const dateHtml = getDateInfo(tempDist);

    const eventsHtml = getEventsHtml(eventsThisDay);

    const occsHtml = getOccurrencesHtml(occsThisDay);

    div.innerHTML = `<div class="day-block">
                        <div class="day-block__info">Day Info</div>
                        <div class="day-block__percent">${tempDist[6]}% of ${date.slice(-4)}</div>
                            <div class="day-block__row">
                                <div class="day-block__date"><span>${date}</span><span>(${weekday})</span></div>
                                <div class="day-block__temp">${dateHtml}</div>
                            </div>
                            <div class="day-block__events">
                                <div class="day-block__events-title">Events: <span>${
                                    eventsHtml[0] === `<div class="day-block__msg">No entries</div>` ? 0 : eventsHtml.length
                                }</span></div>
                                ${eventsHtml.join("")}
                            </div>
                            <div class="day-block__occurrences">
                                <div class="day-block__occurrences-title">Occurrences: <span>${
                                    occsHtml[0] === `<div class="day-block__msg">No entries</div>` ? 0 : occsHtml.length
                                }</span></div>
                                ${occsHtml.join("")}
                            </div>
                        </div>`;
    Visual.appFieldBlock.appendChild(div);

    setTimeout(() => {
        div.classList.remove("invisible"); // some animation
    }, 100);
}

// ================================================================================================

// dependency of 'renderDayBlock' -- a smaller func
function getEventsHtml(eventsThisDay) {
    // if eventsThisDay.length is 0, show "No Entries"
    return eventsThisDay.length === 0
        ? [`<div class="day-block__msg">No entries</div>`]
        : eventsThisDay.map((eventObj) => {
              const timeHtml = !eventObj.time ? "" : `<div class="day-block__event-time">${eventObj.time}</div>`;
              const descHtml = !eventObj.description ? "" : `<div class="day-block__event-description">${eventObj.description}</div>`;
              return `<div class="day-block__event">
                                <div class="day-block__event-title">${eventObj.title}</div>
                                ${timeHtml}
                                ${descHtml}
                            </div>`;
          });
}

// ================================================================================================

// dependency of 'renderDayBlock' -- a smaller func
function getOccurrencesHtml(occsThisDay) {
    // if occsThisDay.length is 0, show "No Entries"
    return occsThisDay.length === 0
        ? [`<div class="day-block__msg">No entries</div>`]
        : occsThisDay.map((occObj) => {
              const catHtml = !occObj.category ? "" : `<div class="day-block__occurrence-category">${occObj.category}</div>`;
              const descHtml = !occObj.description ? "" : `<div class="day-block__occurrence-description">${occObj.description}</div>`;
              return `<div class="day-block__occurrence">
                                <div class="day-block__occurrence-title">${occObj.title}</div>
                                ${catHtml}
                                ${descHtml}
                            </div>`;
          });
}

// ================================================================================================

// dependency of 'renderDayBlock' -- shows how many days ago or in how many days some date is
function getDateInfo(tempDist) {
    let [daysRaw, years, months, weeks, days, intervalObj] = tempDist; // temporal distance
    let result = "";

    if (daysRaw === 0) result = "Today";

    // FUTURE DATES:
    if (daysRaw === 1) result = `Tomorrow`;
    if (daysRaw > 1 && daysRaw <= 10) result = `in ${daysRaw} days`; // if days are more than 1 and up to 10

    if (daysRaw > 10) {
        let weeksWord = weeks === 1 ? "week" : "weeks";
        let daysWord = days === 1 ? "day" : "days";
        let daysPhrase = days === 0 ? "" : `, ${days} ${daysWord}`;
        result = `in ${daysRaw} days (${weeks} ${weeksWord}${daysPhrase})`; // if more than 10

        if (intervalObj.months > 0) {
            const dayWord = intervalObj.days === 1 ? "day" : "days";
            const monthWord = intervalObj.months === 1 ? "month" : "months";
            const days = intervalObj.days === 0 || !intervalObj.days ? "" : `, ${intervalObj.days} ${dayWord}`;
            result = `in ${daysRaw} days (${intervalObj.months} ${monthWord}${days})`;
            if (intervalObj.days > 14) {
                const monthWord = intervalObj.months === 1 ? "more than a month and a half" : `more than ${intervalObj.months} and a half months`;
                result = `in ${daysRaw} days (${monthWord})`;
            }
        }

        if (intervalObj.years > 0) {
            const years = intervalObj.years;
            const yearsWord = years === 1 ? "year" : "years";
            const months = !intervalObj.months ? "" : `, ${intervalObj.months} ${intervalObj.months === 1 ? "month" : "months"}`;
            const days = !intervalObj.days ? "" : `, ${intervalObj.days} ${intervalObj.days === 1 ? "day" : "days"}`;
            result = `in ${years} ${yearsWord}${months}${days}`;
        }
    }

    // PAST DATES:
    if (daysRaw === -1) result = `Yesterday`;
    if (daysRaw < -1 && daysRaw >= -10) result = `${Math.abs(daysRaw)} days ago`; // no more than 10 days ago

    if (daysRaw < -10) {
        const weeksWord = Math.abs(weeks) === 1 ? "week" : "weeks";
        const daysWord = Math.abs(days) === 1 ? "day" : "days";
        let daysPhrase = Math.abs(days) === 0 ? "" : `, ${Math.abs(days)} ${daysWord}`;
        result = `${Math.abs(daysRaw)} days ago (${Math.abs(weeks)} ${weeksWord}${daysPhrase})`; // more than 10 days ago

        if (Math.abs(intervalObj.months) > 0) {
            const dayWord = Math.abs(intervalObj.days) === 1 ? "day" : "days";
            const monthWord = Math.abs(intervalObj.months) === 1 ? "month" : "months";
            const days = intervalObj.days === 0 || !intervalObj.days ? "" : `, ${Math.abs(intervalObj.days)} ${dayWord}`;
            result = `${Math.abs(daysRaw)} days ago (${Math.abs(intervalObj.months)} ${monthWord}${days})`;
            if (Math.abs(intervalObj.days) > 14) {
                const monthWord =
                    Math.abs(intervalObj.months) === 1
                        ? "more than a month and a half"
                        : `more than ${Math.abs(intervalObj.months)} and a half months`;
                result = `${Math.abs(daysRaw)} days ago (${monthWord})`;
            }
        }

        if (Math.abs(intervalObj.years) > 0) {
            const years = Math.abs(intervalObj.years);
            const yearsWord = years === 1 ? "year" : "years";
            const months = !intervalObj.months ? "" : `, ${Math.abs(intervalObj.months)} ${Math.abs(intervalObj.months) === 1 ? "month" : "months"}`;
            const days = !intervalObj.days ? "" : `, ${Math.abs(intervalObj.days)} ${Math.abs(intervalObj.days) === 1 ? "day" : "days"}`;
            result = `${years} ${yearsWord}${months}${days} ago`;
        }
    }

    return result;
}

// ================================================================================================

export default renderDayBlock;
