import { createSlice } from '@reduxjs/toolkit';

interface TeacherSliceInterface {
  classes: {
    name: string;
    description: string;
    courseImg: string;
  }[];
}

const initialState: TeacherSliceInterface = {
  classes: [
    {
      name: 'CBA1 - Business Analysis 1',
      description: 'This is online course for business analysis 1',
      courseImg:
        'https://cdn.create.vista.com/downloads/b1ec016d-2cd8-4c23-ba56-0b4f3bfe19fa_1024.jpeg',
    },
    {
      name: 'CUX1 - UI UX Fundamental 1',
      description: 'This is online course for UI UX fundamental knowledge 1',
      courseImg:
        'https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg',
    },
    {
      name: 'CBA2 - Business Analysis 2',
      description: 'This is online course for business analysis 2',
      courseImg:
        'https://cdn.create.vista.com/downloads/b1ec016d-2cd8-4c23-ba56-0b4f3bfe19fa_1024.jpeg',
    },
    {
      name: 'CUX1 - UI UX Fundamental 2',
      description: 'This is online course for UI UX fundamental knowledge 2',
      courseImg:
        'https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg',
    },
    {
      name: 'CBA5 - Business Analysis 3',
      description: 'This is online course for business analysis 5',
      courseImg:
        'https://cdn.create.vista.com/downloads/b1ec016d-2cd8-4c23-ba56-0b4f3bfe19fa_1024.jpeg',
    },
    // {
    //   name: 'CUX1 - UI UX Fundamental 3',
    //   description: 'This is online course for UI UX fundamental knowledge 3',
    //   courseImg:
    //     'https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg',
    // },
    // {
    //   name: 'CBA7 - Business Analysis 4',
    //   description: 'This is online course for business analysis 7',
    //   courseImg:
    //     'https://cdn.create.vista.com/downloads/b1ec016d-2cd8-4c23-ba56-0b4f3bfe19fa_1024.jpeg',
    // },
    // {
    //   name: 'CUX1 - UI UX Fundamental 4',
    //   description: 'This is online course for UI UX fundamental knowledge 4',
    //   courseImg:
    //     'https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg',
    // },
    // {
    //   name: 'CBA9 - Business Analysis 5',
    //   description: 'This is online course for business analysis 9',
    //   courseImg:
    //     'https://cdn.create.vista.com/downloads/b1ec016d-2cd8-4c23-ba56-0b4f3bfe19fa_1024.jpeg',
    // },
    // {
    //   name: 'CUX1 - UI UX Fundamental 5',
    //   description: 'This is online course for UI UX fundamental knowledge 5',
    //   courseImg:
    //     'https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg',
    // },
  ],
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    addClass: (state, action) => {
      state.classes = [...state.classes, action.payload];
    },
  },
  extraReducers(builder) {
    builder;
  },
});

export const { addClass } = teacherSlice.actions;
export default teacherSlice;
