import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), mdx()],
  // The résumé is no longer published on the site; old links land on Experience.
  redirects: {
    '/resume': '/#experience',
  },
});
