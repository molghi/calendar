import { Logic, Visual } from "../../Controller.js";

// handle clicks in .actions: change color, import or export
function actionsHandler(actionType) {
    if (actionType === "change color") {
        const newColor = prompt("Enter your new interface color:"); // prompting
        if (newColor === null) return;
        if (newColor === "") return;
        if (newColor.trim().length < 3) return;
        const safeColor = Logic.checkNewColor(newColor.trim().toLowerCase()); // checking the input, returning safe color
        Visual.changeAccentColor(safeColor); // changing in the UI
        Logic.changeAccentColor(safeColor); // changing in state/LS
        //
    } else if (actionType === "import") {
        alert(`NOTE:\nYou can import only JSON and it must be formatted exactly the same as the one you can export.`);
        Visual.inputFileEl.click(); // clicking the file import btn programatically, everything after that happens in the 'change' event listener
        //
    } else if (actionType === "export") {
        Logic.exportAsJson(); // exporting as JSON
    }
}

export default actionsHandler;
