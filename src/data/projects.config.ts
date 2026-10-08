// Curadoria dos projetos: o que aparece em destaque, em que ordem e com quais textos.
// Os campos opcionais sobrescrevem o que vem do GitHub (ver src/lib/projects.ts).

export interface ProjectConfig {
  /** Nome do repositório no GitHub (github.com/erasmossj/<repo>). */
  repo: string;
  featured: boolean;
  order: number;
  title?: string;
  /** Uma frase de impacto, até 120 caracteres. */
  tagline?: string;
  /** Disciplina e professor, ou a motivação pessoal. */
  context?: string;
  /** A parte mais difícil do projeto, em um bullet. */
  highlight?: string;
  demoUrl?: string;
  /** Nome do arquivo de imagem em src/assets/projetos/ (ex.: 'filemetria.png'). */
  image?: string;
}

// Rascunho: textos a revisar e completar por mim (Guia de Conteúdo, SCRUM-8).
export const projectsConfig = [
  {
    repo: 'Filemetria',
    featured: true,
    order: 1,
    tagline: 'Projeto de computação gráfica feito na Godot, com GDScript e shaders.',
    context: 'Computação Gráfica · Prof. Marcelo Costa · IC/UFAL, 2026.2',
  },
  {
    repo: 'Discord-Chat-Bot',
    featured: true,
    order: 2,
    title: 'Discord Chat Bot',
    tagline:
      'Bot de Discord com o Google Gemini que guarda o histórico de conversa por usuário e canal.',
    context: 'Projeto pessoal',
  },
  {
    repo: 'Projeto-Criptografia-RSA-Matematica-Discreta',
    featured: true,
    order: 3,
    title: 'Criptografia RSA',
    tagline: 'Programa em C que criptografa e descriptografa mensagens com o algoritmo RSA.',
    context: 'Matemática Discreta · Prof. Bruno Pimentel · IC/UFAL',
  },
  {
    repo: 'Segundo-Projeto-Estrutura-de-Dados-2025',
    featured: true,
    order: 4,
    title: 'Alocação de disciplinas do IC',
    tagline: 'Programa em C que aloca a oferta de disciplinas do Instituto de Computação da UFAL.',
    context: 'Estrutura de Dados · IC/UFAL, 2025',
  },
  {
    repo: 'MyFood-2026.1',
    featured: true,
    order: 5,
    title: 'MyFood',
    tagline: 'Sistema de pedidos de comida em Java.',
    context: 'Programação 2 · Prof. Mário Hozano · IC/UFAL, 2026.1',
  },
  {
    repo: 'algoritmos-de-grafos',
    featured: true,
    order: 6,
    title: 'Algoritmos de grafos',
    tagline: 'Implementações em C++ de algoritmos clássicos de grafos.',
  },
] satisfies ProjectConfig[];
