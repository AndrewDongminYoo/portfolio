import { Head, Html, Main, NextScript } from 'next/document';
import { description, siteTitle, url } from '@data/constants';

export default function Document() {
    return (
        <Html lang="ko">
            <Head>
                <meta name="description" content={description} />
                <meta name="og:url" property="og:url" content={url} />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" property="og:url" content={url} />
                <meta
                    name="og:description"
                    property="og:description"
                    itemProp="description"
                    content={description}
                />
                <meta
                    name="og:title"
                    content={siteTitle}
                    itemProp="title name"
                />
                <meta
                    name="twitter:description"
                    property="og:description"
                    itemProp="description"
                    content={description}
                />
                <meta
                    name="twitter:title"
                    property="og:title"
                    itemProp="title name"
                    content={siteTitle}
                />
                {/* eslint-disable-next-line @next/next/no-css-tags */}
                <link rel="stylesheet" href="print.css" media="print" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
