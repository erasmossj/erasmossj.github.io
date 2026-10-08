export interface NavItem {
  id: string;
  label: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

const githubUrl = 'https://github.com/erasmossj';

export const site = {
  name: 'Erasmo Junior',
  fullName: 'Erasmo da Silva Sá Junior',
  role: 'Estudante de Ciência da Computação · UFAL',
  githubUrl,
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
  socials: [{ label: 'GitHub', href: githubUrl }] satisfies SocialLink[],
};
