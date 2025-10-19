/**
 * @description Animation variants for the AppHeader component
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-18
 * @lastModified 2025-10-19
 * @version 1.0.0
 */

import { Variants } from 'framer-motion';

// Animation Variants for Fading-in Components
export const fadeInVariant: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.25, ease: 'easeOut' },
    },
};

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

// Animation Variants for Mainstack Apps Dialog Title
export const mainstackAppsDialogTitleVariants: Variants = {
    hidden: { opacity: 0, filter: 'blur(6px)' },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1,
        },
    },
};

// Animation Variants for Mainstack Apps Dialog Item
export const mainstackAppsDialogItemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 28,
            delay: i * 0.1,
        },
    }),
};

// Animation Variants for Mainstack Apps Dialog Container
export const mainstackAppsDialogContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            delayChildren: 0.7,
            staggerChildren: 0.08,
        },
    },
};

// Animation Variants for FilterPanel Overlay
export const overlayVariants: Variants = {
    hidden: {
        opacity: 0,
        backdropFilter: 'blur(0px)',
    },
    visible: {
        opacity: 1,
        backdropFilter: 'blur(8px)',
        transition: {
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        transition: {
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

// Animation Variants for FilterPanel Panel
export const panelVariants: Variants = {
    hidden: {
        x: '100%',
        opacity: 0,
        scale: 0.95,
    },
    visible: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.8,
            when: 'beforeChildren',
            staggerChildren: 0.05,
        },
    },
    exit: {
        x: '100%',
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.25,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

// Animation Variants for FilterPanel Content
export const contentVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        filter: 'blur(4px)',
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};
