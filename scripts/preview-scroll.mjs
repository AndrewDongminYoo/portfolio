export const applyScrollTarget = async (page, target, delay = async () => {}) => {
  const scrollWait = target.scrollWait ?? 0;

  if (typeof target.scrollPercent === 'number') {
    if (target.scrollSelector) {
      await page.evaluate(
        (selector, pct) => {
          const container = document.querySelector(selector);
          if (!container) {
            throw new Error(`Scroll container not found for selector: ${selector}`);
          }

          const maxScroll = container.scrollHeight - container.clientHeight;
          container.scrollTo(0, maxScroll * (pct / 100));
        },
        target.scrollSelector,
        target.scrollPercent,
      );
    } else {
      await page.evaluate((pct) => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll * (pct / 100));
      }, target.scrollPercent);
    }

    if (scrollWait) {
      await delay(scrollWait);
    }

    return;
  }

  if (typeof target.scrollTo === 'number') {
    if (target.scrollSelector) {
      await page.evaluate(
        (selector, scrollTop) => {
          const container = document.querySelector(selector);
          if (!container) {
            throw new Error(`Scroll container not found for selector: ${selector}`);
          }

          container.scrollTo(0, scrollTop);
        },
        target.scrollSelector,
        target.scrollTo,
      );
    } else {
      await page.evaluate((scrollTop) => {
        window.scrollTo(0, scrollTop);
      }, target.scrollTo);
    }

    if (scrollWait) {
      await delay(scrollWait);
    }
  }
};
