import Link from 'next/link';
import colorMap from '@data/lang_colors.module.json';
import styles from '@styles/repository.module.css';

type T = keyof typeof colorMap;

export default function LanguageButton({
    language,
    percent,
    index,
}: {
    language: T;
    percent: number;
    index: number;
}) {
    const backgroundColor = colorMap[language] as string;
    const myRepoLanguage = `https://github.com/AndrewDongminYoo?tab=repositories&language=${language}`;
    const trendingOfLang = `https://github.com/topics/${language}`;
    const style = { backgroundColor };
    return (
        <li className={styles.language__component}>
            <Link href={index === 0 ? myRepoLanguage : trendingOfLang}>
                <span
                    className={styles.language_button}
                    style={style}
                    aria-hidden={true}
                />
                <span className={styles.language_name}>{language}</span>
                <span>{percent.toFixed(1) + '%'}</span>
            </Link>
        </li>
    );
}
