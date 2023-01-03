import colorMap, { Language } from './lang_colors';
import names from 'classnames';
import styles from '@styles/repository.module.css';

export default function LanguageStateBar({
    languages,
    totalCount,
}: {
    languages: [Language, number][];
    totalCount: number;
}) {
    return (
        <span data-view-component={true} className={styles.Progress}>
            {languages.map(([language, count], id) => {
                return (
                    <LanguageBarPart
                        language={language}
                        percent={(count / totalCount) * 100}
                        key={id}
                    />
                );
            })}
        </span>
    );
}

function LanguageBarPart({
    language,
    percent,
}: {
    language: Language;
    percent: number;
}) {
    const backgroundColor = colorMap[
        language as keyof typeof colorMap
    ] as string;
    const percentString = percent.toFixed(1) + '%';
    return (
        <span
            style={{
                backgroundColor: `${backgroundColor} !important`,
                width: percentString,
            }}
            itemProp="keywords"
            aria-label={`${language} ${percentString}`}
            data-view-component={true}
            className={names(
                styles.ProgressItem,
                styles.color_bg_success_emphasis
            )}
        />
    );
}
