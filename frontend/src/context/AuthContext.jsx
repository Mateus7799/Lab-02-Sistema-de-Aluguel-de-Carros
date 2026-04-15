import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const USUARIOS_MOCK = [
  { id: 1, email: 'agente@aluguel.com', senha: '123456', perfil: 'agente', nome: 'Carlos Agente' },
  { id: 2, email: 'cliente@aluguel.com', senha: '123456', perfil: 'cliente', nome: 'Ana Cliente' },
];

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = sessionStorage.getItem('usuario');
    return salvo ? JSON.parse(salvo) : null;
  });

  const login = (email, senha) => {
    const encontrado = USUARIOS_MOCK.find(
      (u) => u.email === email && u.senha === senha
    );
    if (!encontrado) return { ok: false, erro: 'E-mail ou senha inválidos.' };
    const { senha: _, ...dados } = encontrado;
    setUsuario(dados);
    sessionStorage.setItem('usuario', JSON.stringify(dados));
    return { ok: true, perfil: dados.perfil };
  };

  const logout = () => {
    setUsuario(null);
    sessionStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
