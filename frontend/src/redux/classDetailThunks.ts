import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import GradeComposition from '../interface/GradeComposition.interface';
import { deleteGradeCompositionInMap } from './classDetailSlice';
import { RootState } from './store';

export const fetchInitData = createAsyncThunk(
  'classDetail/fetchInitData',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const gradeCompositionList: GradeComposition[] = await axios.get(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/class/${id}/grade`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      return { gradeCompositionList };
    } catch (error) {
      const gradeCompositionList: GradeComposition[] = [
        {
          id: '1',
          name: 'Midterm',
          percentage: 30,
          rank: 1,
          classId: '123',
          isFinalized: false,
        },
        {
          id: '2',
          name: 'Final',
          percentage: 50,
          rank: 0,
          classId: '123',
          isFinalized: false,
        },
        {
          id: '3',
          name: 'Assignment 1',
          percentage: 30,
          rank: 2,
          classId: '123',
          isFinalized: false,
        },
        {
          id: '4',
          name: 'Assignment 2',
          percentage: 30,
          rank: 3,
          classId: '123',
          isFinalized: false,
        },
        {
          id: '5',
          name: 'Midterm',
          percentage: 30,
          rank: 4,
          classId: '123',
          isFinalized: false,
        },
        {
          id: '6',
          name: 'Final',
          percentage: 50,
          rank: 5,
          classId: '123',
          isFinalized: false,
        },
        {
          id: '7',
          name: 'Assignment 1',
          percentage: 30,
          rank: 6,
          classId: '123',
          isFinalized: false,
        },
        {
          id: '8',
          name: 'Assignment 2',
          percentage: 30,
          rank: 7,
          classId: '123',
          isFinalized: true,
        },
        {
          id: '9',
          name: 'Assignment 1',
          percentage: 30,
          rank: 6,
          classId: '123',
          isFinalized: false,
        },
        {
          id: '10',
          name: 'Assignment 1',
          percentage: 30,
          rank: 6,
          classId: '123',
          isFinalized: false,
        },
        {
          id: '11',
          name: 'Assignment 1',
          percentage: 30,
          rank: 6,
          classId: '123',
          isFinalized: false,
        },
        {
          id: '12',
          name: 'Assignment 1',
          percentage: 30,
          rank: 6,
          classId: '123',
          isFinalized: false,
        },
        {
          id: '13',
          name: 'Assignment 1',
          percentage: 30,
          rank: 6,
          classId: '123',
          isFinalized: false,
        },
      ];

      return { gradeCompositionList };
      // rejectWithValue(error);
    }
  },
);

export const deleteGradeComposition = createAsyncThunk(
  'classDetail/deleteGradeComposition',
  async (
    { classId, gradeId }: { classId: string; gradeId: string },
    { rejectWithValue, dispatch, getState },
  ) => {
    try {
      const state = getState() as RootState;
      await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/class/${classId}/grade/${gradeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      dispatch(deleteGradeCompositionInMap(gradeId));
    } catch (error) {
      dispatch(deleteGradeCompositionInMap(gradeId));
      // rejectWithValue(error);
    }
  },
);
