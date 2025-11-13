import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/SIdebar";
import { toast } from "react-toastify";

const LeadDetail = () => {
  const { id } = useParams();

  //state variables
  const [lead, setLead] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agentId, setAgentId] = useState("");
  const [comment, setComment] = useState("");
  const [agents, setAgents] = useState();

  //API ENDPOINTS
  const API_URL = `https://anvaya-backend-gilt.vercel.app/leads/${id}`;
  const AGENT_API = `https://anvaya-backend-gilt.vercel.app/agents`;


    // fetching the comments -> made a separate fetch
    const fetchComments = async () => {
  try {
    const response = await axios.get(`https://anvaya-backend-gilt.vercel.app/leads/${id}/comments`);
    setComments(response.data);
  } catch (err) {
    console.error('Error fetching comments:', err);
  }
};
// eslint-disable-next-line
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        const leadData = await axios.get(API_URL);
        setLead(leadData.data);
        await fetchComments();
        const agentsData = await axios.get(AGENT_API);
        setAgents(agentsData.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const agentNameHandler = (event) => {
    setAgentId(event.target.value);
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    if (!agentId || comment.trim().length <= 0) {
      toast.error("Comment text is empty", {
        position: "top-center",
      });
      return;
    }
    const newComment = {
      lead: id,
      comment: comment,
      author: agentId,
    };
    axios
      .post(
        `https://anvaya-backend-gilt.vercel.app/leads/${id}/comments`,
        newComment
      )
      .then((res) => {
        toast.success("Comment added successfully", {
          position: "top-center",
        });
        fetchComments();
        setComment("");
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("Failed to add comment", {
          position: "top-center",
        });
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-sky-600">Loading lead data...</div>
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

  const agentName = agents?.find((agent) => agent?._id === lead?.salesAgent);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER */}
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-0 z-20 shadow-lg">
        Lead Management : {lead?.name}
      </h1>

      <div className="flex">
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 space-y-8">
          {/* LEAD DETAILS CARD */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Lead Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
              <p>
                <span className="font-medium text-gray-600">Lead Name:</span>{" "}
                {lead?.name}
              </p>
              <p>
                <span className="font-medium text-gray-600">Sales Agent:</span>{" "}
                {agentName?.name}
              </p>
              <p>
                <span className="font-medium text-gray-600">Lead Source:</span>{" "}
                {lead?.source}
              </p>
              <p>
                <span className="font-medium text-gray-600">Lead Status:</span>{" "}
                {lead?.status}
              </p>
              <p>
                <span className="font-medium text-gray-600">Priority:</span>{" "}
                {lead?.priority}
              </p>
              <p>
                <span className="font-medium text-gray-600">Time to Close:</span>{" "}
                {lead?.timeToClose} Days
              </p>
            </div>

            <div className="mt-6">
              <Link to={"/"}>
                <button className="bg-sky-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-sky-700 transition-all">
                  Edit Details
                </button>
              </Link>
            </div>
          </div>

          {/* COMMENT SECTION */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Comments
            </h2>

            {/* Comments Display */}
            {comments && comments.length > 0 ? (
              <div className="space-y-3 mb-6">
                {comments.map((comm, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50 shadow-sm"
                  >
                    <p className="text-gray-800">{comm.commentText}</p>
                    <div className="text-sm text-gray-500 mt-1">
                      <span>{comm.authorName}</span> •{" "}
                      <span>
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic mb-6">
                No comments found yet.
              </p>
            )}

            {/* Add Comment Form */}
            <form
              onSubmit={formSubmitHandler}
              className="space-y-4 border-t pt-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Select Agent
                </label>
                <select
                  id="name"
                  onChange={agentNameHandler}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">-- Select an Agent --</option>
                  {agents ? (
                    agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))
                  ) : (
                    <option>Loading...</option>
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Add Comment
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your comment here..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-sky-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-sky-700 transition-all w-full sm:w-auto"
              >
                Add Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;