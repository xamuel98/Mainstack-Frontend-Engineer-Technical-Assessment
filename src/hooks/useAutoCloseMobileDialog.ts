/**
 * @description
 * Custom hook for automatically closing a mobile dialog when the window width exceeds a specified breakpoint
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-19
 * @lastModified 2025-10-19
 * @version 1.0.0
 */

import { useEffect } from 'react';

interface UseAutoCloseMobileDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    breakpoint?: number;
}

/**
 * Custom hook that automatically closes a mobile dialog when the window width exceeds a specified breakpoint
 *
 * @param isOpen - Boolean indicating if the dialog is currently open
 * @param setIsOpen - Function to set the dialog open state
 * @param breakpoint - Window width threshold in pixels (default: 768)
 */
export const useAutoCloseMobileDialog = ({
    isOpen,
    setIsOpen,
    breakpoint = 768,
}: UseAutoCloseMobileDialogProps): void => {
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > breakpoint && isOpen) {
                setIsOpen(false);
            }
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Check on mount in case the window is already wide
        handleResize();

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen, setIsOpen, breakpoint]);
};
