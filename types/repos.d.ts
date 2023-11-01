/**
 * 전체 리포지토리.
 */
export default interface Repository {
  allow_auto_merge?:    boolean;
  allow_forking?:       boolean;
  allow_merge_commit?:  boolean;
  allow_rebase_merge?:  boolean;
  allow_squash_merge?:  boolean;
  allow_update_branch?: boolean;
  /**
   * 익명 Git 액세스가 허용되는지 여부.
   */
  anonymous_access_enabled?: boolean;
  archive_url:               string;
  archived:                  boolean;
  assignees_url:             string;
  blobs_url:                 string;
  branches_url:              string;
  clone_url:                 string;
  /**
   * 행동 강령.
   */
  code_of_conduct?:        CodeOfConductSimple;
  collaborators_url:       string;
  comments_url:            string;
  commits_url:             string;
  compare_url:             string;
  contents_url:            string;
  contributors_url:        string;
  created_at:              string;
  default_branch:          string;
  delete_branch_on_merge?: boolean;
  deployments_url:         string;
  description:             null | string;
  /**
   * 이 리포지토리가 비활성화되었는지 여부를 반환.
   */
  disabled:          boolean;
  downloads_url:     string;
  events_url:        string;
  fork:              boolean;
  forks:             number;
  forks_count:       number;
  forks_url:         string;
  full_name:         string;
  git_commits_url:   string;
  git_refs_url:      string;
  git_tags_url:      string;
  git_url:           string;
  has_discussions:   boolean;
  has_downloads?:    boolean;
  has_issues:        boolean;
  has_pages:         boolean;
  has_projects:      boolean;
  has_wiki:          boolean;
  homepage:          null | string;
  hooks_url:         string;
  html_url:          string;
  id:                number;
  is_template?:      boolean;
  issue_comment_url: string;
  issue_events_url:  string;
  issues_url:        string;
  keys_url:          string;
  labels_url:        string;
  language:          null | string;
  languages_url:     string;
  license:           null | LicenseSimple;
  master_branch?:    string;
  /**
   * 병합 커밋 메시지의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
   * - `PR_BODY` - 기본값은 풀리퀘스트의 본문.
   * - `BLANK` - 기본값은 빈 커밋 메시지.
   */
  merge_commit_message?: MergeCommitMessage;
  /**
   * 병합 커밋 제목의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
   * - `MERGE_MESSAGE` - 기본값은 병합 메시지의 클래식 제목(예: Merge pull request #123 from branch-name).
   */
  merge_commit_title?: MergeCommitTitle;
  merges_url:          string;
  milestones_url:      string;
  mirror_url:          null | string;
  name:                string;
  network_count:       number;
  node_id:             string;
  notifications_url:   string;
  open_issues:         number;
  open_issues_count:   number;
  organization?:       null | SimpleUser;
  /**
   * GitHub 사용자.
   */
  owner: SimpleUser;
  /**
   * GitHub의 리포지토리.
   */
  parent?:                ParentObject;
  permissions?:           Permissions;
  private:                boolean;
  pulls_url:              string;
  pushed_at:              string;
  releases_url:           string;
  security_and_analysis?: null | SecurityAndAnalysis;
  /**
   * 리포지토리의 크기. 크기는 매시간 계산됩니다. 리포지토리가 처음 만들어지면 크기는 0.
   */
  size: number;
  /**
   * GitHub의 리포지토리.
   */
  source?: Object;
  /**
   * 스쿼시 병합 커밋 메시지의 기본값:
   *
   * - `PR_BODY` - 풀 리퀘스트 본문으로 기본값.
   * - `COMMIT_MESSAGES` - 브랜치의 커밋 메시지로 기본값.
   * - `BLANK` - 빈 커밋 메시지로 기본값.
   */
  squash_merge_commit_message?: SquashMergeCommitMessage;
  /**
   * 스쿼시 병합 커밋 제목의 기본값 :
   *
   * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
   * - `COMMIT_OR_PR_TITLE` - 기본값은 커밋 제목(커밋이 하나만 있는 경우) 또는 풀 리퀘스트의 제목(둘 이상의 커밋이 있는 경우).
   */
  squash_merge_commit_title?:      SquashMergeCommitTitle;
  ssh_url:                         string;
  stargazers_count:                number;
  stargazers_url:                  string;
  statuses_url:                    string;
  subscribers_count:               number;
  subscribers_url:                 string;
  subscription_url:                string;
  svn_url:                         string;
  tags_url:                        string;
  teams_url:                       string;
  temp_clone_token?:               null | string;
  template_repository?:            null | RepositoryObject;
  topics?:                         string[];
  trees_url:                       string;
  updated_at:                      string;
  url:                             string;
  use_squash_pr_title_as_default?: boolean;
  /**
   * 리포지토리 가시성: 공개, 비공개 또는 내부.
   */
  visibility?:                  string;
  watchers:                     number;
  watchers_count:               number;
  web_commit_signoff_required?: boolean;
}

/**
 * 행동 강령.
 */
export interface CodeOfConductSimple {
  html_url: null | string;
  key:      string;
  name:     string;
  url:      string;
}

/**
 * 라이선스.
 */
export interface LicenseSimple {
  html_url?: string;
  key:       string;
  name:      string;
  node_id:   string;
  spdx_id:   null | string;
  url:       null | string;
}

