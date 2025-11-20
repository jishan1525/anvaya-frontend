import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const AgentView = () => {

    //state variable
  const [agents, setAgents] = useState();
  const [leads, setLeads] = useState();
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortingFilter, setSortingFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = `https://anvaya-backend-gilt.vercel.app/leads`;
  const AGENT_API = `https://anvaya-backend-gilt.vercel.app/agents`;

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const LeadResponse = await axios.get(API_URL);
      setLeads(LeadResponse.data);
      const AgentResponse = await axios.get(AGENT_API);
      setAgents(AgentResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [API_URL, AGENT_API]);

  // GROUPING LOGIC
  const grouped = {};


//   {
//.  every agent has a bucket ready to store their leads
//   "123": { agentName: "John", leads: [] },
//   "456": { agentName: "Sarah", leads: [] }
// }

  // Create empty group for every agent
  agents?.forEach((agent) => {
    grouped[agent._id] = {
      agentName: agent.name,
      leads: [],
    };
  });

  //Loop through each lead and put it into its agent’s bucket
  // Fill with leads + filters
  leads?.forEach((lead) => {
    const agentId = lead.salesAgent.id;

    const statusMatch =
      statusFilter === "" || lead.status === statusFilter;

    const priorityMatch =
      priorityFilter === "" || lead.priority === priorityFilter;
    //Push only the leads that match both filters
    if (grouped[agentId] && statusMatch && priorityMatch) {
      grouped[agentId].leads.push(lead);
    }
  });
  //Convert grouped object into an array to use .map()
//   [
//   { agentName: "John", leads: [...] },
//   { agentName: "Sarah", leads: [...] }
// ]
  const agentList = Object.values(grouped);

  // Sorting
  agentList.forEach((agent) => {
    if (sortingFilter === "High to Low") {
      agent.leads.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortingFilter === "Low to High") {
      agent.leads.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }
  });

  return (
    <div>
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-0 z-20 shadow-lg">
        Leads by Sales Agent
      </h1>

      <div className="flex">
        <Sidebar />

        <div className="flex flex-col w-full">

          {/*  FILTERS */}
          <div className="flex gap-6 p-6 bg-white shadow rounded-lg border mb-6 mx-6 mt-6">

            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg p-2 text-gray-700"
              >
                <option value={""}>All</option>
                <option value={"New"}>New</option>
                <option value={"Contacted"}>Contacted</option>
                <option value={"Qualified"}>Qualified</option>
                <option value={"Proposal Sent"}>Proposal Sent</option>
                <option value={"Closed"}>Closed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Filter by Priority
              </label>
              <select
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border rounded-lg p-2 text-gray-700"
              >
                <option value={""}>All Priorities</option>
                <option value={"High"}>High</option>
                <option value={"Medium"}>Medium</option>
                <option value={"Low"}>Low</option>
              </select>
            </div>

            {/* Sorting Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Sort by Created Date
              </label>
              <select
                onChange={(e) => setSortingFilter(e.target.value)}
                className="border rounded-lg p-2 text-gray-700"
              >
                <option value={"High to Low"}>Latest to Oldest</option>
                <option value={"Low to High"}>Oldest to Latest</option>
              </select>
            </div>
          </div>

         
          {/* MAIN BODY */}
<div className="px-6 py-4 w-full">

  {loading ? (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-3 text-gray-600 font-medium">Loading leads...</p>
      </div>
    </div>
  ) : (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Lead List by Agent
      </h2>

      <div className="space-y-10">
        {agentList.map((a) => (
          <div
            key={a.agentName}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
          >
            {/* Agent Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {a.agentName}
              </h3>

              <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                Total Leads: {a.leads.length}
              </span>
            </div>

            {/* Leads Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {a.leads.map((lead) => (
                <div
                  key={lead._id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow transition"
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    {lead.name}
                  </h4>

                  <p className="text-sm text-gray-700 mt-1">
                    Status:
                    <span className="font-medium text-blue-600">
                      {" "}
                      {lead.status}
                    </span>
                  </p>

                  <p className="text-sm text-gray-700">
                    Priority:
                    <span
                      className={`font-medium ${
                        lead.priority === "High"
                          ? "text-red-600"
                          : lead.priority === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {" "}
                      {lead.priority}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default AgentView;