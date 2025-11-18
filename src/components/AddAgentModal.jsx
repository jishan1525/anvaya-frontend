import axios from "axios";
import { useState } from "react";

const AddAgentModal = ({ onClose, onSuccess, onFailure }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const AGENT_API = `https://anvaya-backend-gilt.vercel.app/agents`;
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const newAgent = {
      name: name,
      email: email,
    };
    try {
      setLoading(true);
      const response = await axios.post(AGENT_API, newAgent);
      if (response.status === 200 || response.status === 201) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      onFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-sky-600">
          Add New Agent
        </h2>
        <form onSubmit={formSubmitHandler} className="space-y-4">
          <div className="">
            <label htmlFor="name" className="text-gray-700 font-medium">
              Name
            </label>
            <input
              ype="text"
              required
              placeholder="Enter name"
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              required
              placeholder="Enter email"
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition"
          >
            {loading ? "Submitting..." : "Add Agent"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
export default AddAgentModal;
