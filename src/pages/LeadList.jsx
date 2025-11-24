import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const LeadList = () => {
  // -------------------- STATE VARIABLES --------------------
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [AgentFilter, setAgentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortingFilter, setSortingFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // API URLs 
  const API_URL = `https://anvaya-backend-gilt.vercel.app/leads`;
  const AGENT_API = `https://anvaya-backend-gilt.vercel.app/agents`;

  // FETCHING LEADS and AGENTS
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
  }, [AGENT_API,API_URL]);

  let filteredLeads = [...leads];

  if (AgentFilter) {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.salesAgent?.id === AgentFilter
    );
  }

  if (statusFilter) {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.status === statusFilter
    );
  }

  if (priorityFilter) {
    const priorityRank = { High: 3, Medium: 2, Low: 1 };

    filteredLeads.sort((a, b) => {
      const A = priorityRank[a.priority] || 0;
      const B = priorityRank[b.priority] || 0;

      return priorityFilter === "High to Low" ? B - A : A - B;
    });
  }

  if (sortingFilter) {
    filteredLeads.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return sortingFilter === "High to Low"
        ? dateB - dateA // Latest to Oldest
        : dateA - dateB; // Oldest to Latest
    });
  }

  //
  return (
    <div>
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-0 z-20 shadow-lg">
        Lead List
      </h1>
      <div className="flex">
        <Sidebar />

        <div className="flex flex-col w-full">
          {/*  FILTERS */}
          <div className="flex gap-6 p-6 bg-white shadow rounded-lg border mb-6 mx-6 mt-6">
            {/* Agent Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Filter by Sales Agent
              </label>
              <select
                onChange={(e) => setAgentFilter(e.target.value)}
                className="border rounded-lg p-2 text-gray-700"
              >
                <option value={""}>All</option>
                {agents?.map((agent) => (
                  <option value={agent._id} key={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg p-2 text-gray-700"
              >
                <option value={""}>All Status</option>
                <option value={"New"}>New</option>
                <option value={"Contacted"}>Contacted</option>
                <option value={"Qualified"}>Qualified</option>
                <option value={"Proposal Sent"}>Proposal Sent</option>
                <option value={"Closed"}>Closed</option>
              </select>
            </div>

            {/* Sorting by Priority */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Sort by Priority
              </label>
              <select
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border rounded-lg p-2 text-gray-700"
              >
                <option value={""}>All Priorities</option>
                <option value={"High to Low"}>High to Low</option>
                <option value={"Low to High"}>Low to High</option>
              </select>
            </div>

            {/* Sorting by Time to close */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Sort by Time to Close
              </label>
              <select
                onChange={(e) => setSortingFilter(e.target.value)}
                className="border rounded-lg p-2 text-gray-700"
              >
                <option value={"High to Low"}>Latest to Oldest</option>
                <option value={"Low to High"}>Oldest to Latest</option>
              </select>
            </div>

            {/* ADD LEAD BUTTON */}
            <div>
              <Link to="/addLead">
                <button className="bg-sky-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-sky-700 hover:shadow-lg transition-all">
                  Add New Lead
                </button>
              </Link>
            </div>
          </div>

          {/*  MAIN BODY */}
          <div className="px-6 py-4 w-full">
            {/* LOADING */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-3 text-gray-600 font-medium">
                    Loading leads...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {filteredLeads.length === 0 ? (
                  <p className="text-center text-gray-600 mt-10">
                    No leads found.
                  </p>
                ) : (
                  filteredLeads.map((lead) => (
                    <div
                      key={lead._id}
                      className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mb-3"
                    >
                      {/* NAME and STATUS */}
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {lead.name}
                        </h3>

                        <span
                          className="
                                    px-3 py-1 rounded-full font-semibold"
                        >
                          {lead.status}
                        </span>
                      </div>

                      {/* AGENT DETAILS*/}
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                        <span className="font-medium">Agent:</span>
                        <span className="text-gray-600">
                          {lead.salesAgent?.name}
                        </span>
                      </div>
    
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadList;
