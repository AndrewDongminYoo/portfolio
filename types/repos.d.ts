/**
 * 깃허브 리포지토리.
 */
export default interface Repository {
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: Owner;
  html_url: string;
  description: string;
  languages_url: string;
  pushed_at: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  forks_count: number;
  languages: Record<string, number>;
}

/**
 * GitHub 사용자.
 */
export interface Owner {
  login: string;
  avatar_url: string;
}
