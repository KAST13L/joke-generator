import {Dispatch} from "redux";
import {setAppError, setAppStatus} from "../../app/app-reducer";
import {STATUS} from "./variables";
import {ResponseServerErrorType} from "../api/jokes-api";

export function handleServerAppError(data: ResponseServerErrorType, dispatch: Dispatch) {
    if (data.message) {
        dispatch(setAppError({error: data.message}))
    } else {
        dispatch(setAppError({error: 'Some error occurred'}))
    }
    dispatch(setAppStatus({status: STATUS.FAILED}))
}

export function handleServerNetworkError(error: { message: string }, dispatch: Dispatch) {
    dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}))
    dispatch(setAppStatus({status: STATUS.FAILED}))
}
