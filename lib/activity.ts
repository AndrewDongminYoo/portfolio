import $ from "elly";
import addSubtractDate from "add-subtract-date";
import fetch from 'node-fetch';
import formatoid from "formatoid";
import parse from "github-calendar-parser";

type globalStat = {
    textMuted1: string;
    contribNumber: string;
    textMuted2: string;
}

export const getGitHubContributionCounts = async () => {
    const DATE_FORMAT1 = "MMM D, YYYY";
    const DATE_FORMAT2 = "MMMM D";
    const body = await fetch("https://api.bloggify.net/gh-calendar/?username=AndrewDongminYoo").then((r) => r.text());
    const div = document.createElement("div");
    div.innerHTML = body;
    const cal = div.querySelector(".js-yearly-contributions");
    $(".position-relative h2", cal).remove();
    if (cal === null) return;
    const svg = cal.querySelector("svg.js-calendar-graph-svg");
    if (svg === null) return;
    const width = svg.getAttribute("width");
    const height = svg.getAttribute("height");
    // Remove height property entirely
    svg.removeAttribute("height");
    // Width property should be set to 100% to fill entire container
    svg.setAttribute("width", "100%");
    // Add a viewBox property based on the former width/height
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    function printDayCount(dayCount: string | number) {
        return `${dayCount} ${dayCount === 1 ? "day" : "days"}`;
    }
    const parsed = parse($("svg", cal).outerHTML);
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
    const firstCol: globalStat = {
        textMuted1: 'Contributions in the last year',
        contribNumber: `${parsed.last_year} total`,
        textMuted2: `${contributionsLast}`
    };
    const secondCol: globalStat = {
        textMuted1: 'Longest streak',
        contribNumber: `${printDayCount(parsed.longest_streak)}`,
        textMuted2: `${longestStreakInfo}`,
    };
    const thirdCol: globalStat = {
        textMuted1: 'Current streak',
        contribNumber: `${printDayCount(parsed.current_streak)}`,
        textMuted2: `${currentStreakInfo}`,
    };
    return { firstCol, secondCol, thirdCol };
}