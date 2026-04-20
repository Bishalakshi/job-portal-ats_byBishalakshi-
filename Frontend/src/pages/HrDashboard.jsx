import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function HrDashboard() {
  const [jobs, setJobs]   = useState([]);
  const [form, setForm]   = useState({
    title: "", description: "", location: "",
    salary: "", mode: "ONSITE", requiredSkills: ""
  });
  const [show, setShow]   = useState(false);
  const navigate  = useNavigate();
  const username  = localStorage.getItem("username");

  const loadJobs = () =>
    api.get("/jobs").then(r => setJobs(r.data));

  useEffect(() => { loadJobs(); }, []);

  const change = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const post = async e => {
    e.preventDefault();
    await api.post("/jobs", { ...form, postedBy: username });
    alert("Job posted successfully!");
    setShow(false);
    setForm({
      title: "", description: "", location: "",
      salary: "", mode: "ONSITE", requiredSkills: ""
    });
    loadJobs();
  };

  const deleteJob = async id => {
    if (!confirm("Delete this job?")) return;
    await api.delete(`/jobs/${id}`);
    loadJobs();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between
                      align-items-center mb-4">
        <h3>HR Dashboard</h3>
        <div>
          <button className="btn btn-outline-info me-2"
            onClick={() => navigate("/hr-applications")}>
            View Applications
          </button>
          <button className="btn btn-primary me-2"
            onClick={() => setShow(true)}>
            + Post Job
          </button>
          <button className="btn btn-outline-danger"
            onClick={logout}>Logout</button>
        </div>
      </div>

      <h5>Live Jobs ({jobs.length})</h5>
      <div className="row g-3 mt-1">
        {jobs.map(job => (
          <div className="col-md-6" key={job.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>{job.title}</h6>
                <p className="text-muted mb-1">
                  📍 {job.location} · {job.mode}
                </p>
                <p className="text-muted mb-1">💰 {job.salary}</p>
                <p className="small text-muted">
                  Skills: {job.requiredSkills}
                </p>
              </div>
              <div className="card-footer">
                <button className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteJob(job.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Job Modal */}
      {show && (
        <div className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Post New Job</h5>
                <button className="btn-close"
                  onClick={() => setShow(false)} />
              </div>
              <form onSubmit={post}>
                <div className="modal-body">
                  {[
                    ["title",         "Job Title",        "text"],
                    ["location",      "Location",         "text"],
                    ["salary",        "Salary",           "text"],
                    ["requiredSkills","Required Skills (comma separated)", "text"],
                  ].map(([name, label, type]) => (
                    <div className="mb-3" key={name}>
                      <label className="form-label">{label}</label>
                      <input className="form-control" type={type}
                        name={name} required onChange={change} />
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="form-label">Mode</label>
                    <select className="form-select" name="mode"
                      onChange={change}>
                      <option value="ONSITE">Onsite</option>
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" name="description"
                      rows={3} required onChange={change} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary"
                    onClick={() => setShow(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    Post Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}