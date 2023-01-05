import '@styles/globals.css';
import type { AppProps, NextWebVitalsMetric } from 'next/app';
import Head from 'next/head';
import names from 'classnames';
import { notoSans } from '@hooks/useFont';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="theme-color" content="#0969da" />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
            </Head>
            <main className={names(notoSans.className,)}>
                <Component {...pageProps} />
            </main>
        </>
    );
};

App.reportWebVitals = (metric: NextWebVitalsMetric) => {
    console.debug(metric);
};

export default App;