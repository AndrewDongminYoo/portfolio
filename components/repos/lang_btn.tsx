import colorMap, { Language } from './lang_colors';
import Link from 'next/link';

export default function LanguageButton({
    language,
    percent,
    index,
}: {
    language: Language;
    percent: number;
    index: number;
}) {
    const backgroundColor = colorMap[language] as string;
    const myRepoLanguage = `https://github.com/AndrewDongminYoo?tab=repositories&language=${language}`;
    const trendingOfLang = `https://github.com/topics/${language}`;
    const style = { backgroundColor };
    return (
        <li className="inline-flex items-center mr-1">
            <Link href={index === 0 ? myRepoLanguage : trendingOfLang}>
                <span
                    className="inline-block h-3 mr-1 w-3 rounded-full"
                    style={style}
                    aria-hidden={true}
                />
                <span className="font-medium mr-1 text-slateBlack">{language}</span>
                <span>{percent.toFixed(1) + '%'}</span>
            </Link>
        </li>
    );
}
