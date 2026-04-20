import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ApplicationTracking() {
  const [apps, setApps] = useState([]);

  const loadApps = () => {
    api.get("/applications").then(res => setApps(res.data));
  };

  useEffect(() => {
    loadApps();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/applications/${id}`, { status });
    loadApps();
  };

  return (
    <div className="container mt-5">
      <h2>Applications</h2>

      {apps.map(app => (
        <div key={app.id} className="card p-3 mb-2">
          <h5>{app.name}</h5>
          <p>{app.job}</p>
          <p>Status: {app.status}</p>

          <button className="btn btn-warning me-2"
            onClick={() => updateStatus(app.id, "Shortlisted")}>
            Shortlist
          </button>

          <button className="btn btn-danger me-2"
            onClick={() => updateStatus(app.id, "Rejected")}>
            Reject
          </button>

          <button className="btn btn-success"
            onClick={() => updateStatus(app.id, "Hired")}>
            Hire
          </button>
        </div>
      ))}
    </div>
  );
}