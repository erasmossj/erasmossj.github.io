import { describe, expect, it } from 'vitest';
import { toRepos } from './transform.ts';
import type { ApiRepoNode, ApiResponse } from './types.ts';

function node(overrides: Partial<ApiRepoNode> = {}): ApiRepoNode {
  return {
    name: 'algoritmos-de-grafos',
    description: 'Algoritmos clássicos de grafos',
    url: 'https://github.com/erasmossj/algoritmos-de-grafos',
    homepageUrl: null,
    isFork: false,
    isArchived: false,
    stargazerCount: 3,
    forkCount: 1,
    pushedAt: '2026-09-06T12:00:00Z',
    repositoryTopics: { nodes: [{ topic: { name: 'cpp' } }, { topic: { name: 'graphs' } }] },
    languages: {
      totalSize: 1000,
      edges: [
        { size: 750, node: { name: 'C++', color: '#f34b7d' } },
        { size: 250, node: { name: 'CMake', color: '#DA3434' } },
      ],
    },
    ...overrides,
  };
}

function response(nodes: ApiRepoNode[], pinned: string[] = []): ApiResponse {
  return {
    data: {
      user: {
        pinnedItems: { nodes: pinned.map((name) => ({ name })) },
        repositories: { nodes },
      },
    },
  };
}

describe('toRepos', () => {
  it('converte um repositório da API para o modelo do site', () => {
    const [repo] = toRepos(response([node()]));

    expect(repo).toEqual({
      name: 'algoritmos-de-grafos',
      description: 'Algoritmos clássicos de grafos',
      url: 'https://github.com/erasmossj/algoritmos-de-grafos',
      homepage: null,
      languages: [
        { name: 'C++', color: '#f34b7d', percent: 75 },
        { name: 'CMake', color: '#DA3434', percent: 25 },
      ],
      topics: ['cpp', 'graphs'],
      stars: 3,
      forks: 1,
      isFork: false,
      pushedAt: '2026-09-06T12:00:00Z',
      pinned: false,
    });
  });

  it('arredonda a porcentagem das linguagens para uma casa decimal', () => {
    const [repo] = toRepos(
      response([
        node({
          languages: {
            totalSize: 3,
            edges: [
              { size: 2, node: { name: 'Python', color: '#3572A5' } },
              { size: 1, node: { name: 'Shell', color: null } },
            ],
          },
        }),
      ]),
    );

    expect(repo?.languages.map((l) => l.percent)).toEqual([66.7, 33.3]);
  });

  it('retorna lista de linguagens vazia quando o repositório não tem código', () => {
    const [repo] = toRepos(response([node({ languages: { totalSize: 0, edges: [] } })]));

    expect(repo?.languages).toEqual([]);
  });

  it('trata homepage vazia como ausente', () => {
    const [repo] = toRepos(response([node({ homepageUrl: '' })]));

    expect(repo?.homepage).toBeNull();
  });

  it('marca os repositórios fixados no perfil', () => {
    const repos = toRepos(response([node({ name: 'a' }), node({ name: 'b' })], ['b']));

    expect(repos.map((r) => [r.name, r.pinned])).toEqual([
      ['a', false],
      ['b', true],
    ]);
  });

  it('remove forks e arquivados por padrão', () => {
    const repos = toRepos(
      response([
        node({ name: 'proprio' }),
        node({ name: 'fork', isFork: true }),
        node({ name: 'arquivado', isArchived: true }),
      ]),
    );

    expect(repos.map((r) => r.name)).toEqual(['proprio']);
  });

  it('mantém forks e arquivados quando pedido', () => {
    const repos = toRepos(
      response([
        node({ name: 'fork', isFork: true }),
        node({ name: 'arquivado', isArchived: true }),
      ]),
      { includeForks: true, includeArchived: true },
    );

    expect(repos.map((r) => r.name)).toEqual(['fork', 'arquivado']);
  });

  it('lança erro quando a API devolve erros GraphQL', () => {
    expect(() => toRepos({ errors: [{ message: 'API rate limit exceeded' }] })).toThrow(
      /API rate limit exceeded/,
    );
  });

  it('lança erro quando o usuário não existe', () => {
    expect(() => toRepos({ data: { user: null } })).toThrow(/usuário/i);
  });
});
