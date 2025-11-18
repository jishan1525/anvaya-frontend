import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AddAgentModal from "../components/AddAgentModal";
import { toast } from "react-toastify";

const SalesAgent = () => {
  const AGENT_API = `https://anvaya-backend-gilt.vercel.app/agents`;
  const [agentData, setAgentData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-sky-600">Loading agent data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-red-600 p-4 border border-red-300 bg-red-50 rounded-lg">
          Error fetching data: {error}
        </div>
      </div>
    );
  }

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
    <div className="h-screen flex flex-col">
      {/* HEADER */}
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-0 z-20 shadow-lg">
        Sales Agent List
      </h1>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
          {/* GRID OF AGENTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {agentData?.map((agent) => (
              <div
                key={agent._id}
                className="bg-white shadow-lg border border-gray-100 rounded-xl p-5 hover:shadow-xl transition-all"
              >
                <p>
                  <span className="text-lg font-extrabold text-gray-700 block">
                    {agent?.name}
                  </span>
                  <span className="text-sm text-gray-500">{agent?.email}</span>
                </p>
              </div>
            ))}
          </div>

          {/* ADD NEW AGENT BUTTON */}
          <div className="mt-8">
            <button
              onClick={() => setShowModal(true)}
              className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition"
            >
              Add New Agent
            </button>
          </div>
        </div>
      </div>
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
