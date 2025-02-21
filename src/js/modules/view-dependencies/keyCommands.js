import { Visual } from "../../Controller.js";

function listenKeys(handler) {
    document.addEventListener("keydown", function (e) {
        // 'keypress' is deprecated
        // console.log(e);

        if (e.code === `ArrowRight` || e.code === `ArrowLeft`) {
            // viewing next/prev months
            if (document.querySelector("form")) return; // if a form is shown, these keys shouldn't work
            let type;
            if (e.code === `ArrowLeft`) type = "prev";
            if (e.code === `ArrowRight`) type = "next";
            handler(type);
        }

        if (e.metaKey && e.code === "Enter") {
            if (!document.querySelector("form")) return;
            document.querySelector(".app__form-btn").click(); // clicking to submit the form
        }
    });
}

export default listenKeys;
