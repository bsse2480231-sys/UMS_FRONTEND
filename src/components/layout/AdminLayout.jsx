import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        
        {/* Mobile Top Navbar */}
        <div className="md:hidden bg-white p-4 border-b border-slate-100 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 hover:text-indigo-600">
            <HiOutlineMenu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-indigo-600">UniPortal</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;