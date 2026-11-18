import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jay-parmar.github.io',
  base: '/JayParmar',
  compressHTML: true,
  vite: {
    build: {
      cssTarget: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'],
    },
  },
});
