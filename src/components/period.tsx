import { format } from 'date-fns/format';
import { formatISO } from 'date-fns/formatISO';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { isSameDay } from 'date-fns/isSameDay';
import { isValid } from 'date-fns/isValid';
import { parseISO } from 'date-fns/parseISO';

export const DateElement = ({ dateTime, fmt = 'yyyy.MM.' }: { dateTime: string; fmt?: string }) => {
  const date = parseISO(dateTime);
  if (isValid(date)) {
    return <time dateTime={dateTime}>{format(date, fmt)}</time>;
  } else {
    return <span>{dateTime}</span>;
  }
};

type DateInfo = {
  date: Date | null;
  display: string;
};

const parseDateInfo = (value?: string): DateInfo => {
  if (!value) return { date: null, display: '' };
  const parsed = parseISO(value);
  if (!isValid(parsed)) return { date: null, display: value };
  return { date: parsed, display: formatISO(parsed) };
};

const ensureValidRange = (start: DateInfo, end: DateInfo, fallbackEnd: Date) => {
  const endDate = end.date ?? fallbackEnd;
  let rangeStart = start.date;
  let rangeEnd = endDate;
  let displayStart = start.display;
  let displayEnd = end.display || formatISO(endDate);

  if (start.date && end.date && end.date < start.date) {
    rangeStart = end.date;
    rangeEnd = start.date;
    displayStart = end.display;
    displayEnd = start.display;
  }

  return { rangeStart, rangeEnd, displayStart, displayEnd };
};

const buildDurationLabel = (start: Date | null, end: Date | null) => {
  if (!start || !end || !isValid(start) || !isValid(end)) return '';
  const dur = intervalToDuration({ start, end });
  const parts = [];
  if (dur.days && dur.days > 0) parts.push(`${dur.days}일`);
  if (dur.weeks && dur.weeks > 0) parts.push(`${dur.weeks}주`);
  if (dur.months && dur.months > 0) parts.push(`${dur.months}개월`);
  if (dur.years && dur.years > 0) parts.push(`${dur.years}년`);
  return parts.reverse().join(' ');
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
  const { rangeStart, rangeEnd, displayStart, displayEnd } = ensureValidRange(
    startInfo,
    endInfo,
    now,
  );

  const isSame =
    rangeStart && rangeEnd && isValid(rangeStart) && isValid(rangeEnd)
      ? isSameDay(rangeStart, rangeEnd)
      : false;
  const period = buildDurationLabel(rangeStart, rangeEnd);
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
