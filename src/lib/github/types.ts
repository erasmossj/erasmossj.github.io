// Modelo dos repositórios usado pelo site (gerado no build em src/data/repos.json).

export interface RepoLanguage {
  name: string;
  color: string | null;
  /** Fatia do código do repositório nesta linguagem, de 0 a 100 (uma casa decimal). */
  percent: number;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  languages: RepoLanguage[];
  topics: string[];
  stars: number;
  forks: number;
  isFork: boolean;
  pushedAt: string;
  pinned: boolean;
}

export interface ReposSnapshot {
  /** Momento (ISO 8601) em que os dados foram buscados na API. */
  generatedAt: string;
  user: string;
  repos: GitHubRepo[];
}

// Formato da resposta da query em scripts/fetch-github.ts.

export interface ApiRepoNode {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  isFork: boolean;
  isArchived: boolean;
  stargazerCount: number;
  forkCount: number;
  pushedAt: string;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
  languages: {
    totalSize: number;
    edges: { size: number; node: { name: string; color: string | null } }[];
  };
}

export interface ApiResponse {
  data?: {
    user: {
      pinnedItems: { nodes: { name?: string }[] };
      repositories: { nodes: ApiRepoNode[] };
    } | null;
  } | null;
  errors?: { message: string; type?: string }[];
}
