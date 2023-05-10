import {JokeType} from "../api/jokes-api";
import {FAVORITE, MAX_FAVORITE_JOKES_COUNT} from "./variables";

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

export const addJokeToLocaleStorage = (joke: JokeType) => {
    let prevState: JokeType[] = getFavoriteJokes()

    if (prevState.length && prevState.length === MAX_FAVORITE_JOKES_COUNT) {
        return {isDone: false}
    } else {
        prevState = prevState.concat({...joke, favorite: true})
        saveFavoriteJokes(prevState)
        return {isDone: true}
    }
}