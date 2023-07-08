import '@/styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import * as customPack from '@/components/common/icons';
import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import Head from 'next/head';
import { NextIntlClientProvider } from 'next-intl';
import { Noto_Sans_KR } from 'next/font/google';

config.autoAddCss = false;
library.add(customPack);

const NS_KR = Noto_Sans_KR({
    style: 'normal',
    display: 'swap',
    subsets: ['latin'],
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
            <NextIntlClientProvider messages={pageProps.messages}>
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
