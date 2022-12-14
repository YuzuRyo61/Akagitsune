export interface MisskeyUser {
  id: string;
  username: string;
  host: string | null;
  name: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  isBot: boolean;
  description: string | null;
  isAdmin: boolean;
  isModerator: boolean;
  followersCount: number;
  followingCount: number;
  notesCount: number;
}
