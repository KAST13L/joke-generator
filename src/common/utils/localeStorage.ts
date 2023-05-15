import { JokeAPIType, JokeType } from "../api/jokes-api";
import { FAVORITE, MAX_FAVORITE_JOKES_COUNT } from "./variables";
import { RootStateType } from "../../app/store/store";

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
    return localStorage.getItem(FAVORITE) !== null
      ? // @ts-ignore
        JSON.parse(window.localStorage.getItem(FAVORITE))
      : [];
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const deleteJokeFromLocaleStorage = (jokeId: number) => {
  let prevState: JokeType[] = getFavoriteJokes();
  if (prevState.some((j) => j.id === jokeId)) {
    prevState = prevState.filter((j) => j.id !== jokeId);
    saveFavoriteJokes(prevState);
  }
};

export const addOrRemoveJokeFromLocaleStorage = (joke: JokeType) => {
  let prevState: JokeType[] = getFavoriteJokes();

  if (prevState.length && prevState.length === MAX_FAVORITE_JOKES_COUNT) {
    return { isDone: false };
  } else if (joke.favorite) {
    deleteJokeFromLocaleStorage(joke.id);
    return { isDone: true };
  } else {
    prevState = prevState.concat({ ...joke, favorite: true });
    saveFavoriteJokes(prevState);
    return { isDone: true };
  }
};

export const uploadFavoriteJokesAndDetermineIntersection = (
  jokes: JokeAPIType[],
  getState: () => unknown
) => {
  const state = getState() as RootStateType;
  const currentJokes = state.jokes.jokes;

  let transformedJokes: JokeAPIType[] = jokes.map((j) => ({
    ...j,
    favorite: false,
  }));
  const getIdsNewJokes = transformedJokes.map((j) => j.id);
  const getIdsCurrentJokes = currentJokes.map((j) => j.id);

  if (!currentJokes.length) {
    transformedJokes = getFavoriteJokes().concat(transformedJokes);
    transformedJokes = transformedJokes.filter(
      (j, index) => index < MAX_FAVORITE_JOKES_COUNT
    );
  }

  let intersection = getIdsCurrentJokes.filter((x: any) =>
    getIdsNewJokes.includes(x)
  );

  return {
    transformedJokes,
    intersection,
  } as { transformedJokes: JokeType[]; intersection: number[] };
};
