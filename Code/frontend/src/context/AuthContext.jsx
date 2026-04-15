import { createContext, useContext, useState } from 'react';
import { criarCliente } from '../api/clientes';

const AuthContext = createContext(null);

// usuarios fixos de demonstraçao
const USUARIOS_MOCK = [
  { id: 1, email: 'agente@aluguel.com', senha: '123456', perfil: 'agente', nome: 'Carlos Agente' },
  { id: 2, email: 'cliente@aluguel.com', senha: '123456', perfil: 'cliente', nome: 'Ana Cliente' },
];

export function AuthProvider({ children }) {
  const [usuariosDinamicos, setUsuariosDinamicos] = useState(() => {
    const salvo = sessionStorage.getItem('usuariosDinamicos');
    return salvo ? JSON.parse(salvo) : [];
  });

  const [usuario, setUsuario] = useState(() => {
    const salvo = sessionStorage.getItem('usuario');
    return salvo ? JSON.parse(salvo) : null;
  });

  const login = (email, senha) => {
    const todos = [...USUARIOS_MOCK, ...usuariosDinamicos];
    const encontrado = todos.find(
      (u) => u.email === email && u.senha === senha
    );
    if (!encontrado) return { ok: false, erro: 'E-mail ou senha inválidos.' };
    const { senha: _, ...dados } = encontrado;
    setUsuario(dados);
    sessionStorage.setItem('usuario', JSON.stringify(dados));
    return { ok: true, perfil: dados.perfil };
  };

  const register = async (dadosFormulario) => {
    const todos = [...USUARIOS_MOCK, ...usuariosDinamicos];
    const emailExiste = todos.find((u) => u.email === dadosFormulario.email);
    if (emailExiste) {
      return { ok: false, erro: 'Este e-mail já está cadastrado.' };
    }

    const clienteData = {
      nome: dadosFormulario.nome,
      cpf: dadosFormulario.cpf.replace(/\D/g, ''),
      rg: dadosFormulario.rg.replace(/\D/g, ''),
      endereco: dadosFormulario.endereco,
      profissao: dadosFormulario.profissao,
      rendimento1: dadosFormulario.rendimento1 ? parseFloat(dadosFormulario.rendimento1) : null,
      rendimento2: dadosFormulario.rendimento2 ? parseFloat(dadosFormulario.rendimento2) : null,
      rendimento3: dadosFormulario.rendimento3 ? parseFloat(dadosFormulario.rendimento3) : null,
    };

    const clienteCriado = await criarCliente(clienteData);

    const novoUsuario = {
      id: clienteCriado.id || Date.now(),
      email: dadosFormulario.email,
      senha: dadosFormulario.senha,
      perfil: 'cliente',
      nome: dadosFormulario.nome,
    };

    const atualizados = [...usuariosDinamicos, novoUsuario];
    setUsuariosDinamicos(atualizados);
    sessionStorage.setItem('usuariosDinamicos', JSON.stringify(atualizados));

    const { senha: _, ...dadosLogin } = novoUsuario;
    setUsuario(dadosLogin);
    sessionStorage.setItem('usuario', JSON.stringify(dadosLogin));

    return { ok: true };
  };

  const logout = () => {
    setUsuario(null);
    sessionStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}