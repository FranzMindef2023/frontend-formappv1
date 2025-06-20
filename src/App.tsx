import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './auth/PrivateRoute';
import PublicRoute from './auth/PublicRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import PrivateLayout from './layouts/PrivateLayout';
import GraciasPorRegistrarte from './pages/GraciasPorRegistrarte';
import GraciasPorConsultar from './pages/GraciasPorConsultar';
import Preinscritos from './pages/Preinscritos';
import Resumen from './pages/Resumen';
import CuadroInvitaciones from './pages/CuadroInvitaciones';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/form-postulacion" element={<GraciasPorRegistrarte />} />
        <Route path="/form-consulta" element={<GraciasPorConsultar />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Dashboard />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Preinscritos"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Preinscritos />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Resumen"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Resumen />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/CuadroInvitaciones"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <CuadroInvitaciones />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        {/* Ruta comodín para páginas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
