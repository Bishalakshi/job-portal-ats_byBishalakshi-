import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Jobs() {
  const [jobs, setJobs]       = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate  = useNavigate();
  const username  = localStorage.getItem("username");

  useEffect(() => {
    api.get("/jobs").then(r => setJobs(r.data));
  }, []);

  const apply = async (job) => {
    try {
      await api.post("/applications", {
        username,
        jobId: job.id
      });
      alert(`Applied to "${job.title}" successfully!`);
    } catch {
      alert("Application failed or already applied.");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between
                      align-items-center mb-4">
        <h3>Available Jobs</h3>
        <div>
          <button className="btn btn-outline-secondary me-2"
            onClick={() => navigate("/my-applications")}>
            My Applications
          </button>
          <button className="btn btn-outline-danger"
            onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="row g-3">
        {jobs.map(job => (
          <div className="col-md-6 col-lg-4" key={job.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text text-muted mb-1">
                  📍 {job.location}
                </p>
                <p className="card-text text-muted mb-1">
                  💼 {job.mode}
                </p>
                <p className="card-text text-muted mb-2">
                  💰 {job.salary}
                </p>
                <p className="card-text small">
                  {job.description?.substring(0, 100)}...
                </p>
              </div>
              <div className="card-footer d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm flex-fill"
                  onClick={() => setSelected(job)}>
                  Details
                </button>
                <button className="btn btn-success btn-sm flex-fill"
                  onClick={() => apply(job)}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Job Detail Modal */}
      {selected && (
        <div className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selected.title}</h5>
                <button className="btn-close"
                  onClick={() => setSelected(null)} />
              </div>
              <div className="modal-body">
                <p><strong>Location:</strong> {selected.location}</p>
                <p><strong>Mode:</strong> {selected.mode}</p>
                <p><strong>Salary:</strong> {selected.salary}</p>
                <p><strong>Required Skills:</strong> {selected.requiredSkills}</p>
                <p><strong>Description:</strong> {selected.description}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary"
                  onClick={() => setSelected(null)}>Close</button>
                <button className="btn btn-success"
                  onClick={() => { apply(selected); setSelected(null); }}>
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}