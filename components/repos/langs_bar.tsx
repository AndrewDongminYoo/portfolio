import Language, { colorMap } from './lang_colors';

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
            className='flex h-3 mt-1 overflow-hidden bg-transparent border-collapse'>
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

function LanguageBarPart({ language, percent }: { language: Language; percent: number }) {
    const backgroundColor = colorMap[language] as string;
    const width = percent.toFixed(1) + '%';
    return (
        <span
            itemProp='keywords'
            aria-label={`${language} ${percent.toFixed(3)}`}
            data-view-component={true}
            className='flex h-3 overflow-hidden border-collapse ml-0.5 first:ml-0'
            style={{
                backgroundColor,
                width,
            }}
        />
    );
}
