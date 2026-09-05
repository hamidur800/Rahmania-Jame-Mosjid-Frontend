import { Outlet } from "react-router";
import Sidebar from "../Componant/Dashboard/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen bg-gray-100 p-4 transition-colors duration-300 md:p-6 dark:bg-gray-950">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
