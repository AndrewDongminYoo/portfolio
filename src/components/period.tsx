import { format } from 'date-fns/format';
import { formatISO } from 'date-fns/formatISO';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { isSameDay } from 'date-fns/isSameDay';
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

const parseDateInfo = (value?: string) => {
  if (!value) {
    return { date: null, display: '' };
  }
  const parsed = parseISO(value);
  if (!isValid(parsed)) {
    return { date: null, display: value };
  }
  return { date: parsed, display: formatISO(parsed) };
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
  const now = new Date();

  const startInfo = parseDateInfo(startAt);
  const endInfo = parseDateInfo(endAt);

  const startDate = startInfo.date;
  const endDate = endInfo.date ?? now;

  let displayStart = startInfo.display;
  let displayEnd = endInfo.display || formatISO(endDate);
  let rangeStart = startDate;
  let rangeEnd = endDate;

  if (startDate && endInfo.date && endInfo.date < startDate) {
    rangeStart = endInfo.date;
    rangeEnd = startDate;
    displayStart = endInfo.display;
    displayEnd = startInfo.display;
  }

  const canComputeRange =
    rangeStart != null && rangeEnd != null && isValid(rangeStart) && isValid(rangeEnd);
  const isSame = canComputeRange ? isSameDay(rangeStart!, rangeEnd) : false;

  const dur = canComputeRange ? intervalToDuration({ start: rangeStart!, end: rangeEnd }) : null;
  const periods = [];
  if (dur?.days && dur.days > 0) periods.push(`${dur.days}일`);
  if (dur?.weeks && dur.weeks > 0) periods.push(`${dur.weeks}주`);
  if (dur?.months && dur.months > 0) periods.push(`${dur.months}개월`);
  if (dur?.years && dur.years > 0) periods.push(`${dur.years}년`);
  const period = periods.reverse().join(' ');
  return (
    <span className={className}>
      <DateElement dateTime={displayStart} fmt={isSame ? 'yyyy.MM.dd' : 'yyyy.MM'} />
      {!isSame && displayEnd ? (
        <>
          {' ~ '}
          <DateElement dateTime={displayEnd} />
        </>
      ) : null}
      {!isSame && (softWrap ? <br /> : ' ')}
      {!datesOnly && !isSame && period && `(${period})`}
    </span>
  );
}
