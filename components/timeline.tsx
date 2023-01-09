import { differenceInDays as diff, format, parseISO } from 'date-fns';
import Period from '@components/common/period';
import { ReactElement } from 'react';
import type { Resume } from '@typings/profile';
import names from 'classnames';
import { renderToString as toHtml } from 'react-dom/server';

export default function GridTimeline({ timeline }: { timeline: Resume[]; }) {
    const { monthsLabels, makeBlock } = getMonthLabels();
    return (
        <div className="flex flex-col items-end justify-start w-full">
            <div className="flex flex-col items-start justify-start w-full px-0 py-6 mb-0 border-b-0 flex-nowrap max-h-max">
                <div className="block w-full m-0 text-base break-all min-h-12.5">
                    <div className="grid mb-0.5 text-base leading-snug grid-cols-11">
                        {monthsLabels}
                    </div>
                    <div className="grid grid-flow-col-dense pt-1 grid-cols-100">
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
                key={month}
                className="pl-1 text-xs leading-normal border-r border-solid text-slate-600 border-r-slate-200"
                dateTime={month}
            >
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
        const end = endAt ? parseISO(endAt) : latest;
        const sPoint = Math.round(diff(parseISO(startAt), oldest) * pixel);
        const ePoint = Math.round(diff(end, oldest) * pixel);
        if (sPoint <= 0 || ePoint <= 0) return null;
        const gridColumn = `${sPoint} / ${ePoint}`;
        const popOverHtml = (
            <Period startAt={startAt} endAt={format(end, 'yyyy-MM-dd')} />
        );
        return (
            <span
                key={id}
                title={name}
                data-original-title={name}
                data-type={type}
                data-html={true}
                data-toggle="popover"
                data-placement="top"
                data-content={toHtml(popOverHtml)}
                className={names(
                    'font-black leading-normal text-center whitespace-nowrap rounded-sm cursor-text py-1 px-2 ml-0.4 overflow-clip',
                    ["activity", "project"].includes(type) ? "text-xxs tracking-tight" : "text-xs",
                    tailwindColor(type),
                )}
                style={{ gridColumn }}
            >
                {name}
            </span>
        );
    };
    return { monthsLabels, makeBlock };
};

const tailwindColor = (type: string) => {
    switch (type) {
        case "activity":
            return "bg-gray-400 text-zinc-800";
        case "project":
            return "bg-gray-500 text-zinc-100";
        case "education":
            return "bg-gray-400 text-zinc-700";
        default:
            return "bg-slate-700 text-slate-400";
    }
};