// Model is responsible for all logic in the app: all computations, calculations, and data operations

// importing dependencies:
import LS from "./model-dependencies/localStorage.js";
import { exportAsJson } from "./model-dependencies/export.js";
import { addEventOccurrence, editEventOccurrence, deleteEntry } from "./model-dependencies/addEditDelete.js";
import validateInput from "./model-dependencies/validate.js";
import { getEventsByMonth, getOccurrencesByMonth } from "./model-dependencies/getByMonth.js";
import getThisMonthEventfulDays from "./model-dependencies/getThisMonthEventfulDays.js";
import filterOccsByCat from "./model-dependencies/filterOccsByCat.js";
import { getNowTime, defineYearTime, calcMonth, getDayData, calcTemporalDistance } from "./model-dependencies/calculations.js";

// ================================================================================================

class Model {
    #state = {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        nowDate: [],
        monthToShow: [new Date().getFullYear(), new Date().getMonth() + 1], // by default (on app start) is the now year and now month; changed later
        hourlyTimer: "",
        data: {
            events: [],
            occurrences: [],
        },
        editingItem: "",
        everyMinTimer: "",
        selectedEventsOrOccurences: "events", // by default (on app start) is events; changed later
        accentColor: "#fd8d64", // changed later
    };

    constructor() {
        this.fetchEventOccurrences(); // fetching from LS
        this.fetchSelectedEventsOrOccurences(); // fetching from LS
        this.fetchAccentColor(); // fetching from LS
    }

    // ================================================================================================

    // get the arrays of events and occurences
    getData = () => this.#state.data; // both arrays
    getEvents = () => this.#state.data.events;
    getOccurrences = () => this.#state.data.occurrences;

    // getting the arrays of month and weekday names
    getMonths = () => this.#state.months;
    getWeekdays = () => this.#state.weekdays;

    // ================================================================================================

    // setting, getting and fetching whichever block is displayed on the right (the last clicked by a user) Events or Occurrences
    setSelectedEventsOrOccurences(value) {
        this.#state.selectedEventsOrOccurences = value; // setting user preference
        LS.save("calendarUserPreference", this.#state.selectedEventsOrOccurences, "prim"); // pushing to LS as a primitive type
    }

    getSelectedEventsOrOccurences = () => this.#state.selectedEventsOrOccurences;

    fetchSelectedEventsOrOccurences() {
        const fetched = LS.get("calendarUserPreference", "prim");
        if (!fetched) return;
        this.#state.selectedEventsOrOccurences = fetched;
    }

    // ================================================================================================

    // filtering events saved to state: getting only those that are equal to month-year now shown
    getEventsByMonth() {
        return getEventsByMonth();
    }

    // ================================================================================================

    // filtering occurrences saved to state: getting only those that are equal to month-year now shown
    getOccurrencesByMonth() {
        return getOccurrencesByMonth();
    }

    // ================================================================================================

    // getting and setting the current date
    setNowDate = (value) => (this.#state.nowDate = value); // value is [year, month, date]
    getNowDate = () => this.#state.nowDate;

    // ================================================================================================

    // getting and setting the month and year that are now rendered
    setMonthToShow = (value) => (this.#state.monthToShow = value); // value is [yr, mth]
    getMonthToShow = () => this.#state.monthToShow;

    // ================================================================================================

    // get the now time
    getNowTime() {
        return getNowTime();
    }

    // ================================================================================================

    // return the time of the year
    // defineYearTime(monthNum) {
    //     return defineYearTime(monthNum);
    // }

    // ================================================================================================

    // calc how many days are in some month and return other things as well, ready to be rendered
    calcMonth(setYear, setMonth) {
        return calcMonth(setYear, setMonth);
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
        return validateInput(inputValuesArr, type);
    }

    // ================================================================================================

    // adding an event or occurrence
    addEventOccurrence(obj) {
        addEventOccurrence(obj);
    }

    // ================================================================================================

    // saving to local storage
    saveToLS() {
        LS.save("calendarData", this.#state.data, "ref"); // pushing to LS; key, value, type = "ref" for reference
    }

    // ================================================================================================

    // editing an event or occurrence
    editEventOccurrence(obj) {
        editEventOccurrence(obj);
    }

    // ================================================================================================

    // fetching from the state, all events and occurences, upon start
    fetchEventOccurrences() {
        const fetched = LS.get("calendarData", "ref"); // key, type
        if (!fetched) return;
        this.#state.data.events = fetched.events;
        this.#state.data.occurrences = fetched.occurrences;
    }

    // ================================================================================================

    // return just day numbers when a day of this month (which is a month that is displayed now) has either an event or occurence
    getThisMonthEventfulDays() {
        return getThisMonthEventfulDays();
    }

    // ================================================================================================

    // removing one entry and pushing it to LS
    deleteEntry(type, title, date) {
        deleteEntry(type, title, date);
    }

    // ================================================================================================

    // getting all the data of 'el' from the state: 4 of its props (when editing)
    getEntryData(title, date, type) {
        const itemData = this.#state.data[type].find((itemObj) => itemObj.title === title && itemObj.date === date);
        const copy = JSON.parse(JSON.stringify(itemData)); // making a copy because '.find' returns a ref to the object found within the orig array, not a newly created object
        delete copy.added; // deleting what I don't need to return
        return copy;
    }

    // ================================================================================================

    // getting some info about some day: if it has events, occurences, the temporal distance between now and this day, and what weekday it is
    getDayData(date) {
        return getDayData(date);
    }

    // ================================================================================================

    // dependency of 'getDayData' -- calculating the temporal distance between now and some day
    calcTemporalDistance(dateString) {
        return calcTemporalDistance(dateString);
    }

    // ================================================================================================

    // setting what item I am editing now in case if I modify all of its fields: to be able to find it then in state
    setEditingItem(title, date, type) {
        const item = this.#state.data[type].find((itemObj) => itemObj.title === title && itemObj.date === date);
        this.#state.editingItem = [type, item];
    }

    getEditingItem = () => this.#state.editingItem;

    // ================================================================================================

    // runs every 60 secs
    everyMinuteTimer(handler) {
        clearInterval(this.#state.everyMinTimer);

        this.#state.everyMinTimer = setInterval(() => {
            const [now, year, month, date, weekday, hours, minutes] = this.getNowTime();
            if (hours === 0 && minutes === 0) handler(); // if it is a new day, refresh interface
        }, 60000);
    }

    // ================================================================================================

    // filtering occurrences by category -- for Routines This Month block
    filterOccsByCat() {
        return filterOccsByCat();
    }

    // ================================================================================================

    // get all dates that have this category (to highlight those dates/those day elements)
    getDates(categoryString) {
        const occs = this.getOccurrences();
        let result = occs.filter((occObj) => occObj.category.toLowerCase() === categoryString).map((obj) => obj.date); // an array of only dates
        result = result.map((dateString) => dateString.split("/").reverse().join(",")); // formatting those dates a bit differently
        return result;
    }

    // ================================================================================================

    // returns date today, num of events, num of occurrences -- to update doc.title later
    getTodayData() {
        const dateToday = this.#state.nowDate.slice().reverse().join("/");
        const dateTodayShortened = this.#state.nowDate
            .slice()
            .reverse()
            .map((x) => (x.toString().length > 2 ? x.toString().slice(2) : x))
            .join("/"); // not 2025 but just 25

        const events = this.getEvents();
        const occs = this.getOccurrences();
        const eventsToday = events.filter((eventObj) => eventObj.date === dateToday);
        const occurrencesToday = occs.filter((occurrenceObj) => occurrenceObj.date === dateToday);
        return [dateTodayShortened, eventsToday.length, occurrencesToday.length];
    }

    // ================================================================================================

    // checking the input accent color -- returns string (color in rgb)
    checkNewColor(newColor) {
        // mimicking DOM addition to get the computed color
        const span = document.createElement("span");
        document.body.appendChild(span);
        span.style.color = newColor;
        let color = window.getComputedStyle(span).color;
        document.body.removeChild(span);

        const rgbValues = color
            .slice(4, -1)
            .split(",")
            .map((x) => +x.trim()); // just the rgb values (r,g,b)

        if (rgbValues[0] < 40 && rgbValues[1] < 40 && rgbValues[2] < 40) return `rgb(0, 128, 0)`; // return green if it is too dark

        return color;
    }

    // ================================================================================================

    // changing the accent color of the interface in state, LS; fetching it from LS; and fetching the state value
    changeAccentColor(value) {
        this.#state.accentColor = value;
        LS.save("calendarAccentColor", this.#state.accentColor, "prim"); // pushing to LS; key, value, type = "prim" for primitive type
    }

    fetchAccentColor() {
        const fetched = LS.get("calendarAccentColor", "prim");
        if (!fetched) return;
        this.#state.accentColor = fetched;
    }

    getAccentColor = () => this.#state.accentColor;

    // ================================================================================================

    // exporting as JSON
    exportAsJson() {
        exportAsJson();
    }
}

export default Model;
