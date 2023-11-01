import Period from 'components/common/period';
import { ReactElement } from 'react';
import type Resume from 'types/profile';
import diff from 'date-fns/differenceInDays';
import format from 'date-fns/format';
import { names } from 'lib/utils';
import parse from 'date-fns/parseISO';
import { renderToString } from 'react-dom/server';

export default function GridTimeline({ timeline }: { timeline: Resume[] }) {
  const { monthsLabels, makeBlock } = getMonthLabels();
  return (
    <div className='flex flex-col items-end justify-start w-full'>
      <div
        className={names(
          'flex flex-col items-start justify-start flex-nowrap',
          'w-full px-0 py-6 mb-0 border-b-0 max-h-max',
        )}>
        <div className='block w-full m-0 text-base break-all min-h-12.5'>
          <div className='grid mb-0.5 text-base leading-snug grid-cols-11'>{monthsLabels}</div>
          <div className='pt-1 grid grid-flow-col-dense grid-cols-100'>
            {timeline.map(makeBlock)}
          </div>
        </div>
      </div>
    </div>
  );
}

const getMonthLabels = () => {
  const now = new Date();
  const monthsLabels: ReactElement[] = [];
  while (monthsLabels.length < 11) {
    const month = format(now, 'yy.MM');
    const label = (
      <time
        key={now.toUTCString()}
        dateTime={month}
        className={names(
          'pl-1 border-r border-solid border-r-slate-200',
          'text-xs leading-normal text-slate-600',
        )}>
        {month}
      </time>
    );
    monthsLabels.unshift(label);
    now.setMonth(now.getMonth() - 2);
  }
  const latest = new Date();
  const oldest = now;
  const pixel = 100 / diff(latest, oldest);
  const makeBlock = (action: Resume) => {
    const { type, id, name, startAt, endAt } = action;
    const end = endAt ? parse(endAt) : latest;
    const sPoint = Math.round(diff(parse(startAt), oldest) * pixel);
    const ePoint = Math.round(diff(end, oldest) * pixel);
    if (sPoint <= 0 || ePoint <= 0) return null;
    const gridColumn = `${sPoint} / ${ePoint}`;
    const popOverHtml = <Period startAt={startAt} endAt={format(end, 'yyyy-MM-dd')} />;
    return (
      <span
        key={`${id}-${type}`}
        title={name}
        data-original-title={name}
        data-type={type}
        data-html={true}
        data-toggle='popover'
        data-placement='top'
        data-content={renderToString(popOverHtml)}
        className={names(
          'font-black leading-normal text-center whitespace-nowrap',
          'rounded-sm cursor-text py-1 px-2 ml-0.4 overflow-clip',
          ['activity', 'project'].includes(type) ? 'text-xxs tracking-tight' : 'text-xs',
          tailwindColor[type],
        )}
        style={{ gridColumn }}>
        {name}
      </span>
    );
  };
  return { monthsLabels, makeBlock };
};

const tailwindColor = {
  activity: 'bg-gray-400 text-zinc-800',
  project: 'bg-gray-500 text-zinc-100',
  education: 'bg-gray-400 text-zinc-700',
  experience: 'bg-slate-700 text-slate-400',
};
