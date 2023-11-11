import { createSlice } from '@reduxjs/toolkit';
import { Loading } from '../utils/enum';
import { User } from '../interface/';

interface ScheduleState {
  loading: Loading;
  userMap: Record<string, User>;
}

const initialState: ScheduleState = {
  loading: Loading.idle,
  userMap: {},
};

const appSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers(builder) {
    builder;
  },
});

export const { setLoading } = appSlice.actions;
export default appSlice;
