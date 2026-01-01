import { format } from 'date-fns/format';
import { formatISO } from 'date-fns/formatISO';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { isValid } from 'date-fns/isValid';
import { parseISO } from 'date-fns/parseISO';

const DateElement = ({ dateTime, fmt = 'yyyy.MM.' }: { dateTime: string; fmt?: string }) => {
  const date = parseISO(dateTime);
  if (isValid(date)) {
    return <time dateTime={dateTime}>{format(date, fmt)}</time>;
  } else {
    return <span>{dateTime}</span>;
  }
};

export default function Period({
  startAt,
  endAt,
  className,
  datesOnly,
  softWrap,
}: {
  startAt: string;
  endAt?: string;
  className?: string;
  datesOnly?: boolean;
  softWrap?: boolean;
}) {
  const start = parseISO(startAt);
  const now = new Date();
  const end = endAt && isValid(parseISO(endAt)) ? parseISO(endAt) : now;
  const dur = intervalToDuration({ start, end });
  const periods = [];
  if (dur.days && dur.days > 0) periods.push(`${dur.days}일`);
  if (dur.weeks && dur.weeks > 0) periods.push(`${dur.weeks}주`);
  if (dur.months && dur.months > 0) periods.push(`${dur.months}개월`);
  if (dur.years && dur.years > 0) periods.push(`${dur.years}년`);
  const period = periods.reverse().join(' ');
  return (
    <span className={className}>
      <DateElement dateTime={formatISO(start)} />
      {' ~ '}
      <DateElement dateTime={formatISO(end)} />
      {softWrap ? <br /> : ' '}
      {!datesOnly && period && `(${period})`}
    </span>
  );
}
