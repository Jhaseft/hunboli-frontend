import { useState, useCallback } from 'react';

/**
 * Hook para manejar estados booleanos con funciones auxiliares
 * @param initialValue - Valor inicial del toggle
 * @returns [value, toggle, setTrue, setFalse, setValue]
 */
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse, setValue] as const;
}
