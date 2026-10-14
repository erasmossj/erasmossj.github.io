import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { languages, pathFor } from '../src/lib/i18n.ts';

// Análise automática do axe (WCAG 2.2 A/AA) nos dois temas e nos dois idiomas (SCRUM-26, SCRUM-31).
for (const lang of languages) {
  for (const theme of ['light', 'dark'] as const) {
    test(`sem violações de acessibilidade em ${pathFor(lang)} no tema ${theme === 'light' ? 'claro' : 'escuro'}`, async ({
      page,
    }) => {
      await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
      await page.goto(pathFor(lang));
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      const summary = violations.map(
        (violation) =>
          `${violation.id}: ${violation.help}\n` +
          violation.nodes.map((node) => `  - ${node.target.join(' ')}`).join('\n'),
      );
      expect(summary).toEqual([]);
    });
  }
}
