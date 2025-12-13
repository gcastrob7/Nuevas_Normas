import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import NormDetail from './pages/NormDetail';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="library" element={<Library />} />
          <Route path="norm/:id" element={<NormDetail />} />
          <Route path="help" element={<div className="p-8 text-center text-slate-500">Centro de Ayuda - Próximamente</div>} />
          <Route path="settings" element={<div className="p-8 text-center text-slate-500">Configuración - Próximamente</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;