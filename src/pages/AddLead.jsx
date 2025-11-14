import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/SIdebar";

const AddLead = () => {
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [salesAgentId, setSalesAgentId] = useState("");
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");
  const [timeToClose, setTimeToClose] = useState(0);
  const [priority, setPriority] = useState("");
  const [closedAt, setClosedAt] = useState();
  const [agents, setAgents] = useState();
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const AGENT_API = `https://anvaya-backend-gilt.vercel.app/agents`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        const agentsData = await axios.get(AGENT_API);
        setAgents(agentsData.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [AGENT_API]);

  const tagsHandler = (e) => {
    setTag(e.target.value);
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    toast.info("Validating lead details", {
          position: "top-center",
        });

    // VALIDATION
    if (status === "Closed" && !closedAt) {
      toast.error("closed at cannot be left blank if status is closed", {
        position: "top-center",
      });
      return;
    }



    const newLead = {
      name: name,
      source: source,
      salesAgent: salesAgentId,
      status: status,
      tags: tag.split(",").map(t => t.trim()).filter(t => t !== ""),
      priority: priority,
      timeToClose: parseInt(timeToClose),
      closedAt: closedAt ? closedAt : null,
    };


    console.log(newLead);
    axios
      .post(
        `https://anvaya-backend-gilt.vercel.app/leads`,
        newLead
      )
      .then((res) => {
        toast.success("Lead added successfully", {
          position: "top-center",
        });
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("Failed to add Lead", {
          position: "top-center",
        });
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-sky-600">Fetching data...</div>
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-0 z-20 shadow-lg">
        Add New Lead
      </h1>

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Lead Details
            </h2>

            <form onSubmit={formSubmitHandler} className="space-y-6">
              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Lead Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter lead name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* SALES AGENT */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sales Agent
                </label>
                <select
                  required
                  onChange={(e) => setSalesAgentId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                >
                    <option value="">-- Select an agent --</option>
                  {agents?.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select
                  required
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                >
                <option value="">-- Select an status --</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* SOURCE */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Lead Source
                </label>
                <select
                  required
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                >
                    <option value="">-- Select a Source --</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* TAGS */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tags, Separated by commas
                </label>
                <input
                  type="text"
                  placeholder="Enter tags (comma separated)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  onChange={tagsHandler}
                />
              </div>

              {/* TIME TO CLOSE */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Time to Close (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  onChange={(e) => setTimeToClose(e.target.value)}
                />
              </div>

              {/* PRIORITY */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Priority
                </label>
                <select
                  required
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                >
                    <option value="">-- Select an Priority --</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* CLOSED AT */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Closed At (Optional)
                </label>
                <input max={new Date().toISOString().split("T")[0]}
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  onChange={(e) => setClosedAt(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-sky-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-sky-700 transition-all w-full sm:w-auto"
              >
                Add Lead
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLead;