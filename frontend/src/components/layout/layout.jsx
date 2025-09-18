import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen bg-base-200">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-base-300 transition-all duration-300 flex flex-col`}
      >
        <button
          className="btn btn-ghost btn-sm m-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "«" : "»"}
        </button>

        <nav className="flex-1">
          <ul className="menu p-2">
            <li>
              <Link to="/"> {isOpen && "Dashboard"}</Link>
            </li>
            <li>
              <Link to="/students"> {isOpen && "Students"}</Link>
            </li>
            <li>
              <Link to="/programs"> {isOpen && "Programs"}</Link>
            </li>
            <li>
              <Link to="/colleges"> {isOpen && "Colleges"}</Link>
            </li>
          </ul>
        </nav>
      </aside>

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