# erasmossj.github.io

[![CI](https://github.com/erasmossj/erasmossj.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/erasmossj/erasmossj.github.io/actions/workflows/ci.yml)
[![Deploy](https://github.com/erasmossj/erasmossj.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/erasmossj/erasmossj.github.io/actions/workflows/deploy.yml)

Portfólio pessoal com os meus projetos do GitHub — **https://erasmossj.github.io**

Feito com [Astro](https://astro.build), Tailwind CSS e TypeScript, publicado no GitHub Pages via GitHub Actions.

## Rodando localmente

Requer Node.js 22.18 ou superior.

```sh
npm install
npm run dev      # servidor local em http://localhost:4321
npm run build    # busca os repositórios no GitHub e gera o site estático em ./dist
npm run preview  # serve o build localmente
```

### Dados do GitHub

Antes do build, `scripts/fetch-github.ts` busca os repositórios públicos pela API GraphQL e salva
em `src/data/repos.json`. A busca precisa de um token em `GITHUB_TOKEN` (no GitHub Actions é usado o
token automático). Localmente, com o [GitHub CLI](https://cli.github.com):

```sh
GITHUB_TOKEN=$(gh auth token) npm run build
```

Sem token, ou se a API falhar, o build usa o último `repos.json` commitado e mostra um aviso. A
curadoria dos projetos (destaques, ordem e textos) fica em `src/data/projects.config.ts`.

## Qualidade

| Comando                | O que faz                             |
| ---------------------- | ------------------------------------- |
| `npm run check`        | Verificação de tipos (`astro check`)  |
| `npm run lint`         | ESLint (incluindo regras de a11y)     |
| `npm test`             | Testes unitários (Vitest)             |
| `npm run format`       | Formata o código com Prettier         |
| `npm run format:check` | Confere a formatação sem alterar nada |

O CI roda essas verificações em todo pull request, mais o Lighthouse CI com nota mínima de 95 em
Performance, Acessibilidade, Boas Práticas e SEO.

## Estrutura

```text
src/
├── components/   componentes reutilizáveis
├── data/         dados dos repositórios e curadoria dos projetos
├── layouts/      layout base das páginas
├── pages/        rotas do site
└── styles/       CSS global e tokens do Tailwind
```

## Licença

[MIT](LICENSE)
