import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import appSlice from './appSlice';
import teacherSlice from './teacherSlice';

export const appStore = configureStore({
  reducer: {
    app: appSlice.reducer,
    teacher: teacherSlice.reducer
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
