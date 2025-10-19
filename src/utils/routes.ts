/**
 * @description Router configuration for the Mainstack app
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-17
 * @lastModified 2025-10-19
 * @version 1.0.0
 */

import { MaterialSymbol } from 'react-material-symbols';
import { NavItem } from '@/types';
import {
    BookingIcon,
    CommunityIcon,
    InvoiceIcon,
    LinkInBioIcon,
    MediaKitIcon,
    StoreIcon,
} from './icons';

/**
 * @description Router configuration for the Mainstack app
 */
export const ROUTES = {
    HOME: '/',
    ANALYTICS: '/analytics',
    REVENUE: '/revenue',
    CRM: '/crm',
};

/**
 * @description Navigation items for the app header
 * @returns {NavItem[]} Navigation items
 */
export const APP_HEADER_NAVIGATION_ITEMS: NavItem[] = [
    {
        name: 'Home',
        href: ROUTES.HOME,
        material_icon_name: 'home',
        icon: MaterialSymbol,
    },
    {
        name: 'Analytics',
        href: ROUTES.ANALYTICS,
        material_icon_name: 'insert_chart',
        icon: MaterialSymbol,
    },
    {
        name: 'Revenue',
        href: ROUTES.REVENUE,
        material_icon_name: 'payments',
        icon: MaterialSymbol,
    },
    {
        name: 'CRM',
        href: ROUTES.CRM,
        material_icon_name: 'group',
        icon: MaterialSymbol,
    },
];

/**
 * @description More apps navigation items for the app header
 */
export const MORE_APPS_NAVIGATION_ITEMS = [
    {
        title: 'Link in Bio',
        description: 'Manage your Link in Bio',
        icon: LinkInBioIcon,
    },
    {
        title: 'Store',
        description: 'Manage your Store activities',
        icon: StoreIcon,
    },
    {
        title: 'Media Kit',
        description: 'Manage your Media Kit',
        icon: MediaKitIcon,
    },
    {
        title: 'Invoicing',
        description: 'Manage your Invoices',
        icon: InvoiceIcon,
    },
    {
        title: 'Bookings',
        description: 'Manage your Bookings',
        icon: BookingIcon,
    },
    {
        title: 'Community',
        description: 'Manage your Community',
        icon: CommunityIcon,
    },
];

/**
 * @description User menu actions navigation items for the app header
 * @returns {NavItem[]} Navigation items
 */
export const USER_MENU_ACTIONS_ITEMS: NavItem[] = [
    {
        name: 'Settings',
        href: ROUTES.HOME,
        material_icon_name: 'settings',
        icon: MaterialSymbol,
    },
    {
        name: 'Purhase History',
        href: ROUTES.HOME,
        material_icon_name: 'receipt_long',
        icon: MaterialSymbol,
    },
    {
        name: 'Refer and Earn',
        href: ROUTES.HOME,
        material_icon_name: 'redeem',
        icon: MaterialSymbol,
    },
    {
        name: 'Integrations',
        href: ROUTES.HOME,
        material_icon_name: 'widgets',
        icon: MaterialSymbol,
    },
    {
        name: 'Report Bug',
        href: ROUTES.HOME,
        material_icon_name: 'bug_report',
        icon: MaterialSymbol,
    },
    {
        name: 'Switch Account',
        href: ROUTES.HOME,
        material_icon_name: 'switch_account',
        icon: MaterialSymbol,
    },
];
