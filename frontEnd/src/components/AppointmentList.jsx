import { useState, useEffect } from "react";
import { appointmentAPI, patientAPI } from "../services/apiService";
import "./AppointmentList.css";

function AppointmentList({ refreshTrigger = 0 }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const appointmentsRes = await appointmentAPI.getAllAppointments();
      const patientsRes = await patientAPI.getAllPatients();
      setAppointments(appointmentsRes.data);
      setPatients(patientsRes.data);
    } catch (err) {
      setError("Failed to load appointments. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (pId) => {
    const patient = patients.find((p) => p.pId === pId);
    return patient ? patient.name : `Patient ID: ${pId}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="appointment-list-container">
      <h2>Appointments</h2>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="no-data">No appointments booked yet.</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Patient ID</th>
                <th>Date & Time</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.aId}>
                  <td>{appointment.aId}</td>
                  <td>{getPatientName(appointment.pId)}</td>
                  <td>{appointment.pId}</td>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AppointmentList;
