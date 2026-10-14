import { defaultLang, type Lang } from './i18n.ts';

/** Imagem de compartilhamento 1200×630 de cada idioma, gerada por scripts/og-image.ts. */
export function ogImagePath(lang: Lang): string {
  return lang === defaultLang ? '/og.png' : `/og-${lang}.png`;
}

/** Dados da pessoa nos metadados estruturados, já no idioma da página. */
export interface PersonSource {
  name: string;
  fullName: string;
  jobTitle: string;
  institution: string;
  /** Perfis em outros sites (GitHub, LinkedIn). */
  sameAs: string[];
}

/** JSON-LD `Person` (schema.org) para os buscadores ligarem o site aos perfis do GitHub e LinkedIn. */
export function personJsonLd(source: PersonSource, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: source.fullName,
    alternateName: source.name,
    url: siteUrl,
    jobTitle: source.jobTitle,
    affiliation: { '@type': 'CollegeOrUniversity', name: source.institution },
    sameAs: source.sameAs,
  };
}

/** Serializa para um `<script type="application/ld+json">` sem permitir fechar a tag por dentro. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
