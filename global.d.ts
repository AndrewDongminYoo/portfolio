interface Window {
    GitHubCalendar: (selector: string, username: string, options: object) => void;
}

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        GITHUB_TOKEN: string;
        NEXT_PUBLIC_AUTH0_DOMAIN: string;
        NEXT_PUBLIC_AUTH0_CLIENT_ID: string;
        NEXT_PUBLIC_AUTH0_ADMIN_EMAIL: string;
        NEXT_PUBLIC_BASE_URL: string;
        REDIS_URL: string;
        OPENAI_ORGANIZATION: string;
        OPENAI_API_KEY: string;
    }
}

declare module 'accept-language-parser' {
    /**
     * 'pick' 기능은 제공된 수락 언어 및 옵션을 기반으로 지원되는 언어를 선택하는 데 사용됩니다.
     *
     * @param {string[]} supportedLanguages 지원되는 언어를 나타내는 문자열 배열입니다. 각 문자열은 "language-code" 또는 "language-code-region"
     *      또는 "language-code-script-region" 형식이어야 합니다. 예: ["en", "en-US", "zh-Hans-CN"].
     * @param {string} acceptLanguage `acceptLanguage` 매개변수는 HTTP `Accept-Language` 헤더 형식으로 사용자의 선호 언어를 나타내는 문자열입니다.
     *      쉼표로 구분된 여러 언어 태그를 포함할 수 있으며 각 태그는 언어 코드와 선택적 영역 및 스크립트 하위 태그로 구성됩니다. 예를 들어, "en-US"
     * @param {} options `options` 매개변수는 다음 속성을 포함할 수 있는 선택적 개체입니다.
     *      - `loose`-지역과 스크립트가 일치하는 경우에만 `language-code`가 일치하는 지원되는 언어를 선택하거나 false로 설정합니다. 기본값은 false입니다.
     * @return 수락 언어와 일치하는 지원되는 언어 또는 일치하는 항목이 없으면 null
     */
    function pick(supportedLanguages: readonly ['ko', 'en'], acceptLanguage: string, options?: { loose: boolean; });
}

type IntlMessages = typeof import('./messages/ko.json');
