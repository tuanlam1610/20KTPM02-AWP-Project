import { createSlice } from '@reduxjs/toolkit';
import { Loading } from '../utils/enum';
import { User } from '../interface/';
import { Class } from '../interface/Class.interface';

interface AppState {
  loading: Loading;
  userInfo?: User;
  isAuthenticated: boolean;
  classes: Class[];
}

const initialState: AppState = {
  loading: Loading.idle,
  userInfo: undefined,
  isAuthenticated: false,
  classes: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setClasses: (state, action) => {
      state.classes = action.payload;
    },
    addClass: (state, action) => {
      state.classes = [...state.classes, action.payload];
    },
  },
  extraReducers(builder) {
    builder;
  },
});

export const {
  setLoading,
  setUserInfo,
  setIsAuthenticated,
  setClasses,
  addClass,
} = appSlice.actions;
export default appSlice;
