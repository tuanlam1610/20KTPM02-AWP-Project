import { createSlice } from '@reduxjs/toolkit';
import { Loading } from '../utils/enum';
import { User } from '../interface/';

interface ScheduleState {
  loading: Loading;
  userInfo?: User;
}

const initialState: ScheduleState = {
  loading: Loading.idle,
  userInfo: undefined,
};

const appSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers(builder) {
    builder;
  },
});

export const { setLoading, setUserInfo } = appSlice.actions;
export default appSlice;
