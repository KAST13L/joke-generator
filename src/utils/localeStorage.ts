import {JokeType} from "../api/jokes-api";
import {FAVORITE} from "../variables";

export const saveFavoriteJokes = (data: JokeType[]) => {
    if (!window || !window.localStorage) {
        return;
    }
    window.localStorage.setItem(FAVORITE, JSON.stringify(data));
};

export const getFavoriteJokes = () => {
    if (!window || !window.localStorage) {
        return null;
    }
    try {
        // @ts-ignore
        return localStorage.getItem(FAVORITE) !== null ? JSON.parse(window.localStorage.getItem(FAVORITE)) : [];
    } catch (e) {
        console.error(e);
        return null;
    }
};