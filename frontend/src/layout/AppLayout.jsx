import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';
import Footer from '../components/layout/Footer.jsx';

const AppLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="grid-overlay absolute inset-0 opacity-50" />
        <div className="float-drift absolute left-[6%] top-[-8rem] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="float-drift absolute right-[10%] top-[18%] h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" style={{ animationDelay: '1.8s' }} />
        <div className="float-drift absolute bottom-[-8rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-300/10 blur-3xl" style={{ animationDelay: '3.1s' }} />
      </div>

      <div className="relative flex min-h-screen">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden lg:pl-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-2 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl fade-rise">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
      </div>
    </div>
  );
};

export default AppLayout;
