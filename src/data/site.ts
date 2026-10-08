export interface NavItem {
  id: string;
  label: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Email {
  label: string;
  address: string;
}

export interface Competition {
  name: string;
  detail: string;
}

const githubUrl = 'https://github.com/erasmossj';
const linkedinUrl = 'https://www.linkedin.com/in/erasmo-junior-883010309/';

export const site = {
  name: 'Erasmo Junior',
  fullName: 'Erasmo da Silva Sá Junior',
  role: 'Estudante de Ciência da Computação · UFAL',
  githubUrl,
  linkedinUrl,
  sourceUrl: 'https://github.com/erasmossj/erasmossj.github.io',
  // Textos provisórios: a versão final é escrita por mim (Guia de Conteúdo, SCRUM-20).
  pitch: 'Construo projetos de algoritmos, computação gráfica e bots com IA.',
  about: [
    'Sou estudante de Ciência da Computação no Instituto de Computação da UFAL, em Maceió. Gosto de entender como as coisas funcionam por dentro e de transformar o que aprendo nas disciplinas em projetos que dá para rodar e mostrar.',
    'Meus interesses giram em torno de algoritmos e programação competitiva, com treino em questões da ICPC; de computação gráfica, que hoje estudo com a Godot; e de IA, principalmente aplicações com modelos de linguagem, como o bot de Discord que fiz com o Gemini.',
    'Aqui reúno os projetos de que mais gosto, com o contexto de cada um e o que aprendi no caminho.',
  ],
  nav: [
    { id: 'sobre', label: 'Sobre' },
    { id: 'destaques', label: 'Destaques' },
    { id: 'repositorios', label: 'Repositórios' },
    { id: 'skills', label: 'Skills' },
    { id: 'formacao', label: 'Formação' },
    { id: 'contato', label: 'Contato' },
  ] satisfies NavItem[],
  socials: [
    { label: 'GitHub', href: githubUrl },
    { label: 'LinkedIn', href: linkedinUrl },
  ] satisfies SocialLink[],

  // As linguagens da seção Skills vêm dos repositórios; estas listas são manuais.
  // Rascunho (SCRUM-23): revisar ferramentas e áreas de interesse.
  skills: {
    tools: [
      'Git e GitHub',
      'Godot',
      'Astro',
      'Tailwind CSS',
      'Jupyter',
      'R Markdown',
      'API do Gemini',
    ],
    interests: [
      'Computação gráfica',
      'Algoritmos e estruturas de dados',
      'Programação competitiva',
      'IA e modelos de linguagem',
    ],
  },
  education: {
    course: 'Ciência da Computação',
    institution: 'Instituto de Computação · Universidade Federal de Alagoas (IC/UFAL)',
    period: 'Desde 2024.1',
    // Disciplinas que geraram projetos deste portfólio.
    courses: ['Matemática Discreta', 'Estrutura de Dados', 'Programação 2', 'Computação Gráfica'],
  },
  competitions: [
    {
      name: 'Olimpíada Brasileira de Informática (OBI) 2024',
      detail: 'Modalidade Programação, nível Sênior · 1ª, 2ª e 3ª fases',
    },
    {
      name: 'Maratona SBC de Programação · sub-regional brasileira do ICPC',
      detail: '2025 e 2026',
    },
    { name: '1ª Maratona Nordestina de Programação', detail: '2026' },
  ] satisfies Competition[],
  // Rascunho (SCRUM-23): frase de abertura da seção Contato.
  contactPitch:
    'Quer conversar sobre um projeto, uma vaga ou programação competitiva? Me chame por aqui.',
  emails: [
    { label: 'E-mail pessoal', address: 'erasmojunior4002@gmail.com' },
    { label: 'E-mail acadêmico', address: 'essj@ic.ufal.br' },
  ] satisfies Email[],
};
