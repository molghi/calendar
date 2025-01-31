// local storage operations

class LS {
    constructor() {
        // this.save('name', 'John')   -->   NOTE: if you pass a ref type, do not stringify it beforehand else it gets double-stringified!
        // this.get('name')   -->   NOTE: if you get a ref type, do not parse it!
        // this.getAll()
        // this.remove('name')
        // this.clear()
        // this.length
    }

    // ================================================================================================

    // save to local storage
    save(key, value, type = "prim") {
        if (type.startsWith("prim")) {
            localStorage.setItem(key, value); // primitives need no JSON-stringifying
        } else {
            localStorage.setItem(key, JSON.stringify(value)); // ref types do
        }
    }

    // ================================================================================================

    // retrieve one from local storage
    get(key, type = "primitive") {
        if (type.startsWith("prim")) {
            return localStorage.getItem(key); // primitives need no JSON-parsing
        } else {
            const fetched = localStorage.getItem(key);
            if (!fetched) return null;
            return JSON.parse(fetched); // ref types do
        }
    }

    // ================================================================================================

    // retrieve all keys currently stored in local storage
    getAll() {
        const storageKeys = Object.keys(localStorage);
        return storageKeys;
    }

    // ================================================================================================

    // remove one from local storage
    remove(key) {
        localStorage.removeItem(key);
    }

    // ================================================================================================

    // clear everything in local storage
    clear() {
        const response = confirm("are you sure you want to clear all items in your storage?");
        if (!response) return;
        localStorage.clear();
        console.log(`local storage is clear now`);
    }

    // ================================================================================================

    // get how many items are stored there
    get length() {
        console.log(`keys saved in local storage:`, localStorage.length);
        return localStorage.length;
    }
}

export default new LS(); // I export and instantiate it right here, so I don't have to instantiate it where I import it
// export default LS
