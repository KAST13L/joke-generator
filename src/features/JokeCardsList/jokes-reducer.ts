import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {jokesAPI, JokeType} from "../../api/jokes-api";

export const fetchJokes = createAsyncThunk('jokes/fetchJokes', async (arg, {dispatch}) => {
    const res = await jokesAPI.getJokes()
    try {
        dispatch(setJokes({jokes: res.data}))
    } catch (e: any) {
        console.log(e)
        // handleServerNetworkError(e, dispatch)
    }
})
export const refreshJoke = createAsyncThunk('jokes/refreshJoke', async (id: number, {dispatch}) => {
    let res = await jokesAPI.getOneJoke()
    if (res.data.id === id) {
        res = await jokesAPI.getOneJoke()
    }
    try {
        dispatch(changeJoke({id, joke: {...res.data}}))
    } catch (e: any) {
        console.log(e)
        // handleServerNetworkError(e, dispatch)
    }
})

const initialState = {
    jokes: [] as JokeType[]
}

export const slice = createSlice({
    name: 'jokes',
    initialState: initialState,
    reducers: {
        setJokes(state, action: PayloadAction<{ jokes: JokeType[] }>) {
            return {
                ...state, jokes: state.jokes.concat(action.payload.jokes)
            }
        },
        deleteJoke(state, action: PayloadAction<{ id: number }>) {
            state.jokes.filter(j => j.id !== action.payload.id)
            const index = state.jokes.findIndex(j => j.id === action.payload.id)
            state.jokes.splice(index, 1)
        },
        changeJoke(state, action: PayloadAction<{ joke: JokeType, id: number }>) {
            const index = state.jokes.findIndex( j => j.id === action.payload.id)
            state.jokes.splice(index, 1, action.payload.joke)
        }
    }
})

export const {changeJoke,setJokes, deleteJoke} = slice.actions
export const jokesReducer = slice.reducer
