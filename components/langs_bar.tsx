import colorMap from '@data/lang_colors.module.json';
import names from 'classnames';
import styles from '@styles/repository.module.css';


export default function LanguageStateBar({ languages, totalCount }: { languages: [string, number][], totalCount: number }) {
    return (
        <span data-view-component={true}
            className={styles.Progress}>
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

export function LanguageBarPart({ language, percent }: { language: string; percent: number; }) {
    const backgroundColor = colorMap[language as keyof typeof colorMap] as string;
    const percentString = percent.toFixed(1) + '%'
    return (
        <span style={{
            backgroundColor: `${backgroundColor} !important`,
            width: percentString
        }}
            itemProp="keywords"
            aria-label={`${language} ${percentString}`}
            data-view-component={true}
            className={names(styles.ProgressItem, styles.color_bg_success_emphasis)}
        />
    );
}