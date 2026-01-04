import { act, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useIsMobile } from '@/hooks/use-mobile';

const setInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
};

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('reacts to viewport changes', async () => {
    const listeners = new Set<() => void>();

    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: (_: string, cb: () => void) => listeners.add(cb),
      removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
    }));

    setInnerWidth(500);

    function Harness() {
      const isMobile = useIsMobile();
      return <div>{isMobile ? 'mobile' : 'desktop'}</div>;
    }

    const { getByText } = render(<Harness />);

    await waitFor(() => expect(getByText('mobile')).toBeInTheDocument());

    setInnerWidth(1024);
    act(() => {
      listeners.forEach((cb) => cb());
    });

    expect(getByText('desktop')).toBeInTheDocument();
  });
});
