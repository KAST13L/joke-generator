import {combineReducers} from 'redux'
import {configureStore} from "@reduxjs/toolkit";
import {appReducer} from "../app-reducer";
import {jokesReducer} from "../../features/JokeCardsList/jokes-reducer";


const rootReducer = combineReducers({
    app: appReducer,
    jokes: jokesReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})

export type AppDispatch = typeof store.dispatch;
export type RootStateType = ReturnType<typeof rootReducer>
// @ts-ignore
window.store = store;