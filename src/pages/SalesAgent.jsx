import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AddAgentModal from "../components/AddAgentModal";
import { toast } from "react-toastify";

const SalesAgent = () => {
  const AGENT_API = `https://anvaya-backend-gilt.vercel.app/agents`;
  const [agentData, setAgentData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await axios.get(AGENT_API);
        setAgentData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [AGENT_API]);

  const handleSuccess = () => {
    toast.success("New Agent Added Successfully!");

    // Refresh list
    axios.get(AGENT_API).then((res) => setAgentData(res.data));
  };
  
  const handleFailure = () => {
    toast.error("Please check the email!");

    // Refresh list
    axios.get(AGENT_API).then((res) => setAgentData(res.data));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar />

      {/* HEADER - Position below mobile menu, shift right on desktop */}
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-16 md:top-0 z-20 shadow-lg md:pl-56">
        Sales Agent List
      </h1>

      {/* MAIN CONTENT - Shift right on desktop */}
      <div className="md:pl-56 p-2 px-2 bg-gray-50">
        {/* INFO BAR */}
        <div className="mb-6 flex p-6 justify-between items-center mt-4">
          <h2 className="text-2xl font-bold text-gray-800">
            All Agents ({agentData?.length || 0})
          </h2>
          
          {/* ADD NEW AGENT BUTTON */}
          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition shadow-md mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add New Agent
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xl text-sky-600 font-medium">Loading agent data...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-xl text-red-600 p-4 border border-red-300 bg-red-50 rounded-lg">
              Error fetching data: {error}
            </div>
          </div>
        )}

        {/* CONTENT - Only show when data is loaded */}
        {!loading && !error && (
          <>
            {/* GRID OF AGENTS */}
            {agentData && agentData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {agentData.map((agent) => (
                  <div
                    key={agent._id}
                    className="bg-white shadow-lg border border-gray-100 rounded-xl p-5 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      <span className="text-lg font-extrabold text-gray-800 mb-1">
                        {agent?.name}
                      </span>
                      <span className="text-sm text-gray-500 break-words">
                        {agent?.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 mx-6">
                <p className="text-gray-500 text-lg">No agents found.</p>
                <p className="text-gray-400 text-sm mt-2">Click "Add New Agent" to get started.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <AddAgentModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
          onFailure={handleFailure}
        />
      )}
    </div>
  );
};

export default SalesAgent;