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
  grade: Partial<Pick<GradeComposition, 'id' | 'name'>>;
  explanation: string;
  status: 'Open' | 'Denied' | 'Accepted';
  createdAt?: string;
  updatedAt?: string;
}
