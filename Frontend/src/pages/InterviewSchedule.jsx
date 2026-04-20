import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function InterviewSchedule() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [form, setForm] = useState({
    interviewDate: "", interviewTime: "",
    interviewVenue: "", interviewMode: "ONLINE",
    interviewLocation: ""
  });
  const [msg, setMsg] = useState("");

  const change = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const schedule = async e => {
    e.preventDefault();
    try {
      await api.put(`/applications/${id}/interview`, form);
      setMsg("Interview scheduled successfully!");
      setTimeout(() => navigate("/hr-applications"), 1500);
    } catch {
      setMsg("Failed to schedule interview.");
    }
  };

  return (
    <div className="container d-flex justify-content-center
                    align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: 480 }}>
        <h4 className="text-center mb-4">Schedule Interview</h4>
        <p className="text-muted text-center">
          Application ID: {id}
        </p>

        {msg && (
          <div className={`alert ${msg.includes("success")
            ? "alert-success" : "alert-danger"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={schedule}>
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input className="form-control" type="date"
              name="interviewDate" required onChange={change} />
          </div>
          <div className="mb-3">
            <label className="form-label">Time</label>
            <input className="form-control" type="time"
              name="interviewTime" required onChange={change} />
          </div>
          <div className="mb-3">
            <label className="form-label">Venue</label>
            <input className="form-control" type="text"
              name="interviewVenue" required onChange={change}
              placeholder="e.g. Conference Room 3, Building A" />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input className="form-control" type="text"
              name="interviewLocation" required onChange={change}
              placeholder="e.g. Bangalore, Karnataka" />
          </div>
          <div className="mb-3">
            <label className="form-label">Mode</label>
            <select className="form-select" name="interviewMode"
              onChange={change}>
              <option value="ONLINE">Online</option>
              <option value="IN_PERSON">In Person</option>
            </select>
          </div>

          <div className="d-flex gap-2">
            <button type="button"
              className="btn btn-outline-secondary flex-fill"
              onClick={() => navigate("/hr-applications")}>
              Cancel
            </button>
            <button type="submit"
              className="btn btn-primary flex-fill">
              Confirm Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}