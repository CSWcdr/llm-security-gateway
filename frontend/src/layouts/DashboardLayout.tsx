import {
    useState,
  } from "react";
  
  import {
    Outlet,
  } from "react-router-dom";
  
  import Header from "../components/layout/Header";
  import MobileSidebar from "../components/layout/MobileSidebar";
  import Sidebar from "../components/layout/Sidebar";
  
  export default function DashboardLayout() {
    const [
      mobileSidebarOpen,
      setMobileSidebarOpen,
    ] = useState(false);
  
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Desktop navigation */}
        <Sidebar />
  
        {/* Mobile navigation */}
        <MobileSidebar
          open={
            mobileSidebarOpen
          }
          onClose={() =>
            setMobileSidebarOpen(
              false
            )
          }
        />
  
        {/* Dashboard */}
        <div className="min-h-screen lg:pl-64">
          <Header
            onMenuClick={() =>
              setMobileSidebarOpen(
                true
              )
            }
          />
  
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }