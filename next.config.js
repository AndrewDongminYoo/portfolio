const isDevelopment = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
module.exports = {
  /** 프로덕션 빌드 중에 브라우저 소스 맵 생성 활성화 */
  productionBrowserSourceMaps: true,
  /** Next.js 런타임은 엄격한 모드를 준수합니다. */
  reactStrictMode: true,
  /** 기본적으로 Next.js는 후행 슬래시가 있는 URL을 후행 슬래시가 없는 해당 URL로 리디렉션합니다. */
  trailingSlash: true,
  compiler: {
    removeConsole: !isDevelopment,
  },
  turbopack: {
    root: __dirname,
  },
  /**
   * `undefined`: 프로덕션 모드 next start 또는 Vercel과 같은 호스팅 제공업체에서 작동하는 기본 빌드 출력인 .next 디렉토리입니다.
   * `standalone`: 필요한 파일/종속성만 포함하는 독립 실행형 빌드 출력, .next/standalone 디렉토리. Docker 컨테이너에서 자체 호스팅할 때 유용합니다.
   * `export`: 내보낸 빌드 출력, 정적 HTML/CSS/JS만 포함하는 .out 디렉터리. Node.js 서버 없이 자체 호스팅할 때 유용합니다.
   */
  output: undefined,
  /** 빌드 출력 디렉토리(기본값은 .next)는 이제 Next.js 캐시를 제외하고 기본적으로 지워집니다. */
  cleanDistDir: true,
  /** OG 이미지 라우트가 번들 Noto Sans KR 폰트를 서버리스에서 읽을 수 있도록 포함합니다. */
  outputFileTracingIncludes: {
    '/opengraph-image': ['./public/fonts/**'],
    '/posts/[post]/opengraph-image': ['./public/fonts/**'],
    '/repos/[repo]/opengraph-image': ['./public/fonts/**'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'AndrewDongminYoo.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'simpleicons.org',
        pathname: '/icons/**',
      },
    ],
    dangerouslyAllowSVG: true,
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    disableStaticImages: false,
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    unoptimized: true,
  },
  /**
   * 헤더를 사용하면 들어오는 요청 경로에 대한 사용자 정의 HTTP 헤더를 설정할 수 있습니다.
   * @returns {Promise<import('next/dist/lib/load-custom-routes').Header[]>} - 헤더 목록을 리턴
   */
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=10, stale-while-revalidate=59', // 일치하는 매개 변수를 값에 사용할 수 있습니다.
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'sec-fetch-site',
          value: 'same-origin',
        },
        {
          key: 'Referer',
          value: 'https://AndrewDongminYoo.vercel.app',
        },
      ],
    },
  ],
};
