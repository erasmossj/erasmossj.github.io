/** Dados do site usados nos metadados estruturados (subconjunto de `site` em src/data/site.ts). */
export interface PersonSource {
  name: string;
  fullName: string;
  education: { institution: string };
  socials: { href: string }[];
}

/** JSON-LD `Person` (schema.org) para os buscadores ligarem o site aos perfis do GitHub e LinkedIn. */
export function personJsonLd(source: PersonSource, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: source.fullName,
    alternateName: source.name,
    url: siteUrl,
    jobTitle: 'Estudante de Ciência da Computação',
    affiliation: { '@type': 'CollegeOrUniversity', name: source.education.institution },
    sameAs: source.socials.map((social) => social.href),
  };
}

/** Serializa para um `<script type="application/ld+json">` sem permitir fechar a tag por dentro. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
