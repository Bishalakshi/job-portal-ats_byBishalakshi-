import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const navigate  = useNavigate();
  const username  = localStorage.getItem("username");

  useEffect(() => {
    api.get(`/applications/my/${username}`)
      .then(r => setApps(r.data));
  }, []);

  const badge = status => ({
    APPLIED:     "secondary",
    SHORTLISTED: "warning",
    INTERVIEW:   "info",
    HIRED:       "success",
    REJECTED:    "danger"
  }[status] || "secondary");

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-4">
        <h3>My Applications</h3>
        <button className="btn btn-outline-secondary"
          onClick={() => navigate("/jobs")}>
          Back to Jobs
        </button>
      </div>

      {apps.length === 0
        ? <p className="text-muted">No applications yet.</p>
        : apps.map(app => (
          <div className="card mb-3 shadow-sm" key={app.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h6>Job ID: {app.jobId}</h6>
                <span className={`badge bg-${badge(app.status)}`}>
                  {app.status}
                </span>
              </div>

              {app.status === "INTERVIEW" && (
                <div className="mt-2 p-2 bg-light rounded">
                  <strong>Interview Scheduled</strong>
                  <p className="mb-0">
                    📅 {app.interviewDate} at {app.interviewTime}
                  </p>
                  <p className="mb-0">
                    📍 {app.interviewVenue}, {app.interviewLocation}
                  </p>
                  <p className="mb-0">
                    💻 Mode: {app.interviewMode}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      }
    </div>
  );
}