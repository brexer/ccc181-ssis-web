import { useContext } from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext';
import Sidebar from "./sidebar";
import { useState } from "react";

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  return (
    <div className="flex h-screen bg-base-200">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="navbar bg-base-100 shadow">
          <div className="flex-1">
            <h1 className="text-lg font-bold">Student Information System</h1>
          </div>
          <div className="flex-none gap-2">
            <span className="text-sm font-medium">Welcome, {user?.username}</span>
            <button 
              onClick={handleLogout}
              className="btn btn-ghost btn-sm hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <section className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
}