import { BrandSlug, BrandTitle, Ecosystem } from '@/interface/stack';

/**
 * 깃허브 리포지토리.
 */
export default interface Repository {
  default_branch?: string;
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
  topics?: string[];
  framework?: BrandTitle;
  descriptive_slug?: BrandSlug;
  framework_candidates?: Candidate[];
  ecosystems?: Ecosystem[];
}

/**
 * GitHub 사용자.
 */
export interface Owner {
  login: string;
  avatar_url: string;
}
