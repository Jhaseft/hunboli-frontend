import { useEffect, RefObject } from 'react';

/**
 * Hook para detectar clicks fuera de uno o varios elementos
 * @param refs - Referencia o array de referencias de elementos
 * @param handler - Función a ejecutar cuando se hace click fuera
 * @param enabled - Si el hook está activo o no
 */
export function useClickOutside(
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const refsArray = Array.isArray(refs) ? refs : [refs];

      // Verificar si el click fue dentro de alguno de los elementos
      const clickedInside = refsArray.some(
        (ref) => ref.current?.contains(target)
      );

      // Solo ejecutar el handler si el click fue fuera
      if (!clickedInside) {
        handler();
      }
    }

    // Usar setTimeout para que el evento se registre después del click actual
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [refs, handler, enabled]);
}
