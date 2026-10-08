import type { ApiRepoNode, ApiResponse, GitHubRepo, RepoLanguage } from './types.ts';

export interface ToReposOptions {
  includeForks?: boolean;
  includeArchived?: boolean;
}

function toLanguages({ totalSize, edges }: ApiRepoNode['languages']): RepoLanguage[] {
  if (totalSize === 0) return [];
  return edges.map(({ size, node }) => ({
    name: node.name,
    color: node.color,
    percent: Math.round((size / totalSize) * 1000) / 10,
  }));
}

/** Converte a resposta da API GraphQL do GitHub para o modelo de repositórios do site. */
export function toRepos(
  response: ApiResponse,
  { includeForks = false, includeArchived = false }: ToReposOptions = {},
): GitHubRepo[] {
  if (response.errors?.length) {
    throw new Error(`API do GitHub: ${response.errors.map((e) => e.message).join('; ')}`);
  }
  const user = response.data?.user;
  if (!user) throw new Error('API do GitHub: usuário não encontrado na resposta.');

  const pinned = new Set(user.pinnedItems.nodes.map((item) => item.name));

  return user.repositories.nodes
    .filter((repo) => (includeForks || !repo.isFork) && (includeArchived || !repo.isArchived))
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      homepage: repo.homepageUrl || null,
      languages: toLanguages(repo.languages),
      topics: repo.repositoryTopics.nodes.map(({ topic }) => topic.name),
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      isFork: repo.isFork,
      pushedAt: repo.pushedAt,
      pinned: pinned.has(repo.name),
    }));
}
