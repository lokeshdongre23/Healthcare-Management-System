import { useState } from "react";
import { patientAPI } from "../services/apiService";
import "./PatientForm.css";

function PatientForm({ onPatientAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    email: "",
    add: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      if (
        !formData.name ||
        !formData.gender ||
        !formData.age ||
        !formData.email ||
        !formData.add
      ) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      const response = await patientAPI.createPatient({
        ...formData,
        age: parseInt(formData.age),
      });

      setSuccess(`Patient "${formData.name}" registered successfully!`);

      setFormData({
        name: "",
        gender: "",
        age: "",
        email: "",
        add: "",
      });

      if (onPatientAdded) {
        onPatientAdded(response.data);
      }
    } catch (err) {
      setError("Failed to register patient. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-form-container">
      <h2>Register New Patient</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name"> Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter patient name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter age"
            min="1"
            max="150"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="add">Address *</label>
          <textarea
            id="add"
            name="add"
            value={formData.add}
            onChange={handleChange}
            placeholder="Enter address"
            rows={3}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register Patient"}
        </button>
      </form>
    </div>
  );
}

export default PatientForm;
