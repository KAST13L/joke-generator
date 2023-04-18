import {RootStateType} from "./store";

export const selectStatus = (state: RootStateType) => state.app.status;
export const selectRepeatingIdsOfJokesList = ( state: RootStateType) => state.jokes.repeatingIdsOfJokesList
export const selectJokesTotalCount = ( state: RootStateType) => state.jokes.jokes.length
