import { describe, expect, it } from 'vitest';

import { getSpec, getSpecificationsMeta, isProgrammingLanguage } from '@/features/repos/specs';

describe('specs', () => {
  it('resolves specs by title and alias', () => {
    const spec = getSpec('JavaScript');
    expect(spec?.title).toBe('JavaScript');

    const aliasSpec = getSpec('node');
    expect(aliasSpec?.title).toBe('JavaScript');
  });

  it('detects programming languages', () => {
    expect(isProgrammingLanguage('JavaScript')).toBe(true);
  });

  it('returns metadata', () => {
    const meta = getSpecificationsMeta();
    expect(meta.linguistCount).toBeGreaterThan(0);
    expect(meta.simpleIconsCount).toBeGreaterThan(0);
  });
});
