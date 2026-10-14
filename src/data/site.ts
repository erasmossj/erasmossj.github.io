import type { Localized } from '../lib/i18n.ts';

export interface NavItem {
  id: string;
  label: Localized;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Email {
  label: Localized;
  address: string;
}

export interface Competition {
  name: Localized;
  detail: Localized;
}

const githubUrl = 'https://github.com/erasmossj';
const linkedinUrl = 'https://www.linkedin.com/in/erasmo-junior-883010309/';

// Textos em `{ pt, en }` (SCRUM-31); valores simples valem para os dois idiomas.
export const site = {
  name: 'Erasmo Junior',
  fullName: 'Erasmo da Silva Sá Junior',
  role: {
    pt: 'Estudante de Ciência da Computação · UFAL',
    en: 'Computer Science student · UFAL',
  } as Localized,
  githubUrl,
  linkedinUrl,
  sourceUrl: 'https://github.com/erasmossj/erasmossj.github.io',
  pitch: {
    pt: 'Construo projetos de algoritmos, computação gráfica e bots com IA.',
    en: 'I build projects in algorithms, computer graphics and AI-powered bots.',
  } as Localized,
  about: {
    pt: [
      'Sou estudante de Ciência da Computação no Instituto de Computação da UFAL, em Maceió. Gosto de entender como as coisas funcionam por dentro e de transformar o que aprendo nas disciplinas em projetos que dá para rodar e mostrar.',
      'Meus interesses giram em torno de algoritmos e programação competitiva, com treino em questões da ICPC; de computação gráfica, que hoje estudo com a Godot; e de IA, principalmente aplicações com modelos de linguagem, como o bot de Discord que fiz com o Gemini.',
      'Aqui reúno os projetos de que mais gosto, com o contexto de cada um e o que aprendi no caminho.',
    ],
    en: [
      "I'm a Computer Science student at the Institute of Computing of UFAL (Federal University of Alagoas), in Maceió, Brazil. I like understanding how things work under the hood and turning what I learn in class into projects that actually run and that I can show.",
      "My interests revolve around algorithms and competitive programming, training with ICPC problems; computer graphics, which I'm currently studying with Godot; and AI, especially applications built on language models, like the Discord bot I made with Gemini.",
      'Here I gather the projects I like the most, with the context of each one and what I learned along the way.',
    ],
  } as Localized<string[]>,
  nav: [
    { id: 'sobre', label: { pt: 'Sobre', en: 'About' } },
    { id: 'destaques', label: { pt: 'Destaques', en: 'Featured' } },
    { id: 'repositorios', label: { pt: 'Repositórios', en: 'Repositories' } },
    { id: 'skills', label: 'Skills' },
    { id: 'formacao', label: { pt: 'Formação', en: 'Education' } },
    { id: 'contato', label: { pt: 'Contato', en: 'Contact' } },
  ] satisfies NavItem[],
  socials: [
    { label: 'GitHub', href: githubUrl },
    { label: 'LinkedIn', href: linkedinUrl },
  ] satisfies SocialLink[],

  // As linguagens da seção Skills vêm dos repositórios; estas listas são manuais.
  skills: {
    tools: {
      pt: [
        'Git e GitHub',
        'Godot',
        'Astro',
        'Tailwind CSS',
        'Jupyter',
        'R Markdown',
        'API do Gemini',
      ],
      en: [
        'Git and GitHub',
        'Godot',
        'Astro',
        'Tailwind CSS',
        'Jupyter',
        'R Markdown',
        'Gemini API',
      ],
    } as Localized<string[]>,
    interests: {
      pt: [
        'Computação gráfica',
        'Algoritmos e estruturas de dados',
        'Programação competitiva',
        'IA e modelos de linguagem',
      ],
      en: [
        'Computer graphics',
        'Algorithms and data structures',
        'Competitive programming',
        'AI and language models',
      ],
    } as Localized<string[]>,
  },
  education: {
    course: { pt: 'Ciência da Computação', en: 'Computer Science' } as Localized,
    institution: {
      pt: 'Instituto de Computação · Universidade Federal de Alagoas (IC/UFAL)',
      en: 'Institute of Computing · Federal University of Alagoas (IC/UFAL)',
    } as Localized,
    period: { pt: 'Desde 2024.1', en: 'Since 2024.1' } as Localized,
    // Disciplinas que geraram projetos deste portfólio.
    courses: {
      pt: ['Matemática Discreta', 'Estrutura de Dados', 'Programação 2', 'Computação Gráfica'],
      en: ['Discrete Mathematics', 'Data Structures', 'Programming 2', 'Computer Graphics'],
    } as Localized<string[]>,
  },
  competitions: [
    {
      name: {
        pt: 'Olimpíada Brasileira de Informática (OBI) 2024',
        en: 'Brazilian Olympiad in Informatics (OBI) 2024',
      },
      detail: {
        pt: 'Modalidade Programação, nível Sênior · 1ª, 2ª e 3ª fases',
        en: 'Programming track, Senior level · 1st, 2nd and 3rd rounds',
      },
    },
    {
      name: {
        pt: 'Maratona SBC de Programação · sub-regional brasileira do ICPC',
        en: 'SBC Programming Marathon · Brazilian sub-regional of the ICPC',
      },
      detail: { pt: '2025 e 2026', en: '2025 and 2026' },
    },
    {
      name: {
        pt: '1ª Maratona Nordestina de Programação',
        en: '1st Northeast Brazil Programming Marathon',
      },
      detail: '2026',
    },
  ] satisfies Competition[],
  // Frase de abertura da seção Contato.
  contactPitch: {
    pt: 'Quer conversar sobre um projeto, uma vaga ou programação competitiva? Me chame por aqui.',
    en: 'Want to talk about a project, a job opportunity or competitive programming? Reach out here.',
  } as Localized,
  emails: [
    {
      label: { pt: 'E-mail pessoal', en: 'Personal email' },
      address: 'erasmojunior4002@gmail.com',
    },
    { label: { pt: 'E-mail acadêmico', en: 'Academic email' }, address: 'essj@ic.ufal.br' },
  ] satisfies Email[],
};
