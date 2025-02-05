import { Logic } from "../../Controller.js";
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, intervalToDuration, getDayOfYear } from "date-fns";

// ================================================================================================

// get the now time
function getNowTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const weekday = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return [now, year, month, date, weekday, hours, minutes];
}

// ================================================================================================

// return the time of the year
function defineYearTime(monthNum) {
    switch (monthNum) {
        case 12:
        case 1:
        case 2:
            return "Winter";
        case 3:
        case 4:
        case 5:
            return "Spring";
        case 6:
        case 7:
        case 8:
            return "Summer";
        case 9:
        case 10:
        case 11:
            return "Autumn";
        default:
            return null;
    }
}

// ================================================================================================

// calc how many days are in some month and return other things as well, ready to be rendered
function calcMonth(setYear, setMonth) {
    let [now, year, month, date, weekday, hours, minutes] = getNowTime();
    if (setYear && setMonth) {
        // setting custom params, overwriting defaults
        year = setYear;
        month = setMonth;
    }
    const daysInThisMonth = new Date(year, month, 1 - 1).getDate(); // month here is next month; '1 - 1' means get the first day of the next month and subtract one = prev mth last day
    const monthWord = Logic.getMonths()[month - 1];
    const yearTime = defineYearTime(month);
    return [now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime];
}

// ================================================================================================

// getting some info about some day: if it has events, occurences, the temporal distance between now and this day, and what weekday it is
function getDayData(date) {
    // 'date' is a string like '28/2/2025'
    const eventsThisDay = Logic.getEvents().filter((eventObj) => eventObj.date === date); // getting all events this day
    const occsThisDay = Logic.getOccurrences().filter((occObj) => occObj.date === date); // getting all occurrences this day
    const temporalDistance = calcTemporalDistance(date); // calc-ing temporal distance between now and that day
    const [aDate, month, year] = date.split("/").map((x) => +x);
    const weekdayNum = new Date(year, month - 1, aDate).getDay();
    const weekday = Logic.getWeekdays()[weekdayNum]; // getting the weekday
    return [eventsThisDay, occsThisDay, temporalDistance, weekday];
}

// ================================================================================================

// dependency of 'getDayData' -- calculating the temporal distance between now and some day
function calcTemporalDistance(dateString) {
    const [now, year, month, date, weekday, hours, minutes] = getNowTime();
    const nowDate = new Date(year, month - 1, date, 0, 0, 0);
    const [thenDate, thenMonth, thenYear] = dateString.split("/").map(Number);
    const targetDate = new Date(thenYear, thenMonth - 1, thenDate);

    // calculating differences using the functions of the 'date-fns' 3-rd party library
    let years = differenceInYears(targetDate, nowDate);
    let months = differenceInMonths(targetDate, nowDate) % 12; // remaining months after years
    let totalDays = differenceInDays(targetDate, nowDate);
    let weeks = differenceInWeeks(targetDate, nowDate);
    let days = totalDays % 7; // remaining days after full weeks

    const intervalObj = intervalToDuration({
        start: nowDate,
        end: targetDate,
    });

    const dayOfTheYear = getDayOfYear(new Date(thenYear, thenMonth - 1, thenDate));
    const endOfTheYear = getDayOfYear(new Date(thenYear, 11, 31));
    const yearCompletedPercent = ((dayOfTheYear / endOfTheYear) * 100).toFixed(1);

    return [totalDays, years, months, weeks, days, intervalObj, yearCompletedPercent]; // returning the result as an array
}

// ================================================================================================

export { getNowTime, defineYearTime, calcMonth, getDayData, calcTemporalDistance };
