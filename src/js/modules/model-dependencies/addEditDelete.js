import { Logic } from "../../Controller.js";
import LS from "./localStorage.js";

// ================================================================================================

// adding an event or occurrence and pushing it to LS
function addEventOccurrence(obj) {
    let { date, desc, title, type, variable } = obj;
    if (date.includes(".")) date = date.split(".").join("/"); // if it has '.', I replace all of those with '/'
    date = date
        .split("/")
        .map((x) => (x.startsWith("0") ? x.replace("0", "") : x))
        .join("/"); // if it is for instance '05/02/2025', I make it '5/2/2025'
    const myObj = {
        date,
        description: desc,
        title,
        added: new Date().toISOString(), // later acts as ID
    };
    if (type === "event") {
        myObj.time = variable;
        Logic.getData().events.push(myObj); // pushing to state
    } else {
        // type is occurrence
        myObj.category = variable;
        Logic.getData().occurrences.push(myObj); // pushing to state
    }

    LS.save("calendarData", Logic.getData(), "ref"); // pushing to LS; key, value, type = "ref" for reference
}

// ================================================================================================

// editing an event or occurrence and pushing it to LS
function editEventOccurrence(obj) {
    const [editingItemType, editingItem] = Logic.getEditingItem();

    // editing:
    if (obj.title !== editingItem.title) editingItem.title = obj.title;

    if (obj.date !== editingItem.date) {
        let date = obj.date;
        if (obj.date.includes(".")) date = date.split(".").join("/"); // if it has '.', I replace all of those with '/'
        date = date
            .split("/")
            .map((x) => (x.startsWith("0") ? x.replace("0", "") : x))
            .join("/"); // if it is for instance '05/02/2025', I make it '5/2/2025'
        editingItem.date = date;
    }

    if (obj.desc !== editingItem.description) editingItem.description = obj.desc; // if it is not the same, update it

    if (editingItemType === "events") {
        if (obj.variable !== editingItem.time) editingItem.time = obj.variable;
    } else {
        if (obj.variable !== editingItem.category) editingItem.category = obj.variable;
    }

    LS.save("calendarData", Logic.getData(), "ref"); // pushing to LS; key, value, type = "ref" for reference
}

// ================================================================================================

// removing one entry and pushing it to LS
function deleteEntry(type, title, date) {
    if (type === "events") {
        const index = Logic.getEvents().findIndex((entryObj) => entryObj.title === title && entryObj.date === date); // getting the index
        if (index < 0) return console.error("negative index: not found");
        Logic.getData().events.splice(index, 1); // removing by index
    } else {
        const index = Logic.getOccurrences().findIndex((entryObj) => entryObj.title === title && entryObj.date === date);
        if (index < 0) return console.error("negative index: not found");
        Logic.getData().occurrences.splice(index, 1);
    }

    LS.save("calendarData", Logic.getData(), "ref"); // pushing to LS; key, value, type = "ref" for reference
}

// ================================================================================================

export { addEventOccurrence, editEventOccurrence, deleteEntry };
