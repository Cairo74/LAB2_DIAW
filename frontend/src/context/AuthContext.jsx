import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, clienteService } from '../services/api';
const AuthContext = createContext({});
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('autorent_token');
    const storedUser = localStorage.getItem('autorent_user');
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.role === 'ROLE_CLIENTE') {
          fetchClienteData();
        }
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, []);
  const fetchClienteData = async () => {
    try {
      const res = await clienteService.getPerfil();
      setCliente(res.data);
    } catch (e) {
      console.error('Erro ao buscar dados do cliente', e);
    }
  };
  const login = async (email, senha) => {
    const res = await authService.login({ email, senha });
    const authData = res.data;
    localStorage.setItem('autorent_token', authData.token);
    localStorage.setItem('autorent_user', JSON.stringify(authData));
    setUser(authData);
    if (authData.role === 'ROLE_CLIENTE') {
      await fetchClienteData();
    }
    return authData;
  };
  const registerCliente = async (formData) => {
    const res = await authService.registerCliente(formData);
    const authData = res.data;
    localStorage.setItem('autorent_token', authData.token);
    localStorage.setItem('autorent_user', JSON.stringify(authData));
    setUser(authData);
    await fetchClienteData();
    return authData;
  };
  const registerAgente = async (formData) => {
    const res = await authService.registerAgente(formData);
    const authData = res.data;
    localStorage.setItem('autorent_token', authData.token);
    localStorage.setItem('autorent_user', JSON.stringify(authData));
    setUser(authData);
    return authData;
  };
  const logout = () => {
    localStorage.removeItem('autorent_token');
    localStorage.removeItem('autorent_user');
    setUser(null);
    setCliente(null);
  };
  const isCliente = user?.role === 'ROLE_CLIENTE';
  const isAgenteEmpresa = user?.role === 'ROLE_AGENTE_EMPRESA';
  const isAgenteBanco = user?.role === 'ROLE_AGENTE_BANCO';
  const isAgente = isAgenteEmpresa || isAgenteBanco;
  return (
    <AuthContext.Provider
      value={{
        user,
        cliente,
        loading,
        login,
        registerCliente,
        registerAgente,
        logout,
        fetchClienteData,
        isCliente,
        isAgente,
        isAgenteEmpresa,
        isAgenteBanco,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
