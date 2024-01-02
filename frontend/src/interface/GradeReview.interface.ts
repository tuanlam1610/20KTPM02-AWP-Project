import { Class, Student, Teacher, User } from '.';
import GradeComposition from './GradeComposition.interface';

export default interface GradeReview {
  student: Partial<Student>;
  teacher?: Partial<Teacher>;
  class: Partial<Pick<Class, 'id' | 'name'>>;
  id: string;
  expectedGrade: number;
  currentGrade: number;
  finalGrade?: number;
  studentGrade: {
    grade: number;
    gradeComposition: Partial<GradeComposition>;
  };
  explanation: string;
  status: 'Open' | 'Denied' | 'Accepted';
  createdAt?: string;
  updatedAt?: string;
}
