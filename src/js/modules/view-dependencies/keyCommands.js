import { Visual } from "../../Controller.js";

class KeyCommands {
    constructor() {
        this.listen();
    }

    listen() {
        document.addEventListener("keydown", function (event) {
            // 'keypress' is deprecated
            if (event.code === "KeyZ") {
                const newCol = prompt("Enter a new UI colour:");
                if (!newCol) return;
                document.documentElement.style.setProperty("--accent", newCol); // changing the accent colour
                console.log(`UI accent colour now: ${newCol}`);
            }
        });
    }
}

export default new KeyCommands(); // I export and instantiate it right here, so I don't have to instantiate it where I import it
