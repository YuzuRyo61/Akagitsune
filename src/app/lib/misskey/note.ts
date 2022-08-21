import { MisskeyUser } from './user';


export interface MisskeyNote {
  id: string;
  createdAt: string;
  text: string | null;
  cw: string | null;
  user: MisskeyUser;
  visibility: string;
}
