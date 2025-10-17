import { Link } from "react-router-dom";
export default function Sidebar({ isOpen, setIsOpen }){
  return(
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
  );
}