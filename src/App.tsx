import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout/MainLayout';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import RolesModule from "./components/Roles/RolesModule";

const LoginForm = lazy(() => import('./components/Login/LoginForm'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const Usuarios = lazy(() => import('./components/Usuarios/UsuariosList'));
const Solicitudes = lazy(() => import('./components/Solicitudes/Solicitudes'));
const Personal = lazy(() => import('./components/Personal Transporte/PersonalTForm'));
const Rutas = lazy(() => import('./components/Rutas/RutasForm'));
const Paradas = lazy(() => import('./components/Paradas/ParadasForm'));
const RegistroAutobuses = lazy(() => import('./components/RegistroAutobuses/RegistroAutobusesForm'));
const PasswordResetForm = lazy(() => import('./components/Login/PasswordResetForm'));
const NewPasswordForm = lazy(() => import('./components/Login/NewPasswordForm'));
const HorariosForm = lazy(() => import('./components/Horarios/HorariosForm'));
const ActivityModule = lazy(() => import('./components/ActivityLog/ActivityModule'));
const MantenimientoForm = lazy(() => import('./components/MantenimientoAutobuses/MantenimientoForm'));

const App = () => {
  return (
    <Router>
      <RoutesComponent />
    </Router>
  );
};

const RoutesComponent = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/password-reset" element={<PasswordResetForm />} />
        <Route path="/new-password" element={<NewPasswordForm />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="activity" element={<ActivityModule />} />
          <Route path="personal" element={<Personal />} />
          <Route path="rutas" element={<Rutas />} />
          <Route path="paradas" element={<Paradas />} />
          <Route path="mantenimientos" element={<MantenimientoForm />} />
          <Route path="registros" element={<RegistroAutobuses />} />
          <Route path="horarios" element={<HorariosForm />} />
          <Route path="roles" element={<RolesModule />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
