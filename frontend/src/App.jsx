import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FormularioCliente from './components/FormularioCliente';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/clientes/novo" element={<FormularioCliente />} />
        <Route path="/clientes/:id/editar" element={<FormularioCliente />} />
        <Route path="/" element={<Navigate to="/clientes/novo" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
