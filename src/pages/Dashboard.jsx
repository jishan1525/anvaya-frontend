import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react"; 

const Dashboard = () => {
  const API_URL = "https://anvaya-backend-gilt.vercel.app/leads";

  // State variables for data fetching
  const [leadsData, setLeadsData] = useState(null); //leads
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [filterStatus, setFilterStatus] = useState('All'); 


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
  ? (filterStatus === "All" 
      ? leadsData 
      : leadsData.filter((lead) => lead.status === filterStatus))
  : [];
  console.log(filteredLeads);


 const statusCounts =leadsData ? (leadsData.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {})):[];
  // Loading/Error Views
  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-xl text-sky-600">Loading leads...</div>
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
      
      {/* HEADER BAR */}
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-0 z-20 shadow-lg">
        Anvaya CRM Dashboard
      </h1>
      
      {/* FILTER & ADD LEAD BAR */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md border-b border-gray-200 sticky top-14 z-10">
        
        {/* Left side - filters */}
        <div className="flex items-center gap-4">
          <label htmlFor="status-filter" className="text-gray-600 font-medium text-lg">Filter by Status:</label>
          <select 
            id="status-filter"
            className="border border-gray-300 rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} 
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Right side - add lead button */}
        <Link to="/addLead"> 
          <button className="bg-sky-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-sky-700 hover:shadow-lg transition-all text-base flex items-center gap-1">
            Add New Lead
          </button>
        </Link>
      </div>
      
      {/* MAIN LAYOUT */}
      <div className="flex">
        
        {/* SIDEBAR */}
        <div className="w-56 bg-sky-800 shadow-xl p-6 flex flex-col items-start min-h-screen border-r border-sky-900">
          <ul className="space-y-2 w-full">
            {[
                { name: 'Leads', path: '/' },
                { name: 'Sales', path: '/sales' },
                { name: 'Agents', path: '/agents' },
                { name: 'Reports', path: '/reports' },
                { name: 'Settings', path: '/settings' },
            ].map((item) => (
                <li key={item.name} className="w-full">
                    <Link 
                        to={item.path} 
                        className="text-white text-lg font-medium block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-sky-600 hover:shadow-md active:bg-sky-700"
                    >
                        {item.name}
                    </Link>
                </li>
            ))}
          </ul>
        </div>
        
        {/* MAIN CONTENT AREA */}
        <div className="flex-1 p-8 overflow-y-auto">
            {/* LEADS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              
              {filteredLeads.length > 0 ? (
                
                filteredLeads.map((lead) => (
                  <div key={lead.id} className="bg-white shadow-lg border border-gray-100 rounded-xl p-5 text-center transition-all duration-300 hover:shadow-xl flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-extrabold text-gray-800 text-lg mb-2">
                          Lead Name: {lead.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Status: 
                        <span className={`font-semibold ml-1 ${
                            lead.status === 'New' ? 'text-green-600' :
                            lead.status === 'Contacted' ? 'text-yellow-600' :
                            lead.status === 'Proposal Sent' ? 'text-blue-600' :
                            lead.status === 'Closed' ? 'text-red-600' : 'text-gray-600'
                        }`}>
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
            
            {/* STATUS SUMMARY FOOTER */}
            <div className="mt-10 bg-white shadow-lg p-6 rounded-xl flex flex-wrap justify-around gap-4 text-base font-semibold border-t-4 border-sky-600">
                <p className="text-gray-700">All Leads: <span className="font-extrabold text-sky-600">{leadsData ? leadsData.length : 0}</span></p>
                <p className="text-gray-700"> New: <span className="font-extrabold text-green-600">{statusCounts["New"] || 0}</span></p>
                <p className="text-gray-700"> Contacted: <span className="font-extrabold text-yellow-600">{statusCounts["Contacted"] || 0}</span></p>
                <p className="text-gray-700"> Proposal Sent: <span className="font-extrabold text-blue-600">{(leadsData ? leadsData.length : 0)-(statusCounts["New"] || 0)-(statusCounts["Contacted"] || 0)-(statusCounts["Closed"] || 0)}</span></p>
                <p className="text-gray-700"> Closed: <span className="font-extrabold text-red-600">{statusCounts["Closed"] || 0}</span></p>
            </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default Dashboard;
