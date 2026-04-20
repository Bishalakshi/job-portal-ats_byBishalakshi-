import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function HrApplications() {
  const [apps, setApps]         = useState([]);
  const [profiles, setProfiles] = useState({});
  const navigate = useNavigate();

  const load = () =>
    api.get("/applications").then(r => setApps(r.data));

  useEffect(() => { load(); }, []);

  const loadProfile = async username => {
    if (profiles[username]) return;
    const r = await api.get(`/auth/profile/${username}`);
    setProfiles(p => ({ ...p, [username]: r.data }));
  };

  const getAts = async id => {
    const r = await api.get(`/applications/ats/${id}`);
    alert(`ATS Score: ${r.data.atsScore} / 100`);
    load();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/applications/${id}/status`, { status });
    load();
  };

  const downloadResume = username => {
    window.open(
      `http://localhost:8080/auth/resume/${username}`,
      "_blank"
    );
  };

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
        <h3>All Applications</h3>
        <button className="btn btn-outline-secondary"
          onClick={() => navigate("/hr-dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {apps.length === 0
        ? <p className="text-muted">No applications yet.</p>
        : apps.map(app => (
          <div className="card mb-3 shadow-sm" key={app.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between
                              align-items-start">
                <div>
                  <h6 className="mb-1">
                    Candidate: <strong>{app.username}</strong>
                  </h6>
                  <p className="mb-1 text-muted">
                    Job ID: {app.jobId}
                  </p>
                  <span className={`badge bg-${badge(app.status)}`}>
                    {app.status}
                  </span>
                  {app.atsScore > 0 && (
                    <span className={`badge ms-2 ${
                      app.atsScore >= 70 ? "bg-success" :
                      app.atsScore >= 40 ? "bg-warning text-dark" :
                      "bg-danger"}`}>
                      ATS: {app.atsScore}%
                    </span>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-2
                                justify-content-end">
                  <button className="btn btn-sm btn-outline-secondary"
                    onClick={() => loadProfile(app.username)}>
                    View Profile
                  </button>
                  <button className="btn btn-sm btn-outline-primary"
                    onClick={() => downloadResume(app.username)}>
                    Download Resume
                  </button>
                  <button className="btn btn-sm btn-info"
                    onClick={() => getAts(app.id)}>
                    ATS Score
                  </button>
                  <button className="btn btn-sm btn-warning"
                    onClick={() => updateStatus(app.id, "SHORTLISTED")}>
                    Shortlist
                  </button>
                  <button className="btn btn-sm btn-danger"
                    onClick={() => updateStatus(app.id, "REJECTED")}>
                    Reject
                  </button>
                  <button className="btn btn-sm btn-success"
                    onClick={() => updateStatus(app.id, "HIRED")}>
                    Hire
                  </button>
                  <button className="btn btn-sm btn-outline-info"
                    onClick={() => navigate(`/interview/${app.id}`)}>
                    Schedule Interview
                  </button>
                </div>
              </div>

              {/* Candidate Profile */}
              {profiles[app.username] && (
                <div className="mt-3 p-3 bg-light rounded">
                  <strong>Profile</strong>
                  <div className="row mt-2">
                    {[
                      ["Full Name",    profiles[app.username].fullName],
                      ["Email",        profiles[app.username].email],
                      ["Mobile",       profiles[app.username].mobile],
                      ["DOB",          profiles[app.username].dob],
                      ["Nationality",  profiles[app.username].nationality],
                      ["Govt ID",      profiles[app.username].govId],
                    ].map(([label, val]) => (
                      <div className="col-md-4 mb-1" key={label}>
                        <small className="text-muted">{label}</small>
                        <p className="mb-0">{val || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      }
    </div>
  );
}