import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {jokesAPI, JokeType} from "../../api/jokes-api";
import {RootStateType} from "../../app/store";
import {getFavoriteJokes, saveFavoriteJokes} from "../../utils/localeStorage";
import {MAX_JOKES_COUNT} from "../../variables";

export const fetchJokes = createAsyncThunk('jokes/fetchJokes', async (arg, {
    dispatch,
    getState
}) => {
    const res = await jokesAPI.getJokes()
    let jokes: JokeType[] = res.data.map(j => ({...j, favorite: false}))
    const getIdsNewJokes = jokes.map(j => j.id)

    const state = getState() as RootStateType
    const getIdsCurrentJokes = state.jokes.jokes.map(j => j.id)
    if(!state.jokes.jokes.length) {
        jokes = getFavoriteJokes().concat(jokes)
        jokes = jokes.filter((j, index) => index < MAX_JOKES_COUNT)
    }

    let intersection = getIdsCurrentJokes.filter((x: any) => getIdsNewJokes.includes(x));

    if (!intersection.length) {
        try {
            dispatch(setJokes({jokes}))
        } catch (e: any) {
            console.log(e)
            // handleServerNetworkError(e, dispatch)
        }
    } else {
        dispatch(updateRepeatingIdsOfJokesList({repeatingJokesCount: intersection.length}))
        dispatch(fetchJokes())
    }
})

export const refreshJoke = createAsyncThunk('jokes/refreshJoke', async (id: number, {dispatch}) => {

    let prevState: JokeType[] = getFavoriteJokes()
    if (prevState.some(j => j.id === id)) {
        prevState = prevState.filter(j => j.id !== id)
        saveFavoriteJokes(prevState)
    }

    let res = await jokesAPI.getOneJoke()
    if (res.data.id !== id) {
        try {
            dispatch(changeJoke({id, joke: {...res.data, favorite: false}}))
        } catch (e: any) {
            console.log(e)
            // handleServerNetworkError(e, dispatch)
        }
    } else {
        dispatch(refreshJoke(id))
    }
})

export const deleteJoke = createAsyncThunk('jokes/delete', async (id: number, {dispatch}) => {

    let prevState: JokeType[] = getFavoriteJokes()
    if (prevState.some(j => j.id === id)) {
        prevState = prevState.filter(j => j.id !== id)
        saveFavoriteJokes(prevState)
    }
    try {
        dispatch(deleteJokeAction({id}))
    } catch (e: any) {
        console.log(e)
        // handleServerNetworkError(e, dispatch)
    }
})

export const addToFavorite = createAsyncThunk('jokes/addToFavorite', (id: number, {
    dispatch,
    getState
}) => {
    dispatch(changeFavoriteField({id, isFavorite: true}))
    let state = getState() as RootStateType
    let joke: JokeType[] = state.jokes.jokes.filter(j => j.id === id)
    let prevState: JokeType[] = getFavoriteJokes()
    if (prevState.length) {
        if (prevState.some(j => j.id === id)) {
            alert('така шутка вже добавлена')
        } else {
            prevState = prevState.concat(joke)
            saveFavoriteJokes(prevState)
        }
    } else {
        prevState = prevState.concat(joke)
        saveFavoriteJokes(prevState)
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
