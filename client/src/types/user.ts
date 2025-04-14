export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar_path?: string;
  avatar_url?: string;
  created_at: string;
  last_login?: string;
}
