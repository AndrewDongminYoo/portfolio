import { differenceInMonths } from 'date-fns';
import { differenceInDays } from 'date-fns/differenceInDays';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { ReactElement } from 'react';

import Period from '@/components/period';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type Resume from '@/interface/profile';
import { cn } from '@/lib/utils';
const pixels = 240;

export default function GridTimeline({ timeline }: { timeline: Resume[] }) {
  const { monthsLabels, makeBlock, column } = getMonthLabels();
  return (
    <div className='flex w-full flex-col items-end justify-start'>
      <div className='mb-0 flex max-h-max w-full flex-col flex-nowrap items-start justify-start border-b-0 px-0 py-6'>
        <div className='mx-0 my-0 block min-h-[50px] w-full text-base break-all'>
          <div
            className='mb-0.5 grid grid-cols-1 text-base leading-snug'
            style={{ gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))` }}>
            {monthsLabels}
          </div>
          <div
            className='grid grid-flow-col-dense pt-1'
            style={{ gridTemplateColumns: `repeat(${pixels}, minmax(0, 1fr))` }}>
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
  const column = Math.ceil(differenceInMonths(now, parseISO('2022-05-15')) / 2);

  while (monthsLabels.length < column) {
    const datetime = now.getMonth() <= 1 ? format(now, 'yy년') : format(now, 'MM월');
    const label = (
      <time
        key={now.toUTCString()}
        dateTime={datetime}
        className='text-xxs border-r border-solid border-r-slate-200 pl-1 leading-normal text-slate-600'
        style={{ fontWeight: now.getMonth() <= 1 ? '900' : undefined }}>
        {datetime}
      </time>
    );
    monthsLabels.unshift(label);
    if (now.getMonth() <= 1) {
      now.setFullYear(now.getFullYear() - 1);
      now.setMonth(now.getMonth() + 10);
    } else {
      now.setMonth(now.getMonth() - 2);
    }
  }
  const latest = new Date();
  const oldest = now;
  const pixel = pixels / differenceInDays(latest, oldest);
  const makeBlock = (action: Resume, index: number) => {
    const { type, id, name, startAt, endAt } = action;
    const end = endAt ? parseISO(endAt) : latest;
    const sPoint = Math.round(differenceInDays(parseISO(startAt), oldest) * pixel);
    const ePoint = Math.round(differenceInDays(end, oldest) * pixel);
    if (sPoint <= 0 || ePoint <= 0) return null;
    const gridColumn = `${sPoint} / ${ePoint}`;
    return (
      <Tooltip>
        <TooltipTrigger
          key={`${id}-${type}`}
          className={cn(
            'ml-[1.6px] cursor-text overflow-clip rounded-sm px-2 py-1 text-center leading-normal font-black whitespace-nowrap',
            ['activity', 'project'].includes(type) ? 'text-xxs tracking-tight' : 'text-xs',
            tailwindColor[type],
          )}
          style={{ gridColumn, opacity: `${100 - index * 15}%` }}>
          {name}
        </TooltipTrigger>
        <TooltipContent>
          <Period startAt={startAt} endAt={format(end, 'yyyy-MM-dd')} />
        </TooltipContent>
      </Tooltip>
    );
  };
  return { monthsLabels, makeBlock, column };
};

const tailwindColor = {
  activity: 'bg-gray-400 text-zinc-800',
  project: 'bg-gray-500 text-zinc-100',
  education: 'bg-gray-400 text-zinc-700',
  experience: 'bg-mirage text-quill-gray',
};
