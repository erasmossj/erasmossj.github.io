// Gera public/og.png (1200×630), a prévia do link ao compartilhar o site (SCRUM-25).
// Rodar só quando o nome, o título ou o pitch mudarem: `node scripts/og-image.ts`. A imagem fica commitada.
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { site } from '../src/data/site.ts';

const OUTPUT = fileURLToPath(new URL('../public/og.png', import.meta.url));
const FONT = (family: string) =>
  `https://cdn.jsdelivr.net/fontsource/fonts/${family}:vf@latest/latin-wght-normal.woff2`;

const escape = (text: string) => text.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`);

// Paleta "Pôr do sol", tema escuro (mesmos valores de src/styles/global.css).
const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<style>
  @font-face { font-family: Geist; src: url(${FONT('geist')}) format('woff2'); font-weight: 100 900; }
  @font-face { font-family: 'Geist Mono'; src: url(${FONT('geist-mono')}) format('woff2'); font-weight: 100 900; }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; padding: 72px 80px;
    display: flex; flex-direction: column; justify-content: space-between;
    background: radial-gradient(circle at 100% 0%, #3a1d1a 0%, #0b1220 55%);
    color: #e2e8f0; font-family: Geist, system-ui, sans-serif;
  }
  .url { font-family: 'Geist Mono', monospace; font-size: 26px; color: #ff8a5b; letter-spacing: 0.02em; }
  h1 { font-size: 96px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
  .role { margin-top: 24px; font-size: 36px; font-weight: 500; }
  .pitch { margin-top: 20px; font-size: 30px; color: #94a3b8; max-width: 1040px; line-height: 1.35; }
  .bar { height: 8px; width: 160px; border-radius: 4px; background: #ff8a5b; }
</style>
</head>
<body>
  <p class="url">erasmossj.github.io</p>
  <div>
    <h1>${escape(site.name)}</h1>
    <p class="role">${escape(site.role)}</p>
    <p class="pitch">${escape(site.pitch)}</p>
  </div>
  <div class="bar"></div>
</body>
</html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: OUTPUT, type: 'png' });
  console.log(`✓ ${OUTPUT}`);
} finally {
  await browser.close();
}
