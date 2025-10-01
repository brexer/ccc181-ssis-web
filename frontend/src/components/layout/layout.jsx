import { Outlet, Link } from "react-router-dom";
import Sidebar from "./sidebar";
import { useState } from "react";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);

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
          <div className="flex-none">
            <button className="btn btn-ghost"></button>
            <button className="btn btn-ghost"></button>
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