/**
 * 병합 커밋 메시지의 기본값.
 *
 * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
 * - `PR_BODY` - 기본값은 풀 리퀘스트의 본문.
 * - `BLANK` - 기본값은 공백 커밋 메시지.
 */
export enum MergeCommitMessage {
  Blank = "BLANK",
  PRBody = "PR_BODY",
  PRTitle = "PR_TITLE",
}

/**
 * 병합 커밋 제목의 기본값.
 *
 * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
 * - `MERGE_MESSAGE` - 기본값은 병합 메시지의 클래식 제목(예: Merge pull request #123 from branch-name).
 */
export enum MergeCommitTitle {
  MergeMessage = "MERGE_MESSAGE",
  PRTitle = "PR_TITLE",
}

/**
 * GitHub 사용자.
 */
export interface SimpleUser {
  avatar_url:          string;
  email?:              null | string;
  events_url:          string;
  followers_url:       string;
  following_url:       string;
  gists_url:           string;
  gravatar_id:         null | string;
  html_url:            string;
  id:                  number;
  login:               string;
  name?:               null | string;
  node_id:             string;
  organizations_url:   string;
  received_events_url: string;
  repos_url:           string;
  site_admin:          boolean;
  starred_at?:         string;
  starred_url:         string;
  subscriptions_url:   string;
  type:                string;
  url:                 string;
}

/**
 * GitHub의 리포지토리.
 */
export interface ParentObject {
  /**
   * 풀 리퀘스트에 자동 병합을 사용할 수 있도록 허용할지 여부.
   */
  allow_auto_merge?: boolean;
  /**
   * 이 리포지토리의 포크 허용 여부.
   */
  allow_forking: boolean;
  /**
   * 풀 리퀘스트에 대한 커밋 병합을 허용할지 여부.
   */
  allow_merge_commit?: boolean;
  /**
   * 풀리퀘스트에 리베이스 병합을 허용할지 여부.
   */
  allow_rebase_merge?: boolean;
  /**
   * 풀리퀘스트에 스쿼시 병합을 허용할지 여부.
   */
  allow_squash_merge?: boolean;
  /**
   * 베이스 브랜치 뒤에 있는 풀 리퀘스트 헤드 브랜치를 병합하기 전에 최신 상태로 유지할 필요가 없더라도 항상 업데이트할 수 있는지 여부.
   */
  allow_update_branch?: boolean;
  /**
   * 이 리포지토리에 대해 익명 Git 액세스를 사용하도록 설정했는지 여부.
   */
  anonymous_access_enabled?: boolean;
  archive_url?:              string;
  /**
   * 리포지토리가 아카이브되는지 여부.
   */
  archived:           boolean;
  assignees_url?:     string;
  blobs_url?:         string;
  branches_url?:      string;
  clone_url?:         string;
  collaborators_url?: string;
  comments_url?:      string;
  commits_url?:       string;
  compare_url?:       string;
  contents_url?:      string;
  contributors_url:   string;
  created_at:         null | string;
  /**
   * 리포지토리의 기본 브랜치.
   */
  default_branch: string;
  /**
   * 풀 리퀘스트 병합 시 헤드 브랜치를 삭제할지 여부.
   */
  delete_branch_on_merge?: boolean;
  deployments_url:         string;
  description:             null | string;
  /**
   * 이 리포지토리가 비활성화되었는지 여부를 반환.
   */
  disabled:         boolean;
  downloads_url:    string;
  events_url:       string;
  fork:             boolean;
  forks:            number;
  forks_count:      number;
  forks_url:        string;
  full_name:        string;
  git_commits_url?: string;
  git_refs_url?:    string;
  git_tags_url?:    string;
  git_url?:         string;
  /**
   * 토론이 활성화되었는지 여부.
   */
  has_discussions: boolean;
  /**
   * 다운로드가 활성화되었는지 여부.
   */
  has_downloads: boolean;
  /**
   * 이슈가 활성화되었는지 여부.
   */
  has_issues: boolean;
  has_pages:  boolean;
  /**
   * 프로젝트가 활성화되었는지 여부.
   */
  has_projects: boolean;
  /**
   * 위키가 활성화되었는지 여부.
   */
  has_wiki:  boolean;
  homepage?: null | string;
  hooks_url: string;
  html_url:  string;
  /**
   * 리포지토리의 고유 식별자.
   */
  id: number;
  /**
   * 이 리포지토리가 새 리포지토리를 생성하는 데 사용할 수 있는 템플릿 역할을 하는지 여부.
   */
  is_template:        boolean;
  issue_comment_url?: string;
  issue_events_url?:  string;
  issues_url?:        string;
  keys_url?:          string;
  labels_url?:        string;
  language:           null | string;
  languages_url:      string;
  license?:           null | ParentLicenseSimple;
  master_branch?:     string;
  /**
   * 병합 커밋 메시지의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
   * - `PR_BODY` - 기본값은 풀리퀘스트의 본문.
   * - `BLANK` - 기본값은 빈 커밋 메시지.
   */
  merge_commit_message?: MergeCommitMessage;
  /**
   * 병합 커밋 제목의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
   * - `MERGE_MESSAGE` - 기본값은 병합 메시지의 클래식 제목(예: Merge pull request #123 from branch-name).
   */
  merge_commit_title?: MergeCommitTitle;
  merges_url:          string;
  milestones_url?:     string;
  mirror_url?:         null | string;
  /**
   * 리포지토리 이름.
   */
  name:               string;
  network_count?:     number;
  node_id:            string;
  notifications_url?: string;
  open_issues:        number;
  open_issues_count:  number;
  organization?:      null | ParentSimpleUser;
  /**
   * GitHub 사용자.
   */
  owner:       ParentOwner;
  permissions: ParentPermissions;
  /**
   * 리포지토리가 비공개인지 공개인지 여부.
   */
  private:       boolean;
  pulls_url?:    string;
  pushed_at:     null | string;
  releases_url?: string;
  /**
   * 리포지토리의 크기. 크기는 시간별로 계산됩니다. 리포지토리가 처음 생성되면 크기는 0.
   */
  size: number;
  /**
   * 스쿼시 병합 커밋 메시지의 기본값:
   *
   * - `PR_BODY` - 풀 리퀘스트의 본문이 기본값.
   * - `COMMIT_MESSAGES` - 브랜치의 커밋 메시지가 기본값.
   * - `BLANK` - 빈 커밋 메시지가 기본값.
   */
  squash_merge_commit_message?: SquashMergeCommitMessage;
  /**
   * 스쿼시 병합 커밋 제목의 기본값:
   *
   * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
   * - `COMMIT_OR_PR_TITLE` - 기본값은 커밋의 제목(커밋이 하나만 있는 경우) 또는 풀 리퀘스트의 제목(둘 이상 있는 경우).
   */
  squash_merge_commit_title?: SquashMergeCommitTitle;
  ssh_url?:                   string;
  stargazers_count:           number;
  stargazers_url:             string;
  starred_at?:                string;
  statuses_url?:              string;
  subscribers_count?:         number;
  subscribers_url:            string;
  subscription_url:           string;
  svn_url:                    string;
  tags_url:                   string;
  teams_url:                  string;
  temp_clone_token?:          string;
  template_repository?:       null | ParentTemplateRepository;
  topics:                     string[];
  trees_url?:                 string;
  updated_at:                 null | string;
  url:                        string;
  /**
   * 스쿼시 병합 커밋이 풀 리퀘스트 제목을 기본값으로 사용할 수 있는지 여부.
   * **이 속성은 더 이상 사용되지 않는다. 대신 `squash_merge_commit_title`을 사용하세요.
   */
  use_squash_pr_title_as_default?: boolean;
  /**
   * 리포지토리 가시성: 공개, 비공개 또는 내부.
   */
  visibility:     string;
  watchers:       number;
  watchers_count: number;
  /**
   * 기여자가 웹 기반 커밋에 서명하도록 요구할지 여부.
   */
  web_commit_signoff_required: boolean;
  languages:                   any;
}

