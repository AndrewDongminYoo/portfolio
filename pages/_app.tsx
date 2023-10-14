import 'styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import * as customPack from 'components/common/icons';
import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import Head from 'next/head';
import { NextIntlClientProvider } from 'next-intl';
import { Noto_Sans_KR } from 'next/font/google';

config.autoAddCss = false;
library.add(customPack);

const NS_KR = Noto_Sans_KR({
  preload: true,
  style: 'normal',
  display: 'swap',
  subsets: ['latin'],
  adjustFontFallback: true,
  weight: ['300', '400', '500', '700', '900'],
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
      <NextIntlClientProvider
        formats={{
          dateTime: {
            short: {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            },
          },
        }}
        messages={pageProps.messages}
        // Providing an explicit value for `now` ensures consistent formatting of
        // relative values regardless of the server or client environment.
        now={new Date(pageProps.now)}
        // Also an explicit time zone is helpful to ensure dates render the
        // same way on the client as on the server, which might be located
        // in a different time zone.
        timeZone='Asia/Seoul'>
        <main className={NS_KR.className}>
          <Component {...pageProps} />
        </main>
      </NextIntlClientProvider>
    </>
  );
};

App.reportWebVitals = (metric: NextWebVitalsMetric) => {
  console.debug(metric);
};

export default App;
