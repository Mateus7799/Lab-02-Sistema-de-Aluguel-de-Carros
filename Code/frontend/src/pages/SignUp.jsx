import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Car } from 'lucide-react';

function SignUp() {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [erroServidor, setErroServidor] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: '', email: '', senha: '', confirmarSenha: '',
      cpf: '', rg: '', endereco: '', profissao: '',
      rendimento1: '', rendimento2: '', rendimento3: '',
    },
  });

  // Mesmos formatadores do FormularioCliente
  const formatarCPF = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
    if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
    return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9, 11)}`;
  };

  const formatarRG = (value) => value.replace(/[^\d]/g, '').slice(0, 14);

  const validarCPF = (cpf) => {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return 'CPF deve ter 11 dígitos';
    return true;
  };

  const validarRG = (rg) => {
    const digits = rg.replace(/[^\d]/g, '');
    if (digits.length < 5) return 'RG deve ter pelo menos 5 dígitos';
    return true;
  };

  const onSubmit = async (dados) => {
    setErroServidor('');

    // Validar confirmação de senha no submit (pode usar validate no register também)
    if (dados.senha !== dados.confirmarSenha) {
      setErroServidor('As senhas não conferem.');
      return;
    }

    setCarregando(true);
    try {
      const resultado = await registerAuth(dados);
      if (!resultado.ok) {
        setErroServidor(resultado.erro);
        return;
      }
      // Login automático feito dentro do registerAuth — redireciona direto para o portal
      navigate('/cliente/portal');
    } catch (error) {
      const msg =
        error.response?.data?.details ||
        error.response?.data?.message ||
        'Erro ao criar conta. Verifique os dados e tente novamente.';
      setErroServidor(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">

        {/* Cabeçalho — mesmo estilo do Login */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
            <Car size={28} className="text-white" />
          </div>
          <h1 className="text-white font-bold text-3xl tracking-tight">DriveHub</h1>
          <p className="text-slate-400 text-sm mt-1">Sistema de Gestão de Aluguel de Veículos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-slate-900 font-bold text-xl mb-1">Criar conta</h2>
          <p className="text-slate-500 text-sm mb-6">Preencha seus dados para se cadastrar</p>

          {erroServidor && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {erroServidor}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

            {/* ── Acesso ── */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pt-1 pb-2 border-b border-gray-100">
              Dados de acesso
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                E-mail <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                {...register('email', {
                  required: 'E-mail é obrigatório',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'E-mail inválido' },
                })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Senha <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••"
                  {...register('senha', {
                    required: 'Senha é obrigatória',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                  })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                {errors.senha && <p className="text-red-600 text-xs mt-1">{errors.senha.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirmar senha <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••"
                  {...register('confirmarSenha', { required: 'Confirme sua senha' })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                {errors.confirmarSenha && <p className="text-red-600 text-xs mt-1">{errors.confirmarSenha.message}</p>}
              </div>
            </div>

            {/* ── Dados Pessoais ── */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pt-2 pb-2 border-b border-gray-100">
              Dados pessoais
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nome completo <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Digite seu nome completo"
                maxLength={100}
                {...register('nome', {
                  required: 'Nome é obrigatório',
                  minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' },
                })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {errors.nome && <p className="text-red-600 text-xs mt-1">{errors.nome.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  CPF <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  {...register('cpf', {
                    required: 'CPF é obrigatório',
                    validate: (v) => validarCPF(v) === true || validarCPF(v),
                  })}
                  onChange={(e) => {
                    e.target.value = formatarCPF(e.target.value);
                    e.target.dispatchEvent(new Event('change', { bubbles: true }));
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                {errors.cpf && <p className="text-red-600 text-xs mt-1">{errors.cpf.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  RG <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="00.000.000-0"
                  maxLength={20}
                  {...register('rg', {
                    required: 'RG é obrigatório',
                    validate: (v) => validarRG(v) === true || validarRG(v),
                  })}
                  onChange={(e) => {
                    e.target.value = formatarRG(e.target.value);
                    e.target.dispatchEvent(new Event('change', { bubbles: true }));
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                {errors.rg && <p className="text-red-600 text-xs mt-1">{errors.rg.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Endereço <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Rua, número, bairro, cidade - UF"
                maxLength={255}
                {...register('endereco', { required: 'Endereço é obrigatório' })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {errors.endereco && <p className="text-red-600 text-xs mt-1">{errors.endereco.message}</p>}
            </div>

            {/* ── Dados Profissionais ── */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pt-2 pb-2 border-b border-gray-100">
              Dados profissionais
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Profissão <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Engenheiro, Médico, Advogado..."
                maxLength={100}
                {...register('profissao', { required: 'Profissão é obrigatória' })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              {errors.profissao && <p className="text-red-600 text-xs mt-1">{errors.profissao.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Rendimentos (máximo 3)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((num) => (
                  <div key={num}>
                    <label className="block text-xs text-gray-500 mb-1">Rendimento {num}</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      {...register(`rendimento${num}`, {
                        validate: (value) => {
                          if (!value) return true;
                          return parseFloat(value) >= 0 || 'Valor inválido';
                        },
                      })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 mt-2"
            >
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          {/* Link voltar para login */}
          <div className="mt-5 text-center">
            <p className="text-sm text-slate-500">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Entrar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;