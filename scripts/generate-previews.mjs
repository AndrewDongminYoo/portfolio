#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

const delay = (ms = 0) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'assets');
const configPath = path.join(__dirname, 'preview-targets.json');

const defaultTargets = [
  {
    name: 'desktop-1.png',
    path: '/',
    viewport: { width: 1440, height: 900 },
    scrollTo: 0,
    waitAfter: 2400,
  },
  {
    name: 'desktop-2.png',
    path: '/repos',
    viewport: { width: 1440, height: 900 },
    scrollTo: 1100,
    waitAfter: 2400,
  },
  {
    name: 'mobile-1.png',
    path: '/',
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
    scrollTo: 0,
    waitAfter: 2400,
  },
  {
    name: 'mobile-2.png',
    path: '/',
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
    scrollTo: 600,
    waitAfter: 600,
  },
  {
    name: 'mobile-3.png',
    path: '/repos',
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
    scrollTo: 1200,
    waitAfter: 800,
  },
];

const parseArgs = () => {
  const result = {};
  const args = process.argv.slice(2);

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if ((arg === '--url' || arg === '-u') && args[index + 1]) {
      result.baseUrl = args[index + 1];
      index += 1;
    }

    if ((arg === '--target' || arg === '-t') && args[index + 1]) {
      result.targetName = args[index + 1];
      index += 1;
    }
  }

  return result;
};

const loadTargets = async () => {
  try {
    const raw = await readFile(configPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) {
      return parsed;
    }
    throw new Error('preview-targets.json must export a non-empty array.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeFile(configPath, `${JSON.stringify(defaultTargets, null, 2)}\n`, 'utf-8');
      console.log('🆕 Created scripts/preview-targets.json with defaults.');
      return defaultTargets;
    }
    console.warn('⚠️  Falling back to built-in preview targets.', error);
    return defaultTargets;
  }
};

const resolveBaseUrl = (cliBaseUrl) => {
  const baseUrl = cliBaseUrl ?? process.env.PREVIEW_BASE_URL ?? 'http://localhost:3000';
  try {
    return new URL(baseUrl);
  } catch (error) {
    console.error(
      `❌ Invalid base URL "${baseUrl}". Provide a valid origin via --url or PREVIEW_BASE_URL.`,
    );
    throw error;
  }
};

const ensureDir = async (dir) => {
  await mkdir(dir, { recursive: true });
};

const captureTarget = async (browser, target, baseUrl) => {
  const page = await browser.newPage();
  const viewport = target.viewport ?? { width: 1440, height: 900 };
  await page.setViewport({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: target.deviceScaleFactor ?? 2,
    isMobile: target.isMobile ?? false,
    hasTouch: target.hasTouch ?? false,
  });

  if (target.userAgent) {
    await page.setUserAgent(target.userAgent);
  }

  if (target.mediaType) {
    await page.emulateMediaType(target.mediaType);
  }

  if (Array.isArray(target.mediaFeatures) && target.mediaFeatures.length) {
    await page.emulateMediaFeatures(target.mediaFeatures);
  }

  const targetUrl = target.url
    ? new URL(target.url, baseUrl)
    : new URL(target.path ?? '/', baseUrl);

  await page.goto(targetUrl.toString(), {
    waitUntil: target.waitUntil ?? 'networkidle0',
    timeout: target.timeout ?? 90_000,
  });

  if (typeof target.scrollTo === 'number') {
    await page.evaluate((scrollTop) => {
      window.scrollTo(0, scrollTop);
    }, target.scrollTo);

    if (target.scrollWait ?? 0) {
      await delay(target.scrollWait);
    }
  }

  if (target.waitForSelector) {
    await page.waitForSelector(target.waitForSelector, {
      timeout: target.waitForSelectorTimeout ?? 30_000,
    });
  }

  if (target.waitAfter) {
    await delay(target.waitAfter);
  }

  await ensureDir(assetsDir);
  const outputPath = path.join(assetsDir, target.name);

  if (target.selector) {
    const rect = await page.$eval(target.selector, (element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    });

    if (!rect || !rect.width || !rect.height) {
      throw new Error(`Selector "${target.selector}" did not return a measurable element.`);
    }

    await page.screenshot({
      path: outputPath,
      clip: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      },
    });
  } else {
    await page.screenshot({
      path: outputPath,
      fullPage: target.fullPage ?? false,
    });
  }

  await page.close();
  console.log(`📸  Captured ${target.name}`);
};

const main = async () => {
  const parsed = parseArgs();
  const baseUrl = resolveBaseUrl(parsed.baseUrl);
  const configuredTargets = await loadTargets();
  const filteredTargets = parsed.targetName
    ? configuredTargets.filter((target) => target.name === parsed.targetName)
    : configuredTargets;

  if (!filteredTargets.length) {
    console.error(
      `❌ No preview targets matched "${parsed.targetName}". Update scripts/preview-targets.json.`,
    );
    process.exitCode = 1;
    return;
  }

  const isCI = process.env.CI === 'true' || process.env.CI === '1';
  const args = [];
  if (isCI || process.env.PUPPETEER_NO_SANDBOX === '1') {
    args.push('--no-sandbox', '--disable-setuid-sandbox');
  }
  // CI에서 종종 /dev/shm 이슈도 같이 터져서 같이 넣는 게 안전
  args.push('--disable-dev-shm-usage');

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
    args,
  });

  let hasFailure = false;

  for (const target of filteredTargets) {
    try {
      await captureTarget(browser, target, baseUrl);
    } catch (error) {
      hasFailure = true;
      console.error(`❌ Failed to capture ${target.name}`, error);
    }
  }

  await browser.close();

  if (hasFailure) {
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error('❌ Preview capture aborted.', error);
  process.exitCode = 1;
});
