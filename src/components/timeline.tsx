'use client';

import { differenceInDays } from 'date-fns/differenceInDays';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';

import Period from '@/components/period';
import type Resume from '@/interface/profile';
import { cn } from '@/lib/utils';

export default function GridTimeline({ timeline }: { timeline: Resume[] }) {
  const { monthsLabels, makeBlock } = getMonthLabels();
  return (
    <div className='flex w-full flex-col items-end justify-start'>
      <div className='mb-0 flex max-h-max w-full flex-col flex-nowrap items-start justify-start border-b-0 px-0 py-6'>
        <div className='mx-0 my-0 block min-h-[50px] w-full text-base break-all'>
          <div className='mb-0.5 grid grid-cols-11 text-base leading-snug'>{monthsLabels}</div>
          <div className='grid grid-flow-col-dense grid-cols-100 pt-1'>
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
        className='border-r border-solid border-r-slate-200 pl-1 text-xs leading-normal text-slate-600'>
        {month}
      </time>
    );
    monthsLabels.unshift(label);
    now.setMonth(now.getMonth() - 2);
  }
  const latest = new Date();
  const oldest = now;
  const pixel = 100 / differenceInDays(latest, oldest);
  const makeBlock = (action: Resume) => {
    const { type, id, name, startAt, endAt } = action;
    console.debug({ type, id, name, startAt, endAt });
    const end = endAt ? parseISO(endAt) : latest;
    const sPoint = Math.round(differenceInDays(parseISO(startAt), oldest) * pixel);
    const ePoint = Math.round(differenceInDays(end, oldest) * pixel);
    console.debug(name, pixel, sPoint, ePoint);
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
        className={cn(
          'ml-[1.6px] cursor-text overflow-clip rounded-sm px-2 py-1 text-center leading-normal font-black whitespace-nowrap',
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
  experience: 'bg-mirage text-quill-gray',
};
