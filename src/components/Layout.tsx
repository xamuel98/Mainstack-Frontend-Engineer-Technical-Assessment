import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';

const Layout = () => {
  return (
    <div className='flex flex-col min-h-svh'>
      <AppHeader />
      <div className='flex-1 flex items-stretch'>
        <div className='w-full'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
