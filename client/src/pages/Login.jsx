import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import InputField from "../components/InputField";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data);

      if (res.data.role === "student") {
        navigate("/student");
      } else if (res.data.role === "company") {
        navigate("/company");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-6">Login</h2>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <Button type="submit" label="Login" />
        </form>
      </div>
    </div>
  );
};

export default Login;
