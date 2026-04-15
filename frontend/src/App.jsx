import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FormularioCliente from './components/FormularioCliente';
import Listar from './pages/Listar';
import Login from './pages/Login'
import SignUp from './pages/SignUp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/clientes" element={<Listar />} />
        <Route path="/clientes/novo" element={<FormularioCliente />} />
        <Route path="/clientes/:id/editar" element={<FormularioCliente />} />
        <Route path="/" element={<Navigate to="/clientes" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
