import '@/styles/globals.css';
import '@/styles/calendar.css';
import '@/styles/markdown.css';

import '@fortawesome/fontawesome-svg-core/styles.css';
import * as customPack from '@/components/common/icons';
import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import Head from 'next/head';
import { Noto_Sans_KR } from 'next/font/google';

config.autoAddCss = false;
library.add(customPack);

const NS_KR = Noto_Sans_KR({
  preload: true,
  style: 'normal',
  display: 'swap',
  subsets: ['latin'],
  adjustFontFallback: true,
  weight: 'variable',
  fallback: [
    'ui-sans-serif',
    'system-ui',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji',
  ],
  variable: '--noto-sans-kr',
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='theme-color' content='#0969da' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />
      </Head>
      <main className={NS_KR.variable}>
        <Component {...pageProps} />
      </main>
    </>
  );
};

App.reportWebVitals = (metric: NextWebVitalsMetric) => {
  console.debug(metric);
};

export default App;
