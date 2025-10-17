import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, Analytics, Revenue, CRM } from '@/pages';
import Layout from './components/Layout';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Navigate to='/revenue' replace />} />
        <Route path='/' element={<Home />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/revenue' element={<Revenue />} />
        <Route path='/crm' element={<CRM />} />
      </Route>
    </Routes>
  );
}
