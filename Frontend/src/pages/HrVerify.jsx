import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function HrVerify() {
  const [orgName, setOrgName]   = useState("");
  const [empId, setEmpId]       = useState("");
  const [error, setError]       = useState("");
  const navigate  = useNavigate();
  const username  = localStorage.getItem("username");

  const verify = async e => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/hr-verify", {
        username, orgName, employeeId: empId
      });
      alert("Verification successful!");
      navigate("/hr-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center
                    align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: 420 }}>
        <h4 className="text-center mb-2">HR Verification</h4>
        <p className="text-muted text-center mb-4">
          Please verify your organisation details to continue
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={verify}>
          <div className="mb-3">
            <label className="form-label">Organisation Name</label>
            <input className="form-control" required
              onChange={e => setOrgName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Employee ID</label>
            <input className="form-control" required
              onChange={e => setEmpId(e.target.value)} />
          </div>
          <button className="btn btn-primary w-100">Verify & Continue</button>
        </form>
      </div>
    </div>
  );
}