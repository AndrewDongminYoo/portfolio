#!/usr/bin/env node
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const delay = (ms = 0) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const parseArgs = () => {
  const result = {};
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if ((arg === '--url' || arg === '-u') && args[i + 1]) {
      result.baseUrl = args[i + 1];
      i += 1;
    }
    if ((arg === '--path' || arg === '-p') && args[i + 1]) {
      result.pagePath = args[i + 1];
      i += 1;
    }
    if ((arg === '--out-dir' || arg === '-o') && args[i + 1]) {
      result.outDir = args[i + 1];
      i += 1;
    }
    if ((arg === '--tz' || arg === '-z') && args[i + 1]) {
      result.timeZone = args[i + 1];
      i += 1;
    }
  }

  return result;
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

const timestampKstHour = (timeZone = 'Asia/Seoul') => {
  // YYYYMM (KST by default)
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date());

  const get = (type) => parts.find((p) => p.type === type).value;
  const yyyy = get('year');
  const mm = get('month');
  return `${yyyy}${mm}`;
};

const main = async () => {
  const args = parseArgs();
  const baseUrl = resolveBaseUrl(args.baseUrl);
  const pagePath = args.pagePath ?? '/';
  const timeZone = args.timeZone ?? process.env.TZ ?? 'Asia/Seoul';

  const outDir = path.resolve(rootDir, args.outDir ?? 'public/resume');
  await ensureDir(outDir);

  const stamp = timestampKstHour(timeZone);
  const outputPath = path.join(outDir, `${stamp}.pdf`);

  const url = new URL(pagePath, baseUrl).toString();

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
  });

  try {
    const page = await browser.newPage();

    // 레이아웃 깨짐 줄이려면 적당히 큰 뷰포트(웹 UI 기반이면 특히)
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 90_000 });

    // 프린트 CSS를 타게 하고 싶으면 print 미디어로
    await page.emulateMediaType('print');

    // 애니메이션 대기
    await delay(2400);

    await page.pdf({
      path: outputPath,
      printBackground: true,
      preferCSSPageSize: true,
      waitForFonts: true,
    });

    await page.close();
    console.log(`🧾  Saved PDF: ${outputPath}`);
  } finally {
    await browser.close();
  }
};

main().catch((error) => {
  console.error('❌ PDF generation aborted.', error);
  process.exitCode = 1;
});