/**
 * 라이선스.
 */
export interface ParentLicenseSimple {
  html_url?: string;
  key:       string;
  name:      string;
  node_id:   string;
  spdx_id:   null | string;
  url:       null | string;
}

/**
 * GitHub 사용자.
 */
export interface ParentSimpleUser {
  avatar_url:          string;
  email?:              null | string;
  events_url:          string;
  followers_url:       string;
  following_url:       string;
  gists_url:           string;
  gravatar_id:         null | string;
  html_url:            string;
  id:                  number;
  login:               string;
  name?:               null | string;
  node_id:             string;
  organizations_url:   string;
  received_events_url: string;
  repos_url:           string;
  site_admin:          boolean;
  starred_at?:         string;
  starred_url:         string;
  subscriptions_url:   string;
  type:                string;
  url:                 string;
}

/**
 * GitHub 사용자.
 */
export interface ParentOwner {
  avatar_url:          string;
  email?:              null | string;
  events_url:          string;
  followers_url:       string;
  following_url:       string;
  gists_url:           string;
  gravatar_id:         null | string;
  html_url:            string;
  id:                  number;
  login:               string;
  name?:               null | string;
  node_id:             string;
  organizations_url:   string;
  received_events_url: string;
  repos_url:           string;
  site_admin:          boolean;
  starred_at?:         string;
  starred_url:         string;
  subscriptions_url:   string;
  type:                string;
  url:                 string;
}

export interface ParentPermissions {
  admin:     boolean;
  maintain?: boolean;
  pull:      boolean;
  push:      boolean;
  triage?:   boolean;
}

/**
 * 스쿼시 병합 커밋 메시지의 기본값:
 *
 * - `PR_BODY` - 풀 리퀘스트 본문으로 기본값.
 * - `COMMIT_MESSAGES` - 브랜치의 커밋 메시지로 기본값.
 * - `BLANK` - 빈 커밋 메시지로 기본값.
 */
export enum SquashMergeCommitMessage {
  Blank = "BLANK",
  CommitMessages = "COMMIT_MESSAGES",
  PRBody = "PR_BODY",
}

/**
 * 스쿼시 병합 커밋 제목의 기본값 :
 *
 * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
 * - `COMMIT_OR_PR_TITLE` - 기본값은 커밋 제목(커밋이 하나만 있는 경우) 또는 풀 리퀘스트의 제목(둘 이상의 커밋이 있는 경우).
 */
export enum SquashMergeCommitTitle {
  CommitOrPRTitle = "COMMIT_OR_PR_TITLE",
  PRTitle = "PR_TITLE",
}

