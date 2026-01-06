import '../globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ko } from 'date-fns/locale/ko';
import { Metadata, Viewport } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';

import { description, homepage, keywords, myName, primaryTitle } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 5.0,
  viewportFit: 'cover',
  themeColor: '#0969da',
};

export const metadata: Metadata = {
  metadataBase: homepage,
  title: { default: primaryTitle, template: `%s | ${myName}` },
  description: description,
  applicationName: primaryTitle,
  keywords: keywords,
  referrer: 'strict-origin-when-cross-origin',
  icons: {
    icon: {
      type: 'image/x-icon',
      url: '/favicon.ico',
    },
    shortcut: {
      type: 'image/x-icon',
      url: '/favicon.ico',
    },
    apple: {
      type: 'image/x-icon',
      url: '/favicon.ico',
    },
  },
  appleWebApp: {
    capable: true,
    title: primaryTitle,
    statusBarStyle: 'default',
  },
  alternates: {
    canonical: homepage,
    types: {
      // 'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    url: homepage,
    siteName: primaryTitle,
    description: description,
    images: ['/images/laundry.jpg'],
  },
  other: {
    'x-ua-compatible': 'ie=edge',
    'google-site-verification': ['BiQvPYtlHwQtrRLpNlqqQxfqJv0548TjtrbmZHDizz4'],
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={ko.code} className={cn(NS_KR.variable)} suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel='stylesheet' href='/styles/print.css' media='print' />
      </head>
      <body className='font-sans antialiased'>
        {children}
        {/* Vercel Analytics Script */}
        <Analytics />
        {/* Google Analytics Script */}
        <GoogleAnalytics gaId='G-954YXFWZGG' />
        {/* Vercel Speed Insight Script */}
        <SpeedInsights />
        {/* Microsoft Clarity Script */}
        <Script id='clarity' type='text/javascript' strategy='afterInteractive'>
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ux1kntnn9n");
          `}
        </Script>
      </body>
    </html>
  );
}
