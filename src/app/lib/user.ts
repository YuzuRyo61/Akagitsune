export interface User {
  id: string;
  username: string;
  host?: string | null;
  display_name?: string | null;
  avatar_url: string;
}
