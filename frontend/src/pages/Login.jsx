import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    const resultado = login(email, senha);
    setCarregando(false);
    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    if (resultado.perfil === 'agente') {
      navigate('/agente/dashboard');
    } else {
      navigate('/cliente/portal');
    }
  };

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl bg-gray-100 p-6 shadow-sm">
        <h1 className="flex items-center justify-center font-sans text-2xl font-semibold text-black">
          Welcome Back!
        </h1>
        <p className="flex items-center justify-center p-4 font-sans text-xl font-extralight text-black">
          To stay connected with us please login in your account
        </p>
        {erro && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-300 px-4 py-2 text-sm text-red-700">
            {erro}
          </div>
        )}
        <form className="flex flex-col items-center space-y-4" onSubmit={handleSubmit}>
          <input
            placeholder="E-mail"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          Agente: agente@aluguel.com / 123456 &nbsp;|&nbsp; Cliente: cliente@aluguel.com / 123456
        </p>
      </div>
    </div>
  );
}

export default Login;
