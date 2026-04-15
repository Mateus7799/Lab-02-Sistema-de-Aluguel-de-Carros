import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getClientes, deletarCliente } from '../api/clientes';
import { toast } from 'react-toastify';

const Listar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const busca = searchParams.get('busca') || '';

  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Carregar clientes
  useEffect(() => {
    const carregarClientes = async () => {
      try {
        setCarregando(true);
        const dados = await getClientes();
        // Filtrar localmente por nome se houver busca
        if (busca) {
          const filtrados = dados.filter(c =>
            c.nome.toLowerCase().includes(busca.toLowerCase())
          );
          setClientes(filtrados);
        } else {
          setClientes(dados);
        }
        setErro('');
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        setErro('Erro ao carregar clientes');
        toast.error('Erro ao carregar clientes');
      } finally {
        setCarregando(false);
      }
    };

    carregarClientes();
  }, [busca]);

  const handleBusca = (e) => {
    e.preventDefault();
    const termoBusca = e.target.elements.busca.value;
    if (termoBusca.trim()) {
      setSearchParams({ busca: termoBusca });
    } else {
      setSearchParams({});
    }
  };

  const handleExcluir = async (id, nome) => {
    if (!window.confirm(`Deseja excluir o cliente "${nome}"?`)) return;

    try {
      await deletarCliente(id);
      setClientes(clientes.filter(c => c.id !== id));
      toast.success('Cliente excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir:', err);
      toast.error('Erro ao excluir cliente');
    }
  };

  const formatarCPF = (cpf) => {
    if (!cpf) return '-';
    const digits = cpf.replace(/\D/g, '');
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  };

  const formatarRG = (rg) => {
    if (!rg) return '-';
    return rg.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');
  };

  const calcularRendimentoTotal = (cliente) => {
    const values = [cliente.rendimento1, cliente.rendimento2, cliente.rendimento3].filter(v => v);
    const total = values.reduce((sum, v) => sum + (v || 0), 0);
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-slate-900 text-white px-8 h-16 flex items-center justify-between shadow-lg">
        <h1 className="text-xl font-semibold tracking-wide">Sistema de Aluguel de Carros</h1>
        <span className="text-sm text-blue-200">Gestão de Clientes</span>
      </header>

      <div className="max-w-6xl mx-auto mt-8 px-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Clientes Cadastrados</h2>
          <button
            onClick={() => navigate('/clientes/novo')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition"
          >
            + Novo Cliente
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleBusca} className="flex gap-2 mb-6">
          <input
            type="text"
            name="busca"
            placeholder="Buscar por nome..."
            defaultValue={busca}
            className="flex-1 max-w-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition"
          >
            Buscar
          </button>
          {busca && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-300 transition"
            >
              Limpar
            </button>
          )}
        </form>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {carregando ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando clientes...</p>
            </div>
          ) : erro ? (
            <div className="text-center py-12">
              <p className="text-red-600">{erro}</p>
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-6">Nenhum cliente encontrado.</p>
              <button
                onClick={() => navigate('/clientes/novo')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition"
              >
                Cadastrar primeiro cliente
              </button>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">#</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">CPF</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">RG</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">Profissão</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">Rendimento Total</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">Endereço</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                          {cliente.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{cliente.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatarCPF(cliente.cpf)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatarRG(cliente.rg)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cliente.profissao}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{calcularRendimentoTotal(cliente)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cliente.endereco}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleExcluir(cliente.id, cliente.nome)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-700">
                Total: {clientes.length} cliente(s) encontrado(s)
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listar;
