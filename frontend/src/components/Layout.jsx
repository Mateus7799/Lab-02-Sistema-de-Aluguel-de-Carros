import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Car, ClipboardList, Users } from 'lucide-react';

const NAV_AGENTE = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/agente/dashboard' },
  { label: 'Estoque', icon: Car, href: '/agente/estoque' },
  { label: 'Pedidos', icon: ClipboardList, href: '/agente/pedidos' },
  { label: 'Clientes', icon: Users, href: '/clientes' },
  { label: 'Perfil', icon: User, href: '/agente/perfil' },
];

const NAV_CLIENTE = [
  { label: 'Portal do Cliente', icon: LayoutDashboard, href: '/cliente/portal' },
  { label: 'Meus Pedidos', icon: ClipboardList, href: '/cliente/pedidos' },
  { label: 'Perfil', icon: User, href: '/cliente/perfil' },
];

export default function Layout({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = usuario?.perfil === 'agente' ? NAV_AGENTE : NAV_CLIENTE;
  const titulo = usuario?.perfil === 'agente' ? 'Painel do Agente' : 'Portal do Cliente';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-slate-900 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-700">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Sistema</p>
          <h2 className="text-white font-bold text-base leading-tight">Aluguel de Carros</h2>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const ativo = location.pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  ativo
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {usuario?.nome?.charAt(0) ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{usuario?.nome}</p>
              <p className="text-slate-400 text-xs capitalize">{usuario?.perfil}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 h-14 flex items-center justify-between shadow-sm">
          <h1 className="text-slate-800 font-semibold text-base">{titulo}</h1>
          <span className="text-sm text-slate-500">Sistema de Aluguel de Carros</span>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
