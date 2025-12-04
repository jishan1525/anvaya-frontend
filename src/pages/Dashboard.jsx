import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";

const Dashboard = () => {
  const API_URL = "https://anvaya-backend-gilt.vercel.app/leads";

  const [leadsData, setLeadsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await axios.get(API_URL);
        setLeadsData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredLeads = leadsData
    ? filterStatus === "All"
      ? leadsData
      : leadsData.filter((lead) => lead.status === filterStatus)
    : [];

  const statusCounts = leadsData
    ? leadsData.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DashboardSidebar />

      {/* HEADER - Now positioned below mobile menu */}
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white fixed top-16 md:top-0 left-0 right-0 z-20 shadow-lg md:pl-56">
        Anvaya CRM Dashboard
      </h1>

      {/* FILTER BAR - Adjusted positioning */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md border-b border-gray-200 fixed top-[136px] md:top-[88px] left-0 right-0 z-10 md:pl-56">
        <div className="flex items-center gap-4 px-5">
          <label htmlFor="status-filter" className="text-gray-600 font-medium text-lg">
            Filter by Status:
          </label>
          <select
            id="status-filter"
            className="border border-gray-300 rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            disabled={loading}
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <Link to="/addLead">
          <button className="bg-sky-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-sky-700 hover:shadow-lg transition-all text-base flex items-center gap-1">
            Add New Lead
          </button>
        </Link>
      </div>

      {/* MAIN AREA - Added top padding for mobile */}
      <div className="md:pl-56 p-6 pt-[200px] md:pt-[160px]">
        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full mx-auto"></div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-5 mt-4">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white shadow-lg border border-gray-100 rounded-xl p-5 text-center transition-all duration-300 hover:shadow-xl flex flex-col justify-between h-full"
                  >
                    <div>
                      <h3 className="font-extrabold text-gray-800 text-lg mb-2">
                        Lead Name: {lead.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Status:
                        <span
                          className={`font-semibold ml-1 ${
                            lead.status === "New"
                              ? "text-green-600"
                              : lead.status === "Contacted"
                              ? "text-yellow-600"
                              : lead.status === "Proposal Sent"
                              ? "text-blue-600"
                              : lead.status === "Closed"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <Link to={`/leads/${lead.id}`}>
                        <button className="w-full bg-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-700 transition-colors shadow-md mt-2">
                          Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 p-10 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
                  No leads data available.
                </p>
              )}
            </div>

            {/* FOOTER */}
            <div className="mt-10 bg-white shadow-lg p-6 rounded-xl flex flex-wrap justify-around gap-4 text-base font-semibold border-t-4 border-sky-600 ml-5">
              <p className="text-gray-700">
                All Leads: <span className="font-extrabold text-sky-600">{leadsData?.length || 0}</span>
              </p>
              <p className="text-gray-700">
                New: <span className="font-extrabold text-green-600">{statusCounts["New"] || 0}</span>
              </p>
              <p className="text-gray-700">
                Contacted: <span className="font-extrabold text-yellow-600">{statusCounts["Contacted"] || 0}</span>
              </p>
              <p className="text-gray-700">
                Proposal Sent:
                <span className="font-extrabold text-blue-600">
                  {(leadsData?.length || 0) -
                    (statusCounts["New"] || 0) -
                    (statusCounts["Contacted"] || 0) -
                    (statusCounts["Closed"] || 0)}
                </span>
              </p>
              <p className="text-gray-700">
                Closed: <span className="font-extrabold text-red-600">{statusCounts["Closed"] || 0}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;