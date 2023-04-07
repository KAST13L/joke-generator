import {JokeType} from "../api/jokes-api";

export const saveToStorage = (name: string, data: JokeType[]) => {
    if (!window || !window.localStorage) {
        return;
    }
    window.localStorage.setItem(name, JSON.stringify(data));
};

export const getFromStorage = (name: string) => {
    if (!window || !window.localStorage) {
        return null;
    }
    try {
        // @ts-ignore
        return JSON.parse(window.localStorage.getItem(name));
    } catch (e) {
        console.error(e);
        return null;
    }
};