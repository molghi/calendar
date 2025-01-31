// Controller is the grand orchestrator of the entire project: it initialises Model, View, and uses all methods defined there to perform all actions.

"use strict";

import "../styles/main.scss";

// instantiating main classes
import Model from "./modules/Model.js";
import View from "./modules/View.js";
const Logic = new Model();
const Visual = new View();

// ================================================================================================

// runs on app start
function init() {
    runEventListeners();
}
init();

// ================================================================================================

// running event listeners
function runEventListeners() {}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners };
