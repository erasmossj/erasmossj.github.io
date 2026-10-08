import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ApiResponse, ReposSnapshot } from '../src/lib/github/types.ts';
import { updateSnapshot } from './fetch-github.ts';

const apiResponse: ApiResponse = {
  data: {
    user: {
      pinnedItems: { nodes: [] },
      repositories: {
        nodes: [
          {
            name: 'novo-repo',
            description: null,
            url: 'https://github.com/erasmossj/novo-repo',
            homepageUrl: null,
            isFork: false,
            isArchived: false,
            stargazerCount: 0,
            forkCount: 0,
            pushedAt: '2026-10-08T12:00:00Z',
            repositoryTopics: { nodes: [] },
            languages: { totalSize: 0, edges: [] },
          },
        ],
      },
    },
  },
};

const oldSnapshot: ReposSnapshot = {
  generatedAt: '2026-10-01T09:00:00.000Z',
  user: 'erasmossj',
  repos: [],
};

let dir: string;
let snapshotPath: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'fetch-github-'));
  snapshotPath = join(dir, 'repos.json');
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

function readSnapshot(): ReposSnapshot {
  return JSON.parse(readFileSync(snapshotPath, 'utf8'));
}

describe('updateSnapshot', () => {
  it('salva os repositórios da API quando a busca funciona', async () => {
    const fetchImpl = vi.fn(async () => Response.json(apiResponse));
    const warn = vi.fn();

    const result = await updateSnapshot({ token: 't', snapshotPath, fetchImpl, warn });

    expect(result).toBe('api');
    expect(readSnapshot().repos.map((r) => r.name)).toEqual(['novo-repo']);
    expect(warn).not.toHaveBeenCalled();

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.github.com/graphql');
    expect(init.headers).toMatchObject({ Authorization: 'bearer t' });
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it.each([
    ['token inválido', async () => new Response('Bad credentials', { status: 401 }), /401/],
    [
      'rate limit',
      async () => Response.json({ errors: [{ message: 'API rate limit exceeded' }] }),
      /rate limit/,
    ],
    ['falha de rede', async () => Promise.reject(new TypeError('fetch failed')), /fetch failed/],
    [
      'timeout',
      async () => Promise.reject(new DOMException('aborted', 'TimeoutError')),
      /tempo limite/,
    ],
  ])('mantém o snapshot anterior e avisa em caso de %s', async (_, fetchImpl, reason) => {
    writeFileSync(snapshotPath, JSON.stringify(oldSnapshot));
    const warn = vi.fn();

    const result = await updateSnapshot({ token: 't', snapshotPath, fetchImpl, warn });

    expect(result).toBe('snapshot');
    expect(readSnapshot()).toEqual(oldSnapshot);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toMatch(reason);
    expect(warn.mock.calls[0]?.[0]).toMatch(/snapshot/);
  });

  it('usa o snapshot sem chamar a API quando não há token', async () => {
    writeFileSync(snapshotPath, JSON.stringify(oldSnapshot));
    const fetchImpl = vi.fn();
    const warn = vi.fn();

    const result = await updateSnapshot({ token: undefined, snapshotPath, fetchImpl, warn });

    expect(result).toBe('snapshot');
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(warn.mock.calls[0]?.[0]).toMatch(/GITHUB_TOKEN/);
  });

  it('falha com mensagem explicativa quando a API falha e não há snapshot', async () => {
    const fetchImpl = vi.fn(async () => new Response('Bad credentials', { status: 401 }));

    await expect(
      updateSnapshot({ token: 't', snapshotPath, fetchImpl, warn: vi.fn() }),
    ).rejects.toThrow(/não há snapshot/);
  });
});
