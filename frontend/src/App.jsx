import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FormularioCliente from './components/FormularioCliente';
import Listar from './pages/Listar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/clientes" element={<Listar />} />
        <Route path="/clientes/novo" element={<FormularioCliente />} />
        <Route path="/clientes/:id/editar" element={<FormularioCliente />} />
        <Route path="/" element={<Navigate to="/clientes" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
