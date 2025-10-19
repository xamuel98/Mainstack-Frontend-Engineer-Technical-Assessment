/**
 * @description React hook that triggers a callback when a click or touch event occurs outside a given element.
 * @template T - The type of the HTML element to observe.
 * @param {function(MouseEvent | TouchEvent): void} onClickAway - Callback fired when a click/touch happens outside the element.
 * @returns {React.RefObject<T>} A ref to be attached to the element you want to monitor.
 *
 * @example
 * const ref = useClickAway<HTMLDivElement>((event) => {
 *   console.log('Clicked outside!', event);
 * });
 *
 * return <div ref={ref}>Click outside me!</div>;
 *
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-17
 * @lastModified 2025-10-18
 * @version 1.0.0
 */

import { useEffect, useRef } from 'react';

export function useClickAway<T extends HTMLElement = HTMLElement>(
    onClickAway: (event: MouseEvent | TouchEvent) => void
) {
    const ref = useRef<T>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent | TouchEvent) {
            const target = event.target as HTMLElement;

            // Ignore clicks on NavLinks or elements inside them
            if (target.closest('a[data-router-link]')) return;

            // Only trigger if click is [outside] of the element
            if (ref.current && !ref.current.contains(target)) {
                onClickAway(event);
            }
        }

        // Add both mouse and touch listeners for full coverage
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('touchstart', handleClick);

        // Cleanup listeners on unmount
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('touchstart', handleClick);
        };
    }, [onClickAway]);

    return ref;
}
