import { describe, expect, it } from 'vitest';
import { getLang, localize, pathFor, ui, useTranslations } from './i18n.ts';

describe('ui', () => {
  it('tem as mesmas chaves, todas preenchidas, nos dois idiomas', () => {
    expect(Object.keys(ui.en).sort()).toEqual(Object.keys(ui.pt).sort());
    for (const text of [...Object.values(ui.pt), ...Object.values(ui.en)]) {
      expect(text.trim()).not.toBe('');
    }
  });

  it('usa os mesmos {campos} nas duas traduções', () => {
    const fields = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const key of Object.keys(ui.pt) as (keyof typeof ui.pt)[]) {
      expect(fields(ui.en[key]), key).toEqual(fields(ui.pt[key]));
    }
  });
});

describe('useTranslations', () => {
  it('busca o texto no idioma e preenche os campos', () => {
    expect(useTranslations('pt')('card.of', { title: 'MyFood' })).toBe('de MyFood');
    expect(useTranslations('en')('repos.countOther', { count: 3 })).toBe('3 repositories');
  });

  it('mantém o marcador quando o campo não é informado', () => {
    expect(useTranslations('en')('card.of')).toBe('for {title}');
  });
});

describe('localize', () => {
  it('escolhe a tradução do idioma', () => {
    expect(localize({ pt: 'Sobre', en: 'About' }, 'en')).toBe('About');
    expect(localize({ pt: ['a'], en: ['b'] }, 'pt')).toEqual(['a']);
  });

  it('devolve valores sem tradução como estão', () => {
    expect(localize('MyFood', 'en')).toBe('MyFood');
    expect(localize(['Godot', 'Astro'], 'en')).toEqual(['Godot', 'Astro']);
  });
});

describe('getLang e pathFor', () => {
  it('usa o português quando a rota não tem prefixo de idioma', () => {
    expect(getLang(undefined)).toBe('pt');
    expect(getLang('fr')).toBe('pt');
    expect(getLang('en')).toBe('en');
  });

  it('serve o português na raiz e o inglês em /en/', () => {
    expect(pathFor('pt')).toBe('/');
    expect(pathFor('en')).toBe('/en/');
  });
});
