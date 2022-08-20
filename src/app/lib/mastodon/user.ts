export interface MastodonUser {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
  acct: string;
  header: string;
  bot: boolean;
}
