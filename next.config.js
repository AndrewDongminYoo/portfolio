/* eslint-disable-next-line @typescript-eslint/no-var-requires */
// const nextTranslate = require('next-translate-plugin');
const isDevelopment = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
module.exports = {
    eslint: {
        /** `next lint`와 `next build` 에서 이 디렉터리에서만 ESLint를 실행합니다. */
        dirs: ['components', 'constants', 'lib', 'pages']
    },
    /** 기본적으로 Next.js는 빌드 시점에 글꼴 CSS를 자동으로 인라인 처리합니다. */
    optimizeFonts: true,
    /** 프로덕션 빌드 중에 브라우저 소스 맵 생성 활성화 */
    productionBrowserSourceMaps: true,
    /** SWC 컴파일러를 사용하여 생성된 자바스크립트 최소화 */
    swcMinify: true,
    /** Next.js 런타임은 엄격한 모드를 준수합니다. */
    reactStrictMode: true,
    /** 기본적으로 Next.js는 후행 슬래시가 있는 URL을 후행 슬래시가 없는 해당 URL로 리디렉션합니다. */
    trailingSlash: true,
    compiler: {
        removeConsole: !isDevelopment
    },
    /**
     * `undefined`: 프로덕션 모드 next start 또는 Vercel과 같은 호스팅 제공업체에서 작동하는 기본 빌드 출력인 .next 디렉토리입니다.
     * `standalone`: 필요한 파일/종속성만 포함하는 독립 실행형 빌드 출력, .next/standalone 디렉토리. Docker 컨테이너에서 자체 호스팅할 때 유용합니다.
     * `export`: 내보낸 빌드 출력, 정적 HTML/CSS/JS만 포함하는 .out 디렉터리. Node.js 서버 없이 자체 호스팅할 때 유용합니다.
     */
    output: 'standalone',
    /** 빌드하는 동안 Next.js는 각 페이지와 해당 종속성을 자동으로 추적하여 애플리케이션의 프로덕션 버전을 배포하는 데 필요한 모든 파일을 확인합니다. */
    outputFileTracing: true,
    /** 빌드 출력 디렉토리(기본값은 .next)는 이제 Next.js 캐시를 제외하고 기본적으로 지워집니다. */
    cleanDistDir: true,
    /**
     * Next.js는 v10.0.0부터 국제화(i18n) 라우팅을 기본적으로 지원합니다. 로캘 목록, 기본 로캘 및 도메인별 로캘을 제공하면 Next.js가 자동으로 라우팅을 처리합니다.
     * 경로와 로캘 구문 분석을 간소화하여 react-intl, react-i18next, lingui, rosetta, next-intl, next-translate, next-multilingual, typesafe-i18n, tolgee 등과 같은 기존 i18n 라이브러리 솔루션을 보완.
     *
     * @see https://nextjs.org/docs/pages/building-your-application/routing/internationalization#prefixing-the-default-locale
     */
    i18n: {
        localeDetection: false,
        /** 애플리케이션에서 지원하려는 모든 로캘은 다음과 같습니다. */
        locales: ['ko', 'en'],
        /** 로캘이 아닌 접두사가 붙은 경로(예: `/hello`)를 방문할 때 사용할 기본 로캘입니다. */
        defaultLocale: 'ko',
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "avatars.githubusercontent.com",
                pathname: "/u/**",
            },
            {
                protocol: 'https',
                hostname: "*.githubassets.com",
            }, {
                protocol: 'https',
                hostname: "AndrewDongminYoo.vercel.app",
            }
        ],
        dangerouslyAllowSVG: true,
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 60,
        disableStaticImages: false,
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        unoptimized: false,
    },
    /** 헤더를 사용하면 들어오는 요청 경로에 대한 사용자 정의 HTTP 헤더를 설정할 수 있습니다. */
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=10, stale-while-revalidate=59', // 일치하는 매개 변수를 값에 사용할 수 있습니다.
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'sec-fetch-site',
                        value: 'same-origin',
                    },
                    {
                        key: 'Referer',
                        value: 'https://AndrewDongminYoo.vercel.app'
                    }
                ]
            }
        ]
    },
}
