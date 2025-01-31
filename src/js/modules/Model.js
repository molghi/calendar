// Model is responsible for all logic in the app: all computations, calculations, and data operations

class Model {
    #state = {
        months: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        nowDate: [],
        monthToShow: [],
        hourlyTimer: "",
    };

    constructor() {}

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
}

export default Model;
