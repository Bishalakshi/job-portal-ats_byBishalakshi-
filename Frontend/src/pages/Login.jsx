import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      const { token, role, hrVerified } = res.data;

      localStorage.setItem("token",    token);
      localStorage.setItem("username", username);
      localStorage.setItem("role",     role);

      if (role === "HR") {
        navigate(hrVerified ? "/hr-dashboard" : "/hr-verify");
      } else {
        navigate("/upload");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center
                    align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: 380 }}>
        <h3 className="text-center mb-4">ATS Portal — Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={login}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input className="form-control" required
              onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" required
              onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary w-100">Login</button>
        </form>

        <p className="text-center mt-3">
          No account?{" "}
          <span className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}