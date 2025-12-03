import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

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
  // edit lead variables
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "",
    tags: "",
    priority: "",
    timeToClose: "",
  });

  //API ENDPOINTS
  const API_URL = `https://anvaya-backend-gilt.vercel.app/leads/${id}`;
  const AGENT_API = `https://anvaya-backend-gilt.vercel.app/agents`;

  // fetching the comments -> made a separate fetch
  //useCallback hook is a memorization tool in React. why ?? -> To prevent a function from being recreated on every re-render of its parent component unless one of its dependencies has changed.
  const fetchComments = useCallback(async () => {
    //useCallback memorizes this entire inner function
    try {
      const response = await axios.get(
        `https://anvaya-backend-gilt.vercel.app/leads/${id}/comments`
      );
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  }, [id]); //This is the array of dependencies. It tells React when it is necessary to create a new version of the function.

  //how does it works ?
  // case 1: id is the same -> React checks [id]. The value hasn't changed. so, fetchComments remains the exact same function reference as before.
  //case 2: id is changed -> React checks [id]. The value has changed. so, useCallback creates a new function reference for fetchComments that captures the new id.

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
  }, [API_URL, AGENT_API, fetchComments]);

  // handler to open modal with existing values
  const openEditModal = () => {
    setEditData({
      name: lead.name || "",
      source: lead.source || "",
      salesAgent: lead.salesAgent?.id || "",
      status: lead.status || "",
      tags: lead.tags?.join(", ") || "",
      priority: lead.priority || "",
      timeToClose: lead.timeToClose || "",
    });
    setIsEditOpen(true);
  };

  // handling the Put request
  const updateLeadHandler = async (e) => {
    e.preventDefault();

    // validation
    if (!editData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      toast.info("Updating Lead...");

      await axios.put(`https://anvaya-backend-gilt.vercel.app/leads/${id}`, {
        name: editData.name,
        source: editData.source,
        salesAgent: editData.salesAgent,
        status: editData.status,
        tags: editData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        priority: editData.priority,
        timeToClose: parseInt(editData.timeToClose),
      });

      toast.success("Lead updated successfully!");
      setIsEditOpen(false);

      // refresh page
      const refreshed = await axios.get(API_URL);
      setLead(refreshed.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lead");
    }
  };

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
      {/* SIDEBAR */}
      <Sidebar />

      {/* HEADER - Position below mobile menu, shift right on desktop */}
      <h1 className="font-extrabold text-3xl sm:text-4xl p-6 text-center bg-sky-600 text-white sticky top-16 md:top-0 z-20 shadow-lg md:pl-56">
        Lead Management : {lead?.name}
      </h1>

      {/* MAIN CONTENT - Shift right on desktop */}
      <div className="md:pl-56 p-8 space-y-8">
        {/* LEAD DETAILS CARD */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 ">
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
              <span className="font-medium text-gray-600">
                Time to Close:
              </span>{" "}
              {lead?.timeToClose} Days
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={openEditModal}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 shadow"
            >
              Edit Lead
            </button>
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

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Edit Lead
            </h2>

            <form onSubmit={updateLeadHandler} className="space-y-4">
              {/* name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Lead Name
                </label>
                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              {/* agent */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sales Agent
                </label>
                <select
                  value={editData.salesAgent}
                  onChange={(e) =>
                    setEditData({ ...editData, salesAgent: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="">-- Select Agent --</option>
                  {agents?.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* status */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* source */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Source
                </label>
                <select
                  value={editData.source}
                  onChange={(e) =>
                    setEditData({ ...editData, source: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* tags */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tags
                </label>
                <input
                  value={editData.tags}
                  onChange={(e) =>
                    setEditData({ ...editData, tags: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              {/* timeToClose */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Time To Close (Days)
                </label>
                <input
                  type="number"
                  value={editData.timeToClose}
                  onChange={(e) =>
                    setEditData({ ...editData, timeToClose: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                />
              </div>

              {/* priority */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Priority
                </label>
                <select
                  value={editData.priority}
                  onChange={(e) =>
                    setEditData({ ...editData, priority: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;