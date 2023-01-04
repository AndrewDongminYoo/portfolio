import localFont from '@next/font/local';

export const notoSans = localFont({
    preload: true,
    display: 'swap',
    style: 'normal',
    src: [
        { path: "../public/fonts/NotoSansKR-Thin.otf", weight: '100' },
        { path: "../public/fonts/NotoSansKR-Light.otf", weight: '300' },
        { path: "../public/fonts/NotoSansKR-Regular.otf", weight: '400' },
        { path: "../public/fonts/NotoSansKR-Medium.otf", weight: '500' },
        { path: "../public/fonts/NotoSansKR-Bold.otf", weight: '700' },
        { path: "../public/fonts/NotoSansKR-Black.otf", weight: '900' },
    ],
});