import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ClipboardList, DollarSign, Plus, Pencil, Trash2, Image } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../../components/Layout';
import { getAutomoveis, criarAutomovel, atualizarAutomovel, deletarAutomovel } from '../../api/automoveis';
import { getPedidos, atualizarStatusPedido } from '../../api/pedidos';
import ModalAutomovel from '../../components/agente/ModalAutomovel';

export default function DashboardAgente() {
  const navigate = useNavigate();
  const [automoveis, setAutomoveis] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [automovelEditando, setAutomovelEditando] = useState(null);

  const carregarDados = useCallback(async () => {
    try {
      const [autos, peds] = await Promise.all([getAutomoveis(), getPedidos()]);
      setAutomoveis(autos);
      setPedidos(peds);
    } catch {
      toast.error('Erro ao carregar dados do servidor');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const totalVeiculos = automoveis.length;
  const pedidosPendentes = pedidos.filter((p) => p.status === 'pendente').length;
  const lucroTotal = pedidos
    .filter((p) => p.status === 'concluido')
    .reduce((acc, p) => {
      const dias =
        Math.max(
          1,
          Math.ceil(
            (new Date(p.dataFim) - new Date(p.dataInicio)) / (1000 * 60 * 60 * 24)
          )
        );
      return acc + (p.automovel?.valorDiaria ?? 0) * dias;
    }, 0);

  const handleSalvarAutomovel = async (dados) => {
    try {
      if (automovelEditando) {
        await atualizarAutomovel(automovelEditando.id, dados);
        toast.success('Veículo atualizado!');
      } else {
        await criarAutomovel(dados);
        toast.success('Veículo cadastrado!');
      }
      setModalAberto(false);
      setAutomovelEditando(null);
      await carregarDados();
    } catch {
      toast.error('Erro ao salvar veículo');
    }
  };

  const handleDeletarAutomovel = async (id, modelo) => {
    if (!window.confirm(`Excluir o veículo "${modelo}"?`)) return;
    try {
      await deletarAutomovel(id);
      toast.success('Veículo excluído!');
      await carregarDados();
    } catch {
      toast.error('Erro ao excluir veículo');
    }
  };

  const handleStatusPedido = async (id, novoStatus) => {
    try {
      await atualizarStatusPedido(id, novoStatus);
      toast.success('Status atualizado!');
      await carregarDados();
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  const statusColor = {
    disponivel: 'bg-green-100 text-green-700',
    alugado: 'bg-blue-100 text-blue-700',
    manutencao: 'bg-yellow-100 text-yellow-700',
  };

  const pedidoStatusColor = {
    pendente: 'bg-yellow-100 text-yellow-700',
    ativo: 'bg-blue-100 text-blue-700',
    concluido: 'bg-green-100 text-green-700',
    cancelado: 'bg-red-100 text-red-700',
  };

  if (carregando) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h2>
        <p className="text-slate-500 text-sm">Visão geral do sistema de aluguel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <Car className="text-blue-600" size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total de Veículos</p>
            <p className="text-3xl font-bold text-slate-900">{totalVeiculos}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
            <ClipboardList className="text-yellow-600" size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Pedidos Pendentes</p>
            <p className="text-3xl font-bold text-slate-900">{pedidosPendentes}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <DollarSign className="text-green-600" size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Lucro Total</p>
            <p className="text-3xl font-bold text-slate-900">
              {lucroTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Gestão de Estoque</h3>
          <button
            onClick={() => { setAutomovelEditando(null); setModalAberto(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            <Plus size={15} /> Novo Veículo
          </button>
        </div>
        {automoveis.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Car size={40} className="mx-auto mb-3 text-slate-300" />
            <p>Nenhum veículo cadastrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Veículo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Placa</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Ano</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Diária</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody>
                {automoveis.map((a) => (
                  <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {a.marca} {a.modelo}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{a.placa}</td>
                    <td className="px-6 py-4 text-slate-600">{a.ano}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {Number(a.valorDiaria).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setAutomovelEditando(a); setModalAberto(true); }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletarAutomovel(a.id, `${a.marca} ${a.modelo}`)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-slate-900">Pedidos Recentes</h3>
        </div>
        {pedidos.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <ClipboardList size={40} className="mx-auto mb-3 text-slate-300" />
            <p>Nenhum pedido registrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Veículo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Período</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-slate-500">#{p.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{p.cliente?.nome ?? '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{p.automovel ? `${p.automovel.marca} ${p.automovel.modelo}` : '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{p.dataInicio} → {p.dataFim}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${pedidoStatusColor[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusPedido(p.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-600"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="ativo">Ativo</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalAberto && (
        <ModalAutomovel
          automovel={automovelEditando}
          onSalvar={handleSalvarAutomovel}
          onFechar={() => { setModalAberto(false); setAutomovelEditando(null); }}
        />
      )}
    </Layout>
  );
}
