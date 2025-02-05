import { Logic, Visual, renderThings } from "../../Controller.js";

// runs as a callback for 'Visual.handleFormSubmission'
function formHandler(values, type, formType) {
    // NOTE: 'values' is array, 'type' is string, 'formType' is either 'editForm' or 'addForm'

    const [isValidated, safeValues, message] = Logic.validateInput(values, type); // validating input

    if (!isValidated) {
        return Visual.showMessage("error", message); // showing some notification in the UI if validation failed
    }

    if (formType === "addForm") Logic.addEventOccurrence(safeValues); // adding this just submitted thing to state and pushing it to LS
    else Logic.editEventOccurrence(safeValues); // editing in state and pushing to LS

    Visual.removeForm(); // removing form

    renderThings(); // rendering or re-rendering all main things on the screen

    const messageToShow = formType === "addForm" ? "Added successfully!" : "Edited successfully!";
    Visual.showMessage("success", messageToShow); // showing some notification in the UI

    Visual.setFormIsShown(); // setting that form is shown (boolean, false here) and if false, .calendar__days loses the no-hover class
}

export default formHandler;
