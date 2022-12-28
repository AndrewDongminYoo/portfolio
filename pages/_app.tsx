import '@styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
                <meta name="theme-color" content="#0969da" />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
            </Head>
            <Component {...pageProps} />
        </>
    );
};

export default App;