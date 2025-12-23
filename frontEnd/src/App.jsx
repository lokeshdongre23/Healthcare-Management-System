import { useState } from "react";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("patient-register");
  const [patientRefresh, setPatientRefresh] = useState(0);
  const [appointmentRefresh, setAppointmentRefresh] = useState(0);

  const handlePatientAdded = () => {
    setPatientRefresh((prev) => prev + 1);
  };

  const handleAppointmentBooked = () => {
    setAppointmentRefresh((prev) => prev + 1);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Healthcare Management System</h1>
          <p>Manage patients and appointments efficiently</p>
        </div>
      </header>

      <div className="container">
        <nav className="navigation">
          <button
            className={`nav-button ${
              activeTab === "patient-register" ? "active" : ""
            }`}
            onClick={() => setActiveTab("patient-register")}
          >
            Register Patient
          </button>
          <button
            className={`nav-button ${
              activeTab === "patient-list" ? "active" : ""
            }`}
            onClick={() => setActiveTab("patient-list")}
          >
            View Patients
          </button>
          <button
            className={`nav-button ${
              activeTab === "appointment-form" ? "active" : ""
            }`}
            onClick={() => setActiveTab("appointment-form")}
          >
            Book Appointment
          </button>
          <button
            className={`nav-button ${
              activeTab === "appointment-list" ? "active" : ""
            }`}
            onClick={() => setActiveTab("appointment-list")}
          >
            View Appointments
          </button>
        </nav>

        <main className="content">
          {activeTab === "patient-register" && (
            <PatientForm onPatientAdded={handlePatientAdded} />
          )}
          {activeTab === "patient-list" && (
            <PatientList refreshTrigger={patientRefresh} />
          )}
          {activeTab === "appointment-form" && (
            <AppointmentForm onAppointmentBooked={handleAppointmentBooked} />
          )}
          {activeTab === "appointment-list" && (
            <AppointmentList refreshTrigger={appointmentRefresh} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
