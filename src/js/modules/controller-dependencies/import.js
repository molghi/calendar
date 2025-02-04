import { Logic, Visual, renderThings } from "../../Controller";

// ================================================================================================

function processInput(event) {
    const file = event.target.files[0]; // Get the file
    if (!file) return; // Ensure there's a file selected

    const reader = new FileReader(); // Create FileReader instance

    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result); // Parse the JSON content
            const isValidInput = checkValidInput(jsonData);

            if (!isValidInput) {
                Visual.showMessage("error", `Invalid JSON! Check the formatting: you can import JSON formatted the same as what you can export.`);
            }

            addFromImported(jsonData); // adding to the state and pushing to LS
            Visual.showMessage("success", "Import successful!");

            // now all must be re-rendered
            renderThings();
        } catch (err) {
            console.error("Invalid input file", err); // Error handling
            Visual.showMessage("error", `Invalid input file! You can import only JSON and it must be formatted the same as what you can export.`);
            return null;
        } finally {
            Visual.inputFileEl.value = ""; // resetting the file input value to be able to import again without problems
        }
    };

    reader.readAsText(file); // Read the file as text
}

// ================================================================================================

// dependency of 'processInput' -- validating the input/imported thing -- making sure it's formatted the way I allow it
function checkValidInput(data) {
    if (typeof data !== `object`) return;
    let passed = true;

    if (!data.hasOwnProperty("events")) return (passed = false);
    if (!data.hasOwnProperty("occurrences")) return (passed = false);

    if (!Array.isArray(data.events)) return (passed = false);
    if (!Array.isArray(data.occurrences)) return (passed = false);

    if (data.events.length > 0) {
        data.events.forEach((eventObj) => {
            if (!eventObj.hasOwnProperty("added")) return (passed = false);
            if (!eventObj.hasOwnProperty("date")) return (passed = false);
            if (!eventObj.hasOwnProperty("description")) return (passed = false);
            if (!eventObj.hasOwnProperty("time")) return (passed = false);
            if (!eventObj.hasOwnProperty("title")) return (passed = false);

            [eventObj.added, eventObj.date, eventObj.description, eventObj.time, eventObj.title].forEach((prop) =>
                typeof prop !== "string" ? (passed = false) : (passed = true)
            );
        });
    }

    if (data.occurrences.length > 0) {
        data.occurrences.forEach((occObj) => {
            if (!occObj.hasOwnProperty("added")) return (passed = false);
            if (!occObj.hasOwnProperty("category")) return (passed = false);
            if (!occObj.hasOwnProperty("date")) return (passed = false);
            if (!occObj.hasOwnProperty("description")) return (passed = false);
            if (!occObj.hasOwnProperty("title")) return (passed = false);

            [occObj.added, occObj.date, occObj.description, occObj.category, occObj.title].forEach((prop) =>
                typeof prop !== "string" ? (passed = false) : (passed = true)
            );
        });
    }

    return passed;
}

// ================================================================================================

// dependency of 'processInput' --- the import was successful, so adding to the state and pushing to LS
function addFromImported(data) {
    const { events: importedEvents, occurrences: importedOccs } = data;

    const stateEvents = Logic.getEvents();
    const stateEventsAddedDates = stateEvents.map((obj) => obj.added);
    const stateOccurrences = Logic.getOccurrences();
    const stateOccsAddedDates = stateOccurrences.map((obj) => obj.added);

    if (importedEvents.length > 0) {
        importedEvents.forEach((importedEventObj) => {
            if (stateEventsAddedDates.includes(importedEventObj.added)) {
                // means state already has this event, so I replace it --> replace what can be changed
                const indexInState = Logic.getEvents().findIndex((eventObj) => eventObj.added === importedEventObj.added);
                Logic.getEvents()[indexInState].date = importedEventObj.date;
                Logic.getEvents()[indexInState].description = importedEventObj.description;
                Logic.getEvents()[indexInState].time = importedEventObj.time;
                Logic.getEvents()[indexInState].title = importedEventObj.title;
            } else {
                // means state doesn't have this event, so I just push it
                Logic.getEvents().push(importedEventObj);
            }
        });
    }

    if (importedOccs.length > 0) {
        importedOccs.forEach((importedOccObj) => {
            if (stateOccsAddedDates.includes(importedOccObj.added)) {
                // means state already has this event, so I replace it --> replace what can be changed
                const indexInState = Logic.getOccurrences().findIndex((occObj) => occObj.added === importedOccObj.added);
                Logic.getOccurrences()[indexInState].date = importedOccObj.date;
                Logic.getOccurrences()[indexInState].description = importedOccObj.description;
                Logic.getOccurrences()[indexInState].category = importedOccObj.category;
                Logic.getOccurrences()[indexInState].title = importedOccObj.title;
            } else {
                // means state doesn't have this event, so I just push it
                Logic.getOccurrences().push(importedOccObj);
            }
        });
    }

    // pushing to LS
    Logic.saveToLS();
}

// ================================================================================================

export default processInput;
