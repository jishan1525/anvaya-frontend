
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import LeadDetail from './pages/LeadDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddLead from './pages/AddLead';
import SalesAgent from './pages/SalesAgent';
import AddAgentModal from './components/AddAgentModal';
import AgentView from './pages/AgentView';


function App() {
  return (
    <>
    <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/leads/:id" element={<LeadDetail/>}/>
        <Route path="/addLead" element={<AddLead/>}/>
        <Route path="/agents" element={<SalesAgent />} />
        <Route path="/addAgent" element={<AddAgentModal/>} />
        <Route path='/sales' element={<AgentView/>}/>
      </Routes>
      <ToastContainer position="top-center" />
    </>
      
  );
}

export default App;
