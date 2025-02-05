import { Logic } from "../../Controller.js";

// validating form input
function validateInput(inputValuesArr, type) {
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
    if (!/^(0?[1-9]|[12]\d|3[01])[./](0?[1-9]|1[0-2])[./]\d{4}$/.test(date))
        (isValidated = false), (message = "Date is incorrect. The correct format: D/M/YYYY or DD.MM.YYYY");

    if (type === "event") {
        if (!/^(?:[01]?\d|2[0-3]):[0-5]\d$/.test(variable) && variable.length > 0)
            (isValidated = false), (message = "Time is incorrect. The correct format: HH:MM (24-hour time)");
        // if it's type 'event', the 'variable' is 'time' -- if it's 'occurrence', the 'variable' is 'category'
    } else {
        // type is occurrence here
    }

    let safeValues = {
        title: title.trim(),
        date: date.trim(),
        variable: variable.trim(),
        desc: desc.trim(),
        type: type,
    };

    return [isValidated, safeValues, message];
}

export default validateInput;
