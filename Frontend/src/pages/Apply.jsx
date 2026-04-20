import { useEffect, useState } from "react";
import api from "../api/axios";

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");

  const loadJobs = () => {
    api.get("/jobs").then(res => setJobs(res.data));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const addJob = async () => {
    await api.post("/jobs", { title });
    setTitle("");
    loadJobs();
  };

  const deleteJob = async (id) => {
    await api.delete(`/jobs/${id}`);
    loadJobs();
  };

  const updateJob = async (id) => {
    const newTitle = prompt("Enter new title:");
    if (!newTitle) return;

    await api.put(`/jobs/${id}`, { title: newTitle });
    loadJobs();
  };

  return (
    <div className="container mt-5">
      <h2>Job Management</h2>

      <input
        className="form-control mb-2"
        placeholder="Job title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button className="btn btn-success mb-3" onClick={addJob}>
        Add Job
      </button>

      {jobs.map(job => (
        <div key={job.id} className="card p-3 mb-2">
          <h5>{job.title}</h5>

          <button className="btn btn-warning me-2"
            onClick={() => updateJob(job.id)}>
            Edit
          </button>

          <button className="btn btn-danger"
            onClick={() => deleteJob(job.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}