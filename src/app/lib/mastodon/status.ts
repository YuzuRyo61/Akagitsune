import { MastodonUser } from './user';


export interface MastodonStatus {
  id: string;
  created_at: string;
  spoiler_text: string;
  url: string;
  uri: string;
  visibility: string;
  content: string;
  account: MastodonUser;
  reblog: MastodonStatus | null;
}
