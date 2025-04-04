import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api"; // Ensure this is correctly imported

const Register = () => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    phone: "",
    location: "",
    sector: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyWebsite: "",
    collegeName: "",
    stream: "",
  });

  const [message, setMessage] = useState(""); // Success message
  const [error, setError] = useState(""); // Error message
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Preparing the form data based on role
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role,
      phone: formData.phone,
      location: formData.location,
      company_name: role === "company" ? formData.companyName : null,
      sector: role === "company" ? formData.sector : null,
      company_website: role === "company" ? formData.companyWebsite : null,
      college_name: role === "student" ? formData.collegeName : null,
      stream: role === "student" ? formData.stream : null,
    };

    try {
      const response = await axios.post("/auth/register", userData);
      setMessage("✅ Registration successful! Redirecting to login...");
      setError("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.message || "❌ Registration failed. Try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      {/* Success & Error Messages */}
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <label className="block mb-2">
        Role
        <select
          className="w-full p-2 border rounded mt-1"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="company">Company</option>
        </select>
      </label>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Common Fields */}
        <label className="block">
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>

        {role === "company" ? (
          <>
            <label className="block">
              Company Name
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>
            <label className="block">
              Phone Number
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>
            <label className="block">
              Location
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>
            <label className="block">
              Sector
              <input
                type="text"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>
            <label className="block">
              Company Website
              <input
                type="text"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
          </>
        ) : (
          <>
            <label className="block">
              College Name
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>
            <label className="block">
              Stream
              <input
                type="text"
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>
            <label className="block">
              Phone Number
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>
          </>
        )}

        {/* Common Fields */}
        <label className="block">
          Email ID
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <label className="block">
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <label className="block">
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
