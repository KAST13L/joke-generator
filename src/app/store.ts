import {combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {configureStore} from "@reduxjs/toolkit";
import {appReducer} from "./app-reducer";
import {jokesReducer} from "../features/JokeCardsList/jokes-reducer";


const rootReducer = combineReducers({
    app: appReducer,
    jokes: jokesReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type RootStateType = ReturnType<typeof rootReducer>