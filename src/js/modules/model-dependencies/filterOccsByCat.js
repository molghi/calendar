import { Logic } from "../../Controller.js";

// filtering occurrences by category -- for Routines This Month block
function filterOccsByCat() {
    const occs = Logic.getOccurrences();
    const [yearShowing, monthShowing] = Logic.getMonthToShow(); // month, year now shown on screen

    const withCategory = occs.filter((occObj) => {
        const [date, month, year] = occObj.date.split("/");
        return occObj.category && +month === monthShowing && +year === yearShowing; // all occurrences that have category assigned and happened in the observing month-year
    });
    const allCategories = withCategory.map((occObj) => occObj.category.toLowerCase().trim()); // a flat arr of strings: all categories

    let map = {};
    [...new Set(allCategories)].forEach((cat) => (map[cat] = 0)); // pre-filling the map to increment properly below
    allCategories.forEach((catString, index, arr) => (map[catString] += 1)); // filling it properly to see how many times a set thing occurs in an array

    const routines = Object.entries(map).filter((entry) => entry[1] > 1);
    map = {};
    routines.forEach((entry) => {
        map[entry[0]] = entry[1];
    });
    // Object.values(map).forEach((value, index) => {
    //     // deleting those props that have 1 as value (repeated once)
    //     const keys = Object.keys(map);
    //     if (value === 1) delete map[keys[index]];
    // });

    const daysInThisMonth = new Date(yearShowing, monthShowing, 1 - 1).getDate();
    return [map, daysInThisMonth];
}

export default filterOccsByCat;
