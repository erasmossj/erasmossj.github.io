import { describe, expect, it } from 'vitest';
import type { ProjectConfig } from '../data/projects.config.ts';
import type { GitHubRepo } from './github/types.ts';
import { mergeProjects } from './projects.ts';

function repo(name: string, overrides: Partial<GitHubRepo> = {}): GitHubRepo {
  return {
    name,
    description: `Descrição de ${name} no GitHub`,
    url: `https://github.com/erasmossj/${name}`,
    homepage: null,
    languages: [{ name: 'C', color: '#555555', percent: 100 }],
    topics: [],
    stars: 0,
    forks: 0,
    isFork: false,
    pushedAt: '2026-01-01T00:00:00Z',
    pinned: false,
    ...overrides,
  };
}

describe('mergeProjects', () => {
  it('usa os dados do GitHub quando o repositório não está na curadoria', () => {
    const { projects } = mergeProjects([repo('rsa', { homepage: 'https://rsa.dev' })], []);

    expect(projects[0]).toMatchObject({
      repo: 'rsa',
      title: 'rsa',
      tagline: 'Descrição de rsa no GitHub',
      context: null,
      highlight: null,
      url: 'https://github.com/erasmossj/rsa',
      demoUrl: 'https://rsa.dev',
      image: null,
      featured: false,
    });
  });

  it('deixa a curadoria sobrescrever os textos do GitHub', () => {
    const config: ProjectConfig[] = [
      {
        repo: 'rsa',
        featured: true,
        order: 1,
        title: 'Criptografia RSA',
        tagline: 'RSA em C',
        context: 'Matemática Discreta',
        highlight: 'Exponenciação modular',
        demoUrl: 'https://demo.dev',
        image: '/projetos/rsa.png',
      },
    ];

    const { projects } = mergeProjects([repo('rsa', { homepage: 'https://rsa.dev' })], config);

    expect(projects[0]).toMatchObject({
      title: 'Criptografia RSA',
      tagline: 'RSA em C',
      context: 'Matemática Discreta',
      highlight: 'Exponenciação modular',
      demoUrl: 'https://demo.dev',
      image: '/projetos/rsa.png',
      featured: true,
    });
  });

  it('ordena pela curadoria e depois pelo push mais recente', () => {
    const repos = [
      repo('antigo', { pushedAt: '2025-01-01T00:00:00Z' }),
      repo('recente', { pushedAt: '2026-05-01T00:00:00Z' }),
      repo('segundo', { pushedAt: '2024-01-01T00:00:00Z' }),
      repo('primeiro', { pushedAt: '2024-01-01T00:00:00Z' }),
    ];
    const config: ProjectConfig[] = [
      { repo: 'segundo', featured: true, order: 2 },
      { repo: 'primeiro', featured: true, order: 1 },
    ];

    const { projects } = mergeProjects(repos, config);

    expect(projects.map((p) => p.repo)).toEqual(['primeiro', 'segundo', 'recente', 'antigo']);
  });

  it('avisa sobre repositórios da curadoria que não existem', () => {
    const { projects, warnings } = mergeProjects(
      [repo('rsa')],
      [{ repo: 'apagado', featured: true, order: 1 }],
    );

    expect(projects.map((p) => p.repo)).toEqual(['rsa']);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatch(/apagado/);
  });
});
