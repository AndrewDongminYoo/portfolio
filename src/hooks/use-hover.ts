import { useCallback, useEffect, useRef, useState } from 'react';

const LONG_PRESS_MS = 450;

export function useCanHover() {
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);
  return canHover;
}

export function useLongPressTooltip(delay = LONG_PRESS_MS, enabled = true) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const longPressed = useRef(false);

  const clear = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || e.pointerType !== 'touch') return;
      longPressed.current = false;
      clear();
      timer.current = window.setTimeout(() => {
        longPressed.current = true;
        setOpen(true);
      }, delay);
    },
    [enabled, delay, clear],
  );

  const onPointerUp = useCallback(() => {
    if (!enabled) return;
    clear();
    if (longPressed.current) setOpen(false);
    longPressed.current = false;
  }, [enabled, clear]);

  const onPointerCancel = onPointerUp;

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || e.pointerType !== 'touch') return;
      // If there is movement such as scrolling, cancel the long press.
      clear();
    },
    [enabled, clear],
  );

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;
      if (longPressed.current) {
        e.preventDefault();
        e.stopPropagation();
        longPressed.current = false;
      }
    },
    [enabled],
  );

  return {
    open,
    setOpen,
    handlers: { onPointerDown, onPointerUp, onPointerCancel, onPointerMove, onClick },
  };
}
