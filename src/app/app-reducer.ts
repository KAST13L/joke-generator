import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { STATUS } from "../common/utils/variables";
import { jokesThunks } from "../features/JokeCardsList/jokes-reducer";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  success: string | null;
};

export const slice = createSlice({
  name: "app",
  initialState: {
    status: STATUS.IDLE,
    error: null,
    success: null,
  } as InitialStateType,
  reducers: {
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setAppSuccess(state, action: PayloadAction<{ success: string | null }>) {
      state.success = action.payload.success;
    },
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(jokesThunks.toggleIsFavorite.fulfilled, (state) => {
        state.success = "Favorite list changed";
      })
      .addCase(jokesThunks.fetchJokes.fulfilled, (state) => {
        state.success = "Jokes received";
      })
      .addCase(jokesThunks.refreshJoke.fulfilled, (state) => {
        state.success = "Joke refreshed";
      })
      .addCase(jokesThunks.deleteJoke.fulfilled, (state) => {
        state.success = "Joke deleted";
      })
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
            state.error = payload.message ? payload.message : payload.error;
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
      );
  },
});

export const appActions = slice.actions;
export const appReducer = slice.reducer;
