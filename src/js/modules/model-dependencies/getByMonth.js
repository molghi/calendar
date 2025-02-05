import { Logic } from "../../Controller.js";

// filtering events saved to state: getting only those that are equal to month-year now shown
function getEventsByMonth() {
    const [yearNowRendered, monthNowRendered] = Logic.getMonthToShow();
    const filtered = Logic.getData().events.filter((eventObj) => {
        const [date, month, year] = eventObj.date.split("/");
        if (+year === yearNowRendered && +month === monthNowRendered) return eventObj;
    });

    filtered.sort((a, b) => {
        // sorting chronologically
        const [date1, month1, year1] = a.date.split("/");
        const timeOne = new Date(year1, month1 - 1, date1).getTime();
        const [date2, month2, year2] = b.date.split("/");
        const timeTwo = new Date(year2, month2 - 1, date2).getTime();
        return timeOne - timeTwo;
    });

    return filtered;
}

// ================================================================================================

// filtering occurrences saved to state: getting only those that are equal to month-year now shown
function getOccurrencesByMonth() {
    const [yearNowRendered, monthNowRendered] = Logic.getMonthToShow();
    const filtered = Logic.getData().occurrences.filter((occObj) => {
        const [date, month, year] = occObj.date.split("/");
        if (+year === yearNowRendered && +month === monthNowRendered) return occObj;
    });

    filtered.sort((a, b) => {
        // sorting chronologically
        const [date1, month1, year1] = a.date.split("/");
        const timeOne = new Date(year1, month1 - 1, date1).getTime();
        const [date2, month2, year2] = b.date.split("/");
        const timeTwo = new Date(year2, month2 - 1, date2).getTime();
        return timeOne - timeTwo;
    });

    return filtered;
}

// ================================================================================================

export { getEventsByMonth, getOccurrencesByMonth };
