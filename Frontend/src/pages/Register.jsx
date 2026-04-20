import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "", password: "", fullName: "",
    email: "", mobile: "", dob: "",
    address: "", nationality: "", govId: "",
    role: "APPLICANT"
  });
  const [error, setError] = useState("");

  const change = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      alert("Registered successfully! Please login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow mx-auto p-4" style={{ maxWidth: 600 }}>
        <h3 className="text-center mb-4">Create Account</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">I am a</label>
            <select className="form-select" name="role"
              value={form.role} onChange={change}>
              <option value="APPLICANT">Applicant</option>
              <option value="HR">HR / Recruiter</option>
            </select>
          </div>

          {[
            ["username",    "Username",       "text"],
            ["password",    "Password",       "password"],
            ["fullName",    "Full Name",      "text"],
            ["email",       "Email",          "email"],
            ["mobile",      "Mobile Number",  "text"],
            ["dob",         "Date of Birth",  "date"],
            ["address",     "Address",        "text"],
            ["nationality", "Nationality",    "text"],
            ["govId",       "Govt ID Number", "text"],
          ].map(([name, label, type]) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <input className="form-control" type={type}
                name={name} required
                onChange={change} />
            </div>
          ))}

          <button className="btn btn-success w-100">Register</button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <span className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}