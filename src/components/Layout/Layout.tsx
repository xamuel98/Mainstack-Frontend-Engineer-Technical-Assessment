import { Outlet } from 'react-router-dom';
import { LayoutWrapper, LayoutContainer, LayoutOutlet } from './Layout.styles';
import { AppHeader } from '../AppHeader';
import { AppToolbar } from '../AppToolbar';

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
                    <Outlet />
                </LayoutOutlet>
            </LayoutContainer>

            {/* App Footer */}
            <AppToolbar />
        </LayoutWrapper>
    );
};

export default Layout;
