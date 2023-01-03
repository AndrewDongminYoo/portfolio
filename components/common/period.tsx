import {
    differenceInDays,
    differenceInMonths,
    differenceInWeeks,
    differenceInYears,
    format,
    isValid,
    parseISO,
} from 'date-fns';
import React from 'react';

export const DatElement = ({ dateTime, fmt }: { dateTime: string; fmt?: string }) => {
    const date = parseISO(dateTime);
    if (isValid(date)) {
        return <time dateTime={dateTime}>{format(date, fmt ?? 'yy-MM')}</time>;
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
    const start = parseISO(startAt);
    const end = isValid(parseISO(endAt)) ? parseISO(endAt) : new Date();
    const diff = differenceInDays(end, start);
    const diff1 = differenceInWeeks(end, start) + 1;
    const diff2 = differenceInMonths(end, start) + 1;
    const diff3 = differenceInYears(end, start) + 1;
    let periodString = '';
    if (diff > 2) periodString = `(${diff}일)`;
    if (diff1 > 2) periodString = `(${diff1}주)`;
    if (diff2 > 2) periodString = `(${diff2}개월)`;
    if (diff2 > 20) periodString = `(${diff3}년)`;
    return (
        <span className={className}>
            {'기간: '}
            <DatElement dateTime={startAt} />
            {' ~ '}
            <DatElement dateTime={endAt} /> {periodString}
        </span>
    );
}
