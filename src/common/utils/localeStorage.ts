import {JokeType} from "../api/jokes-api";
import {FAVORITE} from "./variables";
import {Dispatch} from "redux";

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

export const deleteJokeFromLocaleStorage = (jokeId: number) => {
    let prevState: JokeType[] = getFavoriteJokes()
    if (prevState.some(j => j.id === jokeId)) {
        prevState = prevState.filter(j => j.id !== jokeId)
        saveFavoriteJokes(prevState)
    }
}

export const addJokeToLocaleStorage = (dispatch: Dispatch, joke: JokeType) => {

}