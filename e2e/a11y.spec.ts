import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Análise automática do axe (WCAG 2.2 A/AA) nos dois temas (SCRUM-26).
for (const theme of ['light', 'dark'] as const) {
  test(`sem violações de acessibilidade no tema ${theme === 'light' ? 'claro' : 'escuro'}`, async ({
    page,
  }) => {
    await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
    await page.goto('/');
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
