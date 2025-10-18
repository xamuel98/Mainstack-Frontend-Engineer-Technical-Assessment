/**
 * @description Animation variants for the AppHeader component
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-18
 * @lastModified 2025-10-18
 * @version 1.0.0
 */

import { Variants } from 'framer-motion';

// Animation Variants for AppHeader
export const headerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
            when: 'beforeChildren',
            staggerChildren: 0.07,
            delayChildren: 0.1,
        },
    },
};

// Animation Variants for AppHeaderNavLink
export const linkVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

// Animation Variants for MoreAppsDropdown
export const containerVariants: Variants = {
    hidden: { opacity: 1, scale: 0.98, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
            when: 'beforeChildren',
            staggerChildren: 0.06,
            delayChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        y: 8,
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
    },
};

// Animation Variants for DropdownItemLink
export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 28,
        },
    },
};
