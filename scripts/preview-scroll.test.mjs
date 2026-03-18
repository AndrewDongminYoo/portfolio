import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { applyScrollTarget } from './preview-scroll.mjs';

const createMockPage = () => {
  const calls = [];
  return {
    calls,
    async evaluate(callback, ...args) {
      calls.push({ callback: callback.toString(), args });
    },
  };
};

describe('applyScrollTarget', () => {
  it('scrolls a selector when scrollPercent and scrollSelector are set', async () => {
    const page = createMockPage();

    await applyScrollTarget(page, {
      scrollPercent: 50,
      scrollSelector: 'main',
    });

    assert.equal(page.calls.length, 1);
    assert.match(page.calls[0].callback, /document\.querySelector/);
    assert.deepEqual(page.calls[0].args, ['main', 50]);
  });
});
