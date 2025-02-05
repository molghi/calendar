import { Logic } from "../../Controller.js";

// ================================================================================================

// exporting as .json
function exportAsJson() {
    const data = Logic.getData(); // getting the obj to export
    const now = new Date();
    const filename = `calendar-export--${now.getDate()}-${now.getMonth() + 1}-${now
        .getFullYear()
        .toString()
        .slice(2)}--${now.getHours()}-${now.getMinutes()}.json`;

    const json = JSON.stringify(data, null, 2); // Converting data to JSON: Converts the JavaScript object 'data' into a formatted JSON string. The 'null, 2' arguments ensure the output is pretty-printed with 2-space indentation for readability.
    const blob = new Blob([json], { type: "application/json" }); // Creating a blob: Creates a binary large object (Blob) containing the JSON string, specifying the MIME type as 'application/json' to ensure it's recognised as a JSON file.
    const url = URL.createObjectURL(blob); // Creating a download URL: Generates a temporary URL pointing to the Blob, enabling it to be downloaded as a file by associating it with a download link.

    // Create an invisible anchor element for downloading
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // clicking programmatically and removing it right after
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Clean up the URL
}

// ================================================================================================
// ================================================================================================
// ================================================================================================

// exporting as .txt is not finished (maybe later, if it's of any use...) 🔴
function exportAsTxt() {
    const data = prepareForExport();
    return;
    const [year, month, date, hours, minutes, seconds] = Logic.getCurrentTime();

    const filename = `calendar-export--${date}-${month}-${year.toString().slice(2)}--${hours}-${minutes}.txt`;

    const blob = new Blob([data], { type: "text/plain" }); // Create a Blob with the content and specify text/plain MIME type

    const anchor = document.createElement("a"); // Create a temporary anchor element
    anchor.href = URL.createObjectURL(blob); // Create an object URL for the Blob
    anchor.download = filename; // Set the filename for download

    anchor.click(); // Trigger the download

    URL.revokeObjectURL(anchor.href); // Clean up the object URL
}

// ================================================================================================

// dependency of 'exportAsTxt' -- preparing notes to be exported as .txt -- just to have it nicely formatted
function prepareForExport() {
    const separator = `---------------------------------------------------------------------`;

    // console.log(Logic.getData());
    return;
    const result = Logic.getData().map((obj) => {
        // console.log(obj);
    });
    const notesNum = result.length;
    result.unshift(`Your Data (${notesNum})\n\n\n`, separator + "\n\n\n");
    return result.join("");
}

// ================================================================================================

export { exportAsJson };
