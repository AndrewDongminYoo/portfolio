import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('getSimpleIcon', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns icon info when spec exists', async () => {
    vi.unmock('@/features/repos/specs');
    const { getSimpleIcon } = await import('@/features/repos/simple-icons');

    const icon = getSimpleIcon('JavaScript');

    expect(icon).not.toBeNull();
    expect(icon?.slug).toBe('javascript');
    expect(icon?.color).toBe('#f1e05a');
    expect(icon?.hex).toBe('#f1e05a');
    expect(icon?.url).toContain('simpleicons');
  });

  it('returns null for unknown language', async () => {
    vi.unmock('@/features/repos/specs');
    const { getSimpleIcon } = await import('@/features/repos/simple-icons');

    expect(getSimpleIcon('unknown-language')).toBeNull();
  });

  it('prefers spec color and normalizes hex', async () => {
    vi.doMock('@/features/repos/specs', () => ({
      getSpec: () => ({
        title: 'MockLang',
        color: 'ABCDEF',
        icon: { slug: 'mock', hex: '123456', url: 'https://example.com/icon.svg' },
      }),
    }));
    const { getSimpleIcon } = await import('@/features/repos/simple-icons');

    const icon = getSimpleIcon('MockLang');
    expect(icon?.color).toBe('#ABCDEF');
    expect(icon?.hex).toBe('#ABCDEF');
    expect(icon?.slug).toBe('mock');
  });

  it('falls back to icon hex when spec color is missing', async () => {
    vi.doMock('@/features/repos/specs', () => ({
      getSpec: () => ({
        title: 'AltLang',
        color: undefined,
        icon: { slug: 'alt', hex: '00ff00', url: 'https://example.com/icon.svg' },
      }),
    }));
    const { getSimpleIcon } = await import('@/features/repos/simple-icons');

    const icon = getSimpleIcon('AltLang');
    expect(icon?.color).toBe('#00ff00');
    expect(icon?.hex).toBe('#00ff00');
  });

  it('returns null when spec has no icon and no color', async () => {
    vi.doMock('@/features/repos/specs', () => ({
      getSpec: () => ({ title: 'Empty', color: '', icon: null }),
    }));
    const { getSimpleIcon } = await import('@/features/repos/simple-icons');

    expect(getSimpleIcon('Empty')).toBeNull();
  });
});
