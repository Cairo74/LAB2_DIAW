import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('autorent_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const authService = {
  login: (data) => api.post('/auth/login', data),
  registerCliente: (data) => api.post('/auth/register-cliente', data),
  registerAgente: (data) => api.post('/auth/register-agente', data),
  me: () => api.get('/auth/me'),
};
export const clienteService = {
  getPerfil: () => api.get('/clientes/me'),
  getById: (id) => api.get(`/clientes/${id}`),
  updatePerfil: (id, data) => api.put(`/clientes/${id}`, data),
  listarTodos: () => api.get('/clientes'),
};
export const automovelService = {
  listarDisponiveis: () => api.get('/automoveis/disponiveis'),
  listarTodos: () => api.get('/automoveis'),
  criar: (data) => api.post('/automoveis', data),
  atualizar: (id, data) => api.put(`/automoveis/${id}`, data),
  deletar: (id) => api.delete(`/automoveis/${id}`),
};
export const pedidoService = {
  listarMeus: () => api.get('/pedidos/meus'),
  listarTodos: () => api.get('/pedidos'),
  criar: (data) => api.post('/pedidos', data),
  modificar: (id, data) => api.put(`/pedidos/${id}/modificar`, data),
  cancelar: (id) => api.put(`/pedidos/${id}/cancelar`),
  avaliar: (id, data) => api.put(`/pedidos/${id}/avaliar`, data),
};
export const creditoService = {
  listarTodos: () => api.get('/creditos'),
  avaliar: (id, data) => api.put(`/creditos/${id}/avaliar`, data),
};
export default api;
