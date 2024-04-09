import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  BeaconInfo,
  RecvMessageInfo,
  getBeaconInfo,
  getBeaconRecv,
} from "./util";

export interface CounterState {
  value: number;
}

const initialInfo: BeaconInfo = {
  id: 0,
  available: [],
  battery: "N/A",
};

const initialRecv: RecvMessageInfo[] = [];

export const infoSlice = createSlice({
  name: "info",
  initialState: initialInfo,
  reducers: {
    updateInfo: (state) => {
      getBeaconInfo().then((i) => (state = i));
    },
  },
});

export const recvSlice = createSlice({
  name: "recv",
  initialState: initialRecv,
  reducers: {
    updateRecv: (state) => {
      getBeaconRecv().then((i: any) => (state = i));
    },
  },
});

export const store = configureStore({
  reducer: {
    info: infoSlice.reducer,
    recv: recvSlice.reducer,
  },
});

export const { updateInfo } = infoSlice.actions;
export const { updateRecv } = recvSlice.actions;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
