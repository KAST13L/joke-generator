import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    success: string | null
}

const initialState: InitialStateType = {
    status: 'loading',
    error: null,
    success: null,
}

export const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppSuccess(state, action: PayloadAction<{ success: string | null }>) {
            state.success = action.payload.success
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        }
    }
})

export const {setAppError, setAppStatus, setAppSuccess} = slice.actions
export const appReducer = slice.reducer
