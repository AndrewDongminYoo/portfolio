import { describe, expect, it } from 'vitest';

import { getSimpleIcon } from '@/features/repos/simple-icons';

describe('getSimpleIcon', () => {
  it('returns icon info when spec exists', () => {
    const icon = getSimpleIcon('JavaScript');

    expect(icon).not.toBeNull();
    expect(icon?.slug).toBe('javascript');
    expect(icon?.color).toBe('#f1e05a');
    expect(icon?.hex).toBe('#f1e05a');
    expect(icon?.url).toContain('simpleicons');
  });

  it('returns null for unknown language', () => {
    expect(getSimpleIcon('unknown-language')).toBeNull();
  });
});
