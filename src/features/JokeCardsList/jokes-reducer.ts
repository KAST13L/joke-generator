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

export const refreshJokeT = createAsyncThunk('jokes/refreshJokeT', async ({id}:{id: number}, {dispatch}) => {
    const res = await jokesAPI.getOneJoke()
    try {
        dispatch(refreshJoke({id, joke: {...res.data}}))
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
        setJokes(state, action: PayloadAction<{ jokes: Array<JokeType> }>) {
            return {
                ...state, ...action.payload,
            }
        },
        deleteJoke(state, action: PayloadAction<{ id: number }>) {
            state.jokes.filter(j => j.id !== action.payload.id)
            const index = state.jokes.findIndex(j => j.id === action.payload.id)
            state.jokes.splice(index, 1)
        },
        refreshJoke(state, action: PayloadAction<{ joke: JokeType, id: number }>) {
            const index = state.jokes.findIndex( j => j.id === action.payload.id)
            state.jokes.splice(index, 1, action.payload.joke)
        }
    }
})

export const {refreshJoke,setJokes, deleteJoke} = slice.actions
export const jokesReducer = slice.reducer
