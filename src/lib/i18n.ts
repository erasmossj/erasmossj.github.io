// Idiomas do site (SCRUM-31): português em `/` e inglês em `/en/` (i18n nativo do Astro).

export const languages = ['pt', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'pt';

/** Texto igual nos dois idiomas (valor simples) ou traduzido (`{ pt, en }`). */
export type Localized<T = string> = T | Record<Lang, T>;

/** Atributo `lang`/`hreflang`, locale do `Intl` e do Open Graph de cada idioma. */
export const htmlLang: Record<Lang, string> = { pt: 'pt-BR', en: 'en' };
export const intlLocale: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US' };
export const ogLocale: Record<Lang, string> = { pt: 'pt_BR', en: 'en_US' };

export function isLang(value: unknown): value is Lang {
  return languages.includes(value as Lang);
}

/** Idioma da página a partir de `Astro.currentLocale` (sem prefixo = idioma padrão). */
export function getLang(locale: string | undefined): Lang {
  return isLang(locale) ? locale : defaultLang;
}

/** Caminho da página inicial de cada idioma. */
export function pathFor(lang: Lang): string {
  return lang === defaultLang ? '/' : `/${lang}/`;
}

function isTranslated<T>(value: Localized<T>): value is Record<Lang, T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    languages.every((lang) => lang in value)
  );
}

export function localize<T>(value: Localized<T>, lang: Lang): T {
  return isTranslated(value) ? value[lang] : value;
}

const pt = {
  'meta.portfolio': 'Portfólio',
  'meta.description':
    'Portfólio de projetos de {name}, estudante de Ciência da Computação na UFAL.',
  'person.jobTitle': 'Estudante de Ciência da Computação',
  'a11y.skip': 'Pular para o conteúdo',
  'a11y.newTab': '(abre em nova aba)',
  'nav.label': 'Seções',
  'nav.menu': 'Menu de seções',
  'hero.cta': 'Ver projetos',
  'theme.toggle': 'Alternar tema claro/escuro',
  'lang.name': 'Português',
  'socials.label': 'Redes',
  'featured.empty': 'Nenhum projeto em destaque no momento.',
  'card.preview': 'Prévia de {title}',
  'card.highlight': 'Destaque técnico:',
  'card.topics': 'Tópicos',
  'card.code': 'Código',
  'card.of': 'de {title}',
  'languages.label': 'Linguagens',
  'repos.empty': 'Nenhum repositório público encontrado.',
  'repos.filter': 'Filtrar por linguagem',
  'repos.all': 'Todas',
  'repos.updated': 'atualizado em',
  'repos.stars': 'estrelas',
  'repos.emptyFilter': 'Nenhum repositório nessa linguagem.',
  'repos.countOne': '{count} repositório',
  'repos.countOther': '{count} repositórios',
  'repos.countIn': 'em {language}',
  'skills.languages': 'Linguagens',
  'skills.tools': 'Ferramentas',
  'skills.interests': 'Áreas de interesse',
  'education.courses': 'Disciplinas com projetos neste portfólio',
  'education.competitiveTag': 'Programação competitiva',
  'education.competitions': 'Competições',
  'contact.at': 'arroba',
  'footer.madeBy': 'Feito por {name} com Astro e Tailwind CSS. Dados do GitHub atualizados em',
  'footer.source': 'Código-fonte do site',
};

export type UiKey = keyof typeof pt;

const en: Record<UiKey, string> = {
  'meta.portfolio': 'Portfolio',
  'meta.description':
    'Project portfolio of {name}, a Computer Science student at UFAL (Federal University of Alagoas, Brazil).',
  'person.jobTitle': 'Computer Science student',
  'a11y.skip': 'Skip to content',
  'a11y.newTab': '(opens in a new tab)',
  'nav.label': 'Sections',
  'nav.menu': 'Sections menu',
  'hero.cta': 'View projects',
  'theme.toggle': 'Toggle light/dark theme',
  'lang.name': 'English',
  'socials.label': 'Profiles',
  'featured.empty': 'No featured projects at the moment.',
  'card.preview': 'Preview of {title}',
  'card.highlight': 'Technical highlight:',
  'card.topics': 'Topics',
  'card.code': 'Code',
  'card.of': 'for {title}',
  'languages.label': 'Languages',
  'repos.empty': 'No public repositories found.',
  'repos.filter': 'Filter by language',
  'repos.all': 'All',
  'repos.updated': 'updated',
  'repos.stars': 'stars',
  'repos.emptyFilter': 'No repositories in this language.',
  'repos.countOne': '{count} repository',
  'repos.countOther': '{count} repositories',
  'repos.countIn': 'in {language}',
  'skills.languages': 'Languages',
  'skills.tools': 'Tools',
  'skills.interests': 'Areas of interest',
  'education.courses': 'Courses behind projects in this portfolio',
  'education.competitiveTag': 'Competitive programming',
  'education.competitions': 'Competitions',
  'contact.at': 'at',
  'footer.madeBy': 'Built by {name} with Astro and Tailwind CSS. GitHub data updated on',
  'footer.source': 'Site source code',
};

/** Textos fixos da interface; os de conteúdo ficam em src/data. */
export const ui: Record<Lang, Record<UiKey, string>> = { pt, en };

/** `t('card.of', { title })`: busca o texto no idioma e preenche os `{campos}`. */
export function useTranslations(lang: Lang) {
  return (key: UiKey, params: Record<string, string | number> = {}) =>
    ui[lang][key].replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match,
    );
}
