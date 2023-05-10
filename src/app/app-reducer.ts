import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {STATUS} from "../common/utils/variables";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    success: string | null
}

const initialState: InitialStateType = {
    status: STATUS.IDLE,
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
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.status = "loading";
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    const { payload, error } = action;
                    if (payload) {
                        state.error = payload.error
                            ? payload.error
                            : "some error occurred";
                    } else {
                        state.error = error.message ? error.message : "some error occurred";
                    }
                    state.status = "failed";
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/fulfilled"),
                (state) => {
                    state.status = "succeeded";
                }
            )
    }
})

export const {setAppError, setAppStatus, setAppSuccess} = slice.actions
export const appReducer = slice.reducer
