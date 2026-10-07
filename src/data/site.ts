export interface NavItem {
  id: string;
  label: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export const site = {
  name: 'Erasmo Junior',
  fullName: 'Erasmo da Silva Sá Junior',
  role: 'Estudante de Ciência da Computação · UFAL',
  // Texto provisório: a versão final é escrita por mim (Guia de Conteúdo, SCRUM-20).
  pitch: 'Construo projetos de algoritmos, computação gráfica e bots com IA.',
  nav: [
    { id: 'sobre', label: 'Sobre' },
    { id: 'destaques', label: 'Destaques' },
    { id: 'repositorios', label: 'Repositórios' },
    { id: 'skills', label: 'Skills' },
    { id: 'formacao', label: 'Formação' },
    { id: 'contato', label: 'Contato' },
  ] satisfies NavItem[],
  socials: [{ label: 'GitHub', href: 'https://github.com/erasmossj' }] satisfies SocialLink[],
};
