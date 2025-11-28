import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen w-full bg-[#1a0b3c] flex justify-center font-sans overflow-x-hidden">
      {/* Global Background Pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#8b5cf6 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}>
      </div>

      {/* Ambient Glow Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />

      {/* Main Application Container */}
      <div className="w-full max-w-lg min-h-screen flex flex-col relative z-10 bg-[#2E1065] shadow-2xl">
        <main className="relative flex min-h-screen flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
