import { expect, test } from '@playwright/test';
import { site } from '../src/data/site.ts';
import { languages, localize, pathFor, ui } from '../src/lib/i18n.ts';

// Os mesmos cenários nas duas versões do site: `/` (português) e `/en/` (inglês).
for (const lang of languages) {
  test.describe(`${lang} (${pathFor(lang)})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(pathFor(lang));
    });

    test('carrega sem erros no console', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('pageerror', (error) => errors.push(error.message));

      await page.reload();
      await page.waitForLoadState('networkidle');

      expect(errors).toEqual([]);
    });

    test('mostra todas as seções do menu', async ({ page }) => {
      for (const item of site.nav) {
        const section = page.locator(`section#${item.id}`);
        await expect(section).toBeVisible();
        await expect(section.getByRole('heading', { level: 2 })).toContainText(
          localize(item.label, lang),
        );
      }
    });

    test('renderiza ao menos um card de destaque com dados do GitHub', async ({ page }) => {
      const cards = page.locator('#destaques article');

      await expect(cards.first()).toBeVisible();
      await expect(cards.first().getByRole('heading')).not.toBeEmpty();
      await expect(
        cards.first().locator('a[href^="https://github.com/erasmossj/"]').first(),
      ).toBeAttached();
    });

    test('filtra os repositórios por linguagem', async ({ page }) => {
      const section = page.locator('#repositorios');
      const filters = section.getByRole('group', { name: ui[lang]['repos.filter'] });
      const items = section.locator('[data-repo-list] > li');
      const visibleItems = section.locator('[data-repo-list] > li:visible');
      const total = await items.count();

      const language = filters.getByRole('button').nth(1);
      const name = await language.getAttribute('data-language');
      await language.click();

      await expect(language).toHaveAttribute('aria-pressed', 'true');
      const shown = await visibleItems.count();
      expect(shown).toBeGreaterThan(0);
      expect(shown).toBeLessThan(total);
      for (const item of await visibleItems.all()) {
        await expect(item).toHaveAttribute('data-language', name ?? '');
      }
      await expect(section.locator('[data-repo-status]')).toContainText(String(shown));

      await filters.getByRole('button', { name: new RegExp(`^${ui[lang]['repos.all']}`) }).click();
      await expect(visibleItems).toHaveCount(total);
    });

    test('links que abrem em nova aba usam rel="noopener"', async ({ page }) => {
      const links = page.locator('a[target="_blank"]');
      expect(await links.count()).toBeGreaterThan(0);

      for (const link of await links.all()) {
        const href = await link.getAttribute('href');
        expect((await link.getAttribute('rel')) ?? '', `rel de ${href}`).toMatch(/\bnoopener\b/);
      }
    });

    test('alterna o tema e lembra a escolha ao recarregar', async ({ page }) => {
      const root = page.locator('html');
      const before = await root.getAttribute('data-theme');
      const after = before === 'dark' ? 'light' : 'dark';

      await page.locator('[data-theme-toggle]:visible').click();
      await expect(root).toHaveAttribute('data-theme', after);

      await page.reload();
      await expect(root).toHaveAttribute('data-theme', after);
    });
  });
}
