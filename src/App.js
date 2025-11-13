
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import LeadDetail from './pages/LeadDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/leads/:id" element={<LeadDetail/>}/>
        
      </Routes>
      <ToastContainer position="top-center" />
    </>
      
  );
}

export default App;
