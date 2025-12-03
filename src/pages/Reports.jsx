import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Chart } from "react-google-charts";

const Reports = () => {
 
  // STATE variables
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://anvaya-backend-gilt.vercel.app/leads";

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);

        const response = await axios.get(API_URL);
        setLeads(response.data);

      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [API_URL]);


  // CHART 1: Pipeline vs Closed

  const pipelineLeads = leads.filter((lead) => lead.status !== "Closed");
  const pipelineCount = pipelineLeads.length;
  const closedLeads = leads.filter((lead) => lead.status === "Closed");
  const closedCount = closedLeads.length;

  // Pie Chart Data (Pipeline vs Closed)
  const pieDataPipeline = [
    ["Lead Type", "Count"],
    ["Leads in Pipeline", pipelineCount],
    ["Closed Leads", closedCount],
  ];

  const pieOptionsPipeline = {
    title: "Pipeline vs Closed Leads",
    colors: ['#0ea5e9', '#10b981'],
    legend: { position: 'bottom' },
  };

  // CHART 2: Lead Status Distribution

  // Count how many leads exist in each status
  const statusCount = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  // Convert object to Google Charts format
  const pieDataStatus = [
    ["Status", "Lead Count"],
    ...Object.entries(statusCount),
  ];

  const pieOptionsStatus = {
    title: "Lead Status Distribution",
    colors: ['#0ea5e9', '#a855f7', '#f59e0b', '#10b981', '#ef4444'],
    legend: { position: 'bottom' },
  };

  // CHART 3: Leads Closed by Sales Agent

  // Count closed leads grouped by sales agent name
  const closedLeadsByAgent = closedLeads.reduce((acc, lead) => {
    const agent = lead.salesAgent?.name || "Unknown Agent";
    acc[agent] = (acc[agent] || 0) + 1;
    return acc;
  }, {});

  // Convert object to Google Charts format
  const barDataClosedByAgent = [
    ["Sales Agent", "Closed Leads"],
    ...Object.entries(closedLeadsByAgent),
  ];

  const barOptionsClosedByAgent = {
    title: "Leads Closed by Sales Agent",
    colors: ['#0ea5e9'],
    legend: { position: 'none' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar />

      {/* HEADER - Position below mobile menu, shift right on desktop */}
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-16 md:top-0 z-20 shadow-lg md:pl-56">
        Anvaya CRM Reports
      </h1>

      {/* MAIN CONTENT - Shift right on desktop */}
      <div className="md:pl-56 p-8">
        <div className="mb-6">
          <h2 className="text-3xl mt-8 font-semibold text-gray-800 px-6">
            Reports Overview
          </h2>
          <p className="text-gray-600 mt-2 px-6">
            Visualize your sales performance and lead distribution
          </p>
        </div>
        
        <hr className="mb-8 border-gray-300" />

        {/* LOADING SCREEN */}
        {loading ? (
          <div className="w-full flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-3 text-gray-600 font-medium">Loading reports...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 p-6">
            {/* CHART 1: Pipeline vs Closed */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Pipeline vs Closed Leads
              </h3>
              <div className="flex justify-center">
                <Chart
                  chartType="PieChart"
                  data={pieDataPipeline}
                  options={pieOptionsPipeline}
                  width={"100%"}
                  height={"400px"}
                />
              </div>
            </div>

            {/* CHART 2: Leads Closed by Agent */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Leads Closed by Sales Agent
              </h3>
              <div className="flex justify-center">
                <Chart
                  chartType="BarChart"
                  data={barDataClosedByAgent}
                  options={barOptionsClosedByAgent}
                  width={"100%"}
                  height={"400px"}
                />
              </div>
            </div>

            {/* CHART 3: Status Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Lead Status Distribution
              </h3>
              <div className="flex justify-center">
                <Chart
                  chartType="PieChart"
                  data={pieDataStatus}
                  options={pieOptionsStatus}
                  width={"100%"}
                  height={"400px"}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;