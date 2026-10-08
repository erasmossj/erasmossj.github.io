import { describe, expect, it } from 'vitest';
import type { RepoLanguage } from './github/types.ts';
import { languageFilters, primaryLanguage, sortByPushedAt } from './languages.ts';

const lang = (name: string, percent = 100, color: string | null = '#000000'): RepoLanguage => ({
  name,
  color,
  percent,
});

describe('primaryLanguage', () => {
  it('retorna a linguagem com maior fatia do repositório', () => {
    expect(primaryLanguage({ languages: [lang('C++', 83), lang('Shell', 17)] })?.name).toBe('C++');
  });

  it('retorna null quando o repositório não tem linguagem', () => {
    expect(primaryLanguage({ languages: [] })).toBeNull();
  });
});

describe('languageFilters', () => {
  it('conta os repositórios por linguagem principal, da mais usada para a menos', () => {
    const filters = languageFilters([
      { languages: [lang('Java', 100, '#b07219')] },
      { languages: [lang('C', 90), lang('C++', 10)] },
      { languages: [lang('Java')] },
      { languages: [] },
      { languages: [lang('C')] },
      { languages: [lang('Python')] },
    ]);

    expect(filters).toEqual([
      { name: 'C', count: 2, color: '#000000' },
      { name: 'Java', count: 2, color: '#b07219' },
      { name: 'Python', count: 1, color: '#000000' },
    ]);
  });

  it('retorna lista vazia sem repositórios', () => {
    expect(languageFilters([])).toEqual([]);
  });
});

describe('sortByPushedAt', () => {
  it('ordena do push mais recente para o mais antigo sem alterar a lista original', () => {
    const items = [
      { name: 'a', pushedAt: '2025-01-01T00:00:00Z' },
      { name: 'b', pushedAt: '2026-01-01T00:00:00Z' },
      { name: 'c', pushedAt: '2024-01-01T00:00:00Z' },
    ];

    expect(sortByPushedAt(items).map((i) => i.name)).toEqual(['b', 'a', 'c']);
    expect(items.map((i) => i.name)).toEqual(['a', 'b', 'c']);
  });
});
