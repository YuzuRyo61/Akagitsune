export interface MisskeyUser {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  isBot: boolean;
}
