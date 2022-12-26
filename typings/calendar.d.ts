
 /**
 * elly
 * Selects the DOM elements based on the provided selector. If there is no
 * commonjs/module environment, the `$` global variable will be created.
 *
 * @module ./node_modules/elly
 * @see https://github.com/Bloggify/github-calendar/package.json
 * @version ^1.1.11
 * @alias $
 * @name elly
 * @function
 * @param {String|HTMLElement} input The element selector (e.g.
 * `'#my-id > .my-class'`), the element tag you want to create
 * (e.g. `'<ul>'`) or the HTML element (will be returned by the function).
 * @param {Object|HTMLElement} contextOrAttributes
 * @returns {HTMLElement} The HTMLElement that was provided or selected.
 */
declare module "elly";
/**
 * The module exports an object containing two methods:
 * @method `add` (goes in the future).
 * @method `subtract` (goes in the past).
 * They require the following arguments:
 * @param {Date} d: The date object.
 * @param {Number} count: How many years/months/etc to add/subtract.
 * @param {String} what: What to add/subtract. Supported values are:
 *     - `years`
 *     - `year`
 *     - `months`
 *     - `month`
 *     - `weeks`
 *     - `week`
 *     - `days`
 *     - `day`
 *     - `hours`
 *     - `hour`
 *     - `minutes`
 *     - `minute`
 *     - `seconds`
 *     - `second`
 *     - `milliseconds`
 *     - `millisecond`
 * @module ./node_modules/add-subtract-date
 * @see https://github.com/Bloggify/github-calendar/package.json
 * @version ^1.0.15
 * @alias addSubtractDate
 * */
declare module "add-subtract-date";
/**
 * formatoid
 * Formats the date into a given format.
 *
 * Usable format fields:
 *
 *  - **Years**
 *      - `YYYY` (e.g. `"2015"`)
 *      - `YY` (e.g. `"15"`)
 *  - **Months**
 *      - `MMMM` (e.g. `"January"`)
 *      - `MMM` (e.g. `"Jan"`)
 *      - `MM` (e.g. `"01"`)
 *      - `M` (e.g. `"1"`)
 *  - **Days**
 *      - `dddd` (e.g. `"Sunday"`)
 *      - `ddd` (e.g. `"Sun"`)
 *      - `dd` (e.g. `"Su"`)
 *      - `d` (e.g. `"Su"`)
 *  - **Dates**
 *      - `DD` (e.g. `"07"`)
 *      - `D` (e.g. `"7"`)
 *  - **AM/PM**
 *      - `A` (e.g. `"AM"`)
 *      - `a` (e.g. `"pm"`)
 *  - **Hours**
 *      - `hh` (e.g. `"07"`)–12 hour format
 *      - `h` (e.g. `"7"`)
 *      - `HH` (e.g. `"07"`)–24 hour format
 *      - `H` (e.g. `"7"`)
 *  - **Minutes**
 *      - `mm` (e.g. `"07"`)
 *      - `m` (e.g. `"7"`)
 *  - **Seconds**
 *      - `ss` (e.g. `"07"`)
 *      - `s` (e.g. `"7"`)
 *  - **Fractional seconds**
 *      - `S` (e.g. `0 1 2 3 ... 9`)
 *      - `SS` (e.g. `00 01 02 ... 98 99`)
 *      - `SS` (e.g. `000 001 002 ... 998 999`)
 *  - **Timezones**
 *      - `Z` (e.g. `-07:00 -06:00 ... +06:00 +07:00`)
 *      - `ZZ` (e.g. `-0700 -0600 ... +0600 +0700`)
 *
 * @module ./node_modules/formatoid
 * @see https://github.com/Bloggify/github-calendar/package.json
 * @version ^1.2.4
 * @alias formatoid
 * @name formatoid
 * @function
 * @param {Date} i The date object.
 * @param {String} f The date format.
 * @return {String} The formatted date (as string).
 */
declare module "formatoid";
/**
 * parseGitHubCalendarSvg
 * Parses the SVG input (as string).
 *
 * @module ./node_modules/github-calendar-parser
 * @see https://github.com/Bloggify/github-calendar/package.json
 * @version ^1.1.13
 * @alias parse
 * @name parseGitHubCalendarSvg
 * @function
 * @param {String} input The SVG code of the contributions calendar.
 * @return {Object} An object containing:
 *
 *  - `last_year` (Number): The total contributions in the last year.
 *  - `longest_streak` (Number): The longest streak.
 *  - `longest_streak_range` (Array): An array of two date objects representing the date range.
 *  - `current_streak` (Number): The current streak.
 *  - `current_streak_range` (Array): An array of two date objects representing the date range.
 *  - `days` (Array): An array of day objects:
 *       - `fill` (String): The hex color.
 *       - `date` (Date): The day date.
 *       - `count` (Number): The number of commits.
 *       - `level` (Number): A number between 0 and 4 (inclusive) representing the contribution level (more commits, higher value).
 *  - `weeks` (Array): The day objects grouped by weeks (arrays).
 *  - `last_contributed` (Date): The last contribution date.
 */
declare module "github-calendar-parser";