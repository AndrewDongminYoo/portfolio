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
        return <time dateTime={dateTime}>{$(date, fmt ?? 'yy/MM')}</time>;
    } else {
        return <span>{dateTime}</span>;
    }
};

export default function Period({
    startAt,
    endAt,
    className,
    datesOnly,
}: {
    startAt: string;
    endAt: string;
    className?: string;
    datesOnly?: boolean;
}) {
    const start = parse(startAt);
    const end = isValid(parse(endAt)) ? parse(endAt) : new Date();
    const diffD = diffInDays(end, start);
    const diffW = diffInWeeks(end, start) + 1;
    const diffM = diffInMonths(end, start) + 1;
    const diffY = diffInYears(end, start) + 1;
    let periodString = '';
    if (diffD > 2) periodString = `(${diffD}일)`;
    if (diffW > 2) periodString = `(${diffW}주)`;
    if (diffM > 2) periodString = `(${diffM}개월)`;
    if (diffM > 20) periodString = `(${diffY}년)`;
    return (
        <span className={className}>
            <DateElement dateTime={startAt} />
            {' ~ '}
            <DateElement dateTime={endAt} /> {!datesOnly && periodString}
        </span>
    );
}
