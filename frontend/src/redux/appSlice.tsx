import { createSlice } from '@reduxjs/toolkit';
import { Loading } from '../utils/enum';
import { User } from '../interface/';

interface AppState {
  loading: Loading;
  userInfo?: User;
  userRole?: string;
  isAuthenticated: boolean;
}

const initialState: AppState = {
  loading: Loading.idle,
  userInfo: undefined,
  userRole: undefined,
  isAuthenticated: false,
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
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
  },
  extraReducers(builder) {
    builder;
  },
});

export const { setLoading, setUserInfo, setIsAuthenticated, setUserRole } =
  appSlice.actions;
export default appSlice;
