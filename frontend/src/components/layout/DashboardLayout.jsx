import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AIAssistantModal from '../ai/AIAssistantModal';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#FAFBF7] text-[#3D4127]">
      {/* Permanent Olive & White Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-6 bg-[#FAFBF7]">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating AI Assistant */}
      <AIAssistantModal />
    </div>
  );
};

export default DashboardLayout;
