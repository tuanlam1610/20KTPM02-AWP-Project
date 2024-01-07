import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import GradeComposition from '../interface/GradeComposition.interface';
import {
  deleteGradeCompositionInMap,
  updateGradeCompositionInMap,
} from './classDetailSlice';
import { RootState } from './store';

export const getGradeComposition = createAsyncThunk(
  'classDetail/getGradeComposition',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const [gradeCompositionListResult] = await Promise.all([
        await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_SERVER_URL
          }/classes/${id}/getGradeStructure`,
          // {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          //   },
          // },
        ),
      ]);
      return {
        gradeCompositionList: gradeCompositionListResult.data
          .gradeCompositions as GradeComposition[],
      };
    } catch (error) {
      throw rejectWithValue(error);
    }
  },
);

export const updateGradeComposition = createAsyncThunk(
  'classDetail/updateGradeComposition',
  async (
    { gradeId, body }: { gradeId: string; body: any },
    { rejectWithValue, dispatch },
  ) => {
    try {
      await axios.patch(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/grade-compositions/${gradeId}`,
        body,
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        //   },
        // },
      );
      dispatch(updateGradeCompositionInMap({ gradeId, body }));
    } catch (error) {
      // dispatch(deleteGradeCompositionInMap(gradeId));
      throw rejectWithValue(error);
    }
  },
);

export const deleteGradeComposition = createAsyncThunk(
  'classDetail/deleteGradeComposition',
  async ({ gradeId }: { gradeId: string }, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/grade-compositions/${gradeId}`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        //   },
        // },
      );
      dispatch(deleteGradeCompositionInMap(gradeId));
    } catch (error) {
      // dispatch(deleteGradeCompositionInMap(gradeId));
      throw rejectWithValue(error);
    }
  },
);
