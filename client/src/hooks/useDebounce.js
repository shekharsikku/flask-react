import { useEffect, useCallback, useRef } from "react";

const useDebounce = (callback, delay) => {
  const callbackRef = useCallback(callback, [callback]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedFunction = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callbackRef(...args);
    }, delay);
  };

  return debouncedFunction;
};

export { useDebounce };
