import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppHeader } from '../AppHeader';
import { AppToolbar } from '../AppToolbar';
import { AppSwitcherAnchor } from '../AppSwitcherAnchor';
import { LayoutWrapper, LayoutContainer, LayoutOutlet, LayoutBox } from './';

const Layout = () => {
    return (
        <LayoutWrapper>
            {/* App Header */}
            <AppHeader />

            {/* Page content fades in smoothly */}
            <LayoutContainer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.45,
                    ease: [0.33, 1, 0.68, 1],
                }}
            >
                <LayoutOutlet>
                    <LayoutBox>
                        <AnimatePresence>
                            <Outlet />
                        </AnimatePresence>
                    </LayoutBox>
                </LayoutOutlet>
            </LayoutContainer>

            {/* Mainstack Apps Anchor */}
            <AppSwitcherAnchor />

            {/* App Footer */}
            <AppToolbar />
        </LayoutWrapper>
    );
};

export default Layout;
