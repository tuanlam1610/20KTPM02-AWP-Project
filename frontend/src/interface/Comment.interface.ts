import { User } from '.';

export default interface Comment {
  user: Partial<User>;
  createdAt: string;
  content: string;
}
