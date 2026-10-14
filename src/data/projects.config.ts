// Curadoria dos projetos: o que aparece em destaque, em que ordem e com quais textos.
// Os campos opcionais sobrescrevem o que vem do GitHub (ver src/lib/projects.ts).
// Textos em `{ pt, en }` (SCRUM-31); valores simples valem para os dois idiomas.
import type { Localized } from '../lib/i18n.ts';

export interface ProjectConfig {
  /** Nome do repositório no GitHub (github.com/erasmossj/<repo>). */
  repo: string;
  featured: boolean;
  order: number;
  title?: Localized;
  /** Uma frase de impacto, até 120 caracteres. */
  tagline?: Localized;
  /** Disciplina e professor, ou a motivação pessoal. */
  context?: Localized;
  /** A parte mais difícil do projeto, em um bullet. */
  highlight?: Localized;
  demoUrl?: string;
  /** Nome do arquivo de imagem em src/assets/projetos/ (ex.: 'filemetria.png'). */
  image?: string;
}

export const projectsConfig = [
  {
    repo: 'Filemetria',
    featured: true,
    order: 1,
    tagline: {
      pt: 'Jogo 3D na Godot em que o jogador restaura monumentos de Alagoas medindo e estimando áreas.',
      en: '3D game in Godot where the player restores monuments of Alagoas by measuring and estimating areas.',
    },
    context: {
      pt: 'Computação Gráfica · Prof. Marcelo Costa · IC/UFAL, 2026.2',
      en: 'Computer Graphics · Prof. Marcelo Costa · IC/UFAL, 2026.2',
    },
  },
  {
    repo: 'Discord-Chat-Bot',
    featured: true,
    order: 2,
    title: 'Discord Chat Bot',
    tagline: {
      pt: 'Bot de Discord com o Google Gemini que guarda o histórico de conversa por usuário e canal.',
      en: 'Discord bot powered by Google Gemini that keeps the conversation history per user and channel.',
    },
    context: { pt: 'Projeto pessoal', en: 'Personal project' },
  },
  {
    repo: 'Projeto-Criptografia-RSA-Matematica-Discreta',
    featured: true,
    order: 3,
    title: { pt: 'Criptografia RSA', en: 'RSA cryptography' },
    tagline: {
      pt: 'Programa em C que criptografa e descriptografa mensagens com o algoritmo RSA.',
      en: 'C program that encrypts and decrypts messages with the RSA algorithm.',
    },
    context: {
      pt: 'Matemática Discreta · Prof. Bruno Pimentel · IC/UFAL',
      en: 'Discrete Mathematics · Prof. Bruno Pimentel · IC/UFAL',
    },
  },
  {
    repo: 'Segundo-Projeto-Estrutura-de-Dados-2025',
    featured: true,
    order: 4,
    title: { pt: 'Alocação de disciplinas do IC', en: 'IC course allocation' },
    tagline: {
      pt: 'Programa em C que aloca a oferta de disciplinas do Instituto de Computação da UFAL.',
      en: "C program that allocates the course offering of UFAL's Institute of Computing.",
    },
    context: {
      pt: 'Estrutura de Dados · IC/UFAL, 2025',
      en: 'Data Structures · IC/UFAL, 2025',
    },
  },
  {
    repo: 'MyFood-2026.1',
    featured: true,
    order: 5,
    title: 'MyFood',
    tagline: {
      pt: 'Sistema de pedidos de comida em Java.',
      en: 'Food ordering system in Java.',
    },
    context: {
      pt: 'Programação 2 · Prof. Mário Hozano · IC/UFAL, 2026.1',
      en: 'Programming 2 · Prof. Mário Hozano · IC/UFAL, 2026.1',
    },
  },
  {
    repo: 'algoritmos-de-grafos',
    featured: true,
    order: 6,
    title: { pt: 'Algoritmos de grafos', en: 'Graph algorithms' },
    tagline: {
      pt: 'Implementações em C++ de algoritmos clássicos de grafos.',
      en: 'C++ implementations of classic graph algorithms.',
    },
  },
] satisfies ProjectConfig[];
