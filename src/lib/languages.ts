import type { RepoLanguage } from './github/types.ts';

interface WithLanguages {
  languages: RepoLanguage[];
}

export interface LanguageFilter {
  name: string;
  /** Quantos repositórios têm esta como linguagem principal. */
  count: number;
  color: string | null;
}

/** Linguagem com a maior fatia do código (a API já devolve ordenado por tamanho). */
export function primaryLanguage({ languages }: WithLanguages): RepoLanguage | null {
  return languages[0] ?? null;
}

/** Linguagens principais presentes nos repositórios, da mais usada para a menos (empate: nome). */
export function languageFilters(items: WithLanguages[]): LanguageFilter[] {
  const byName = new Map<string, LanguageFilter>();
  for (const item of items) {
    const language = primaryLanguage(item);
    if (!language) continue;
    const filter = byName.get(language.name);
    if (filter) filter.count += 1;
    else byName.set(language.name, { name: language.name, count: 1, color: language.color });
  }
  return [...byName.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR'),
  );
}

/** Cópia da lista ordenada do push mais recente para o mais antigo. */
export function sortByPushedAt<T extends { pushedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
}
