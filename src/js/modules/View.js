// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

// import {} from './view-dependencies/renderMethods.js';
// import {} from './view-dependencies/eventHandlers.js';

class View {
    constructor() {}

    // show an element
    show = (el) => el.classList.remove("hidden");

    // hide an element
    hide = (el) => el.classList.add("hidden");
}

export default View;
