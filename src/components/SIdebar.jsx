import { Link } from "react-router-dom"

const Sidebar = () => {
    return (
        <div className="w-56 bg-sky-800 shadow-xl p-6 flex flex-col items-start min-h-screen border-r border-sky-900">
                    <button className="text-white border text-lg font-medium block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-sky-600 hover:shadow-md active:bg-sky-700"><Link to={"/"}>Back to Dashboard</Link></button>
        </div>
    )
}

export default Sidebar;