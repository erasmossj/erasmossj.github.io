import type { ProjectConfig } from '../data/projects.config.ts';
import type { GitHubRepo, RepoLanguage } from './github/types.ts';
import { defaultLang, localize, type Lang } from './i18n.ts';

/** Projeto pronto para exibir: dados do GitHub com a curadoria aplicada por cima. */
export interface Project {
  repo: string;
  title: string;
  tagline: string | null;
  context: string | null;
  highlight: string | null;
  url: string;
  demoUrl: string | null;
  image: string | null;
  featured: boolean;
  order: number | null;
  languages: RepoLanguage[];
  topics: string[];
  stars: number;
  pushedAt: string;
}

export interface MergeResult {
  projects: Project[];
  warnings: string[];
}

/**
 * Junta os repositórios com a curadoria; os da curadoria vêm primeiro, os demais por push recente.
 * Os textos da curadoria saem no idioma `lang`; a descrição do GitHub é usada como está.
 */
export function mergeProjects(
  repos: GitHubRepo[],
  config: ProjectConfig[],
  lang: Lang = defaultLang,
): MergeResult {
  const text = (value: ProjectConfig['tagline']) =>
    value === undefined ? undefined : localize(value, lang);
  const byRepo = new Map(config.map((entry) => [entry.repo, entry]));
  const known = new Set(repos.map((repo) => repo.name));

  const warnings = config
    .filter((entry) => !known.has(entry.repo))
    .map(
      (entry) =>
        `Curadoria: o repositório "${entry.repo}" não foi encontrado no GitHub ` +
        '(nome errado, privado, fork ou arquivado) e foi ignorado.',
    );

  const projects = repos.map((repo): Project => {
    const entry = byRepo.get(repo.name);
    return {
      repo: repo.name,
      title: text(entry?.title) ?? repo.name,
      tagline: text(entry?.tagline) ?? repo.description,
      context: text(entry?.context) ?? null,
      highlight: text(entry?.highlight) ?? null,
      url: repo.url,
      demoUrl: entry?.demoUrl ?? repo.homepage,
      image: entry?.image ?? null,
      featured: entry?.featured ?? false,
      order: entry?.order ?? null,
      languages: repo.languages,
      topics: repo.topics,
      stars: repo.stars,
      pushedAt: repo.pushedAt,
    };
  });

  projects.sort((a, b) => {
    if (a.order !== null || b.order !== null) {
      return (a.order ?? Infinity) - (b.order ?? Infinity);
    }
    return b.pushedAt.localeCompare(a.pushedAt);
  });

  return { projects, warnings };
}
