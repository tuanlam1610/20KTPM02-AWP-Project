import User from './User.interface';
import GradeReview from './GradeReview.interface';
import GradeComposition from './GradeComposition.interface';
import Class from './Class.interface';
import Comment from './Comment.interface';

export interface Teacher {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
}

export interface Admin {
  id: string;
  user: Partial<Pick<User, 'id' | 'name'>>;
}

export { User, GradeComposition, GradeReview, Class, Comment };
