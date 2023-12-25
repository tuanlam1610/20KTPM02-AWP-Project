import GradeComposition from './GradeComposition.interface';

export interface Class {
  id: string;
  name: string;
  description: string;
  code?: string;
  invitationLink?: string;
  gradeCompositions?: GradeComposition[];
}
