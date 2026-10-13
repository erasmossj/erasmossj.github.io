import { describe, expect, it } from 'vitest';
import { personJsonLd, serializeJsonLd, type PersonSource } from './seo.ts';

const source: PersonSource = {
  name: 'Erasmo Junior',
  fullName: 'Erasmo da Silva Sá Junior',
  education: { institution: 'Universidade Federal de Alagoas' },
  socials: [{ href: 'https://github.com/erasmossj' }, { href: 'https://www.linkedin.com/in/x/' }],
};

describe('personJsonLd', () => {
  it('descreve a pessoa com nome completo, URL do site e perfis em sameAs', () => {
    const data = personJsonLd(source, 'https://erasmossj.github.io/');

    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Erasmo da Silva Sá Junior',
      alternateName: 'Erasmo Junior',
      url: 'https://erasmossj.github.io/',
      affiliation: { '@type': 'CollegeOrUniversity', name: 'Universidade Federal de Alagoas' },
    });
    expect(data.sameAs).toEqual(['https://github.com/erasmossj', 'https://www.linkedin.com/in/x/']);
  });
});

describe('serializeJsonLd', () => {
  it('gera JSON válido', () => {
    expect(JSON.parse(serializeJsonLd({ a: 1, b: ['c'] }))).toEqual({ a: 1, b: ['c'] });
  });

  it('escapa "<" para que o conteúdo não feche a tag <script>', () => {
    const json = serializeJsonLd({ name: '</script><script>alert(1)</script>' });

    expect(json).not.toContain('</script>');
    expect(JSON.parse(json).name).toBe('</script><script>alert(1)</script>');
  });
});
