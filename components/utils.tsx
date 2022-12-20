import React, { SVGAttributes } from 'react';
import { differenceInDays, differenceInMonths, differenceInWeeks, differenceInYears, format, isValid, parseISO } from 'date-fns';
import Icon from '../types/slug-icon.types';
import { IconType } from '@icons-pack/react-simple-icons';
import { iconMap } from '../types/icon-map.types';

export function DateTime({ dateTime, fmt }: { dateTime: string; fmt?: string }) {
    try {
        const date = parseISO(dateTime);
        return <time dateTime={dateTime}>{format(date, fmt ?? 'yy-MM')}</time>;
    } catch (e) {
        return <span>{dateTime}</span>;
    }
}

export function Period({ startAt, endAt, className }: { startAt: string, endAt: string, className?: string }) {
    const start = parseISO(startAt)
    const end = isValid(parseISO(endAt)) ? parseISO(endAt) : new Date()
    const diff = differenceInDays(end, start)
    const diff1 = differenceInWeeks(end, start) + 1
    const diff2 = differenceInMonths(end, start) + 1
    const diff3 = differenceInYears(end, start) + 1
    let periodString = ''

    if (diff > 2) { periodString = `(${diff}일)` }
    if (diff1 > 2) { periodString = `(${diff1}주)` }
    if (diff2 > 2) { periodString = `(${diff2}개월)` }
    if (diff2 > 20) { periodString = `(${diff3}년)` }
    return (
        <span className={className}>
            기간: <DateTime dateTime={startAt} /> ~ <DateTime dateTime={endAt} /> {periodString}
        </span>
    )
}

export const getIcon = (resume: { icon?: string }) => {
    const icon = resume.icon ? `"${resume.icon} "` : 'square';
    return { listStyleType: icon };
};

export default function Description({
    resume,
}: {
    resume: { icon?: string; description: string | string[] };
}) {
    return (
        <div>
            {typeof resume.description !== 'string' ? (
                <ul style={getIcon(resume)}>
                    {resume.description.map((info: string, i: number) => {
                        return <li key={i}>{info}</li>;
                    })}
                </ul>
            ) : resume.description.split(/\n+/).length > 2 ? (
                <ul style={getIcon(resume)}>
                    {resume.description
                        .split(/\n+/)
                        .map((info: string, i: number) => {
                            return <li key={i}>{info}</li>;
                        })}
                </ul>
            ) : (
                <p>{resume.description}</p>
            )}
        </div>
    );
}

type Temp = { slug: IconType }

export const SlugIcon = (props: IconProps): JSX.Element => {
    // const slug = iconMap[props.icon]
    const p: Temp = { slug: iconMap[props.icon] }
    return <p.slug {...props}></p.slug>
}

export type IconProps = SVGAttributes<SVGElement> & {
    icon: Icon;
    color?: string;
    size?: string | number;
    className?: string;
};