import GradeComposition from './GradeComposition.interface';

export default interface Class {
  id: string;
  name: string;
  description: string;
  code?: string;
  invitationLink?: string;
  gradeCompositions?: GradeComposition[];
}
