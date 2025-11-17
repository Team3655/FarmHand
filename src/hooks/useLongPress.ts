import { useCallback, useRef, useState } from "react";
/**
 * A function that completes an action after a callback time, used with touch and mouse events.
 *
 * @param ms How long to hold before the callback is called
 * @param touchCallback The callback function used for touch events
 * @param mouseCallback The callback function used for mouse events
 * @returns CSS properties for the actions as an object
 */
export default function useLongPress(
  ms = 500,
  touchCallback: (event: TouchEvent) => void,
  mouseCallback: (event: MouseEvent) => void
): {} {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const target = useRef<EventTarget | null>(null);

  /**
   * The function that is called when the mouse event starts
   *
   * @param event A MouseEvent that triggers the function
   */
  const mouseStart = useCallback(
    (event: MouseEvent) => {
      target.current = event.currentTarget;

      timeout.current = setTimeout(() => {
        mouseCallback(event);
        setLongPressTriggered(true);
      }, ms);
    },
    [mouseCallback, ms]
  );

  /**
   * The function that is called when the touch event starts
   *
   * @param event A TouchEvent that triggers the function
   */
  const touchStart = useCallback(
    (event: TouchEvent) => {
      target.current = event.currentTarget;

      timeout.current = setTimeout(() => {
        touchCallback(event);
        setLongPressTriggered(true);
      }, ms);
    },
    [touchCallback, ms]
  );

  /**
   * A function called when the mouse input is cleared
   */
  const mouseClear = useCallback(
    (event: MouseEvent) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (longPressTriggered) {
        event.preventDefault();
      }
      setLongPressTriggered(false);
    },
    [longPressTriggered]
  );

  /**
   * A function called when touch input is cleared
   */
  const touchClear = useCallback(
    (event: TouchEvent) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (longPressTriggered) {
        event.preventDefault();
      }
      setLongPressTriggered(false);
    },
    [longPressTriggered]
  );

  return {
    onMouseDown: mouseStart,
    onMouseUp: mouseClear,
    onMouseLeave: mouseClear,
    onTouchStart: touchStart,
    onTouchEnd: touchClear,
  };
}