export interface ParentTemplateRepository {
  allow_auto_merge?:       boolean;
  allow_merge_commit?:     boolean;
  allow_rebase_merge?:     boolean;
  allow_squash_merge?:     boolean;
  allow_update_branch?:    boolean;
  archive_url?:            string;
  archived?:               boolean;
  assignees_url?:          string;
  blobs_url?:              string;
  branches_url?:           string;
  clone_url?:              string;
  collaborators_url?:      string;
  comments_url?:           string;
  commits_url?:            string;
  compare_url?:            string;
  contents_url?:           string;
  contributors_url?:       string;
  created_at?:             string;
  default_branch?:         string;
  delete_branch_on_merge?: boolean;
  deployments_url?:        string;
  description?:            string;
  disabled?:               boolean;
  downloads_url?:          string;
  events_url?:             string;
  fork?:                   boolean;
  forks_count?:            number;
  forks_url?:              string;
  full_name?:              string;
  git_commits_url?:        string;
  git_refs_url?:           string;
  git_tags_url?:           string;
  git_url?:                string;
  has_downloads?:          boolean;
  has_issues?:             boolean;
  has_pages?:              boolean;
  has_projects?:           boolean;
  has_wiki?:               boolean;
  homepage?:               string;
  hooks_url?:              string;
  html_url?:               string;
  id?:                     number;
  is_template?:            boolean;
  issue_comment_url?:      string;
  issue_events_url?:       string;
  issues_url?:             string;
  keys_url?:               string;
  labels_url?:             string;
  language?:               string;
  languages_url?:          string;
  /**
   * 병합 커밋 메시지의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
   * - `PR_BODY` - 기본값은 풀 리퀘스트의 본문.
   * - `BLANK` - 기본값은 공백 커밋 메시지.
   */
  merge_commit_message?: MergeCommitMessage;
  /**
   * 병합 커밋 제목의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
   * - `MERGE_MESSAGE` - 기본값은 병합 메시지의 클래식 제목(예: Merge pull request #123 from branch-name).
   */
  merge_commit_title?: MergeCommitTitle;
  merges_url?:         string;
  milestones_url?:     string;
  mirror_url?:         string;
  name?:               string;
  network_count?:      number;
  node_id?:            string;
  notifications_url?:  string;
  open_issues_count?:  number;
  owner?:              Owner;
  permissions?:        Permissions;
  private?:            boolean;
  pulls_url?:          string;
  pushed_at?:          string;
  releases_url?:       string;
  size?:               number;
  /**
   * 스쿼시 병합 커밋 메시지의 기본값:
   *
   * - `PR_BODY` - 기본값은 풀 리퀘스트의 본문.
   * - `COMMIT_MESSAGES` - 기본값은 브랜치의 커밋 메시지.
   * - `BLANK` - 기본값은 빈 커밋 메시지.
   */
  squash_merge_commit_message?: SquashMergeCommitMessage;
  /**
   * 스쿼시 병합 커밋 제목의 기본값:
   *
   * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
   * - `COMMIT_OR_PR_TITLE` - 기본값은 커밋의 제목(커밋이 하나만 있는 경우) 또는 풀 리퀘스트의 제목(둘 이상의 커밋이 있는 경우).
   */
  squash_merge_commit_title?:      SquashMergeCommitTitle;
  ssh_url?:                        string;
  stargazers_count?:               number;
  stargazers_url?:                 string;
  statuses_url?:                   string;
  subscribers_count?:              number;
  subscribers_url?:                string;
  subscription_url?:               string;
  svn_url?:                        string;
  tags_url?:                       string;
  teams_url?:                      string;
  temp_clone_token?:               string;
  topics?:                         string[];
  trees_url?:                      string;
  updated_at?:                     string;
  url?:                            string;
  use_squash_pr_title_as_default?: boolean;
  visibility?:                     string;
  watchers_count?:                 number;
}

export interface Owner {
  avatar_url?:          string;
  events_url?:          string;
  followers_url?:       string;
  following_url?:       string;
  gists_url?:           string;
  gravatar_id?:         string;
  html_url?:            string;
  id?:                  number;
  login?:               string;
  node_id?:             string;
  organizations_url?:   string;
  received_events_url?: string;
  repos_url?:           string;
  site_admin?:          boolean;
  starred_url?:         string;
  subscriptions_url?:   string;
  type?:                string;
  url?:                 string;
}

export interface Permissions {
  admin?:    boolean;
  maintain?: boolean;
  pull?:     boolean;
  push?:     boolean;
  triage?:   boolean;
}

export interface SecurityAndAnalysis {
  advanced_security?: AdvancedSecurity;
  /**
   * 리포지토리에 대한 Dependabot 보안 업데이트를 사용 또는 사용하지 않도록 설정.
   */
  dependabot_security_updates?:     DependabotSecurityUpdates;
  secret_scanning?:                 SecretScanning;
  secret_scanning_push_protection?: SecretScanningPushProtection;
}

export interface AdvancedSecurity {
  status?: Status;
}

/**
 * 리포지토리에 대한 Dependabot 보안 업데이트의 활성화 상태.
 */
export enum Status {
  Disabled = "disabled",
  Enabled = "enabled",
}

/**
 * 리포지토리에 대한 Dependabot 보안 업데이트를 사용 또는 사용하지 않도록 설정.
 */
