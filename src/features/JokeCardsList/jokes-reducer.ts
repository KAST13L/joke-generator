import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {jokesAPI, JokeType} from "../../common/api/jokes-api";
import {RootStateType} from "../../app/store/store";
import {
    deleteJokeFromLocaleStorage,
    getFavoriteJokes,
    saveFavoriteJokes
} from "../../common/utils/localeStorage";
import {MAX_FAVORITE_JOKES_COUNT} from "../../common/utils/variables";
import {setAppError, setAppSuccess} from "../../app/app-reducer";
import {
    handleServerAppError,
    handleServerNetworkError
} from "../../common/utils/error-utils";

const fetchJokes = createAsyncThunk('jokes/fetchJokes', async (arg, {
    dispatch,
    getState
}) => {


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
            dispatch(jokesActions.setJokes({jokes}))
            dispatch(setAppSuccess({success: 'Jokes received'}))
        } else {
            dispatch(jokesActions.updateRepeatingIdsOfJokesList({repeatingJokesCount: intersection.length}))
            dispatch(fetchJokes())
        }
    } catch (e: any) {
        handleServerAppError(e, dispatch)
    }
})

const refreshJoke = createAsyncThunk('jokes/refreshJoke', async (id: number, {dispatch}) => {

    deleteJokeFromLocaleStorage(id)

    let res = await jokesAPI.getOneJoke()
    if (res.data.id !== id) {
        try {
            dispatch(jokesActions.changeJoke({id, joke: {...res.data, favorite: false}}))
            dispatch(setAppSuccess({success: 'Joke refreshed'}))
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
        }
    } else {
        dispatch(refreshJoke(id))
    }
})

const deleteJoke = createAsyncThunk('jokes/delete', async (id: number, {dispatch}) => {
    dispatch(setAppSuccess({success: 'Joke deleted'}))
    return {id}
})

const addToFavorite = createAsyncThunk('jokes/addToFavorite', (joke: JokeType, {
    dispatch
}) => {
    let prevState: JokeType[] = getFavoriteJokes()

    if (prevState.length && prevState.length === MAX_FAVORITE_JOKES_COUNT) {
        dispatch(setAppError({error: `the maximum number of favorite jokes is ${MAX_FAVORITE_JOKES_COUNT}`}))
    } else {
        prevState = prevState.concat({...joke, favorite: true})
        saveFavoriteJokes(prevState)
        dispatch(setAppSuccess({success: 'Joke has been added to the list of favorites'}))
        dispatch(jokesActions.changeFavoriteField({id: joke.id, isFavorite: true}))
    }
})

export const slice = createSlice({
    name: 'jokes',
    initialState: {
        jokes: [] as JokeType[],
        repeatingIdsOfJokesList: 0 as number
    },
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteJoke.fulfilled, (state, action) => {
                state.jokes.filter(j => j.id !== action.payload.id)
                const index = state.jokes.findIndex(j => j.id === action.payload.id)
                state.jokes.splice(index, 1)
                deleteJokeFromLocaleStorage(action.payload.id)
            })
    }
})

export const jokesReducer = slice.reducer
export const jokesActions = slice.actions
export const jokesThunks = {fetchJokes, deleteJoke, addToFavorite, refreshJoke}
