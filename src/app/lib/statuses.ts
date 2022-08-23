import { User } from './user';


export interface Statuses {
  id: string;
  cw?: string | null;
  body: string | null;
  created_at: string;
  user: User;
  quote?: Statuses;
  reaction?: {
    [x: string]: number;
  }
  quoteCount: number;
  likeCount: number;
}
