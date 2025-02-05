import { Logic } from "../../Controller.js";

// return just day numbers when a day of this month (which is a month that is displayed now) has either an event or occurence
function getThisMonthEventfulDays() {
    const [yearShowing, monthShowing] = Logic.getMonthToShow(); // [2025, 2] -- 2 for February
    const stateEvents = Logic.getEvents();
    const stateOccurrences = Logic.getOccurrences();

    const eventDays =
        stateEvents.length === 0
            ? []
            : stateEvents
                  .filter((eventObj) => {
                      const [date, month, year] = eventObj.date.split("/");
                      if (+month === monthShowing && +year === yearShowing) return date;
                  })
                  .map((obj) => +obj.date.split("/")[0]); // if stateEvents is length 0, return [] -- if not, return only day numbers (dates)

    const occurrenceDays =
        stateOccurrences.length === 0
            ? []
            : stateOccurrences
                  .filter((eventObj) => {
                      const [date, month, year] = eventObj.date.split("/");
                      if (+month === monthShowing && +year === yearShowing) return date;
                  })
                  .map((obj) => +obj.date.split("/")[0]); // same here

    return [eventDays, occurrenceDays];
}

export default getThisMonthEventfulDays;
