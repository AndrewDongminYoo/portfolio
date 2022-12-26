import { Head, Html, Main, NextScript } from 'next/document';
import { description, siteTitle, url } from '@data/constants';

export default function Document() {
    return (
        <Html lang="ko" data-color-mode="dark" data-light-theme="light" data-dark-theme="dark_dimmed" data-a11y-animated-images="system" className={"octotree octotree-gh"} data-turbo-loaded="">
            <Head>
                <meta name="description" content={description} />
                <meta name="og:description" property="og:description" itemProp="description" content={description} />
                <meta name="og:title" content={siteTitle} itemProp="title name" />
                <meta name="og:url" property="og:url" content={url} />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:description" property="og:description" itemProp="description" content={description} />
                <meta name="twitter:title" property="og:title" itemProp="title name" content={siteTitle} />
                <meta name="twitter:url" property="og:url" content={url} />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}