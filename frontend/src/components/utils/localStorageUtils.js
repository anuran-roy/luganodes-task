export const writeToLocalStorage = (key, value) => {
    if (typeof value === 'object') {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
};

export const readFromLocalStorage = (key) => {
    let value = localStorage.getItem(key);
    if (typeof value === "object") {
        value = JSON.parse(value);
    };
    return value;
};

export const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
    localStorage.clear();
};

export const updateLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};