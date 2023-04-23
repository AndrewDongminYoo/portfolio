import email from '@/public/images/contacts/email.svg';
import github from '@/public/images/contacts/github.svg';
import phone from '@/public/images/contacts/phone.svg';
import youtube from '@/public/images/contacts/youtube.svg';

const username = 'AndrewDongminYoo';
const myName = 'Andrew Dong-min, Yoo';
const primaryTitle = '집요하게 더 나은 답을 찾아내는 개발자 유동민입니다.';
const secondaryTitle = '[포트폴리오] 계속해서 업데이트 중입니다.';
const ghProfile = 'https://github.com/AndrewDongminYoo/';
const description =
    '좋은 개발자가 되기 위해 계속해서 성장하고자 하는 집요함을 가지고 있습니다. 일상적으로 만나는 모든 문제들에 더 효율적이고 효과적인 답을 찾기 위해 끊임없이 고민하고 사유합니다. 함께 성장하는 좋은 동료가 되기 위해 노력하겠습니다.';
const url = 'https://andrewdongminyoo.vercel.app/';
const stacks = {
    primaryTags: ['React Native', 'Flutter', 'TypeScript', 'Python'],
    technicalTags: [
        'RN / TurboModule (NativeModuleSpec)',
        'Hermes / Flipper',
        'Dart / Flutter',
        'TypeScript / JavaScript',
        'iOS (Swift, Objective-C++)',
        'Android (Kotlin, Java, Gradle)',
        'SwaggerUI / Postman',
        'TailwindCSS / styled_components',
        'AWS CloudFront / AWS Lambda',
        'Django.py / Flask.py',
        'Firebase / GCP',
        'GitHub / Git',
        'GraphQL.js / Prisma.js / Apollo.js',
        'Spring Framework 5 / Spring Boot 2',
        'NoSQL(MongoDB / DynamoDB)',
        'SQL(MySQL / PostgreSQL)',
        'React.js / Next.js',
        'Selenium.py / BeautifulSoup.py',
        'Webpack.js / Rollup.js',
        'Stomp.js / Sock.js',
        'Chart.js / Three.js',
        'Storybook.js',
        'Testing Library / React Test Renderer',
    ],
};
const contacts = [
    {
        type: 'phone',
        link: 'tel:01035661857',
        image: phone,
    },
    {
        type: 'email',
        link: 'mailto:ydm2790@gmail.com',
        image: email,
    },
    {
        type: 'github',
        link: 'https://github.com/AndrewDongminYoo',
        image: github,
    },
    {
        type: 'youtube',
        link: 'https://www.youtube.com/watch?v=vOh90eJ7VdY',
        image: youtube,
    },
];

export { contacts, description, ghProfile, myName, primaryTitle, secondaryTitle, stacks, url };

export default username;
