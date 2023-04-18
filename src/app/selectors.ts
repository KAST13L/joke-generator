import {RootStateType} from "./store";

export const selectStatus = (state: RootStateType) => state.app.status;