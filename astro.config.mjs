// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Site de usuário do GitHub Pages: servido na raiz, sem `base`.
  site: 'https://erasmossj.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
});
