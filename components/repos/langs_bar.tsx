import colorMap, { Language } from './lang_colors';

export default function LanguageStateBar({
    languages,
    totalCount,
}: {
    languages: [Language, number][];
    totalCount: number;
}) {
    return (
        <span
            data-view-component={true}
            className="flex h-3 mt-1 overflow-hidden bg-transparent border-collapse"
        >
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
    const backgroundColor = colorMap[language] as string;
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
            className="border-collapse flex h-3 overflow-hidden bg-transparent ml-[2px] first:ml-0"
        />
    );
}
