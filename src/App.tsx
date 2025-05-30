import { Route, Routes } from 'react-router-dom'
import './App.css'
import ClinicDashboard from './ClinicDashboard'
import MedicalRecord from './MedicalResult';
import Prescription from './Prescription';
import Appointment from './Appointment';
import Header from './components/Header'; // Import Header
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main content area with Header and Routes */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="flex-1 bg-gray-100">
          <Routes>
            <Route path="/" element={<ClinicDashboard />} />
            <Route path="/medical-record" element={<MedicalRecord />} />
            <Route path="/prescription" element={<Prescription />} />

            <Route path="/appointment" element={<Appointment />} />
            {/* Add more routes as needed */}
            
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App
