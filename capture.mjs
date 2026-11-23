import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../shots/package.json', import.meta.url));
const { chromium } = require('playwright');

const host = '127.0.0.1';
const assets = new Map([
  ['/meme.html', ['text/html; charset=utf-8', './meme.html']],
  ['/mark-1024.png', ['image/png', './mark-1024.png']],
]);
const output = process.argv[2] ?? 'meme.png';
if (!/^meme[0-9]*\.png$/.test(output)) throw new Error('Expected an output name like meme.png');

const server = createServer(async (request, response) => {
  const asset = assets.get(request.url);
  if (!asset) {
    response.writeHead(404).end();
    return;
  }
  const [type, path] = asset;
  try {
    const data = await readFile(new URL(path, import.meta.url));
    response.writeHead(200, { 'Content-Type': type }).end(data);
  } catch (error) {
    console.error(error);
    response.writeHead(500).end();
  }
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, host, resolve);
});

let browser;
try {
  const origin = `http://${host}:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 1 });

  const errors = [];
  const loaded = new Set();
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
    else loaded.add(new URL(response.url()).pathname);
  });

  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort('blockedbyclient');
    return route.continue();
  });

  await page.goto(`${origin}/meme.html`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.waitForFunction(() => {
    const image = document.querySelector('image');
    return !!image && image.getBoundingClientRect().width > 0;
  });

  const png = await page.screenshot({ animations: 'disabled' });
  if (!loaded.has('/mark-1024.png')) errors.push('The press-kit ghost did not load');
  if (errors.length) throw new Error(`Meme capture failed:\n${errors.join('\n')}`);

  await writeFile(new URL(output, import.meta.url), png);
  console.log(`Rendered ${output} (${png.byteLength} bytes)`);
} finally {
  try {
    await browser?.close();
  } finally {
    server.close();
  }
}