export interface DependabotSecurityUpdates {
  /**
   * 리포지토리에 대한 Dependabot 보안 업데이트의 활성화 상태.
   */
  status?: Status;
}

export interface SecretScanning {
  status?: Status;
}

export interface SecretScanningPushProtection {
  status?: Status;
}

/**
 * GitHub의 리포지토리.
 */
export interface Object {
  /**
   * 풀 리퀘스트에 자동 병합을 사용하도록 허용할지 여부.
   */
  allow_auto_merge?: boolean;
  /**
   * 이 리포지토리의 포크를 허용할지 여부.
   */
  allow_forking?: boolean;
  /**
   * 풀 리퀘스트에 대한 커밋 병합을 허용할지 여부.
   */
  allow_merge_commit?: boolean;
  /**
   * 풀리퀘스트에 리베이스 병합을 허용할지 여부.
   */
  allow_rebase_merge?: boolean;
  /**
   * 풀리퀘스트에 스쿼시 병합을 허용할지 여부.
   */
  allow_squash_merge?: boolean;
  /**
   * 베이스 브랜치 뒤에 있는 풀 리퀘스트 헤드 브랜치를 병합하기 전에 최신 상태로 유지할 필요가 없더라도 항상 업데이트할 수 있는지 여부.
   */
  allow_update_branch?: boolean;
  /**
   * 이 리포지토리에 대해 익명 Git 액세스를 사용하도록 설정했는지 여부.
   */
  anonymous_access_enabled?: boolean;
  archive_url:               string;
  /**
   * 리포지토리가 아카이브되는지 여부.
   */
  archived:          boolean;
  assignees_url:     string;
  blobs_url:         string;
  branches_url:      string;
  clone_url:         string;
  collaborators_url: string;
  comments_url:      string;
  commits_url:       string;
  compare_url:       string;
  contents_url:      string;
  contributors_url:  string;
  created_at:        null | string;
  /**
   * 리포지토리의 기본 브랜치.
   */
  default_branch: string;
  /**
   * 풀 리퀘스트 병합 시 헤드 브랜치를 삭제할지 여부.
   */
  delete_branch_on_merge?: boolean;
  deployments_url:         string;
  description:             null | string;
  /**
   * 이 리포지토리가 비활성화되었는지 여부를 반환.
   */
  disabled:        boolean;
  downloads_url:   string;
  events_url:      string;
  fork:            boolean;
  forks:           number;
  forks_count:     number;
  forks_url:       string;
  full_name:       string;
  git_commits_url: string;
  git_refs_url:    string;
  git_tags_url:    string;
  git_url:         string;
  /**
   * 토론이 활성화되었는지 여부.
   */
  has_discussions?: boolean;
  /**
   * 다운로드가 활성화되었는지 여부.
   */
  has_downloads: boolean;
  /**
   * 이슈가 활성화되었는지 여부.
   */
  has_issues: boolean;
  has_pages:  boolean;
  /**
   * 프로젝트가 활성화되었는지 여부.
   */
  has_projects: boolean;
  /**
   * 위키가 활성화되었는지 여부.
   */
  has_wiki:  boolean;
  homepage:  null | string;
  hooks_url: string;
  html_url:  string;
  /**
   * 리포지토리의 고유 식별자.
   */
  id: number;
  /**
   * 이 리포지토리가 새 리포지토리를 생성하는 데 사용할 수 있는 템플릿으로 작동하는지 여부.
   */
  is_template?:      boolean;
  issue_comment_url: string;
  issue_events_url:  string;
  issues_url:        string;
  keys_url:          string;
  labels_url:        string;
  language:          null | string;
  languages_url:     string;
  license:           null | LicenseSimple;
  master_branch?:    string;
  /**
   * 병합 커밋 메시지의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
   * - `PR_BODY` - 기본값은 풀리퀘스트의 본문.
   * - `BLANK` - 기본값은 빈 커밋 메시지.
   */
  merge_commit_message?: MergeCommitMessage;
  /**
   * 병합 커밋 제목의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
   * - `MERGE_MESSAGE` - 기본값은 병합 메시지의 클래식 제목(예: Merge pull request #123 from branch-name).
   */
  merge_commit_title?: MergeCommitTitle;
  merges_url:          string;
  milestones_url:      string;
  mirror_url:          null | string;
  /**
   * 리포지토리 이름.
   */
  name:              string;
  network_count?:    number;
  node_id:           string;
  notifications_url: string;
  open_issues:       number;
  open_issues_count: number;
  organization?:     null | SimpleUser;
  /**
   * GitHub 사용자.
   */
  owner:        Owner;
  permissions?: Permissions;
  /**
   * 리포지토리가 비공개인지 공개인지 여부.
   */
  private:      boolean;
  pulls_url:    string;
  pushed_at:    null | string;
  releases_url: string;
  /**
   * 리포지토리의 크기. 크기는 시간별로 계산. 리포지토리가 처음 생성되면 크기는 0.
   */
  size: number;
  /**
   * 스쿼시 병합 커밋 메시지의 기본값:
   *
   * - `PR_BODY` - 풀 리퀘스트의 본문이 기본값.
   * - `COMMIT_MESSAGES` - 브랜치의 커밋 메시지가 기본값.
   * - `BLANK` - 빈 커밋 메시지가 기본값.
   */
  squash_merge_commit_message?: SquashMergeCommitMessage;
  /**
   * 스쿼시 병합 커밋 제목의 기본값:
   *
   * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
   * - `COMMIT_OR_PR_TITLE` - 기본값은 커밋의 제목(커밋이 하나만 있는 경우) 또는 풀 리퀘스트의 제목(둘 이상 있는 경우).
   */
  squash_merge_commit_title?: SquashMergeCommitTitle;
  ssh_url:                    string;
  stargazers_count:           number;
  stargazers_url:             string;
  starred_at?:                string;
  statuses_url:               string;
  subscribers_count?:         number;
  subscribers_url:            string;
  subscription_url:           string;
  svn_url:                    string;
  tags_url:                   string;
  teams_url:                  string;
  temp_clone_token?:          string;
  template_repository?:       null | TemplateRepository;
  topics?:                    string[];
  trees_url:                  string;
  updated_at:                 null | string;
  url:                        string;
  /**
   * 스쿼시 병합 커밋이 풀 리퀘스트 제목을 기본값으로 사용할 수 있는지 여부.
   * **이 속성은 더 이상 사용되지 않음. 대신 `squash_merge_commit_title` 사용.
   */
  use_squash_pr_title_as_default?: boolean;
  /**
   * 리포지토리 가시성: 공개, 비공개 또는 내부.
   */
  visibility?:    string;
  watchers:       number;
  watchers_count: number;
  /**
   * 기여자가 웹 기반 커밋에 서명하도록 요구할지 여부
   */
  web_commit_signoff_required?: boolean;
}

