import { Link } from "react-router-dom";

import { useState } from "react";

const DashboardSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navbar */}
      <div
        className="md:hidden bg-sky-800 text-white p-4 flex justify-between items-center
        fixed top-0 left-0 w-full z-50 shadow-md"
      >
        <h1 className="text-xl font-semibold">Menu</h1>

        {/* Hamburger Button */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Sidebar"
          className="text-white text-3xl"
        >
          ☰
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile) */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-sky-600 border-r border-sky-900 shadow-xl 
          p-6 flex flex-col items-start w-56 z-40 transition-transform duration-300

          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close (Mobile only) */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close Sidebar"
          className="text-white text-2xl self-end mb-6 md:hidden"
        >
          ✕
        </button>

        {/* Button */}
        <ul className="space-y-2 w-full">
            {[
                { name: 'Leads', path: '/leadStatus' },
                { name: 'Sales', path: '/sales' },
                { name: 'Agents', path: '/agents' },
                { name: 'Reports', path: '/reports' },
                { name: 'Lead List', path: '/leadList' },
                { name: 'Settings', path: '/settings' },
            ].map((item) => (
                <li key={item.name} className="w-full">
                    <Link 
                        to={item.path} 
                        className="text-white text-lg font-medium block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-sky-700 hover:shadow-md active:bg-sky-800"
                    >
                        {item.name}
                    </Link>
                </li>
            ))}
          </ul>
      </div>

      {/* Background overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-30"
        ></div>
      )}
    </>
  );
};

export default DashboardSidebar;