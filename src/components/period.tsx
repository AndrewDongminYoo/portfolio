import { format } from 'date-fns/format';
import { formatISO } from 'date-fns/formatISO';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { isValid } from 'date-fns/isValid';
import { parseISO } from 'date-fns/parseISO';

const DateElement = ({ dateTime, fmt = 'yy/MM' }: { dateTime: string; fmt?: string }) => {
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
}: {
  startAt: string;
  endAt?: string;
  className?: string;
  datesOnly?: boolean;
}) {
  const start = parseISO(startAt);
  const now = new Date();
  const end = endAt && isValid(parseISO(endAt)) ? parseISO(endAt) : now;
  const dur = intervalToDuration({ start, end });
  let period = '';
  if (dur.days && dur.days > 0) period = `${dur.days}일`;
  if (dur.weeks && dur.weeks > 0) period = `${dur.weeks}주` + period;
  if (dur.months && dur.months > 0) period = `${dur.months}개월` + period;
  if (dur.years && dur.years > 0) period = `${dur.years}년` + period;
  return (
    <span className={className}>
      <DateElement dateTime={formatISO(start)} />
      {' ~ '}
      <DateElement dateTime={formatISO(end)} />
      {!datesOnly && period && ` (${period})`}
    </span>
  );
}
