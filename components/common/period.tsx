import { format } from 'date-fns/format';
import { differenceInDays } from 'date-fns/differenceInDays';
import { differenceInMonths } from 'date-fns/differenceInMonths';
import { differenceInWeeks } from 'date-fns/differenceInWeeks';
import { differenceInYears } from 'date-fns/differenceInYears';
import { isValid } from 'date-fns/isValid';
import { parseISO } from 'date-fns/parseISO';

const DateElement = ({ dateTime, fmt }: { dateTime: string; fmt?: string }) => {
  const date = parseISO(dateTime);
  if (isValid(date)) {
    return <time dateTime={dateTime}>{format(date, fmt ?? 'yy/MM')}</time>;
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
  const start = parseISO(startAt);
  const end = isValid(parseISO(endAt)) ? parseISO(endAt) : new Date();
  const diffD = differenceInDays(end, start);
  const diffW = differenceInWeeks(end, start) + 1;
  const diffM = differenceInMonths(end, start) + 1;
  const diffY = differenceInYears(end, start) + 1;
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
