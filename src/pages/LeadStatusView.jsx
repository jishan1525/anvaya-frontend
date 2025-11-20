import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const LeadStatusView = () => {

  // -------------------- STATE VARIABLES --------------------
  const [agents, setAgents] = useState();
  const [leads, setLeads] = useState();
  const [AgentFilter, setAgentFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortingFilter, setSortingFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // -------------------- API URLs --------------------
  const API_URL = `https://anvaya-backend-gilt.vercel.app/leads`;
  const AGENT_API = `https://anvaya-backend-gilt.vercel.app/agents`;

  // -------------------- FETCHING LEADS + AGENTS --------------------
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

  // STATUS LIST
  const status = ["New", "Contacted", "Proposal Sent", "Closed"];

  // CREATE EMPTY GROUP OBJECT
  const grouped = {};
  status.forEach(st => {
    grouped[st] = []; // Example => grouped["New"] = []
  });

  // FILL GROUPS USING FILTERS
  leads?.forEach((lead) => {
    const currentLeadStatus = lead.status;

    const agentMatch =
      AgentFilter === "" || lead.salesAgent?.id === AgentFilter;

    const priorityMatch =
      priorityFilter === "" || lead.priority === priorityFilter;

    if (grouped[currentLeadStatus] && agentMatch && priorityMatch) {
      grouped[currentLeadStatus].push(lead);
    }
  });

  // SORTING LOGIC 
  const sortedGroups = Object.values(grouped);
  sortedGroups.forEach((leadArray) => {
    if (sortingFilter === "Low to High") {
      leadArray.sort((a, b) => new Date(a.timeToClose) - new Date(b.timeToClose));
    } else if (sortingFilter === "High to Low") {
      leadArray.sort((a, b) => new Date(b.timeToClose) - new Date(a.timeToClose));
    }
  });

  // STATUS BADGE COLORS
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "New":
        return "bg-sky-100 text-sky-700";
      case "Contacted":
        return "bg-purple-100 text-purple-700";
      case "Proposal Sent":
        return "bg-amber-100 text-amber-700";
      case "Closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div>
      {/* TOP HEADER */}
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-0 z-20 shadow-lg">
        Lead Status Overview
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
          </div>

          {/*  MAIN BODY */}
          <div className="px-6 py-4 w-full">

            {/* LOADING */}
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
                  Lead List by Status
                </h2>

                {/* STATUS */}
                {status.map((st) => (
                  <div key={st} className="mb-10">

                    {/* STATUS HEADER */}
                    <h2 className="text-xl font-bold mb-3">
                      {st} ({grouped[st].length})
                    </h2>

                    {/* LEADS inside the status */}
                    {grouped[st].length === 0 ? (
                      <p className="text-gray-500 text-sm">No leads in this status.</p>
                    ) : (
                      grouped[st].map((lead) => (
                        <div
                          key={lead._id}
                          className="p-5 bg-gray-50 border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mb-3"
                        >

                          {/* NAME and STATUS BADGE */}
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg text-gray-800">
                              {lead.name}
                            </h3>

                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeClasses(
                                lead.status
                              )}`}
                            >
                              {lead.status}
                            </span>
                          </div>

                          {/* AGENT */}
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Agent:</span>{" "}
                            {lead.salesAgent?.name}
                          </p>

                          {/* PRIORITY */}
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Priority:</span>{" "}
                            <span
                              className={
                                lead.priority === "High"
                                  ? "text-red-600 font-semibold"
                                  : lead.priority === "Medium"
                                  ? "text-yellow-600 font-semibold"
                                  : "text-green-600 font-semibold"
                              }
                            >
                              {lead.priority}
                            </span>
                          </p>

                          {/* TIME TO CLOSE */}
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">
                              Time to Close:
                            </span>{" "}
                            {lead.timeToClose} days
                          </p>
                        </div>
                      ))
                    )}

                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadStatusView;