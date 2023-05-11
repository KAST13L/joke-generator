import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jokesAPI, JokeType } from "../../common/api/jokes-api";
import { RootStateType } from "../../app/store/store";
import {
  addJokeToLocaleStorage,
  deleteJokeFromLocaleStorage,
  uploadFavoriteJokesAndDetermineIntersection,
} from "../../common/utils/localeStorage";
import { MAX_FAVORITE_JOKES_COUNT } from "../../common/utils/variables";

const fetchJokes = createAsyncThunk(
  "jokes/fetchJokes",
  async (arg, { dispatch, getState, rejectWithValue }) => {
    const res = await jokesAPI.getJokes();
    const { transformedJokes, intersection } =
      uploadFavoriteJokesAndDetermineIntersection(res.data, getState);
    if (!intersection.length) {
      return { jokes: transformedJokes };
    } else {
      dispatch(
        jokesActions.updateRepeatingIdsOfJokesList({
          repeatingJokesCount: intersection.length,
        })
      );
      dispatch(fetchJokes());
      return rejectWithValue({});
    }
  }
);
const refreshJoke = createAsyncThunk(
  "jokes/refreshJoke",
  async (id: number, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootStateType;

    let res = await jokesAPI.getOneJoke();
    if (state.jokes.jokes.some((j) => j.id === res.data.id)) {
      dispatch(refreshJoke(id));
    } else {
      if (res.data) {
        return { id, joke: { ...res.data, favorite: false } };
      } else {
        return rejectWithValue({ error: res.data });
      }
    }
  }
);

const deleteJoke = createAsyncThunk("jokes/delete", async (id: number) => {
  return { id };
});
const addToFavorite = createAsyncThunk(
  "jokes/addToFavorite",
  (joke: JokeType, { rejectWithValue }) => {
    const result = addJokeToLocaleStorage(joke);
    if (result.isDone) {
      return { id: joke.id };
    } else {
      return rejectWithValue({
        error: `the maximum number of favorite jokes is ${MAX_FAVORITE_JOKES_COUNT}`,
      });
    }
  }
);

export const slice = createSlice({
  name: "jokes",
  initialState: {
    jokes: [] as JokeType[],
    repeatingIdsOfJokesList: 0 as number,
  },
  reducers: {
    updateRepeatingIdsOfJokesList(
      state,
      action: PayloadAction<{ repeatingJokesCount: number }>
    ) {
      state.repeatingIdsOfJokesList += +action.payload.repeatingJokesCount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteJoke.fulfilled, (state, action) => {
        state.jokes.filter((j) => j.id !== action.payload.id);
        const index = state.jokes.findIndex((j) => j.id === action.payload.id);
        state.jokes.splice(index, 1);
        deleteJokeFromLocaleStorage(action.payload.id);
      })
      .addCase(addToFavorite.fulfilled, (state, action) => {
        const index = state.jokes.findIndex((j) => j.id === action.payload?.id);
        state.jokes[index].favorite = true;
      })
      .addCase(refreshJoke.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.jokes.findIndex(
            (j) => j.id === action.payload?.id
          );
          state.jokes.splice(index, 1, action.payload.joke);
          deleteJokeFromLocaleStorage(action.payload.id);
        }
      })
      .addCase(fetchJokes.fulfilled, (state, action) => {
        state.jokes = state.jokes.concat(action.payload.jokes);
      });
  },
});

export const jokesReducer = slice.reducer;
export const jokesActions = slice.actions;
export const jokesThunks = {
  fetchJokes,
  deleteJoke,
  addToFavorite,
  refreshJoke,
};
