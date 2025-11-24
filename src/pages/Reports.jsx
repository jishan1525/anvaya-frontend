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
  };

  return (
    <div>
      {/* Heading */}
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-0 z-20 shadow-lg">
        Anvaya CRM Reports
      </h1>

      <div className="flex">
        <Sidebar />

        {/* RIGHT: Main Content */}
        <div className="w-full p-8">
          <h2 className="text-3xl px-4 font-semibold mb-6 text-gray-700">
            Reports Overview
          </h2>
            <hr/>
          {/* LOADING SCREEN */}
          {loading ? (
            <div className="w-full flex justify-center items-center h-64">
              <p className="text-lg font-semibold text-gray-600">
                Loading reports...
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold my-3">Pipeline vs Closed Leads</h3>
              <Chart
                chartType="PieChart"
                data={pieDataPipeline}
                options={pieOptionsPipeline}
                width={"100%"}
                height={"400px"}
              />

              <hr className="my-8" />
              <h3 className="text-xl font-bold my-3">Leads Closed by Sales Agent</h3>
              <Chart
                chartType="BarChart"
                data={barDataClosedByAgent}
                options={barOptionsClosedByAgent}
                width={"100%"}
                height={"400px"}
              />

              <hr className="my-8" />
              <h3 className="text-xl font-bold my-3">Lead Status Distribution</h3>
              <Chart
                chartType="PieChart"
                data={pieDataStatus}
                options={pieOptionsStatus}
                width={"100%"}
                height={"400px"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;