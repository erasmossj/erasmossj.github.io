import { expect, test } from '@playwright/test';
import { site } from '../src/data/site.ts';
import { htmlLang, languages, pathFor, ui } from '../src/lib/i18n.ts';

// Versão em inglês e troca de idioma (SCRUM-31).
for (const lang of languages) {
  test(`${pathFor(lang)} declara o idioma e aponta para as outras versões`, async ({ page }) => {
    await page.goto(pathFor(lang));

    await expect(page.locator('html')).toHaveAttribute('lang', htmlLang[lang]);
    for (const other of languages) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${htmlLang[other]}"]`),
      ).toHaveAttribute('href', new URL(pathFor(other), 'https://erasmossj.github.io').href);
    }
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
  });
}

test('a versão em inglês não tem textos da interface em português', async ({ page }) => {
  await page.goto(pathFor('en'));
  // As descrições dos repositórios fora da curadoria vêm do GitHub como estão: ficam de fora.
  await page.locator('[data-repo-list] p').evaluateAll((items) => items.forEach((p) => p.remove()));
  const html = await page.content();

  // Textos fixos que mudam entre os idiomas (sem campos a preencher, para comparar literalmente).
  // O nome "Português" aparece de propósito no seletor de idioma.
  const portuguese = (Object.keys(ui.pt) as (keyof typeof ui.pt)[])
    .filter((key) => key !== 'lang.name')
    .filter((key) => ui.pt[key] !== ui.en[key] && !ui.pt[key].includes('{'))
    .map((key) => ui.pt[key])
    .filter((text) => text.length >= 8);
  const about = site.about as { pt: string[] };

  for (const text of [...portuguese, ...about.pt]) {
    expect(html, text).not.toContain(text);
  }
});

test('o seletor troca de idioma e volta', async ({ page }) => {
  await page.goto(pathFor('pt'));

  await page.locator('a[data-lang-switch]:visible').click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.locator('a[data-lang-switch]:visible').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
});

test('o seletor mantém a seção que está na tela', async ({ page }) => {
  await page.goto(pathFor('pt'));
  await page.locator('#skills').evaluate((section) => section.scrollIntoView());
  await expect(page.locator('a[data-nav-link][href="#skills"]').first()).toHaveAttribute(
    'aria-current',
    'location',
  );

  await page.locator('a[data-lang-switch]:visible').click();

  await expect(page).toHaveURL(/\/en\/#skills$/);
});

test('o sitemap lista as duas versões com as alternativas de idioma', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap-0.xml')).text();

  expect(sitemap).toContain('<loc>https://erasmossj.github.io/</loc>');
  expect(sitemap).toContain('<loc>https://erasmossj.github.io/en/</loc>');
  expect(sitemap).toContain('hreflang="en"');
  expect(sitemap).toContain('hreflang="pt-BR"');
});