export interface TemplateRepository {
  allow_auto_merge?:       boolean;
  allow_merge_commit?:     boolean;
  allow_rebase_merge?:     boolean;
  allow_squash_merge?:     boolean;
  allow_update_branch?:    boolean;
  archive_url?:            string;
  archived?:               boolean;
  assignees_url?:          string;
  blobs_url?:              string;
  branches_url?:           string;
  clone_url?:              string;
  collaborators_url?:      string;
  comments_url?:           string;
  commits_url?:            string;
  compare_url?:            string;
  contents_url?:           string;
  contributors_url?:       string;
  created_at?:             string;
  default_branch?:         string;
  delete_branch_on_merge?: boolean;
  deployments_url?:        string;
  description?:            string;
  disabled?:               boolean;
  downloads_url?:          string;
  events_url?:             string;
  fork?:                   boolean;
  forks_count?:            number;
  forks_url?:              string;
  full_name?:              string;
  git_commits_url?:        string;
  git_refs_url?:           string;
  git_tags_url?:           string;
  git_url?:                string;
  has_downloads?:          boolean;
  has_issues?:             boolean;
  has_pages?:              boolean;
  has_projects?:           boolean;
  has_wiki?:               boolean;
  homepage?:               string;
  hooks_url?:              string;
  html_url?:               string;
  id?:                     number;
  is_template?:            boolean;
  issue_comment_url?:      string;
  issue_events_url?:       string;
  issues_url?:             string;
  keys_url?:               string;
  labels_url?:             string;
  language?:               string;
  languages_url?:          string;
  /**
   * 병합 커밋 메시지의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
   * - `PR_BODY` - 기본값은 풀 리퀘스트의 본문.
   * - `BLANK` - 기본값은 공백 커밋 메시지.
   */
  merge_commit_message?: MergeCommitMessage;
  /**
   * 병합 커밋 제목의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
   * - `MERGE_MESSAGE` - 기본값은 병합 메시지의 클래식 제목(예: Merge pull request #123 from branch-name).
   */
  merge_commit_title?: MergeCommitTitle;
  merges_url?:         string;
  milestones_url?:     string;
  mirror_url?:         string;
  name?:               string;
  network_count?:      number;
  node_id?:            string;
  notifications_url?:  string;
  open_issues_count?:  number;
  owner?:              Owner;
  permissions?:        Permissions;
  private?:            boolean;
  pulls_url?:          string;
  pushed_at?:          string;
  releases_url?:       string;
  size?:               number;
  /**
   * 스쿼시 병합 커밋 메시지의 기본값:
   *
   * - `PR_BODY` - 기본값은 풀 리퀘스트의 본문.
   * - `COMMIT_MESSAGES` - 기본값은 브랜치의 커밋 메시지.
   * - `BLANK` - 기본값은 빈 커밋 메시지.
   */
  squash_merge_commit_message?: SquashMergeCommitMessage;
  /**
   * 스쿼시 병합 커밋 제목의 기본값:
   *
   * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
   * - `COMMIT_OR_PR_TITLE` - 기본값은 커밋의 제목(커밋이 하나만 있는 경우) 또는 풀 리퀘스트의 제목(둘 이상의 커밋이 있는 경우).
   */
  squash_merge_commit_title?:      SquashMergeCommitTitle;
  ssh_url?:                        string;
  stargazers_count?:               number;
  stargazers_url?:                 string;
  statuses_url?:                   string;
  subscribers_count?:              number;
  subscribers_url?:                string;
  subscription_url?:               string;
  svn_url?:                        string;
  tags_url?:                       string;
  teams_url?:                      string;
  temp_clone_token?:               string;
  topics?:                         string[];
  trees_url?:                      string;
  updated_at?:                     string;
  url?:                            string;
  use_squash_pr_title_as_default?: boolean;
  visibility?:                     string;
  watchers_count?:                 number;
}

