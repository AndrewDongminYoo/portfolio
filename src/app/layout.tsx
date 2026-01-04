import '../globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ko } from 'date-fns/locale/ko';
import { Metadata, Viewport } from 'next';
import { Noto_Sans_KR } from 'next/font/google';

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
    'google-site-verification': 'neQfjozvcvnZD1CqVqhnSrBYGK_D0gmTr3F8KFEj0LM',
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
