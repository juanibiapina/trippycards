import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLongPress } from './useLongPress';

describe('useLongPress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should call callback after threshold time', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { threshold: 500 }));

    // Simulate mouse down
    act(() => {
      result.current.onMouseDown({} as React.MouseEvent);
    });

    // Fast-forward time by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledOnce();
  });

  it('should not call callback if released before threshold', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { threshold: 500 }));

    // Simulate mouse down
    act(() => {
      result.current.onMouseDown({} as React.MouseEvent);
    });

    // Fast-forward time by 300ms (less than threshold)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Simulate mouse up
    act(() => {
      result.current.onMouseUp();
    });

    // Fast-forward remaining time
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should prevent click if long press was triggered', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { threshold: 500 }));

    // Simulate mouse down
    act(() => {
      result.current.onMouseDown({} as React.MouseEvent);
    });

    // Fast-forward time by 500ms to trigger long press
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledOnce();

    // Simulate click event
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.onClick(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should clear timeout on mouse leave', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { threshold: 500 }));

    // Simulate mouse down
    act(() => {
      result.current.onMouseDown({} as React.MouseEvent);
    });

    // Simulate mouse leave
    act(() => {
      result.current.onMouseLeave();
    });

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should ignore right click', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useLongPress(callback, { threshold: 500 }));

    // Simulate right click (button = 2)
    act(() => {
      result.current.onMouseDown({ button: 2 } as React.MouseEvent);
    });

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});