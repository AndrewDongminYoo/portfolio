import $ from 'date-fns/format';
import diffInDays from 'date-fns/differenceInDays';
import diffInMonths from 'date-fns/differenceInMonths';
import diffInWeeks from 'date-fns/differenceInWeeks';
import diffInYears from 'date-fns/differenceInYears';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parseISO';

const DateElement = ({ dateTime, fmt }: { dateTime: string; fmt?: string }) => {
    const date = parse(dateTime);
    if (isValid(date)) {
        return <time dateTime={dateTime}>{$(date, fmt ?? 'yy-MM')}</time>;
    } else {
        return <span>{dateTime}</span>;
    }
};

export default function Period({
    startAt,
    endAt,
    className,
}: {
    startAt: string;
    endAt: string;
    className?: string;
}) {
    const start = parse(startAt);
    const end = isValid(parse(endAt)) ? parse(endAt) : new Date();
    const diff = diffInDays(end, start);
    const diff1 = diffInWeeks(end, start) + 1;
    const diff2 = diffInMonths(end, start) + 1;
    const diff3 = diffInYears(end, start) + 1;
    let periodString = '';
    if (diff > 2) periodString = `(${diff}일)`;
    if (diff1 > 2) periodString = `(${diff1}주)`;
    if (diff2 > 2) periodString = `(${diff2}개월)`;
    if (diff2 > 20) periodString = `(${diff3}년)`;
    return (
        <span className={className}>
            <DateElement dateTime={startAt} />
            {' ~ '}
            <DateElement dateTime={endAt} /> {periodString}
        </span>
    );
}
