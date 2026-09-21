import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pmezzonato.github.io',
  base: '/writeups',
  trailingSlash: 'always',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
