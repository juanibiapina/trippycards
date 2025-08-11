import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
  threshold?: number; // Time in ms to trigger long press
}

export const useLongPress = (
  callback: () => void,
  options: UseLongPressOptions = {}
) => {
  const { threshold = 500 } = options;
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const preventClick = useRef(false);

  const start = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    // Prevent context menu on right click
    if ('button' in event && event.button !== 0) return;

    preventClick.current = false;
    timeout.current = setTimeout(() => {
      callback();
      preventClick.current = true;
    }, threshold);
  }, [callback, threshold]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, []);

  const onClick = useCallback((event: React.MouseEvent) => {
    if (preventClick.current) {
      event.preventDefault();
      event.stopPropagation();
      preventClick.current = false;
    }
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
    onTouchCancel: clear,
    onClick,
  };
};