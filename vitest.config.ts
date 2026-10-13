import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // e2e/ é do Playwright (`npm run test:e2e`).
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
});
