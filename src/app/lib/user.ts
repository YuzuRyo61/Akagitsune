export interface User {
  id: string;
  acct: string;
  display_name?: string | null;
  avatar_url: string | null;
  banner_url?: string | null;
  description?: string | null;
  bot?: boolean;
  following_count: number;
  follower_count: number;
  post_count: number;
}
