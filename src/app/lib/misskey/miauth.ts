import { MisskeyUser } from './user';


export interface MisskeyMiAuthResponse {
  ok: boolean;
  token?: string;
  user?: MisskeyUser;
}
