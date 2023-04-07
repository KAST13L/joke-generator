import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {jokesAPI, JokeType} from "../../api/jokes-api";
import {RootStateType} from "../../app/store";

export const fetchJokes = createAsyncThunk('jokes/fetchJokes', async (arg, {
    dispatch,
    getState
}) => {
    let res = await jokesAPI.getJokes()
    const getIdsNewJokes = res.data.map(j => j.id)
    const state = getState() as RootStateType
    const getIdsCurrentJokes = state.jokes.jokes.map(j => j.id)
    let intersection = getIdsCurrentJokes.filter((x: any) => getIdsNewJokes.includes(x));
    if (!intersection.length) {
        try {
            dispatch(setJokes({jokes: res.data}))
        } catch (e: any) {
            console.log(e)
            // handleServerNetworkError(e, dispatch)
        }
    } else {
        dispatch(updateRepeatingIdsOfJokesList({number: intersection.length}))
        dispatch(fetchJokes())
    }
})

export const refreshJoke = createAsyncThunk('jokes/refreshJoke', async (id: number, {dispatch}) => {
    let res = await jokesAPI.getOneJoke()
    if (res.data.id !== id) {
        try {
            dispatch(changeJoke({id, joke: {...res.data}}))
        } catch (e: any) {
            console.log(e)
            // handleServerNetworkError(e, dispatch)
        }
    } else {
        dispatch(refreshJoke(id))
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
        deleteJoke(state, action: PayloadAction<{ id: number }>) {
            state.jokes.filter(j => j.id !== action.payload.id)
            const index = state.jokes.findIndex(j => j.id === action.payload.id)
            state.jokes.splice(index, 1)
        },
        changeJoke(state, action: PayloadAction<{ joke: JokeType, id: number }>) {
            const index = state.jokes.findIndex(j => j.id === action.payload.id)
            state.jokes.splice(index, 1, action.payload.joke)
        },
        updateRepeatingIdsOfJokesList(state, action: PayloadAction<{ number: number }>) {
            state.repeatingIdsOfJokesList += +action.payload.number
        }
    }
})

export const {
    updateRepeatingIdsOfJokesList,
    changeJoke,
    setJokes,
    deleteJoke
} = slice.actions
export const jokesReducer = slice.reducer
