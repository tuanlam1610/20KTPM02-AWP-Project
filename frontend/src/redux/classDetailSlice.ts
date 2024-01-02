import { createSlice } from '@reduxjs/toolkit';
import { assign } from 'lodash';
import GradeComposition from '../interface/GradeComposition.interface';
import { Loading } from '../utils/enum';
import { getGradeComposition } from './classDetailThunks';

interface AppState {
  loading: Loading;
  gradeCompositionMap: Record<string, GradeComposition>;
}

const initialState: AppState = {
  loading: Loading.idle,
  gradeCompositionMap: {},
};

const classDetailSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    reset: () => initialState,
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateGradeCompositionInMap: (state, action) => {
      const { id, body } = action.payload;
      Object.assign(state.gradeCompositionMap[id], body);
    },
    deleteGradeCompositionInMap: (state, action) => {
      delete state.gradeCompositionMap[action.payload];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getGradeComposition.pending, (state) => {
        state.loading = Loading.pending;
      })
      .addCase(getGradeComposition.rejected, (state) => {
        state.loading = Loading.error;
      })
      .addCase(getGradeComposition.fulfilled, (state, action) => {
        state.loading = Loading.fulfilled;
        const { gradeCompositionList } = action.payload;
        gradeCompositionList.forEach((grade) => {
          assign(state.gradeCompositionMap, { [grade.id]: grade });
        });
      });
  },
});

export const {
  setLoading,
  deleteGradeCompositionInMap,
  reset,
  updateGradeCompositionInMap,
} = classDetailSlice.actions;
export default classDetailSlice;