/**
 * GitHub의 리포지토리.
 */
export interface RepositoryObject {
  /**
   * 풀 리퀘스트에 자동 병합을 사용할지 여부.
   */
  allow_auto_merge?: boolean;
  /**
   * 이 리포지토리의 포크 허용 여부
   */
  allow_forking?: boolean;
  /**
   * 풀 리퀘스트에 대한 커밋 병합을 허용할지 여부.
   */
  allow_merge_commit?: boolean;
  /**
   * 풀리퀘스트에 리베이스 병합을 허용할지 여부.
   */
  allow_rebase_merge?: boolean;
  /**
   * 풀리퀘스트에 스쿼시 병합을 허용할지 여부.
   */
  allow_squash_merge?: boolean;
  /**
   * 베이스 브랜치 뒤에 있는 풀 리퀘스트 헤드 브랜치를 병합하기 전에 최신 상태로 유지할 필요가 없더라도 항상 업데이트할 수 있는지 여부.
   */
  allow_update_branch?: boolean;
  /**
   * 이 리포지토리에 대해 익명 Git 액세스를 사용하도록 설정했는지 여부
   */
  anonymous_access_enabled?: boolean;
  archive_url:               string;
  /**
   * 리포지토리가 아카이브되는지 여부.
   */
  archived:          boolean;
  assignees_url:     string;
  blobs_url:         string;
  branches_url:      string;
  clone_url:         string;
  collaborators_url: string;
  comments_url:      string;
  commits_url:       string;
  compare_url:       string;
  contents_url:      string;
  contributors_url:  string;
  created_at:        null | string;
  /**
   * 리포지토리의 기본 브랜치.
   */
  default_branch: string;
  /**
   * 풀 리퀘스트 병합 시 헤드 브랜치를 삭제할지 여부
   */
  delete_branch_on_merge?: boolean;
  deployments_url:         string;
  description:             null | string;
  /**
   * 이 리포지토리가 비활성화되었는지 여부.
   */
  disabled:        boolean;
  downloads_url:   string;
  events_url:      string;
  fork:            boolean;
  forks:           number;
  forks_count:     number;
  forks_url:       string;
  full_name:       string;
  git_commits_url: string;
  git_refs_url:    string;
  git_tags_url:    string;
  git_url:         string;
  /**
   * 토론이 활성화되었는지 여부.
   */
  has_discussions?: boolean;
  /**
   * 다운로드가 활성화되었는지 여부.
   */
  has_downloads: boolean;
  /**
   * 이슈가 활성화되었는지 여부.
   */
  has_issues: boolean;
  has_pages:  boolean;
  /**
   * 프로젝트가 활성화되었는지 여부.
   */
  has_projects: boolean;
  /**
   * 위키가 활성화되었는지 여부.
   */
  has_wiki:  boolean;
  homepage:  null | string;
  hooks_url: string;
  html_url:  string;
  /**
   * 리포지토리의 고유 식별자
   */
  id: number;
  /**
   * 이 리포지토리가 새 리포지토리를 생성하는 데 사용할 수 있는 템플릿 역할을 하는지 여부.
   */
  is_template?:      boolean;
  issue_comment_url: string;
  issue_events_url:  string;
  issues_url:        string;
  keys_url:          string;
  labels_url:        string;
  language:          null | string;
  languages_url:     string;
  license:           null | LicenseSimple;
  master_branch?:    string;
  /**
   * 병합 커밋 메시지의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
   * - `PR_BODY` - 기본값은 풀리퀘스트의 본문.
   * - `BLANK` - 기본값은 빈 커밋 메시지.
   */
  merge_commit_message?: MergeCommitMessage;
  /**
   * 병합 커밋 제목의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
   * - `MERGE_MESSAGE` - 기본값은 병합 메시지의 클래식 제목(예: Merge pull request #123 from branch-name).
   */
  merge_commit_title?: MergeCommitTitle;
  merges_url:          string;
  milestones_url:      string;
  mirror_url:          null | string;
  /**
   * 리포지토리 이름.
   */
  name:              string;
  network_count?:    number;
  node_id:           string;
  notifications_url: string;
  open_issues:       number;
  open_issues_count: number;
  organization?:     null | SimpleUser;
  /**
   * GitHub 사용자.
   */
  owner:        SimpleUser;
  permissions?: Permissions;
  /**
   * 리포지토리가 비공개인지 공개인지 여부.
   */
  private:      boolean;
  pulls_url:    string;
  pushed_at:    null | string;
  releases_url: string;
  /**
   * 리포지토리의 크기. 크기는 시간별로 계산. 리포지토리가 처음 생성되면 크기는 0.
   */
  size: number;
  /**
   * 스쿼시 병합 커밋 메시지의 기본값:
   *
   * - `PR_BODY` - 풀 리퀘스트의 본문이 기본값.
   * - `COMMIT_MESSAGES` - 브랜치의 커밋 메시지가 기본값.
   * - `BLANK` - 빈 커밋 메시지가 기본값.
   */
  squash_merge_commit_message?: SquashMergeCommitMessage;
  /**
   * 스쿼시 병합 커밋 제목의 기본값:
   *
   * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
   * - `COMMIT_OR_PR_TITLE` - 기본값은 커밋의 제목(커밋이 하나만 있는 경우) 또는 풀 리퀘스트의 제목(둘 이상 있는 경우).
   */
  squash_merge_commit_title?: SquashMergeCommitTitle;
  ssh_url:                    string;
  stargazers_count:           number;
  stargazers_url:             string;
  starred_at?:                string;
  statuses_url:               string;
  subscribers_count?:         number;
  subscribers_url:            string;
  subscription_url:           string;
  svn_url:                    string;
  tags_url:                   string;
  teams_url:                  string;
  temp_clone_token?:          string;
  template_repository?:       null | RepositoryTemplateRepository;
  topics?:                    string[];
  trees_url:                  string;
  updated_at:                 null | string;
  url:                        string;
  /**
   * 스쿼시 병합 커밋이 풀 리퀘스트 제목을 기본값으로 사용할 수 있는지 여부.
   * **이 속성은 더 이상 사용되지 않음. 대신 `squash_merge_commit_title` 사용.
   */
  use_squash_pr_title_as_default?: boolean;
  /**
   * 리포지토리 가시성: 공개, 비공개 또는 내부.
   */
  visibility?:    string;
  watchers:       number;
  watchers_count: number;
  /**
   * 기여자가 웹 기반 커밋에 서명하도록 요구할지 여부
   */
  web_commit_signoff_required?: boolean;
}

