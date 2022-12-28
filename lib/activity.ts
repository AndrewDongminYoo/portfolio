import $ from "elly";
import addSubtractDate from "add-subtract-date";
import calParse from "github-calendar-parser";
import fetch from 'node-fetch';
import formatoid from "formatoid";
import { parse } from 'node-html-parser';

export type GlobalStat = {
    contribTitle: string;
    contribNumber: string;
    contribPeriod: string;
}

const DATE_FORMAT1 = "MMM D, YYYY";
const DATE_FORMAT2 = "MMMM D";

const printDayCount = (dayCount: number): string => `${dayCount} ${dayCount === 1 ? "day" : "days"}`;

const getCalendar = async (username: string) => await fetch("https://api.bloggify.net/gh-calendar/?username=" + username).then((r) => r.text());

export const fetchCalendar = async (username: string) => {
    const body = await getCalendar(username);
    const div = parse(body);
    const cal = div.querySelector(".js-yearly-contributions");
    if (cal === null) return;
    const parsed = calParse($("svg", cal).outerHTML);
    const currentStreakInfo = parsed.current_streak
        ? `${formatoid(parsed.current_streak_range[0], DATE_FORMAT2)} - ${formatoid(parsed.current_streak_range[1], DATE_FORMAT2)}`
        : parsed.last_contributed
            ? `Last contributed in ${formatoid(parsed.last_contributed, DATE_FORMAT2)}.`
            : "Rock - Hard Place";
    const longestStreakInfo = parsed.longest_streak
        ? `${formatoid(parsed.longest_streak_range[0], DATE_FORMAT2)} - ${formatoid(parsed.longest_streak_range[1], DATE_FORMAT2)}`
        : parsed.last_contributed
            ? `Last contributed in ${formatoid(parsed.last_contributed, DATE_FORMAT2)}.`
            : "Rock - Hard Place";
    const contributionsLast = `${formatoid(addSubtractDate.add(addSubtractDate.subtract(new Date(), 1, "year"), 1, "day"), DATE_FORMAT1)} - ${formatoid(new Date(), DATE_FORMAT1)}`;
    const firstCol: GlobalStat = {
        contribTitle: 'Contributions in the last year',
        contribNumber: `${parsed.last_year} total`,
        contribPeriod: `${contributionsLast}`
    };
    const secondCol: GlobalStat = {
        contribTitle: 'Longest streak',
        contribNumber: `${printDayCount(parsed.longest_streak)}`,
        contribPeriod: `${longestStreakInfo}`,
    };
    const thirdCol: GlobalStat = {
        contribTitle: 'Current streak',
        contribNumber: `${printDayCount(parsed.current_streak)}`,
        contribPeriod: `${currentStreakInfo}`,
    };
    return { firstCol, secondCol, thirdCol };
}