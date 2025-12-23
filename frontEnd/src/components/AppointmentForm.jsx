import { useState, useEffect } from "react";
import { appointmentAPI, patientAPI } from "../services/apiService";
import "./AppointmentForm.css";

function AppointmentForm({ onAppointmentBooked }) {
  const [formData, setFormData] = useState({
    pId: "",
    date: "",
    reason: "",
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getAllPatients();
      setPatients(response.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.pId || !formData.date || !formData.reason) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      const response = await appointmentAPI.createAppointment({
        pId: parseInt(formData.pId),
        date: formData.date,
        reason: formData.reason,
      });

      if (response.data.status === 200) {
        setSuccess("Appointment booked successfully!");

        setFormData({
          pId: "",
          date: "",
          reason: "",
        });

        if (onAppointmentBooked) {
          onAppointmentBooked(response.data);
        }
      } else {
        setError(response.data.respond || "Failed to book appointment");
      }
    } catch (err) {
      setError("Failed to book appointment. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-form-container">
      <h2>Book an Appointment</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="pId">Patient *</label>
          <select
            id="pId"
            name="pId"
            value={formData.pId}
            onChange={handleChange}
            required
          >
            <option value="">Select a Patient</option>
            {patients.map((patient) => (
              <option key={patient.pId} value={patient.pId}>
                {patient.name} (ID: {patient.pId})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Appointment Date & Time *</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason for Visit *</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Describe the reason for appointment"
            rows={3}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}

export default AppointmentForm;
