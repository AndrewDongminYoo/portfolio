import type Repository from '@/interface/repos';
import { graphqlRequest } from '@/lib/github/client';

export type RepoSignals = {
  topics: string[];
  languages: Record<string, number>;
  rootNames: Set<string>; // root entry names + (optional) `${dir}/${name}` paths
  workflowNames: Set<string>;
  pubspecText?: string;
  packageJsonText?: string;
};

type GraphQLRepoSignals = {
  repository: null | {
    topics?: { nodes?: Array<{ topic?: { name?: string | null } | null } | null> | null } | null;
    languages?: {
      edges?: Array<{ size?: number | null; node?: { name?: string | null } | null } | null> | null;
    } | null;

    pubspec?: { __typename?: string; text?: string | null; isBinary?: boolean | null } | null;
    packageJson?: { __typename?: string; text?: string | null; isBinary?: boolean | null } | null;

    root?: {
      __typename?: string;
      entries?: Array<{ name?: string | null; type?: string | null } | null> | null;
    } | null;

    workflows?: {
      __typename?: string;
      entries?: Array<{ name?: string | null; type?: string | null } | null> | null;
    } | null;
  };
};

type GraphQLTreeQueryResult = {
  repository: null | {
    tree?: {
      __typename?: string;
      entries?: Array<{ name?: string | null; type?: string | null } | null> | null;
    } | null;
    pubspec?: { __typename?: string; text?: string | null; isBinary?: boolean | null } | null;
    packageJson?: { __typename?: string; text?: string | null; isBinary?: boolean | null } | null;
  };
};

const REPO_SIGNALS_QUERY = /* GraphQL */ `
  query RepoSignals(
    $owner: String!
    $name: String!
    $pubspecExpr: String!
    $packageExpr: String!
    $rootExpr: String!
    $workflowsExpr: String!
  ) {
    repository(owner: $owner, name: $name) {
      topics: repositoryTopics(first: 30) {
        nodes {
          topic {
            name
          }
        }
      }

      languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
        edges {
          size
          node {
            name
          }
        }
      }

      pubspec: object(expression: $pubspecExpr) {
        __typename
        ... on Blob {
          isBinary
          text
        }
      }

      packageJson: object(expression: $packageExpr) {
        __typename
        ... on Blob {
          isBinary
          text
        }
      }

      root: object(expression: $rootExpr) {
        __typename
        ... on Tree {
          entries {
            name
            type
          }
        }
      }

      workflows: object(expression: $workflowsExpr) {
        __typename
        ... on Tree {
          entries {
            name
            type
          }
        }
      }
    }
  }
`;

const SUBDIR_SCAN_QUERY = /* GraphQL */ `
  query SubdirScan(
    $owner: String!
    $name: String!
    $treeExpr: String!
    $pubspecExpr: String!
    $packageExpr: String!
  ) {
    repository(owner: $owner, name: $name) {
      tree: object(expression: $treeExpr) {
        __typename
        ... on Tree {
          entries {
            name
            type
          }
        }
      }

      pubspec: object(expression: $pubspecExpr) {
        __typename
        ... on Blob {
          isBinary
          text
        }
      }

      packageJson: object(expression: $packageExpr) {
        __typename
        ... on Blob {
          isBinary
          text
        }
      }
    }
  }
`;

function toLanguagesMap(
  edges:
    | Array<{ size?: number | null; node?: { name?: string | null } | null } | null>
    | null
    | undefined,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of edges ?? []) {
    if (!e?.node?.name) continue;
    out[e.node.name] = typeof e.size === 'number' ? e.size : 0;
  }
  return out;
}

function toNameSet(
  entries: Array<{ name?: string | null } | null> | null | undefined,
): Set<string> {
  const out = new Set<string>();
  for (const e of entries ?? []) {
    const name = e?.name?.trim();
    if (name) out.add(name);
  }
  return out;
}

function toTopicsList(
  nodes: Array<{ topic?: { name?: string | null } | null } | null> | null | undefined,
): string[] {
  const out: string[] = [];
  for (const n of nodes ?? []) {
    const name = n?.topic?.name?.trim();
    if (name) out.push(name);
  }
  return out;
}

export function buildBranchExpr(repo: Repository): string {
  const b = String(repo.default_branch ?? '').trim();
  return b || 'HEAD';
}

export async function fetchRepoSignals(
  owner: string,
  repo: string,
  branch: string,
): Promise<RepoSignals> {
  const variables = {
    owner,
    name: repo,
    pubspecExpr: `${branch}:pubspec.yaml`,
    packageExpr: `${branch}:package.json`,
    rootExpr: `${branch}:`,
    workflowsExpr: `${branch}:.github/workflows`,
  };

  const data = await graphqlRequest<GraphQLRepoSignals>(REPO_SIGNALS_QUERY, variables);

  if (!data.repository) {
    return { topics: [], languages: {}, rootNames: new Set(), workflowNames: new Set() };
  }

  const topics = toTopicsList(data.repository.topics?.nodes);
  const languages = toLanguagesMap(data.repository.languages?.edges);

  const rootNames = toNameSet(
    data.repository.root?.__typename === 'Tree' ? data.repository.root.entries : null,
  );
  const workflowNames = toNameSet(
    data.repository.workflows?.__typename === 'Tree' ? data.repository.workflows.entries : null,
  );

  const pubspecText =
    data.repository.pubspec?.__typename === 'Blob' && !data.repository.pubspec.isBinary
      ? (data.repository.pubspec.text ?? undefined)
      : undefined;

  const packageJsonText =
    data.repository.packageJson?.__typename === 'Blob' && !data.repository.packageJson.isBinary
      ? (data.repository.packageJson.text ?? undefined)
      : undefined;

  return { topics, languages, rootNames, workflowNames, pubspecText, packageJsonText };
}

export async function scanOneSubdir(owner: string, repo: string, branch: string, dir: string) {
  const data = await graphqlRequest<GraphQLTreeQueryResult>(SUBDIR_SCAN_QUERY, {
    owner,
    name: repo,
    treeExpr: `${branch}:${dir}`,
    pubspecExpr: `${branch}:${dir}/pubspec.yaml`,
    packageExpr: `${branch}:${dir}/package.json`,
  });

  const entries = toNameSet(
    data.repository?.tree?.__typename === 'Tree' ? data.repository.tree.entries : null,
  );

  const pubspecText =
    data.repository?.pubspec?.__typename === 'Blob' && !data.repository.pubspec.isBinary
      ? (data.repository.pubspec.text ?? undefined)
      : undefined;

  const packageJsonText =
    data.repository?.packageJson?.__typename === 'Blob' && !data.repository.packageJson.isBinary
      ? (data.repository.packageJson.text ?? undefined)
      : undefined;

  return { entries, pubspecText, packageJsonText };
}
