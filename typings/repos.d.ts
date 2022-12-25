/**
 * A repository on GitHub.
 */
export interface Repository {
    languages?: Languages;
    allow_forking?: boolean;
    topics?: string[];
    visibility?: string;
    permissions?: Permissions;
    archive_url: string;
    meta_tags?: MetaTag;
    /**
     * Whether the repository is archived.
     */
    archived: boolean;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    clone_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    created_at: null | string;
    /**
     * The default branch of the repository.
     */
    default_branch: string;
    deployments_url: string;
    description: null | string;
    /**
     * Returns whether or not this repository disabled.
     */
    disabled: boolean;
    downloads_url: string;
    events_url: string;
    fork: boolean;
    forks: number;
    forks_count: number;
    forks_url: string;
    full_name: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    git_url: string;
    /**
     * Whether downloads are enabled.
     */
    has_downloads: boolean;
    /**
     * Whether issues are enabled.
     */
    has_issues: boolean;
    has_pages: boolean;
    /**
     * Whether projects are enabled.
     */
    has_projects: boolean;
    /**
     * Whether the wiki is enabled.
     */
    has_wiki: boolean;
    homepage: null | string;
    hooks_url: string;
    html_url: string;
    /**
     * Unique identifier of the repository
     */
    id: number;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    language: null | string;
    languages_url: string;
    license: null | LicenseSimple;
    merges_url: string;
    milestones_url: string;
    mirror_url: null | string;
    /**
     * The name of the repository.
     */
    name: string;
    node_id: string;
    notifications_url: string;
    open_issues: number;
    open_issues_count: number;
    /**
     * A GitHub user.
     */
    owner: OwnerObject;
    /**
     * Whether the repository is private or public.
     */
    private: boolean;
    pulls_url: string;
    pushed_at: null | string;
    releases_url: string;
    /**
     * The size of the repository. Size is calculated hourly. When a repository is initially
     * created, the size is 0.
     */
    size: number;
    ssh_url: string;
    stargazers_count: number;
    stargazers_url: string;
    subscribers_url: string;
    subscription_url: string;
    svn_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
    updated_at: null | string;
    url: string;
    watchers: number;
    watchers_count: number;
}

/**
 * A GitHub user.
 */
interface OwnerObject {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}

interface Permissions {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
}

type Languages = {
    [lang: string]: number;
}

/**
 * License Simple
 */
interface LicenseSimple {
    key: string;
    name: string;
    node_id: string;
    spdx_id: null | string;
    url: null | string;
}

export interface MetaTag {
    url: string;
    type: string;
    title: string;
    image: Image[];
    description: string;
    site_name: string;
    updated_time: string;
}

interface Image {
    url: string;
}

export interface MetaError {
    error: Error;
}

interface Error {
    message:    string;
    type:       string;
    code:       number;
    fbtrace_id: string;
}
