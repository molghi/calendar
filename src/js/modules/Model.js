// Model is responsible for all logic in the app: all computations, calculations, and data operations

import LS from "./model-dependencies/localStorage.js";

class Model {
    #state = {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        nowDate: [],
        monthToShow: [],
        hourlyTimer: "",
        data: {
            events: [],
            occurrences: [],
        },
    };

    constructor() {
        this.fetchEventOccurrences(); // fetching from LS
        console.log(this.#state);
    }

    // ================================================================================================

    // get the arrays of events and occurences
    getData = () => this.#state.data; // both arrays
    getEvents = () => this.#state.data.events;
    getOccurrences = () => this.#state.data.occurrences;

    // ================================================================================================

    // filtering events saved to state: getting only those that are equal to month-year now shown
    getEventsByMonth() {
        const [yearNowRendered, monthNowRendered] = this.getMonthToShow();
        const filtered = this.#state.data.events.filter((eventObj) => {
            const [date, month, year] = eventObj.date.split("/");
            if (+year === yearNowRendered && +month === monthNowRendered) return eventObj;
        });
        return filtered;
    }

    // ================================================================================================

    // filtering occurrences saved to state: getting only those that are equal to month-year now shown
    getOccurrencesByMonth() {
        const [yearNowRendered, monthNowRendered] = this.getMonthToShow();
        const filtered = this.#state.data.occurrences.filter((occObj) => {
            const [date, month, year] = occObj.date.split("/");
            if (+year === yearNowRendered && +month === monthNowRendered) return occObj;
        });
        return filtered;
    }

    // ================================================================================================

    // the current date
    setNowDate = (value) => (this.#state.nowDate = value); // value is [year, month, date]
    getNowDate = () => this.#state.nowDate;

    // ================================================================================================

    // the month that is now rendered
    setMonthToShow = (value) => (this.#state.monthToShow = value); // value is [yr, mth]
    getMonthToShow = () => this.#state.monthToShow;

    // ================================================================================================

    // get the now time
    getNowTime() {
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
    defineYearTime(monthNum) {
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
    calcMonth(setYear, setMonth) {
        let [now, year, month, date, weekday, hours, minutes] = this.getNowTime();
        if (setYear && setMonth) {
            // setting custom params, overwriting defaults
            year = setYear;
            month = setMonth;
        }
        const daysInThisMonth = new Date(year, month, 1 - 1).getDate(); // month here is next month; '1 - 1' means get the first day of the next month and subtract one = prev mth last day
        const monthWord = this.#state.months[month - 1];
        const yearTime = this.defineYearTime(month);
        return [now, year, month, date, weekday, hours, minutes, daysInThisMonth, monthWord, yearTime];
    }

    // ================================================================================================

    // start the hourly timer
    everyHourTimer(handler) {
        this.stopHourlyTimer(); // stop the hourly timer

        this.#state.hourlyTimer = setInterval(() => {
            handler();
        }, 1000 * 60 * 60);
        // }, 3000); // test
    }

    // ================================================================================================

    // stop the hourly timer
    stopHourlyTimer = () => clearInterval(this.#state.hourlyTimer);

    // ================================================================================================

    // validating form input
    validateInput(inputValuesArr, type) {
        /* NOTE:
            Add form: event: title, date, time, desc
            Add form: occurr: title, date, category, desc
            title is a must (can contain nums or letters)
            date is a must (can contain only nums, dots or slashes)
            time is optional (can contain only nums and ':')
            desc is optional (can contain whatever)
            category is optional (can contain nums or letters)   */
        let isValidated = true;
        let message = "All clear";
        let [title, date, variable, desc] = inputValuesArr; // 'variable' can be either 'time' or 'category', depends on the 'type'

        if (title.trim().toLowerCase().length === 0) (isValidated = false), (message = "Title is incorrect");
        if (date.trim().toLowerCase().length === 0) (isValidated = false), (message = "Date is incorrect");

        // using regular expressions with test() to validate each input
        if (!/^[a-zA-Z0-9\s]+$/.test(title)) (isValidated = false), (message = "Title is incorrect");
        if (!/^[0-9./]+$/.test(date)) (isValidated = false), (message = "Date is incorrect");

        // if (type === "event") {
        //     if (!/^[0-9:]+$/.test(variable)) isValidated = false;
        // } else {
        //     if (!/^[a-zA-Z0-9\s]+$/.test(variable)) isValidated = false;
        // }

        let safeValues = {
            title: title.trim().toLowerCase(),
            date: date.trim().toLowerCase(),
            variable: variable.trim().toLowerCase(),
            desc: desc.trim(),
            type: type,
        };

        // console.log(isValidated, safeValues, message);
        return [isValidated, safeValues, message];
    }

    // ================================================================================================

    // adding an event or occurrence
    addEventOccurrence(obj) {
        const { date, desc, title, type, variable } = obj;
        const myObj = {
            date,
            description: desc,
            title,
            added: new Date().toISOString(),
        };
        if (type === "event") {
            myObj.time = variable;
            this.#state.data.events.push(myObj); // pushing to state
        } else {
            // type is occurrence
            myObj.category = variable;
            this.#state.data.occurrences.push(myObj); // pushing to state
        }

        LS.save("calendarData", this.#state.data, "ref"); // pushing to LS; key, value, type = "ref" for reference
    }

    // ================================================================================================

    fetchEventOccurrences() {
        const fetched = LS.get("calendarData", "ref"); // key, type
        if (!fetched) return;
        this.#state.data.events = fetched.events;
        this.#state.data.occurrences = fetched.occurrences;
    }

    // ================================================================================================

    getThisMonthEventfulDays() {
        // return just day numbers when a day of this month (which is a month that is displayed now) has either an event or occurence
        const [yearShowing, monthShowing] = this.#state.monthToShow; // [2025, 2] -- 2 for February
        const stateEvents = this.#state.data.events;
        const stateOccurrences = this.#state.data.occurrences;

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

    // ================================================================================================

    // removing one entry and pushing it to LS
    deleteEntry(type, title, date) {
        console.log(type, title, date);
        if (type === "events") {
            const index = this.getEvents().findIndex((entryObj) => entryObj.title === title && entryObj.date === date); // getting the index
            if (index < 0) return console.error("negative index: not found");
            this.#state.data.events.splice(index, 1); // removing by index
        } else {
            const index = this.getOccurrences().findIndex((entryObj) => entryObj.title === title && entryObj.date === date);
            if (index < 0) return console.error("negative index: not found");
            this.#state.data.occurrences.splice(index, 1);
        }
        LS.save("calendarData", this.#state.data, "ref"); // pushing to LS; key, value, type = "ref" for reference
    }

    // ================================================================================================
}

export default Model;
