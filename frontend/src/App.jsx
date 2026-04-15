import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FormularioCliente from './components/FormularioCliente';
import Listar from './pages/Listar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import DashboardAgente from './pages/agente/DashboardAgente';
import PerfilAgente from './pages/agente/PerfilAgente';
import PortalCliente from './pages/cliente/PortalCliente';
import PerfilCliente from './pages/cliente/PerfilCliente';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/agente/dashboard" element={<DashboardAgente />} />
        <Route path="/agente/estoque" element={<DashboardAgente />} />
        <Route path="/agente/pedidos" element={<DashboardAgente />} />
        <Route path="/agente/perfil" element={<PerfilAgente />} />

        <Route path="/cliente/portal" element={<PortalCliente />} />
        <Route path="/cliente/pedidos" element={<PortalCliente />} />
        <Route path="/cliente/perfil" element={<PerfilCliente />} />

        <Route path="/clientes" element={<Listar />} />
        <Route path="/clientes/novo" element={<FormularioCliente />} />
        <Route path="/clientes/:id/editar" element={<FormularioCliente />} />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
