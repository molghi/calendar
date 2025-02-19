import { Visual } from "../../Controller.js";

function listenKeys(handler) {
    document.addEventListener("keydown", function (e) {
        // 'keypress' is deprecated

        if (e.code === `ArrowRight` || e.code === `ArrowLeft`) {
            // viewing next/prev months
            if (document.querySelector("form")) return; // if a form is shown, these keys shouldn't work
            let type;
            if (e.code === `ArrowLeft`) type = "prev";
            if (e.code === `ArrowRight`) type = "next";
            handler(type);
        }
    });
}

export default listenKeys;
