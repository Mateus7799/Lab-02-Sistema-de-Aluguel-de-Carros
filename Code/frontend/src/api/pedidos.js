import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getPedidos = () =>
  API.get('/pedidos').then((r) => r.data);

export const getPedidoById = (id) =>
  API.get(`/pedidos/${id}`).then((r) => r.data);

export const criarPedido = (dados) =>
  API.post('/pedidos', dados).then((r) => r.data);

export const atualizarStatusPedido = (id, status) =>
  API.put(`/pedidos/${id}/status`, { status }).then((r) => r.data);

export const deletarPedido = (id) =>
  API.delete(`/pedidos/${id}`).then((r) => r.data);
