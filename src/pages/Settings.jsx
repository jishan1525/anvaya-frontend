import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";

const Settings = () => {
  const AGENT_API = `https://anvaya-backend-gilt.vercel.app/agents`;
  const LEADS_API = `https://anvaya-backend-gilt.vercel.app/leads`;

  const [leads, setLeads] = useState([]);
  const [agents, setAgent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // DELETE AGENT
  const handleAgentDelete = async (id) => {
    toast.error("Deleting Agent...");
    const response = await axios.delete(`${AGENT_API}/${id}`);

    if (response.status === 200) {
      toast.success("Agent Deleted");
      setAgent(agents.filter((a) => a._id !== id));
    } else {
      toast.error("Error deleting agent");
    }
  };

  // DELETE LEAD
  const handleLeadDelete = async (id) => {
    toast.error("Deleting Lead...");
    const response = await axios.delete(`${LEADS_API}/${id}`);

    if (response.status === 200) {
      toast.success("Lead Deleted");
      setLeads(leads.filter((l) => l.id !== id));
    } else {
      toast.error("Error deleting lead");
    }
  };

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const agentsData = await axios.get(AGENT_API);
        setAgent(agentsData.data);

        const leadsData = await axios.get(LEADS_API);
        setLeads(leadsData.data);
      } catch (err) {
        setError(err?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  if (loading) return <p className="text-center pt-10">Loading...</p>;
  if (error) return <p className="text-center pt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 relative">

      {/* SIDEBAR */}
      <Sidebar />

      {/* HEADER — Position below mobile menu bar */}
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-16 md:top-0 z-20 shadow-lg md:pl-56">
        Settings
      </h1>

      {/* MAIN CONTENT */}
      <div className="p-6 md:pl-56">

        {/* LEADS LIST */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-10">
          <h2 className="text-xl font-semibold mt-6 mb-4">Leads</h2>

          {leads.length === 0 && (
            <p className="text-gray-500">No leads available</p>
          )}

          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-100 transition"
              >
                <p className="font-medium">{lead.name}</p>

                <button
                  onClick={() => handleLeadDelete(lead.id)}
                  className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md shadow"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AGENTS LIST */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Agents</h2>

          {agents.length === 0 && (
            <p className="text-gray-500">No agents available</p>
          )}

          <div className="space-y-3">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-100 transition"
              >
                <p className="font-medium">{agent.name}</p>

                <button
                  onClick={() => handleAgentDelete(agent._id)}
                  className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md shadow"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;