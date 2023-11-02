export interface Star {
    id:                          number;
    node_id:                     string;
    name:                        string;
    full_name:                   string;
    private:                     boolean;
    owner:                       Owner;
    html_url:                    string;
    description:                 null | string;
    fork:                        boolean;
    created_at:                  string;
    updated_at:                  string;
    pushed_at:                   string;
    git_url:                     string;
    ssh_url:                     string;
    clone_url:                   string;
    svn_url:                     string;
    homepage:                    null | string;
    size:                        number;
    stargazers_count:            number;
    watchers_count:              number;
    language:                    null | string;
    has_issues:                  boolean;
    has_projects:                boolean;
    has_downloads:               boolean;
    has_wiki:                    boolean;
    has_pages:                   boolean;
    has_discussions:             boolean;
    forks_count:                 number;
    mirror_url:                  null;
    archived:                    boolean;
    disabled:                    boolean;
    open_issues_count:           number;
    license:                     License | null;
    allow_forking:               boolean;
    is_template:                 boolean;
    web_commit_signoff_required: boolean;
    topics:                      string[];
    visibility:                  Visibility;
    forks:                       number;
    open_issues:                 number;
    watchers:                    number;
    default_branch:              DefaultBranch;
    permissions:                 Permissions;
}

export enum DefaultBranch {
    Develop = "develop",
    Main = "main",
    Master = "master",
}

export interface License {
    key:     string;
    name:    string;
    spdx_id: string;
    node_id: string;
    url?:    null;
}

export interface Owner {
    login:       string;
    id:          number;
    node_id:     string;
    avatar_url:  string;
    gravatar_id: string;
    html_url:    string;
    type:        Type;
    site_admin:  boolean;
}

export enum Type {
    Organization = "Organization",
    User = "User",
}

export interface Permissions {
    admin:    boolean;
    maintain: boolean;
    push:     boolean;
    triage:   boolean;
    pull:     boolean;
}

export enum Visibility {
    Public = "public",
}
