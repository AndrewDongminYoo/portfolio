/**
 * A repository on GitHub.
 */
export interface Repository {
    /**
    * Whether the repository is archived.
    */
    archived:                    boolean;
    /**
     * The default branch of the repository.
     */
    default_branch:              string;
    /**
     * Returns whether or not this repository disabled.
     */
    disabled:                    boolean;
    /**
     * Whether downloads are enabled.
     */
    has_downloads:               boolean;
    /**
     * Whether issues are enabled.
     */
    has_issues:                  boolean;
    /**
     * Whether projects are enabled.
     */
    has_projects:                boolean;
    /**
     * Whether the wiki is enabled.
     */
    has_wiki:                    boolean;
    /**
     * Unique identifier of the repository
     */
    id:                          number;
    /**
     * The name of the repository.
    */
    name:                         string;
    /**
        * A GitHub user.
    */
    owner:                       OwnerObject;
    /**
     * Whether the repository is private or public.
     */
    private:                     boolean;
    /**
     * The size of the repository. Size is calculated hourly. When a repository is initially
     * created, the size is 0.
    */
    size:                        number;
    node_id:                     string;
    full_name:                   string;
    html_url:                    string;
    description:                 string;
    fork:                        boolean;
    languages_url:               string;
    created_at:                  string;
    updated_at:                  string;
    pushed_at:                   string;
    svn_url:                     string;
    homepage:                    string;
    size:                        number;
    stargazers_count:            number;
    watchers_count:              number;
    language:                    string;
    has_pages:                   boolean;
    has_discussions:             boolean;
    forks_count:                 number;
    open_issues_count:           number;
    allow_forking:               boolean;
    is_template:                 boolean;
    web_commit_signoff_required: boolean;
    topics:                      string[];
    visibility:                  string;
    forks:                       number;
    open_issues:                 number;
    watchers:                    number;
    network_count:               number;
    subscribers_count:           number;
}

/**
 * A GitHub user.
 */
interface OwnerObject {
    login:                       string;
    id:                          number;
    node_id:                     string;
    avatar_url:                  string;
    gravatar_id:                 string;
    url:                         string;
    html_url:                    string;
    followers_url:               string;
    subscriptions_url:           string;
    organizations_url:           string;
    repos_url:                   string;
    received_events_url:         string;
    type:                        string;
    site_admin:                  boolean;
}

interface Permissions {
    admin:                       boolean;
    maintain:                    boolean;
    push:                        boolean;
    triage:                      boolean;
    pull:                        boolean;
}

/**
 * License Simple
 */
interface LicenseSimple {
    key:                         string;
    name:                        string;
    node_id:                     string;
    spdx_id:                     null | string;
    url:                         null | string;
}

export interface OpenGraph {
    url:                         string | null;
    type:                        string | null;
    title:                       string | null;
    image:                       string | null;
    description:                 string | null;
    site_name:                   string | null;
    'image:alt':                 string | null;
}