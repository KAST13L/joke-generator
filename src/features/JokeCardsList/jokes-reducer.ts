import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {jokesAPI, JokeType} from "../../api/jokes-api";
import {RootStateType} from "../../app/store";
import {getFavoriteJokes, saveFavoriteJokes} from "../../utils/localeStorage";
import {MAX_FAVORITE_JOKES_COUNT, STATUS} from "../../variables";
import {setAppError, setAppStatus, setAppSuccess} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export const fetchJokes = createAsyncThunk('jokes/fetchJokes', async (arg, {dispatch, getState}) => {
    dispatch(setAppStatus({status: STATUS.LOADING}))

    const res = await jokesAPI.getJokes()
    try {
        let jokes: JokeType[] = res.data.map(j => ({...j, favorite: false}))
        const getIdsNewJokes = jokes.map(j => j.id)

        const state = getState() as RootStateType
        const getIdsCurrentJokes = state.jokes.jokes.map(j => j.id)
        if (!state.jokes.jokes.length) {
            jokes = getFavoriteJokes().concat(jokes)
            jokes = jokes.filter((j, index) => index < MAX_FAVORITE_JOKES_COUNT)
        }

        let intersection = getIdsCurrentJokes.filter((x: any) => getIdsNewJokes.includes(x));

        if (!intersection.length) {
            dispatch(setJokes({jokes}))
            dispatch(setAppStatus({status: STATUS.SUCCEEDED}))
            dispatch(setAppSuccess({success: 'Jokes received'}))
        } else {
            dispatch(updateRepeatingIdsOfJokesList({repeatingJokesCount: intersection.length}))
            dispatch(fetchJokes())
        }
    } catch (e: any) {
        handleServerAppError(e, dispatch)
    } finally {
        dispatch(setAppStatus({status: STATUS.IDLE}))
    }
})

export const refreshJoke = createAsyncThunk('jokes/refreshJoke', async (id: number, {dispatch}) => {

    dispatch(setAppStatus({status: STATUS.LOADING}))

    let prevState: JokeType[] = getFavoriteJokes()
    if (prevState.some(j => j.id === id)) {
        prevState = prevState.filter(j => j.id !== id)
        saveFavoriteJokes(prevState)
    }

    let res = await jokesAPI.getOneJoke()
    if (res.data.id !== id) {
        try {
            dispatch(changeJoke({id, joke: {...res.data, favorite: false}}))
            dispatch(setAppStatus({status: STATUS.SUCCEEDED}))
            dispatch(setAppSuccess({success:'Joke refreshed'}))
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        } finally {
            dispatch(setAppStatus({status: STATUS.IDLE}))
        }
    } else {
        dispatch(refreshJoke(id))
    }
})

export const deleteJoke = createAsyncThunk('jokes/delete', async (id: number, {dispatch}) => {

    dispatch(setAppStatus({status: STATUS.LOADING}))

    let prevState: JokeType[] = getFavoriteJokes()
    if (prevState.some(j => j.id === id)) {
        prevState = prevState.filter(j => j.id !== id)
        saveFavoriteJokes(prevState)
    }
    try {
        dispatch(deleteJokeAction({id}))
        dispatch(setAppStatus({status: STATUS.SUCCEEDED}))
        dispatch(setAppSuccess({success: 'Joke deleted'}))
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    } finally {
        dispatch(setAppStatus({status: STATUS.IDLE}))
    }
})

export const addToFavorite = createAsyncThunk('jokes/addToFavorite', (id: number, {dispatch, getState}) => {
    dispatch(setAppStatus({status:STATUS.LOADING}))
    dispatch(changeFavoriteField({id, isFavorite: true}))

    let state = getState() as RootStateType
    let joke: JokeType[] = state.jokes.jokes.filter(j => j.id === id)
    let prevState: JokeType[] = getFavoriteJokes()
    if (prevState.length) {
        if (prevState.some(j => j.id === id)) {
            dispatch(setAppStatus({status:STATUS.FAILED}))
            dispatch(setAppError({error:'Joke is already in the list of favorites'}))
        } else {
            if (prevState.length === MAX_FAVORITE_JOKES_COUNT) {
                dispatch(changeFavoriteField({id, isFavorite: false}))
                dispatch(setAppStatus({status:STATUS.FAILED}))
                dispatch(setAppError({error:`the maximum number of favorite jokes is ${MAX_FAVORITE_JOKES_COUNT}`}))
            } else {
                prevState = prevState.concat(joke)
                saveFavoriteJokes(prevState)
                dispatch(setAppStatus({status:STATUS.SUCCEEDED}))
                dispatch(setAppSuccess({success:'Joke has been added to the list of favorites'}))
            }
        }
    } else {
        prevState = prevState.concat(joke)
        saveFavoriteJokes(prevState)
        dispatch(setAppStatus({status:STATUS.SUCCEEDED}))
        dispatch(setAppSuccess({success:'Joke has been added to the list of favorites'}))
    }
})

const initialState = {
    jokes: [] as JokeType[],
    repeatingIdsOfJokesList: 0 as number
}

export const slice = createSlice({
    name: 'jokes',
    initialState: initialState,
    reducers: {
        setJokes(state, action: PayloadAction<{ jokes: JokeType[] }>) {
            state.jokes = state.jokes.concat(action.payload.jokes)
        },
        deleteJokeAction(state, action: PayloadAction<{ id: number }>) {
            state.jokes.filter(j => j.id !== action.payload.id)
            const index = state.jokes.findIndex(j => j.id === action.payload.id)
            state.jokes.splice(index, 1)
        },
        changeFavoriteField(state, action: PayloadAction<{ id: number, isFavorite: boolean }>) {
            const index = state.jokes.findIndex(j => j.id === action.payload.id)
            state.jokes[index].favorite = action.payload.isFavorite
        },
        changeJoke(state, action: PayloadAction<{ joke: JokeType, id: number }>) {
            const index = state.jokes.findIndex(j => j.id === action.payload.id)
            state.jokes.splice(index, 1, action.payload.joke)
        },
        updateRepeatingIdsOfJokesList(state, action: PayloadAction<{ repeatingJokesCount: number }>) {
            state.repeatingIdsOfJokesList += +action.payload.repeatingJokesCount
        }
    }
})

export const {
    changeFavoriteField,
    updateRepeatingIdsOfJokesList,
    changeJoke,
    setJokes,
    deleteJokeAction
} = slice.actions
export const jokesReducer = slice.reducer
