export interface MastodonUser {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
  acct: string;
  header: string;
  bot?: boolean;
  note: string;
  statuses_count: number;
  followers_count: number;
  following_count: number;
}
