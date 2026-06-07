import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet /> {/* Child routes render here */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;