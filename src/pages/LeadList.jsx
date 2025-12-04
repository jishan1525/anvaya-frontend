import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const LeadList = () => {
  // STATE VARIABLES
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [AgentFilter, setAgentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortingFilter, setSortingFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API URLs
  const API_URL = `https://anvaya-backend-gilt.vercel.app/leads`;
  const AGENT_API = `https://anvaya-backend-gilt.vercel.app/agents`;

  // FETCHING LEADS and AGENTS
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        const LeadResponse = await axios.get(API_URL);
        setLeads(LeadResponse.data);

        const AgentResponse = await axios.get(AGENT_API);
        setAgents(AgentResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [AGENT_API, API_URL]);

  let filteredLeads = [...leads];

  // AGENT FILTER
  if (AgentFilter) {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.salesAgent?.id === AgentFilter
    );
  }

  // STATUS FILTER
  if (statusFilter) {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.status === statusFilter
    );
  }

  // PRIORITY SORTING
  if (priorityFilter) {
    const priorityRank = { High: 3, Medium: 2, Low: 1 };

    filteredLeads.sort((a, b) => {
      const A = priorityRank[a.priority] || 0;
      const B = priorityRank[b.priority] || 0;

      return priorityFilter === "High to Low" ? B - A : A - B;
    });
  }

  // SORT BY TIME
  if (sortingFilter) {
    filteredLeads.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return sortingFilter === "High to Low"
        ? dateB - dateA // Latest to Oldest
        : dateA - dateB; // Oldest to Latest
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar />

      {/* HEADER - Position below mobile menu, shift right on desktop */}
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-16 md:top-0 z-20 shadow-lg md:pl-56">
        Lead List
      </h1>

      {/* MAIN CONTENT - Shift right on desktop */}
      <div className="md:pl-56">
        {/*  FILTERS */}
        <div className="flex flex-wrap gap-4 p-6 bg-white shadow rounded-lg border mb-6 mx-6 mt-6">
          
          {/* Agent Filter */}
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700 mb-1 mt-6">
              Filter by Sales Agent
            </label>
            <select
              value={AgentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              disabled={loading}
              className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-sky-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700 mb-1 mt-6">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={loading}
              className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-sky-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value={""}>All Status</option>
              <option value={"New"}>New</option>
              <option value={"Contacted"}>Contacted</option>
              <option value={"Qualified"}>Qualified</option>
              <option value={"Proposal Sent"}>Proposal Sent</option>
              <option value={"Closed"}>Closed</option>
            </select>
          </div>

          {/* Sort by Priority */}
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700 mb-1 mt-6">
              Sort by Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              disabled={loading}
              className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-sky-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value={""}>All Priorities</option>
              <option value={"High to Low"}>High to Low</option>
              <option value={"Low to High"}>Low to High</option>
            </select>
          </div>

          {/* Sort by Time */}
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700 mb-1 mt-6">
              Sort by Time to Close
            </label>
            <select
              value={sortingFilter}
              onChange={(e) => setSortingFilter(e.target.value)}
              disabled={loading}
              className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-sky-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value={"High to Low"}>Latest to Oldest</option>
              <option value={"Low to High"}>Oldest to Latest</option>
            </select>
          </div>

          {/* ADD LEAD BUTTON */}
          <div className="flex items-end w-full sm:w-auto">
            <Link to="/addLead" className="w-full sm:w-auto">
              <button className="w-full bg-sky-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-sky-700 hover:shadow-lg transition-all">
                Add New Lead
              </button>
            </Link>
          </div>
        </div>

        {/*  MAIN BODY */}
        <div className="px-6 py-4 w-full">
          {/* LOADING STATE */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-xl text-sky-600 font-medium">Loading leads...</p>
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

                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        lead.status === "New"
                          ? "bg-green-100 text-green-700"
                          : lead.status === "Contacted"
                          ? "bg-yellow-100 text-yellow-700"
                          : lead.status === "Qualified"
                          ? "bg-blue-100 text-blue-700"
                          : lead.status === "Proposal Sent"
                          ? "bg-purple-100 text-purple-700"
                          : lead.status === "Closed"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {lead.status}
                      </span>
                    </div>

                    {/* AGENT DETAILS */}
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                      <span className="font-medium">Agent:</span>
                      <span className="text-gray-600">
                        {lead.salesAgent?.name}
                      </span>
                    </div>

                    {/* VIEW DETAILS BUTTON */}
                    <div className="mt-3">
                      <Link to={`/leads/${lead.id}`}>
                        <button className="text-sky-600 hover:text-sky-700 font-medium text-sm">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadList;