import { useState, useEffect } from "react";
import { patientAPI } from "../services/apiService";
import "./PatientList.css";

function PatientList({ refreshTrigger = 0 }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients();
  }, [refreshTrigger]);

  const fetchPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await patientAPI.getAllPatients();
      setPatients(response.data);
    } catch (err) {
      setError("Failed to load patients. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-list-container">
      <h2>Patient List</h2>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading patients...</div>
      ) : patients.length === 0 ? (
        <div className="no-data">No patients registered yet.</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Email</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.pId}>
                  <td>{patient.pId}</td>
                  <td>{patient.name}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.age}</td>
                  <td>{patient.email}</td>
                  <td>{patient.add}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PatientList;