export interface RepositoryTemplateRepository {
  allow_auto_merge?:       boolean;
  allow_merge_commit?:     boolean;
  allow_rebase_merge?:     boolean;
  allow_squash_merge?:     boolean;
  allow_update_branch?:    boolean;
  archive_url?:            string;
  archived?:               boolean;
  assignees_url?:          string;
  blobs_url?:              string;
  branches_url?:           string;
  clone_url?:              string;
  collaborators_url?:      string;
  comments_url?:           string;
  commits_url?:            string;
  compare_url?:            string;
  contents_url?:           string;
  contributors_url?:       string;
  created_at?:             string;
  default_branch?:         string;
  delete_branch_on_merge?: boolean;
  deployments_url?:        string;
  description?:            string;
  disabled?:               boolean;
  downloads_url?:          string;
  events_url?:             string;
  fork?:                   boolean;
  forks_count?:            number;
  forks_url?:              string;
  full_name?:              string;
  git_commits_url?:        string;
  git_refs_url?:           string;
  git_tags_url?:           string;
  git_url?:                string;
  has_downloads?:          boolean;
  has_issues?:             boolean;
  has_pages?:              boolean;
  has_projects?:           boolean;
  has_wiki?:               boolean;
  homepage?:               string;
  hooks_url?:              string;
  html_url?:               string;
  id?:                     number;
  is_template?:            boolean;
  issue_comment_url?:      string;
  issue_events_url?:       string;
  issues_url?:             string;
  keys_url?:               string;
  labels_url?:             string;
  language?:               string;
  languages_url?:          string;
  /**
   * 병합 커밋 메시지의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
   * - `PR_BODY` - 기본값은 풀 리퀘스트의 본문.
   * - `BLANK` - 기본값은 공백 커밋 메시지.
   */
  merge_commit_message?: MergeCommitMessage;
  /**
   * 병합 커밋 제목의 기본값.
   *
   * - `PR_TITLE` - 기본값은 풀리퀘스트의 제목.
   * - `MERGE_MESSAGE` - 기본값은 병합 메시지의 클래식 제목(예: Merge pull request #123 from branch-name).
   */
  merge_commit_title?: MergeCommitTitle;
  merges_url?:         string;
  milestones_url?:     string;
  mirror_url?:         string;
  name?:               string;
  network_count?:      number;
  node_id?:            string;
  notifications_url?:  string;
  open_issues_count?:  number;
  owner?:              Owner;
  permissions?:        IndigoPermissions;
  private?:            boolean;
  pulls_url?:          string;
  pushed_at?:          string;
  releases_url?:       string;
  size?:               number;
  /**
   * 스쿼시 병합 커밋 메시지의 기본값:
   *
   * - `PR_BODY` - 기본값은 풀 리퀘스트의 본문.
   * - `COMMIT_MESSAGES` - 기본값은 브랜치의 커밋 메시지.
   * - `BLANK` - 기본값은 빈 커밋 메시지.
   */
  squash_merge_commit_message?: SquashMergeCommitMessage;
  /**
   * 스쿼시 병합 커밋 제목의 기본값:
   *
   * - `PR_TITLE` - 기본값은 풀 리퀘스트의 제목.
   * - `COMMIT_OR_PR_TITLE` - 기본값은 커밋의 제목(커밋이 하나만 있는 경우) 또는 풀 리퀘스트의 제목(둘 이상의 커밋이 있는 경우).
   */
  squash_merge_commit_title?:      SquashMergeCommitTitle;
  ssh_url?:                        string;
  stargazers_count?:               number;
  stargazers_url?:                 string;
  statuses_url?:                   string;
  subscribers_count?:              number;
  subscribers_url?:                string;
  subscription_url?:               string;
  svn_url?:                        string;
  tags_url?:                       string;
  teams_url?:                      string;
  temp_clone_token?:               string;
  topics?:                         string[];
  trees_url?:                      string;
  updated_at?:                     string;
  url?:                            string;
  use_squash_pr_title_as_default?: boolean;
  visibility?:                     string;
  watchers_count?:                 number;
}
