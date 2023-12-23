import { createSlice } from '@reduxjs/toolkit';
import { assign } from 'lodash';
import GradeComposition from '../interface/GradeComposition.interface';
import { Loading } from '../utils/enum';
import { fetchInitData } from './classDetailThunks';

interface AppState {
  loading: Loading;
  gradeCompositionMap: Record<string, GradeComposition>;
}

const initialState: AppState = {
  loading: Loading.idle,
  gradeCompositionMap: {},
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    deleteGradeCompositionInMap: (state, action) => {
      delete state.gradeCompositionMap[action.payload];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchInitData.pending, (state) => {
        state.loading = Loading.pending;
      })
      .addCase(fetchInitData.fulfilled, (state, action) => {
        state.loading = Loading.fulfilled;
        const { gradeCompositionList } = action.payload;
        gradeCompositionList.forEach((grade) => {
          assign(state.gradeCompositionMap, { [grade.id]: grade });
        });
      });
  },
});

export const { setLoading, deleteGradeCompositionInMap } = appSlice.actions;
export default appSlice;
