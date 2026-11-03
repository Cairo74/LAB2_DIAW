import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import TechGridBackground from './components/TechGridBackground';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import AgentDashboard from './pages/AgentDashboard';
import LoginModal from './pages/LoginModal';

function AppContent() {
  const { user, isCliente, isAgente } = useAuth();
  const [activeTab, setActiveTab] = useState('catalog');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#07080a] text-slate-200 relative selection:bg-emerald-500 selection:text-black">
      <TechGridBackground />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'catalog' && (
          <Catalog onRequireLogin={() => setIsLoginModalOpen(true)} />
        )}
        {activeTab === 'my-orders' && isCliente && <MyOrders />}
        {activeTab === 'profile' && isCliente && <Profile />}
        {activeTab === 'agent-dashboard' && isAgente && <AgentDashboard />}
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
