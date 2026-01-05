import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCanHover, useLongPressTooltip } from '@/hooks/use-hover';

describe('useCanHover', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('updates on media query change', () => {
    let matches = true;
    const listeners = new Set<() => void>();

    window.matchMedia = vi.fn().mockImplementation(() => ({
      get matches() {
        return matches;
      },
      addEventListener: (_: string, cb: () => void) => listeners.add(cb),
      removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
    }));

    function Harness() {
      const canHover = useCanHover();
      return <div>{canHover ? 'hover' : 'nohover'}</div>;
    }

    const { getByText } = render(<Harness />);
    expect(getByText('hover')).toBeInTheDocument();

    matches = false;
    act(() => {
      listeners.forEach((cb) => cb());
    });

    expect(getByText('nohover')).toBeInTheDocument();
  });
});

describe('useLongPressTooltip', () => {
  it('opens on touch long press and closes on release', () => {
    vi.useFakeTimers();

    function Harness() {
      const { open, handlers } = useLongPressTooltip(200, true);
      return (
        <button data-testid='target' {...handlers}>
          {open ? 'open' : 'closed'}
        </button>
      );
    }

    const { getByTestId } = render(<Harness />);

    const button = getByTestId('target');

    fireEvent.pointerDown(button, { pointerType: 'touch' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(button).toHaveTextContent('open');

    fireEvent.pointerUp(button, { pointerType: 'touch' });
    expect(button).toHaveTextContent('closed');

    vi.useRealTimers();
  });

  it('does not open on non-touch pointer', () => {
    vi.useFakeTimers();

    function Harness() {
      const { open, handlers } = useLongPressTooltip(200, true);
      return (
        <button data-testid='target' {...handlers}>
          {open ? 'open' : 'closed'}
        </button>
      );
    }

    const { getByTestId } = render(<Harness />);
    const button = getByTestId('target');

    fireEvent.pointerDown(button, { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(button).toHaveTextContent('closed');

    vi.useRealTimers();
  });

  it('cancels when pointer moves', () => {
    vi.useFakeTimers();

    function Harness() {
      const { open, handlers } = useLongPressTooltip(200, true);
      return (
        <button data-testid='target' {...handlers}>
          {open ? 'open' : 'closed'}
        </button>
      );
    }

    const { getByTestId } = render(<Harness />);
    const button = getByTestId('target');

    fireEvent.pointerDown(button, { pointerType: 'touch' });
    fireEvent.pointerMove(button, { pointerType: 'touch' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(button).toHaveTextContent('closed');

    vi.useRealTimers();
  });

  it('prevents click after long press', () => {
    vi.useFakeTimers();

    let handlers: ReturnType<typeof useLongPressTooltip>['handlers'] | null = null;

    function Harness() {
      const hook = useLongPressTooltip(100, true);
      handlers = hook.handlers;
      return (
        <button data-testid='target' {...hook.handlers}>
          button
        </button>
      );
    }

    const { getByTestId } = render(<Harness />);
    const button = getByTestId('target');

    fireEvent.pointerDown(button, { pointerType: 'touch' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();

    handlers!.onClick({ preventDefault, stopPropagation } as unknown as React.MouseEvent<
      Element,
      MouseEvent
    >);

    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
