import { Routes, Route } from 'react-router-dom';
import { Home, Analytics, Revenue, CRM } from '@/pages';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/analytics' element={<Analytics />} />
      <Route path='/revenue' element={<Revenue />} />
      <Route path='/crm' element={<CRM />} />
    </Routes>
  );
}
