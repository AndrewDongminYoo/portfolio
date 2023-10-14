import { Head, Html, Main, NextScript } from 'next/document';
import { description, homepage, primaryTitle } from '@/constants/';

export default function Document() {
    return (
        <Html lang='ko'>
            <Head>
                <meta name='description' content={description} />
                <meta name='og:url' property='og:url' content={homepage} />
                <meta name='twitter:card' content='summary' />
                <meta name='twitter:url' property='og:url' content={homepage} />
                <meta
                    name='og:description'
                    property='og:description'
                    itemProp='description'
                    content={description}
                />
                <meta name='og:title' content={primaryTitle} itemProp='title name' />
                <meta
                    name='twitter:description'
                    property='og:description'
                    itemProp='description'
                    content={description}
                />
                <meta
                    name='twitter:title'
                    property='og:title'
                    itemProp='title name'
                    content={primaryTitle}
                />
                {/* eslint-disable-next-line @next/next/no-css-tags */}
                <link rel='stylesheet' href='/styles/print.css' media='print' />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
